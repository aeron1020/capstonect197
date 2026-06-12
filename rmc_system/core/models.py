

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('customer', 'Customer'),
        ('dispatcher', 'Dispatcher'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')

class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=50)

class MixDesign(models.Model):
    design_name = models.CharField(max_length=100)
    price_per_cubic = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=50, blank=True, null=True)
    pump_required = models.BooleanField(default=False)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.design_name}"


class Order(models.Model):
    PROJECT_TYPE_CHOICES = [('Commercial', 'Commercial'), ('Government', 'Government')]
    PAYMENT_TERM_CHOICES = [
        ('COD', 'Cash on Delivery'),
        ('Terms', 'Credit Terms'),
        ('Advance', 'Full Advance Payment'),
        ('DP', 'Percentage Downpayment'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255, blank=True)
    company_address = models.TextField(blank=True)
    contact_person = models.CharField(max_length=255, blank=True)
    project_name = models.CharField(max_length=255)
    project_location = models.TextField()
    project_type = models.CharField(max_length=20, choices=PROJECT_TYPE_CHOICES, default='Commercial')
    distance_km = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    proposed_schedule = models.DateField()
    status = models.CharField(max_length=50, default="Pending")
    
    # Cleaned: Combined these fields at the bottom
    payment_term = models.CharField(max_length=20, choices=PAYMENT_TERM_CHOICES, default='COD', null=True, blank=True)
    payment_type = models.CharField(max_length=20, null=True, blank=True) # General type if needed
    payment_status = models.CharField(max_length=20, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="order_items", on_delete=models.CASCADE)
    mix_design = models.ForeignKey(MixDesign, on_delete=models.PROTECT) 
    volume = models.DecimalField(max_digits=10, decimal_places=2)

# class Quotation(models.Model):
#     order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="quotation")
#     computed_total = models.DecimalField(max_digits=12, decimal_places=2)
#     final_total = models.DecimalField(max_digits=12, decimal_places=2)
#     breakdown = models.JSONField(null=True, blank=True) 
#     status = models.CharField(max_length=20, default="Pending")

class Quotation(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="quotation")
    computed_total = models.DecimalField(max_digits=12, decimal_places=2)
    final_total = models.DecimalField(max_digits=12, decimal_places=2)
    breakdown = models.JSONField(null=True, blank=True) 
    status = models.CharField(max_length=20, default="Pending")
    # Recommended addition for audit trail:

    revision_number = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
            return f"Quote for {self.order.project_name} (Rev {self.revision_number}) - ₱{self.final_total}"
        

class Payment(models.Model):
    # Relates the snapshot to an active concrete project order tracking row
    order = models.ForeignKey(
        'Order', 
        on_delete=models.CASCADE, 
        related_name='payment_set' # Matches the source='payment_set' in your Serializer
    )
    
    # Stores the uploaded bank deposit slip or check receipt photo document
    proof_file = models.ImageField(upload_to="payments/proofs/")
    
    # State tracking variables for step dashboards
    status = models.CharField(
        max_length=25, 
        default="Pending" # Options: Pending, Approved, Rejected
    )
    
    # The crucial addition for admin feedback and rejection audits
    remarks = models.TextField(blank=True, null=True)
    
    # Standard engineering tracking fields
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment #{self.id} for Order #{self.order.id} ({self.status})"

class SiteInspection(models.Model):
    RESULT_CHOICES = [
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Re-inspection', 'For Re-inspection'),
    ]

    order = models.OneToOneField(
        Order, 
        on_delete=models.CASCADE, 
        related_name='site_visit_report' 
    )
    inspector = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True
    )
    result = models.CharField(max_length=20, choices=RESULT_CHOICES)
    remarks = models.TextField()
    inspected_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inspection for Order #{self.order.id} - {self.result}"

class Schedule(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    delivery_date = models.DateField()

class Delivery(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    status = models.CharField(max_length=20)

