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
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=50)

class MixDesign(models.Model):
    design_name = models.CharField(max_length=100)
    price_per_cubic = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=50)
    pump_required = models.BooleanField(default=False)

    def __str__(self):
        return self.design_name
    

class Order(models.Model):
    PROJECT_TYPE_CHOICES = [
        ('Commercial', 'Commercial'),
        ('Government', 'Government'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # --- Company Details ---
    # These can be auto-filled from the Customer profile during perform_create
    company_name = models.CharField(max_length=255)
    company_address = models.TextField()
    contact_person = models.CharField(max_length=255)

    # --- Project Details ---
    project_name = models.CharField(max_length=255)
    project_location = models.TextField()
    project_type = models.CharField(
        max_length=20, 
        choices=PROJECT_TYPE_CHOICES,
        default='Commercial'
    )
    
    # --- Technical Specs ---
    volume_m3 = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    # distance_km is null=True because the admin sets this after reviewing the location
    distance_km = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    # --- Scheduling & Status ---
    proposed_schedule = models.DateField()
    status = models.CharField(
        max_length=50, 
        default="Pending"
    ) # Choices: Pending, Quotation Generated, Approved, Scheduled, Delivered, Cancelled

    # --- Payment ---
    payment_type = models.CharField(max_length=20, null=True, blank=True) # Cash, Bank Transfer, PDC
    payment_status = models.CharField(max_length=20, default="Not Required")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project_name} ({self.company_name})"

class OrderDesign(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="designs")
    mix_design = models.ForeignKey(MixDesign, on_delete=models.CASCADE)
    volume = models.FloatField()

QUOTATION_STATUS = (
    ('Pending', 'Pending'),
    ('Approved', 'Approved'),
    ('Rejected', 'Rejected'),
)

class Quotation(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    computed_total = models.DecimalField(max_digits=12, decimal_places=2)
    final_total = models.DecimalField(max_digits=12, decimal_places=2)

    breakdown = models.JSONField(null=True, blank=True)

    status = models.CharField(max_length=20, choices=QUOTATION_STATUS, default="Pending")

class Payment(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    proof_file = models.ImageField(upload_to="payments/")
    status = models.CharField(max_length=20, default="Pending")

class Inspection(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    access_ok = models.BooleanField(default=False)
    ground_ok = models.BooleanField(default=False)
    formwork_ok = models.BooleanField(default=False)
    remarks = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20)

class Schedule(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    delivery_date = models.DateField()

class Delivery(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    status = models.CharField(max_length=20)