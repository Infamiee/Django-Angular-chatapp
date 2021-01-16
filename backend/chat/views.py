
from stream_chat import StreamChat

from chat_server import settings
from mongo_jwt.permissions import AuthenticatedOnly
from rest_framework.decorators import permission_classes
from rest_framework.decorators import api_view
from rest_framework.response import Response




@api_view(['GET'])
@permission_classes([AuthenticatedOnly])
def get_chat_token(request):

    user = request.user
    client = StreamChat(api_key=settings.STREAM_API_KEY,
                        api_secret=settings.STREAM_API_SECRET)
    channel = client.channel('messaging', 'General')
    token = client.create_token(user_id=user["username"])
    return Response(status=200,data={"username": user["username"], "token": token, "apiKey": settings.STREAM_API_KEY})



