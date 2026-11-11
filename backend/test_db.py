import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL

env_file = Path(__file__).resolve().parent / ".env"
load_dotenv(env_file)

password = os.getenv("SUPABASE_DB_PASSWORD")
if not password:
    raise RuntimeError(f"SUPABASE_DB_PASSWORD not found in {env_file}")

database_url = URL.create(
    drivername="postgresql+psycopg",
    username="postgres.lnajcjexabpqzfncgjiz",
    password=password,
    host="aws-0-ap-northeast-1.pooler.supabase.com",
    port=6543,
    database="postgres",
)

engine = create_engine(database_url, pool_pre_ping=True)

with engine.connect() as connection:
    row = connection.execute(text("select current_database(), now()")).one()

print(f"Connected to database: {row[0]}")
print(f"Database server time: {row[1]}")