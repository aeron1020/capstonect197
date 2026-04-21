from rest_framework import viewsets
from .models import *
from .serializers import *
from .services.pricing import compute_quotation
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'role': user.role, # Assuming 'role' is a field in your AbstractUser
        'full_name': f"{user.first_name} {user.last_name}"
    })

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
    
class MixDesignViewSet(viewsets.ModelViewSet):
    queryset = MixDesign.objects.all()
    serializer_class = MixDesignSerializer

class OrderViewSet(viewsets.ModelViewSet):
    # Remove the static queryset line
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Admins and Dispatchers see all orders
        if user.is_staff or user.role in ['admin', 'dispatcher']:
            return Order.objects.all()
        # Customers only see their own orders
        return Order.objects.filter(user=user)

    def perform_create(self, serializer):
        # Automatically assign the logged-in customer to the order
        serializer.save(user=self.request.user, status="Pending")

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def generate_quotation(self, request, pk=None):
        order = self.get_object()

        if order.status not in ["Pending", "For Quotation"]:
            return Response({"error": "Invalid order status"}, status=400)

        if not order.distance_km: # Check for None or 0
            return Response({"error": "Distance is required for computation"}, status=400)

        with transaction.atomic():
            total, breakdown = compute_quotation(order)
            
            # Using update_or_create is safer if the admin re-runs the quotation
            quotation, created = Quotation.objects.update_or_create(
                order=order,
                defaults={
                    'computed_total': total,
                    'final_total': total,
                    'status': "Pending",
                    'breakdown': breakdown
                }
            )

            order.status = "Quotation Generated"
            order.save()

        return Response({
            "message": "Quotation generated successfully",
            "total": total,
            "breakdown": breakdown
        })
    
# core/views.py
def perform_create(self, serializer):
    # Fetch the user's customer profile
    # (Make sure 'customer' is the related_name in your Customer model)
    customer = self.request.user.customer 

    serializer.save(
        user=self.request.user,
        company_name=customer.company_name,
        contact_person=f"{self.request.user.first_name} {self.request.user.last_name}",
        # You can also pull company_address if you have it in the Customer model
        company_address="See Project Location", 
        status="Pending"
    )

@api_view(['POST'])
@permission_classes([IsAdminUser]) # Strictly for Admin only
def generate_and_send_quotation(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        
        # 1. Validation: Ensure Admin has input the distance_km
        if order.distance_km is None:
            return Response({"error": "Please input distance (km) before generating quotation."}, status=400)

        # 2. Calculate using pricing.py
        total_price, detail_breakdown = compute_quotation(order)

        # 3. Create or Update the Quotation record
        quotation, created = Quotation.objects.update_or_create(
            order=order,
            defaults={
                'computed_total': total_price,
                'final_total': total_price,
                'breakdown': detail_breakdown,
                'status': 'Pending' # Client needs to approve this
            }
        )

        # 4. Update Order Status to notify the Client
        order.status = "Quotation Generated"
        order.save()

        return Response({
            "message": "Quotation sent to client successfully!",
            "total": total_price
        })

    except Order.DoesNotExist:
        return Response({"error": "Order not found."}, status=404)
    
class QuotationViewSet(viewsets.ModelViewSet):
    queryset = Quotation.objects.all()
    serializer_class = QuotationSerializer

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def customer_decision(self, request, pk=None):
        quotation = self.get_object()
        order = quotation.order
        user = request.user

        decision = request.data.get("decision")

        # 🔒 Ensure only owner can decide
        if order.user != user:
            return Response({"error": "Not allowed"}, status=403)

        # 🔒 Validate state
        if quotation.status != "Pending":
            return Response({"error": "Already decided"}, status=400)

        # 🔒 Validate input
        if decision not in ["approve", "reject"]:
            return Response({"error": "Invalid decision"}, status=400)

        # 🔁 PROCESS DECISION
        if decision == "approve":
            quotation.status = "Approved"
            order.status = "For Inspection"

        elif decision == "reject":
            quotation.status = "Rejected"
            order.status = "Rejected"

        quotation.save()
        order.save()

        return Response({
            "message": f"Quotation {decision}d successfully"
        })

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer