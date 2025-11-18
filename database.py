from dotenv import load_dotenv
import os
import mysql.connector
from mysql.connector import pooling

# 1️⃣ Cargar variables del .env
load_dotenv()

# 2️⃣ Configuración usando variables del entorno
DB_CONFIG = {
    "host": os.environ.get("DB_HOST"),
    "port": int(os.environ.get("DB_PORT", 3306)),
    "user": os.environ.get("DB_USER"),
    "password": os.environ.get("DB_PASSWORD"),
    "database": os.environ.get("DB_NAME"),
    "charset": "utf8mb4"
}

# 3️⃣ Crear pool de conexiones
connection_pool = pooling.MySQLConnectionPool(
    pool_name="palees_pool",
    pool_size=5,
    **DB_CONFIG
)

def get_conn():
    """Devuelve una conexión desde el pool."""
    return connection_pool.get_connection()