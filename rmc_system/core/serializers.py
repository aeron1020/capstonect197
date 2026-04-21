from rest_framework import serializers
from .models import *
from django.db import transaction
from .models import Customer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # 1. Explicitly mark these as write_only so DRF doesn't try to return them in the response
    company_name = serializers.CharField(write_only=True)
    contact_number = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # Include all fields here
        fields = ('username', 'password', 'email', 'first_name', 'last_name', 'company_name', 'contact_number')

    def create(self, validated_data):
        # 2. Extract (pop) the extra fields so they aren't passed to create_user
        company_name = validated_data.pop('company_name')
        contact_number = validated_data.pop('contact_number')

        with transaction.atomic():
            # 3. Create user with the remaining validated_data
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data.get('email', ''),
                password=validated_data['password'],
                first_name=validated_data.get('first_name', ''),
                last_name=validated_data.get('last_name', ''),
                role='customer'
            )
            
            # 4. Create the profile
            Customer.objects.create(
                user=user,
                company_name=company_name,
                contact_person=f"{user.first_name} {user.last_name}",
                contact_number=contact_number
            )
            
        # Now when this returns, DRF only looks for username/email/etc. on the user object.
        return user
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Add the user data to the response
        data['user'] = {
            'username': self.user.username,
            'role': self.user.role,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
        }
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class MixDesignSerializer(serializers.ModelSerializer):
    class Meta:
        model = MixDesign
        fields = '__all__'

class QuotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quotation
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    mix_design_name = serializers.ReadOnlyField(source='mix_design.design_name')
    class Meta:
        model = OrderItem
        fields = ['id', 'mix_design', 'mix_design_name', 'volume']

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True)
    quotation = QuotationSerializer(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'status', 'company_name', 'company_address', 'contact_person']

    
    def create(self, validated_data):
        items_data = validated_data.pop('order_items')
        
        # Remove 'user' from validated_data if it exists to prevent the collision
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


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'


def validate_designs(self, value):
    if len(value) > 5:
        raise serializers.ValidationError("Maximum of 5 designs only.")
    return value


