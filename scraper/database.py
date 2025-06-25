import psycopg2
import os

def get_connection():
    return psycopg2.connect(
        dbname="noticias_db",
        user="postgres",
        password="postgres",
        host="postgres",
        port=5432
    )
    # return psycopg2.connect(
    #     dbname="postgres",
    #     user="postgres",
    #     password="Luter123.",
    #     host="localhost",
    #     port="5432"
    # )
