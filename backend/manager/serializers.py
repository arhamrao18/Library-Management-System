from rest_framework import serializers
from .models import member, Save,Login, Borrowed, MembershipFee, FEE_DUE_DAY, MONTHLY_FEE_AMOUNT
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from datetime import date
''' Login Serializer'''

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields = '__all__'

''' Save Serializer'''

class SaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Save
        fields = '__all__'

'''Member Serializer'''

from django.contrib.auth.hashers import make_password

def create_fee_for_member(target_member, month_start):
    """
    Creates a MembershipFee record for the given member for the given month,
    if one doesn't already exist. Sets the due date to FEE_DUE_DAY of that month.
    """
    due_date = month_start.replace(day=FEE_DUE_DAY)

    fee, created = MembershipFee.objects.get_or_create(
        member=target_member,
        month=month_start,
        defaults={
            'due_date': due_date,
            'amount': MONTHLY_FEE_AMOUNT,
        }
    )
    return fee
class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = member
        fields = '__all__'

    def create(self, validated_data):
        if validated_data.get('Password'):
            validated_data['Password'] = make_password(validated_data['Password'])

        # Create the member first
        new_member = super().create(validated_data)

        # Immediately charge the first month's fee for this new member,
        # as per requirement: "new member add hote hi fee charge honi chahiye"
        create_fee_for_member(new_member, timezone.now().date().replace(day=1))

        return new_member
'''Borrowed Serializer'''
class BorrowedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Borrowed
        fields = '__all__'
    