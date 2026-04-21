from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    OrderItem, User, Customer, MixDesign, Order, 
    Quotation, Payment, 
    Inspection, Schedule, Delivery
)

# 1. Register the Custom User Model
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # Add the 'role' field to the User forms in Admin
    fieldsets = UserAdmin.fieldsets + (
        ('Role Information', {'fields': ('role',)}),
    )
    list_display = ('username', 'email', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser')

# # 2. Inline editing for Order Designs (makes it easier to see what's in an order)
# class OrderDesignInline(admin.TabularInline):
#     model = OrderDesign
#     extra = 1

# # 3. Order Management
# @admin.register(Order)
# class OrderAdmin(admin.ModelAdmin):
#     list_display = ('project_name', 'user', 'status', 'proposed_schedule', 'project_type')
#     list_filter = ('status', 'project_type', 'proposed_schedule')
#     search_fields = ('project_name', 'company_name', 'user__username')
#     inlines = [OrderDesignInline]

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('project_name', 'company_name', 'status', 'created_at')
    inlines = [OrderItemInline]
    fields = ('user', 'company_name', 'company_address', 'contact_person', 
              'project_name', 'project_location', 'project_type', 
              'proposed_schedule', 'distance_km', 'status')

# 4. Product/Pricing Management
@admin.register(MixDesign)
class MixDesignAdmin(admin.ModelAdmin):
    list_display = ('design_name', 'type', 'price_per_cubic', 'pump_required')
    list_filter = ('type', 'pump_required')

# 5. Simple Registration for the rest
admin.site.register(Customer)
admin.site.register(Quotation)
admin.site.register(Payment)
admin.site.register(Inspection)
admin.site.register(Schedule)
admin.site.register(Delivery)