import os
import psycopg2

db_url = "postgresql://postgres:Naomie334%2FChris123@db.nzoxcdzytohijlcsxmjo.supabase.co:5432/postgres"

try:
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    # List tables to be sure of the name
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
    tables = cur.fetchall()
    print("Tables:", [t[0] for t in tables])
    
    # Try to find the user table
    user_table = next((t[0] for t in tables if 'user' in t[0] and 'africa' in t[0]), 'africa_logistic_user')
    print(f"Using table: {user_table}")
    
    cur.execute(f"SELECT email, role, firstname, lastname, is_active FROM {user_table} LIMIT 50;")
    users = cur.fetchall()
    print("Users found:")
    for user in users:
        print(user)
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
