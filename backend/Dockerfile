FROM python:3.7.9-alpine

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN  apk add libffi-dev gcc linux-headers musl-dev g++ python3-dev
ENV LIBRARY_PATH=/lib:/usr/lib
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# copy project
COPY . .
EXPOSE 8000
CMD [ "python", "./manage.py","runserver","0.0.0.0:8000" ]