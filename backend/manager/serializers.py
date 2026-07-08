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

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = member
        fields = '__all__'

'''Borrowed Serializer'''
class BorrowedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Borrowed
        fields = '__all__'
    