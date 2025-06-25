FROM python:3.11

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Instala dependencias de desarrollo si tienes (ejemplo: pip install debugpy)
# RUN pip install debugpy

EXPOSE 9030

CMD ["flask", "run", "--host=0.0.0.0", "--port=9030", "--reload"]
