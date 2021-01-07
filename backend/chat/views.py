
import json
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .hasher import hash,check_hash
from stream_chat import StreamChat
from .models import Member
# Create your views here.

@csrf_exempt
def login(request):
    if not request.body:
        return JsonResponse(status=200, data={'message': 'No request body'})
    body = json.loads(bytes(request.body).decode('utf-8'))

    if 'username' not in body:
        return JsonResponse(status=400, data={'message': 'Username is required to join the channel'})
    
    if 'password' not in body:
        return JsonResponse(status=400, data={'message': 'Password is required to join the channel'})

    username = body['username']
    password = body['password']
    

    try:
        member = Member.objects.get(username=username)
        if not check_hash(password,member.password):
            return JsonResponse(status=400,data={'message':'Wrong Password'})
        client = StreamChat(api_key=settings.STREAM_API_KEY,
                        api_secret=settings.STREAM_API_SECRET)
        channel = client.channel('messaging', 'General')
        token = client.create_token(user_id=member.username)
        return JsonResponse(status=200, data={"username": member.username, "token": token, "apiKey": settings.STREAM_API_KEY})

    except Member.DoesNotExist:
        return JsonResponse(status=400,data = {'message':'User does not exist'})

@csrf_exempt
def register(request):
    if not request.body:
        return JsonResponse(status=200, data={'message': 'No request body'})
    body = json.loads(bytes(request.body).decode('utf-8'))

    if 'username' not in body:
        return JsonResponse(status=400, data={'message': 'Username is required to join the channel'})
    if 'password' not in body:
        return JsonResponse(status=400, data={'message': 'Password is required to join the channel'})
    username = body['username']
    password = body['password']

    try:
        member = Member.objects.get(username=username)
        if member:
            return JsonResponse(status=400,data={'message':'User already exists'})

    except Member.DoesNotExist:
        hashed = hash(password)
        member = Member(username=username,password=hashed)
        member.save()
        return JsonResponse(status=200, data={'message':'User has been registered'})