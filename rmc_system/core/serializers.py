# from rest_framework import serializers
# from .models import *
# from django.db import transaction
# from .models import Customer
# from django.contrib.auth import get_user_model
# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from rest_framework_simplejwt.views import TokenObtainPairView

# User = get_user_model()

# class RegisterSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)
#     # 1. Explicitly mark these as write_only so DRF doesn't try to return them in the response
#     company_name = serializers.CharField(write_only=True)
#     contact_number = serializers.CharField(write_only=True)

#     class Meta:
#         model = User
#         # Include all fields here
#         fields = ('username', 'password', 'email', 'first_name', 'last_name', 'company_name', 'contact_number')

#     def create(self, validated_data):
#         # 2. Extract (pop) the extra fields so they aren't passed to create_user
#         company_name = validated_data.pop('company_name')
#         contact_number = validated_data.pop('contact_number')

#         with transaction.atomic():
#             # 3. Create user with the remaining validated_data
#             user = User.objects.create_user(
#                 username=validated_data['username'],
#                 email=validated_data.get('email', ''),
#                 password=validated_data['password'],
#                 first_name=validated_data.get('first_name', ''),
#                 last_name=validated_data.get('last_name', ''),
#                 role='customer'
#             )
            
#             # 4. Create the profile
#             Customer.objects.create(
#                 user=user,
#                 company_name=company_name,
#                 contact_person=f"{user.first_name} {user.last_name}",
#                 contact_number=contact_number
#             )
            
#         # Now when this returns, DRF only looks for username/email/etc. on the user object.
#         return user
    
# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
#     def validate(self, attrs):
#         data = super().validate(attrs)
#         # Add the user data to the response
#         data['user'] = {
#             'username': self.user.username,
#             'role': self.user.role,
#             'first_name': self.user.first_name,
#             'last_name': self.user.last_name,
#         }
#         return data

# class MyTokenObtainPairView(TokenObtainPairView):
#     serializer_class = MyTokenObtainPairSerializer

# class MixDesignSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MixDesign
#         fields = '__all__'

# class QuotationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Quotation
#         fields = '__all__'


# class OrderItemSerializer(serializers.ModelSerializer):
#     mix_design_name = serializers.ReadOnlyField(source='mix_design.design_name')
#     class Meta:
#         model = OrderItem
#         fields = ['id', 'mix_design', 'mix_design_name', 'volume']

# # class OrderSerializer(serializers.ModelSerializer):
# #     order_items = OrderItemSerializer(many=True)
# #     quotation = QuotationSerializer(read_only=True)

# #     class Meta:
# #         model = Order
# #         fields = '__all__'
# #         read_only_fields = ['user', 'status', 'company_name', 'company_address', 'contact_person']

    
# #     def create(self, validated_data):
# #         items_data = validated_data.pop('order_items')
        
# #         # Remove 'user' from validated_data if it exists to prevent the collision
# #         validated_data.pop('user', None) 
        
# #         user = self.context['request'].user
# #         profile = getattr(user, 'customer_profile', None)

# #         with transaction.atomic():
# #             order = Order.objects.create(
# #                 user=user,
# #                 company_name=profile.company_name if profile else "N/A",
# #                 contact_person=profile.contact_person if profile else user.get_full_name(),
# #                 **validated_data
# #             )
# #             for item_data in items_data:
# #                 OrderItem.objects.create(order=order, **item_data)
# #         return order

# class OrderSerializer(serializers.ModelSerializer):
#     payments = PaymentSerializer(many=True, read_only=True, source='payment_set')
#     order_items = OrderItemSerializer(many=True)
#     quotation = QuotationSerializer(read_only=True)

#     class Meta:
#         model = Order
#         fields = '__all__'
#         # Add payment_term here so only the Admin action can modify it
#         read_only_fields = [
#             'user', 
#             'status', 
#             'company_name', 
#             'company_address', 
#             'contact_person',
#             'payment_term', 
#             'payment_status'
#         ]

