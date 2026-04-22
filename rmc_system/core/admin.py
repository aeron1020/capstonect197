from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    OrderItem, User, Customer, MixDesign, Order, 
    Quotation, Payment, SiteInspection,
    Schedule, Delivery
)

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Role Information', {'fields': ('role',)}),
    )
    list_display = ('username', 'email', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

# Updated Inline name to match your model choice
class SiteInspectionInline(admin.StackedInline):
    model = SiteInspection
    extra = 0
    # Make sure 'inspector' can be null or handles the current user
    fields = ['result', 'remarks', 'inspector']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'project_name', 'company_name', 'status', 'created_at')
    list_filter = ('status', 'project_type')
    # Combined both Inlines here
    inlines = [OrderItemInline, SiteInspectionInline] 
    fields = ('user', 'company_name', 'company_address', 'contact_person', 
              'project_name', 'project_location', 'project_type', 
              'proposed_schedule', 'distance_km', 'status')

@admin.register(MixDesign)
class MixDesignAdmin(admin.ModelAdmin):
    list_display = ('design_name', 'type', 'price_per_cubic', 'pump_required')
    list_filter = ('type', 'pump_required')

# MERGED SiteInspectionAdmin (removed the duplicate)
@admin.register(SiteInspection)
class SiteInspectionAdmin(admin.ModelAdmin):
    list_display = ('order', 'result', 'inspector', 'inspected_at')
    list_filter = ('result', 'inspected_at')
    search_fields = ['order__project_name', 'remarks']

@admin.register(Quotation)
class QuotationAdmin(admin.ModelAdmin):
    list_display = ('order', 'final_total', 'status', 'created_at')
    readonly_fields = ('breakdown_display',)

    def breakdown_display(self, obj):
        # This makes the JSON look pretty in the Admin panel
        import json
        from django.utils.safestring import mark_safe
        return mark_safe(f"<pre>{json.dumps(obj.breakdown, indent=2)}</pre>")

# Simple Registrations
admin.site.register(Customer)
admin.site.register(Payment)
admin.site.register(Schedule)
admin.site.register(Delivery)