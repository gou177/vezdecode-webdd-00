FROM python:3.8-alpine as backend
WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
COPY . /app
CMD ["python", "__main__.py"]