#     def create(self, validated_data):
#         items_data = validated_data.pop('order_items')
#         validated_data.pop('user', None) 
        
#         user = self.context['request'].user
#         # Note: Your model related_name is 'customer_profile'
#         profile = getattr(user, 'customer_profile', None)

#         with transaction.atomic():
#             order = Order.objects.create(
#                 user=user,
#                 company_name=profile.company_name if profile else "N/A",
#                 contact_person=profile.contact_person if profile else user.get_full_name(),
#                 **validated_data
#             )
#             for item_data in items_data:
#                 OrderItem.objects.create(order=order, **item_data)
#         return order


# class PaymentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Payment
#         fields = ['id', 'order', 'proof_file', 'status', 'remarks']


# def validate_designs(self, value):
#     if len(value) > 5:
#         raise serializers.ValidationError("Maximum of 5 designs only.")
#     return value


from rest_framework import serializers
from django.db import transaction
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import * # Safely imports Customer, MixDesign, Quotation, Order, OrderItem, Payment


User = get_user_model()

# ==========================================
# AUTHENTICATION & PROFILE SERIALIZERS
# ==========================================

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    company_name = serializers.CharField(write_only=True)
    contact_number = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name', 'company_name', 'contact_number')

    def create(self, validated_data):
        company_name = validated_data.pop('company_name')
        contact_number = validated_data.pop('contact_number')

        with transaction.atomic():
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data.get('email', ''),
                password=validated_data['password'],
                first_name=validated_data.get('first_name', ''),
                last_name=validated_data.get('last_name', ''),
                role='customer'
            )
            
            Customer.objects.create(
                user=user,
                company_name=company_name,
                contact_person=f"{user.first_name} {user.last_name}",
                contact_number=contact_number
            )
            
        return user
    

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'username': self.user.username,
            'role': self.user.role,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
        }
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# ==========================================
# RMC PROJECT CORE ENGINE SERIALIZERS
# ==========================================

class MixDesignSerializer(serializers.ModelSerializer):
    class Meta:
        model = MixDesign
        fields = '__all__'


class QuotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quotation
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    """
    Declared here so it is parsed before being safely referenced 
    by relation inside the OrderSerializer downstream.
    """
    class Meta:
        model = Payment
        fields = ['id', 'order', 'proof_file', 'status', 'remarks']


class OrderItemSerializer(serializers.ModelSerializer):
    mix_design_name = serializers.ReadOnlyField(source='mix_design.design_name')
    
    class Meta:
        model = OrderItem
        fields = ['id', 'mix_design', 'mix_design_name', 'volume']


