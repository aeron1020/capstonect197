# from django.contrib.auth.models import AbstractUser
# from django.db import models

# class User(AbstractUser):
#     ROLE_CHOICES = (
#         ('admin', 'Admin'),
#         ('customer', 'Customer'),
#         ('dispatcher', 'Dispatcher'),
#     )
#     role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')

# class Customer(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     company_name = models.CharField(max_length=255)
#     contact_person = models.CharField(max_length=255)
#     contact_number = models.CharField(max_length=50)

# class MixDesign(models.Model):
#     design_name = models.CharField(max_length=100)
#     price_per_cubic = models.DecimalField(max_digits=10, decimal_places=2)
#     type = models.CharField(max_length=50)
#     pump_required = models.BooleanField(default=False)

#     def __str__(self):
#         return self.design_name
    

# class Order(models.Model):
#     PROJECT_TYPE_CHOICES = [
#         ('Commercial', 'Commercial'),
#         ('Government', 'Government'),
#     ]

#     user = models.ForeignKey(User, on_delete=models.CASCADE)

#     # --- Company Details ---
#     # These can be auto-filled from the Customer profile during perform_create
#     company_name = models.CharField(max_length=255)
#     company_address = models.TextField()
#     contact_person = models.CharField(max_length=255)

#     # --- Project Details ---
#     project_name = models.CharField(max_length=255)
#     project_location = models.TextField()
#     project_type = models.CharField(
#         max_length=20, 
#         choices=PROJECT_TYPE_CHOICES,
#         default='Commercial'
#     )
    
#     # --- Technical Specs ---
#     volume_m3 = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
#     # distance_km is null=True because the admin sets this after reviewing the location
#     distance_km = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
#     # --- Scheduling & Status ---
#     proposed_schedule = models.DateField()
#     status = models.CharField(
#         max_length=50, 
#         default="Pending"
#     ) # Choices: Pending, Quotation Generated, Approved, Scheduled, Delivered, Cancelled

#     # --- Payment ---
#     payment_type = models.CharField(max_length=20, null=True, blank=True) # Cash, Bank Transfer, PDC
#     payment_status = models.CharField(max_length=20, default="Not Required")

#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.project_name} ({self.company_name})"

# class OrderDesign(models.Model):
#     order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="designs")
#     mix_design = models.ForeignKey(MixDesign, on_delete=models.CASCADE)
#     volume = models.FloatField()

# QUOTATION_STATUS = (
#     ('Pending', 'Pending'),
#     ('Approved', 'Approved'),
#     ('Rejected', 'Rejected'),
# )

# class Quotation(models.Model):
#     order = models.OneToOneField(Order, on_delete=models.CASCADE)
#     computed_total = models.DecimalField(max_digits=12, decimal_places=2)
#     final_total = models.DecimalField(max_digits=12, decimal_places=2)

#     breakdown = models.JSONField(null=True, blank=True)

#     status = models.CharField(max_length=20, choices=QUOTATION_STATUS, default="Pending")

# from django.contrib.auth.models import AbstractUser
# from django.db import models

# class User(AbstractUser):
#     ROLE_CHOICES = (
#         ('admin', 'Admin'),
#         ('customer', 'Customer'),
#         ('dispatcher', 'Dispatcher'),
#     )
#     role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')

# class Customer(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
#     company_name = models.CharField(max_length=255)
#     contact_person = models.CharField(max_length=255)
#     contact_number = models.CharField(max_length=50)

# class MixDesign(models.Model):
#     design_name = models.CharField(max_length=100)
#     price_per_cubic = models.DecimalField(max_digits=10, decimal_places=2)
#     type = models.CharField(max_length=50, blank=True, null=True)
#     pump_required = models.BooleanField(default=False)
#     description = models.TextField(blank=True, null=True)
#     is_active = models.BooleanField(default=True)

#     def __str__(self):
#         return f"{self.design_name} - P{self.price_per_cubic}"

# class Order(models.Model):
#     PROJECT_TYPE_CHOICES = [('Commercial', 'Commercial'), ('Government', 'Government')]
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     company_name = models.CharField(max_length=255)
#     company_address = models.TextField()
#     contact_person = models.CharField(max_length=255)
#     project_name = models.CharField(max_length=255)
#     project_location = models.TextField()
#     project_type = models.CharField(max_length=20, choices=PROJECT_TYPE_CHOICES, default='Commercial')
#     volume_m3 = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
#     distance_km = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
#     proposed_schedule = models.DateField()
#     status = models.CharField(max_length=50, default="Pending")
#     payment_type = models.CharField(max_length=20, null=True, blank=True)
#     payment_status = models.CharField(max_length=20, default="Not Required")
#     created_at = models.DateTimeField(auto_now_add=True)

# class OrderItem(models.Model):
#     order = models.ForeignKey(Order, related_name="order_items", on_delete=models.CASCADE)
#     mix_design = models.ForeignKey(MixDesign, on_delete=models.PROTECT) 
#     volume = models.DecimalField(max_digits=10, decimal_places=2)

# class Quotation(models.Model):
#     order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="quotation")
#     computed_total = models.DecimalField(max_digits=12, decimal_places=2)
#     final_total = models.DecimalField(max_digits=12, decimal_places=2)
#     breakdown = models.JSONField(null=True, blank=True)
#     status = models.CharField(max_length=20, default="Pending")

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
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    proof_file = models.ImageField(upload_to="payments/")
    status = models.CharField(max_length=20, default="Pending")

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

