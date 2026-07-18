import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, "..", "database", "parking.db")

def initialize_database():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS parking_slots(
        slot_id INTEGER PRIMARY KEY,
        slot_name TEXT,
        vehicle_type TEXT,
        status TEXT,
        location TEXT
    )
    """)

    cursor.execute("SELECT COUNT(*) FROM parking_slots")
    count = cursor.fetchone()[0]

    if count == 0:
        parking_data = [
            ("A1", "Car", "Available", "Block A"),
            ("A2", "Car", "Occupied", "Block A"),
            ("A3", "Car", "Available", "Block A"),
            ("B1", "Bike", "Available", "Block B"),
            ("B2", "Bike", "Occupied", "Block B"),
            ("B3", "Bike", "Available", "Block B"),
            ("C1", "EV", "Available", "Block C"),
            ("C2", "EV", "Occupied", "Block C")
        ]

        cursor.executemany("""
        INSERT INTO parking_slots(slot_name, vehicle_type, status, location)
        VALUES(?,?,?,?)
        """, parking_data)

    conn.commit()
    conn.close()


if __name__ == "__main__":
    initialize_database()
    print("Database created successfully!")