from rest_framework import serializers
from .models import *
from django.db import transaction
from .models import Customer
from django.contrib.auth import get_user_model

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

class MixDesignSerializer(serializers.ModelSerializer):
    class Meta:
        model = MixDesign
        fields = '__all__'

class OrderDesignSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDesign
        fields = ['mix_design', 'volume']

class OrderSerializer(serializers.ModelSerializer):
    designs = OrderDesignSerializer(many=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user']

    def create(self, validated_data):
        designs_data = validated_data.pop('designs')
        user = self.context['request'].user

        order = Order.objects.create(user=user, **validated_data)

        for d in designs_data:
            OrderDesign.objects.create(order=order, **d)

        return order
    
class QuotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quotation
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'


def validate_designs(self, value):
    if len(value) > 5:
        raise serializers.ValidationError("Maximum of 5 designs only.")
    return value


