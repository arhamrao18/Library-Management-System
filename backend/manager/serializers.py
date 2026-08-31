from rest_framework import serializers
from .models import Login, Save, member, Borrowed

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

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = member
        fields = '__all__'

    def create(self, validated_data):
        if validated_data.get('Password'):
            validated_data['Password'] = make_password(validated_data['Password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if validated_data.get('Password'):
            validated_data['Password'] = make_password(validated_data['Password'])
        return super().update(instance, validated_data)

'''Borrowed Serializer'''
class BorrowedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Borrowed
        fields = '__all__'
    