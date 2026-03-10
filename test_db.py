import psycopg2
import os

db_url = "postgresql://postgres.nzoxcdzytohijlcsxmjo:Naomie334%2FChris123@aws-0-eu-west-1.pooler.supabase.com:6543/postgres"

try:
    print(f"Connecting to {db_url.split('@')[1]}...")
    conn = psycopg2.connect(db_url)
    print("Connection successful!")
    cur = conn.cursor()
    cur.execute("SELECT version();")
    print(cur.fetchone())
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
