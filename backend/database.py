import sqlite3
import json

DB_FILE = "rene_cache.db"

def init_db():
    """Creates the cache table if it doesn't exist."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS graphs (
            topic TEXT PRIMARY KEY,
            data JSON
        )
    ''')
    conn.commit()
    conn.close()

def get_cached_graph(topic: str):
    """Fetches graph data from SQLite if we've searched this before."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    # Convert to lowercase for case-insensitive matching
    cursor.execute("SELECT data FROM graphs WHERE lower(topic) = ?", (topic.lower(),))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return json.loads(row[0])
    return None

def save_graph_to_cache(topic: str, data: dict):
    """Saves the AI's JSON output so we never have to generate it twice."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT OR REPLACE INTO graphs (topic, data) VALUES (?, ?)", 
        (topic, json.dumps(data))
    )
    conn.commit()
    conn.close()

# Initialize the database when the file loads
init_db()