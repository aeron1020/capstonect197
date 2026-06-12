from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import transaction
from .models import *
from .serializers import *
from .services.pricing import compute_quotation
from rest_framework_simplejwt.authentication import JWTAuthentication

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
        if self.action in ['create', 'list', 'retrieve', 'approve_quotation', 'upload_payment']:
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

                # --- REVISION LOGIC START ---
                # Check if a quotation already exists for this order
                existing_quotation = Quotation.objects.filter(order=order).first()
                
                if existing_quotation:
                    # If it exists, it's a revision! Bump the number up by 1
                    new_revision = existing_quotation.revision_number + 1
                else:
                    # Brand new quotation issuance
                    new_revision = 0
                # --- REVISION LOGIC END ---

                # Create or Update Quotation
                # This fixes the 500 error because it doesn't "read" the quote before creating it
                Quotation.objects.update_or_create(
                    order=order,
                    defaults={
                        'computed_total': total_price,
                        'final_total': total_price,
                        'breakdown': breakdown,
                        'status': 'Sent',
                        'revision_number': new_revision
                    }
                )

            return Response({
                "status": "success", 
                "total": float(total_price),
                "revision_number": new_revision,
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
        new_date = request.data.get('new_date') # Your front-end matches this perfectly!

        if not result or not remarks:
            return Response({"error": "Please provide both result and remarks."}, status=400)

        with transaction.atomic():
            # Update the Order Date tracking field
            if new_date:
                order.proposed_schedule = new_date

            # 1. Record/Update the inspection logs
            SiteInspection.objects.update_or_create(
                order=order,
                defaults={
                    'inspector': request.user,
                    'result': result,
                    'remarks': remarks,
                }
            )

            # 2. State Machine Pipeline
            if result == 'Approved':
                if order.payment_term in ['COD', 'Terms']:
                    order.status = 'Ready for Pouring'
                else:
                    order.status = 'For Payment Verification'
                
                # --- THIS SECURES THE CALENDAR DATA LINK ---
                final_schedule_date = new_date or order.proposed_schedule
                if final_schedule_date:
                    Schedule.objects.update_or_create(
                        order=order,
                        defaults={
                            'delivery_date': final_schedule_date
                        }
                    )
                # --------------------------------------------

            elif result == 'Rejected':
                order.status = 'Inspection Rejected'
            elif result == 'Re-inspection':
                order.status = 'For Re-inspection'
            
            order.save()

        return Response({
            "message": f"Site {result} successfully.",
            "new_status": order.status,
            "new_date": order.proposed_schedule
        })
    
    @action(
        detail=True, 
        methods=['post'], 
        permission_classes=[permissions.IsAuthenticated],
        parser_classes=[MultiPartParser, FormParser]
    )
    def upload_payment(self, request, pk=None):
        order = self.get_object()
        
        # 1. Safely intercept the binary object payload from Next.js
        uploaded_file = request.FILES.get('proof_of_payment')
        
        if not uploaded_file:
            return Response(
                {"error": "No transaction receipt found. Ensure the FormData key matches 'proof_of_payment'."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            with transaction.atomic():
                # 2. MATCHED FIELDS: Assign 'uploaded_file' to 'proof_file' column explicitly
                payment_record = Payment.objects.create(
                    order=order,
                    proof_file=uploaded_file, # Perfectly matched to your models.py
                    status='Pending'
                )
                
                # 3. Secure workflow track status modification
                order.status = "For Payment Verification"
                order.save()
                
            return Response({
                "status": "success",
                "message": "Proof of payment logged successfully. Pending administrative validation.",
                "payment_id": payment_record.id
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            import traceback
            print("--- DATABASE WRITE ERROR CORRECTION VIEW LOG ---")
            print(traceback.format_exc())
            return Response({"error": f"Database integrity anomaly: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
    
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

# class PaymentViewSet(viewsets.ModelViewSet):
#     queryset = Payment.objects.all()
#     serializer_class = PaymentSerializer

#     @action(detail=True, methods=['post'], permission_classes=[IsAdminUserRole])
#     def verify_payment(self, request, pk=None):
#         payment = self.get_object()
#         order = payment.order
#         decision = request.data.get('decision')  # 'approve' or 'reject'

#         if decision == 'approve':
#             with transaction.atomic():
#                 # 1. Update Payment log status
#                 payment.status = 'Verified'
#                 payment.save()
                
#                 # Fetch payment terms safely (standardizing case just like frontend)
#                 term = (order.payment_term or "COD").strip().upper()

#                 # 2. Advanced Workflow Separation
#                 if term in ['ADVANCE', 'FULL ADVANCE PAYMENT']:
#                     order.payment_status = 'Paid'
#                     order.status = 'Ready for Pouring'
#                     message = "Advance payment verified completely. Order is now Ready for Pouring."
                    
#                 elif term in ['DP', 'PERCENTAGE DOWNPAYMENT']:
#                     # Downpayments satisfy the initial block, allowing dispatching to proceed
#                     order.payment_status = 'Downpayment Verified'  # Custom status state
#                     order.status = 'Ready for Pouring'
#                     message = "Downpayment verified. Structural schedule unlocked! Order is now Ready for Pouring."
                    
#                 else:
#                     # Fallback structural safeguard for COD/Terms if manually passed through here
#                     order.payment_status = 'Paid'
#                     order.status = 'Ready for Pouring'
#                     message = "Payment verified. Order is now Ready for Pouring."

#                 order.save()
#             return Response({"message": message, "payment_status": order.payment_status, "status": order.status})
        
#         else:
#             payment.status = 'Rejected'
#             payment.save()
#             return Response({"message": "Payment verification rejected. Customer must re-upload accurate receipt structural proofs."})

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    # Enforce that only authenticated administrative personnel can trigger verification
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    @action(detail=True, methods=['post'])
    def verify_payment(self, request, pk=None):
        payment = self.get_object()
        decision = request.data.get('decision')
        remarks_input = request.data.get('remarks', '').strip()
        
        # Guard Clause: Validate request payload structure
        if decision not in ['approve', 'reject']:
            return Response(
                {"error": "Invalid system verdict. Decision must be 'approve' or 'reject'."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Guard Clause: Enforce a comment/reason when rejecting a payment
        if decision == 'reject' and not remarks_input:
            return Response(
                {"error": "A brief comment or rejection reason is required when denying a payment transaction."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            with transaction.atomic():
                # Bind the administrative feedback comments to the payment model row
                payment.remarks = remarks_input
                order = payment.order
                
                if decision == 'approve':
                    payment.status = 'Approved'
                    payment.save()
                    
                    # Update cross-referenced Order attributes
                    order.payment_status = 'Paid'
                    order.status = 'Ready for Pouring' # Advances order to Step 4 (Logistics/Dispatch)
                    order.save()
                    
                    message_response = "Payment verified successfully. Order workflow advanced to logistics deployment tracking."
                
                else: # 'reject' logical branch execution
                    payment.status = 'Rejected'
                    payment.save()
                    
                    # Revert order fields so the customer is notified to re-upload on their side
                    order.payment_status = 'Rejected'
                    order.status = 'Quotation Sent' # Returns to active state for customer re-upload
                    order.save()
                    
                    message_response = f"Payment rejected successfully. Reason logged: '{remarks_input}'"
                    
            return Response({
                "status": "success", 
                "message": message_response
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            # Handle standard runtime database connection or serialization errors gracefully
            return Response(
                {"error": f"Failed to execute administrative database operational update: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

@api_view(['GET'])
@permission_classes([IsAdminUserRole])
def admin_dashboard_analytics(request):
    """
    Computes summary cards and active metrics safely.
    """
    try:
        from django.db.models import Sum

        # 1. Pipeline Counter Blocks
        pending_quotes = Order.objects.filter(status="Pending").count()
        pending_inspections = Order.objects.filter(status="For Inspection").count()
        pending_payments = Order.objects.filter(status="For Payment Verification").count()
        ready_to_pour = Order.objects.filter(status="Ready for Pouring").count()
        
        active_clients = Order.objects.exclude(status__in=["Delivered", "Rejected"]).values('user').distinct().count()

        # 2. Defensive calculation fallback loops
        # If your related name isn't 'items', we can compute it safely by evaluating standard Order items:
        active_orders = Order.objects.filter(
            status__in=["Quotation Sent", "For Inspection", "For Payment Verification", "Ready for Pouring"]
        )
        
        # Safe imperative evaluation if aggregate relation paths fail
        total_volume = 0
        for o in active_orders:
            # Looks through your dynamic OrderItems relation regardless of reverse query keys
            items = getattr(o, 'items', None) or (o.orderitem_set if hasattr(o, 'orderitem_set') else None)
            if items:
                total_volume += sum(item.volume for item in items.all())

        # 3. Financial Analytics Fallback
        financial_pipeline = Quotation.objects.filter(
            order__status__in=["For Inspection", "For Payment Verification", "Ready for Pouring"]
        ).aggregate(total=Sum('final_total'))['total'] or 0

        return Response({
            "summary": {
                "active_orders_count": Order.objects.exclude(status="Rejected").count(),
                "active_clients": active_clients,
                "total_volume_scheduled": float(total_volume),
                "projected_revenue": float(financial_pipeline)
            },
            "queues": {
                "Pending": pending_quotes,
                "Quotation Sent": Order.objects.filter(status="Quotation Sent").count(),
                "For Inspection": pending_inspections,
                "For Payment Verification": pending_payments,
                "Ready for Pouring": ready_to_pour,
            }
        })
    except Exception as e:
        # Fallback tracking payload so frontend NEVER crashes due to backend math errors
        print(f"Dashboard Analytics Exception Raised: {str(e)}")
        return Response({
            "summary": {"active_orders_count": 0, "active_clients": 0, "total_volume_scheduled": 0, "projected_revenue": 0},
            "queues": {"Pending": 0, "Quotation Sent": 0, "For Inspection": 0, "For Payment Verification": 0, "Ready for Pouring": 0}
        })
    

class ScheduleViewSet(viewsets.ModelViewSet):
    """
    Dispatcher API Engine: Serves approved production schedules.
    Allows anyone to VIEW, but restricts modifications to authenticated staff.
    """
    serializer_class = ScheduleSerializer
    authentication_classes = [JWTAuthentication] # Keeps authentication active for state changes

    def get_permissions(self):
        # 🔴 ALLOW SAFE METHODS (GET, HEAD, OPTIONS) FOR PUBLIC / DISPLAY VIEWS
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        
        # Unsafe methods (POST status modifications) still require full authentication
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return Schedule.objects.select_related(
            'order', 
            'order__delivery'
        ).prefetch_related('order__order_items__mix_design').all()

    @action(detail=True, methods=['post'])
    def update_delivery_status(self, request, pk=None):
        schedule_record = self.get_object()
        order_record = schedule_record.order
        next_status = request.data.get('status')

        if not next_status:
            return Response({"error": "Target delivery status is required."}, status=400)

        with transaction.atomic():
            # Atomically update or generate the matching row in your Delivery table
            delivery_instance, created = Delivery.objects.get_or_create(
                order=order_record,
                defaults={'status': next_status}
            )
            if not created:
                delivery_instance.status = next_status
                delivery_instance.save()

            # Optional: Advance the overarching order status column to match 
            if next_status == "Completed":
                order_record.status = "Delivered"
                order_record.save()

        return Response({
            "status": "success",
            "message": f"Logistics system status synced to {next_status}."
        })