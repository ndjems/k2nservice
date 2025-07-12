from django.shortcuts import render
from rest_framework import viewsets
from .serializers import MessageSerializer
from .models import Message
from rest_framework.viewsets import ModelViewSet



# Create your views here.

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer


   