class OrderSerializer(serializers.ModelSerializer):
    # Backward relation mapping payment snapshots dynamically to the step panel tracking views
    payments = PaymentSerializer(many=True, read_only=True, source='payment_set')
    order_items = OrderItemSerializer(many=True)
    quotation = QuotationSerializer(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = [
            'user', 
            'status', 
            'company_name', 
            'company_address', 
            'contact_person',
            'payment_term', 
            'payment_status'
        ]

    def validate_order_items(self, value):
        """
        Enforces business workflow rule limits on concrete structural variants per order.
        """
        if len(value) > 5:
            raise serializers.ValidationError("Maximum of 5 unique mix designs allowed per order tracking sequence.")
        return value

    def create(self, validated_data):
        items_data = validated_data.pop('order_items')
        validated_data.pop('user', None) 
        
        user = self.context['request'].user
        profile = getattr(user, 'customer_profile', None)

        with transaction.atomic():
            order = Order.objects.create(
                user=user,
                company_name=profile.company_name if profile else "N/A",
                contact_person=profile.contact_person if profile else user.get_full_name(),
                **validated_data
            )
            for item_data in items_data:
                OrderItem.objects.create(order=order, **item_data)
        return order
    
    

# class DispatchMixDesignSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MixDesign
#         fields = ['design_name']

# class DispatchOrderItemSerializer(serializers.ModelSerializer):
#     mix_design = DispatchMixDesignSerializer(read_only=True)
    
#     class Meta:
#         model = OrderItem
#         fields = ['volume', 'mix_design']

# class ScheduleSerializer(serializers.ModelSerializer):
#     # Fixed: Redundant source='id' removed
#     id = serializers.CharField(read_only=True)
    
#     # Custom relational lookups
#     order_id = serializers.IntegerField(source='order.id', read_only=True)
#     project_name = serializers.CharField(source='order.project_name', read_only=True)
#     project_location = serializers.CharField(source='order.project_location', read_only=True)
    
#     # Method fields and nested arrays
#     date = serializers.SerializerMethodField()
#     order_items = DispatchOrderItemSerializer(source='order.order_items', many=True, read_only=True)
#     delivery_status = serializers.SerializerMethodField()

#     class Meta:
#         model = Schedule
#         # Fixed: Added all custom declarations here so they actually serialize to your frontend
#         fields = [
#             'id', 
#             'order', 
#             'order_id', 
#             'project_name', 
#             'project_location', 
#             'delivery_date', 
#             'date', 
#             'order_items', 
#             'delivery_status'
#         ]

#     def get_date(self, obj):
#         # Explicitly formats the date field to YYYY-MM-DD string format
#         if obj.delivery_date:
#             return obj.delivery_date.strftime('%Y-%m-%d')
#         return None

#     def get_delivery_status(self, obj):
#         try:
#             return obj.order.delivery.status
#         except AttributeError:
#             return "Pending Dispatch"

class DispatchMixDesignSerializer(serializers.ModelSerializer):
    class Meta:
        model = MixDesign
        fields = ['design_name'] # Kept strictly as requested

class DispatchOrderItemSerializer(serializers.ModelSerializer):
    mix_design = DispatchMixDesignSerializer(read_only=True)
    # 🟢 Formatted string generated directly inside the order item layer
    mix_design_spec = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['volume', 'mix_design', 'mix_design_spec']

    def get_mix_design_spec(self, obj):
        if obj.mix_design and hasattr(obj.mix_design, 'design_name'):
            # Formats your existing design name string clean
            return f"ORD {obj.mix_design.design_name}"
        return "Standard RMC Mix"

class ScheduleSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    
    # Custom relational lookups
    order_id = serializers.IntegerField(source='order.id', read_only=True)
    project_name = serializers.CharField(source='order.project_name', read_only=True)
    project_location = serializers.CharField(source='order.project_location', read_only=True)
    
    # 🟢 Safe Method Fields to extract Customer Identity records
    client_name = serializers.SerializerMethodField()
    contact_number = serializers.SerializerMethodField()
    
    # Method fields and nested arrays
    date = serializers.SerializerMethodField()
    order_items = DispatchOrderItemSerializer(source='order.order_items', many=True, read_only=True)
    delivery_status = serializers.SerializerMethodField()

    class Meta:
        model = Schedule
        # 🟢 Added your tracking fields directly here
        fields = [
            'id', 
            'order', 
            'order_id', 
            'project_name', 
            'project_location', 
            'client_name',
            'contact_number',
            'delivery_date', 
            'date', 
            'order_items', 
            'delivery_status'
        ]

    def get_client_name(self, obj):
        try:
            # Safely navigate backward from order -> user -> customer_profile
            user = obj.order.user
            profile = getattr(user, 'customer_profile', None)
            if profile and profile.contact_person:
                return profile.contact_person
            return getattr(obj.order, 'contact_person', user.get_full_name() if user else "Unknown Client")
        except AttributeError:
            return "Unknown Client"

    def get_contact_number(self, obj):
        try:
            user = obj.order.user
            profile = getattr(user, 'customer_profile', None)
            if profile and profile.contact_number:
                return profile.contact_number
            return "No Contact #"
        except AttributeError:
            return "No Contact #"

    def get_date(self, obj):
        if obj.delivery_date:
            return obj.delivery_date.strftime('%Y-%m-%d')
        return None

    def get_delivery_status(self, obj):
        try:
            return obj.order.delivery.status
        except AttributeError:
            return "Pending Dispatch"