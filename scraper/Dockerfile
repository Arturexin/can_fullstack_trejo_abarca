FROM python:3.11

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 9020

# Si usas Flask:
CMD ["flask", "run", "--host=0.0.0.0", "--port=9020", "--reload"]