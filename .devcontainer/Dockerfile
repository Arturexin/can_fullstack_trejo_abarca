# FROM node:18

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 5173

# CMD ["npm", "run", "dev"]

FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 9030

CMD ["flask", "run", "--host=0.0.0.0", "--port=9030"]