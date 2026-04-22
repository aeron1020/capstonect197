from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction
from .models import *
from .serializers import *
from .services.pricing import compute_quotation

# --- AUTH & PROFILE ---

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_profile(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'role': user.role, 
        'full_name': f"{user.first_name} {user.last_name}"
    })

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    authentication_classes = []

# --- CUSTOM PERMISSIONS ---

class IsAdminUserRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')

# --- VIEWSETS ---

class MixDesignViewSet(viewsets.ModelViewSet):
    queryset = MixDesign.objects.all()
    serializer_class = MixDesignSerializer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role in ['admin', 'dispatcher']:
            return Order.objects.all()
        return Order.objects.filter(user=user)

    def get_permissions(self):
        # 1. Allow any logged-in user to Create or View (List/Retrieve)
        if self.action in ['create', 'list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        
        # 2. Allow Customers to decide on their own quotation
        if self.action == 'approve_quotation':
            return [permissions.IsAuthenticated()]

        # 3. Everything else (send_quotation, update, delete) requires ADMIN
        return [IsAdminUserRole()]

        # Allow customers to see and approve
        if self.action in ['create', 'list', 'retrieve', 'approve_quotation']:
            return [permissions.IsAuthenticated()]
        
        # Everything else (sending/editing) is Admin only
        return [IsAdminUserRole()]

    def perform_create(self, serializer):
        # Safely fetch customer profile to auto-fill company info
        try:
            customer = self.request.user.customer
            serializer.save(
                user=self.request.user,
                company_name=customer.company_name,
                contact_person=f"{self.request.user.first_name} {self.request.user.last_name}",
                status="Pending"
            )
        except AttributeError:
            serializer.save(user=self.request.user, status="Pending")

    @action(detail=True, methods=['post'])
    def send_quotation(self, request, pk=None):
        """
        Consolidated single action to handle distance, pump, discount, and terms.
        """
        order = self.get_object()
        
        try:
            # 1. Capture data from the React QuotationEditor
            # Ensure we treat these as numbers immediately to avoid TypeErrors
            distance = request.data.get('distance_km', order.distance_km)
            p_rental = request.data.get('pump_rental', 0)
            p_mob = request.data.get('pump_mobilization', 0)
            disc = request.data.get('discount', 0)
            terms = request.data.get('payment_terms', "Cash on Delivery")

            # 2. Update distance on the order
            order.distance_km = distance
            order.save()

            # 3. Validation: Convert to float before comparing to 0
            # This fixes the "TypeError: '<=' not supported between instances of 'str' and 'int'"
            try:
                dist_val = float(order.distance_km)
            except (ValueError, TypeError):
                dist_val = 0

            if dist_val <= 0:
                return Response({"error": "Please set a valid distance (km) before sending a quotation."}, status=400)

            # 4. Calculation
            total_price, breakdown = compute_quotation(
                order, 
                pump_rental=p_rental, 
                pump_mobilization=p_mob, 
                discount=disc, 
                payment_terms=terms
            )

            # 5. Atomic database update
            with transaction.atomic():
                Quotation.objects.update_or_create(
                    order=order,
                    defaults={
                        'computed_total': total_price,
                        'final_total': total_price,
                        'breakdown': breakdown,
                        'status': 'Pending'
                    }
                )
                order.status = "Quotation Sent"
                order.save()

            return Response({"status": "success", "total": float(total_price)})

        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return Response({"error": str(e)}, status=500)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def approve_quotation(self, request, pk=None):
        order = self.get_object()
        
        # Security: Ensure only the owner can approve
        if order.user != request.user:
            return Response({"error": "Unauthorized"}, status=403)

        try:
            with transaction.atomic():
                # 1. Update the Quotation status
                quotation = order.quotation # This works if you have a OneToOneField or related_name
                quotation.status = "Approved"
                quotation.save()

                # 2. Update the Order status
                order.status = "For Inspection"
                order.save()

            return Response({"status": "Order approved, moving to inspection."})
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class QuotationViewSet(viewsets.ModelViewSet):
    queryset = Quotation.objects.all()
    serializer_class = QuotationSerializer

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def customer_decision(self, request, pk=None):
        quotation = self.get_object()
        order = quotation.order
        decision = request.data.get("decision")

        if order.user != request.user:
            return Response({"error": "Not authorized"}, status=403)

        if decision == "approve":
            quotation.status = "Approved"
            order.status = "For Inspection"
        elif decision == "reject":
            quotation.status = "Rejected"
            order.status = "Rejected"
        else:
            return Response({"error": "Invalid decision"}, status=400)

        quotation.save()
        order.save()
        return Response({"message": f"Quotation {decision}d"})

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer