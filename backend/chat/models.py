from mongoengine import Document, fields

class User(Document):
  id = fields.ObjectId()
  _id = fields.StringField(required=True)
  username = fields.StringField(required=True)
  password = fields.StringField(required=True)
