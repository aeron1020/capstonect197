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

        # # 3. Everything else (send_quotation, update, delete) requires ADMIN
        # return [IsAdminUserRole()]

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


    # @action(detail=True, methods=['post'])
    # def send_quotation(self, request, pk=None):
    #     """
    #     Consolidated single action to handle distance, pump, discount, and terms.
    #     Saves a snapshot of the math for audit purposes and updates order terms.
    #     """
    #     order = self.get_object()
        
    #     try:
    #         # 1. Capture data and force numeric types
    #         distance = request.data.get('distance_km', order.distance_km) or 0
    #         p_rental = request.data.get('pump_rental', 0) or 0
    #         p_mob = request.data.get('pump_mobilization', 0) or 0
    #         disc = request.data.get('discount', 0) or 0
            
    #         # Capture Terms - Important: Ensure these match your logic (COD, Terms, Advance, DP)
    #         terms = request.data.get('payment_terms', "COD")

    #         # 2. Update distance AND payment terms on the order model
    #         # This allows submit_inspection to see the terms later
    #         order.distance_km = distance
    #         order.payment_term = terms 
    #         order.save()

    #         # 3. Validation
    #         if float(distance) <= 0:
    #             return Response({"error": "A valid distance (km) is required to calculate integrated delivery rates."}, status=400)

    #         # 4. Calculation (Logic remains unchanged)
    #         total_price, breakdown = compute_quotation(
    #             order, 
    #             pump_rental=p_rental, 
    #             pump_mobilization=p_mob, 
    #             discount=disc, 
    #             payment_terms=terms
    #         )

    #         # 5. Atomic database update
    #         with transaction.atomic():
    #             # Store the "Live Copy" for the Admin and Customer
    #             Quotation.objects.update_or_create(
    #                 order=order,
    #                 defaults={
    #                     'computed_total': total_price,
    #                     'final_total': total_price,
    #                     'breakdown': breakdown,
    #                     'payment_terms': terms, # Store in quotation for the printed document
    #                     'status': 'Sent'
    #                 }
    #             )
                
    #             # Update Order Status to move the workflow forward
    #             order.status = "Quotation Sent"
    #             order.save()

    #         return Response({
    #             "status": "success", 
    #             "total": float(total_price),
    #             "message": f"Quotation for Order #{order.id} has been recorded and sent."
    #         })

    #     except Exception as e:
    #         import traceback
    #         print(traceback.format_exc())
    #         return Response({"error": f"Internal Server Error: {str(e)}"}, status=500)

    @action(detail=True, methods=['post'])
    def send_quotation(self, request, pk=None):
        order = self.get_object()
        
        try:
            # 1. Capture inputs with safe fallbacks
            # We use .get() and 'or' to ensure we never pass 'None' to the math function
            distance = request.data.get('distance_km') or order.distance_km or 0
            p_rental = request.data.get('pump_rental') or 0
            p_mob = request.data.get('pump_mobilization') or 0
            disc = request.data.get('discount') or 0
            terms = request.data.get('payment_terms') or order.payment_term or "COD"

            # 2. Validation
            if float(distance) <= 0:
                return Response({"error": "A valid distance (km) is required."}, status=400)

            # 3. Calculation
            # This function should now receive raw values, not depend on order.quotation
            total_price, breakdown = compute_quotation(
                order, 
                pump_rental=float(p_rental), 
                pump_mobilization=float(p_mob), 
                discount=float(disc), 
                payment_terms=terms
            )

            # 4. Atomic database update
            with transaction.atomic():
                # Update the Order first
                order.distance_km = distance
                order.payment_term = terms
                order.status = "Quotation Sent"
                order.save()

                # Create or Update Quotation
                # This fixes the 500 error because it doesn't "read" the quote before creating it
                Quotation.objects.update_or_create(
                    order=order,
                    defaults={
                        'computed_total': total_price,
                        'final_total': total_price,
                        'breakdown': breakdown,
                        'status': 'Sent'
                    }
                )

            return Response({
                "status": "success", 
                "total": float(total_price),
                "message": f"Quotation for Order #{order.id} sent successfully."
            })

        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return Response({"error": f"Internal Server Error: {str(e)}"}, status=500)

    @action(detail=True, methods=['post'])
    def preview_quotation(self, request, pk=None):
        order = self.get_object()
        
        # 1. Capture the new distance from the form
        # We don't save it to the DB, we just hold it in this variable
        distance = request.data.get('distance_km', order.distance_km) or 0
        
        # 2. TEMPORARILY update the order object in memory 
        # This ensures compute_quotation uses the NEW distance for the math
        order.distance_km = float(distance)

        # 3. Capture other inputs
        p_rental = request.data.get('pump_rental', 0) or 0
        p_mob = request.data.get('pump_mobilization', 0) or 0
        disc = request.data.get('discount', 0) or 0
        terms = request.data.get('payment_terms', "Cash on Delivery")

        # 4. Calculate using the modified order object
        total, breakdown = compute_quotation(
            order, 
            pump_rental=p_rental, 
            pump_mobilization=p_mob, 
            discount=disc, 
            payment_terms=terms
        )

        # 5. Return the response matching your React keys
        return Response({
            "preview_breakdown": {
                "items": breakdown.get('items'),
                "final_total": float(total), 
            }
        })

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


    # @action(detail=True, methods=['post'])
    # def submit_inspection(self, request, pk=None):
    #     order = self.get_object()
    #     result = request.data.get('result')  # Approved, Rejected, or Re-inspection
    #     remarks = request.data.get('remarks')

    #     if not result or not remarks:
    #         return Response({"error": "Please provide both result and remarks."}, status=400)

    #     with transaction.atomic():
    #         # Create or update the report
    #         # Note: Using site_inspection_record as the related_name we fixed earlier
    #         SiteInspection.objects.update_or_create(
    #             order=order,
    #             defaults={
    #                 'inspector': request.user,
    #                 'result': result,
    #                 'remarks': remarks
    #             }
    #         )

    #         # SIMPLE PROCESS LOGIC:
    #         if result == 'Approved':
    #             order.status = 'Ready for Pouring'
    #         elif result == 'Rejected':
    #             order.status = 'Inspection Rejected'
    #         elif result == 'Re-inspection':
    #             order.status = 'For Re-inspection'
            
    #         order.save()

    #     return Response({
    #         "message": f"Site {result} successfully.",
    #         "new_status": order.status
    #     })

    @action(detail=True, methods=['post'])
    def schedule_inspection(self, request, pk=None):
        order = self.get_object()
        date = request.data.get('inspection_date')
        if not date:
            return Response({"error": "Inspection date is required"}, status=400)
        
        order.inspection_date = date
        order.status = "For Inspection"
        order.save()
        return Response({"message": f"Inspection scheduled for {date}"})

    @action(detail=True, methods=['post'])
    def submit_inspection(self, request, pk=None):
        order = self.get_object()
        result = request.data.get('result')
        remarks = request.data.get('remarks')
        new_date = request.data.get('new_date') # Accept a new date from frontend

        if not result or not remarks:
            return Response({"error": "Please provide both result and remarks."}, status=400)

        with transaction.atomic():
            # Update the Order Date if provided (Handling delays)
            if new_date:
                order.proposed_schedule = new_date

            # 1. Record/Update the inspection details
            SiteInspection.objects.update_or_create(
                order=order,
                defaults={
                    'inspector': request.user,
                    'result': result,
                    'remarks': remarks,
                }
            )

            # 2. State Machine Logic
            if result == 'Approved':
                if order.payment_term in ['COD', 'Terms']:
                    order.status = 'Ready for Pouring'
                else:
                    order.status = 'For Payment Verification'
            elif result == 'Rejected':
                order.status = 'Inspection Rejected'
            elif result == 'Re-inspection':
                order.status = 'For Re-inspection'
                # If re-inspection is needed, the status remains "For Inspection" 
                # logically until a new schedule is set.
            
            order.save()

        return Response({
            "message": f"Site {result} successfully.",
            "new_status": order.status,
            "new_date": order.proposed_schedule
        })

        
    
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

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUserRole])
    def verify_payment(self, request, pk=None):
        payment = self.get_object()
        order = payment.order
        decision = request.data.get('decision') # 'approve' or 'reject'

        if decision == 'approve':
            with transaction.atomic():
                payment.status = 'Verified'
                payment.save()
                
                order.payment_status = 'Paid'
                order.status = 'Ready for Pouring'
                order.save()
            return Response({"message": "Payment verified. Order is now Ready for Pouring."})
        
        else:
            payment.status = 'Rejected'
            payment.save()
            return Response({"message": "Payment rejected. Customer must re-upload."})