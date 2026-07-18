import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, "..", "database", "parking.db")


def get_available_slots() -> str:
    """
    Returns a list of all available parking slots.
    """

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "SELECT slot_name FROM parking_slots WHERE status='Available'"
    )

    slots = cursor.fetchall()
    conn.close()

    if not slots:
        return "No parking slots are available."

    return "\n".join(slot[0] for slot in slots)


def reserve_slot(slot_name: str) -> str:
    """
    Reserves a parking slot if it is available.
    """

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "SELECT status FROM parking_slots WHERE slot_name=?",
        (slot_name,)
    )

    row = cursor.fetchone()

    if row is None:
        conn.close()
        return f"Slot {slot_name} does not exist."

    if row[0] != "Available":
        conn.close()
        return f"Slot {slot_name} is not available."

    cursor.execute(
        "UPDATE parking_slots SET status='Reserved' WHERE slot_name=?",
        (slot_name,)
    )

    conn.commit()
    conn.close()

    return f"Slot {slot_name} has been reserved successfully."


def cancel_reservation(slot_name: str) -> str:
    """
    Cancels a parking reservation and makes the slot available again.
    """

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "SELECT status FROM parking_slots WHERE slot_name=?",
        (slot_name,)
    )

    row = cursor.fetchone()

    if row is None:
        conn.close()
        return f"Slot {slot_name} does not exist."

    if row[0] != "Reserved":
        conn.close()
        return f"Slot {slot_name} is not currently reserved."

    cursor.execute(
        "UPDATE parking_slots SET status='Available' WHERE slot_name=?",
        (slot_name,)
    )

    conn.commit()
    conn.close()

    return f"Reservation for slot {slot_name} has been cancelled successfully."
def get_occupied_slots() -> str:
    """
    Returns a list of all occupied parking slots.
    """

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "SELECT slot_name FROM parking_slots WHERE status='Occupied'"
    )

    slots = cursor.fetchall()

    conn.close()

    if not slots:
        return "There are no occupied parking slots."

    return "\n".join(slot[0] for slot in slots)
def check_slot_status(slot_name: str) -> str:
    """
    Returns the status of a specific parking slot.
    """

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "SELECT status FROM parking_slots WHERE slot_name=?",
        (slot_name,)
    )

    row = cursor.fetchone()

    conn.close()

    if row is None:
        return f"Slot {slot_name} does not exist."

    return f"Slot {slot_name} is {row[0]}."
def get_slot_location(slot_name: str) -> str:
    """
    Returns the location of a parking slot.
    """

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "SELECT location FROM parking_slots WHERE slot_name=?",
        (slot_name,)
    )

    row = cursor.fetchone()

    conn.close()

    if row is None:
        return f"Slot {slot_name} does not exist."

    return f"Slot {slot_name} is located in {row[0]}."
def count_available_slots() -> str:
    """
    Returns the number of available parking slots.
    """

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "SELECT COUNT(*) FROM parking_slots WHERE status='Available'"
    )

    count = cursor.fetchone()[0]

    conn.close()

    return f"There are {count} available parking slots."
def count_occupied_slots() -> int:
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "SELECT COUNT(*) FROM parking_slots WHERE status='Occupied'"
    )

    count = cursor.fetchone()[0]

    conn.close()

    return count


def count_reserved_slots() -> int:
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "SELECT COUNT(*) FROM parking_slots WHERE status='Reserved'"
    )

    count = cursor.fetchone()[0]

    conn.close()

    return count


if __name__ == "__main__":
    import sqlite3

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE parking_slots
        SET status='Available'
        WHERE slot_name IN ('B1','B3','C1')
    """)

    conn.commit()

    print("Database updated successfully!")

    conn.close()