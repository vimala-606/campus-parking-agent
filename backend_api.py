from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.tools import (
    get_available_slots,
    get_occupied_slots,
    reserve_slot,
    cancel_reservation,
    check_slot_status,
    get_slot_location,
    count_available_slots,
    count_occupied_slots,
    count_reserved_slots
)
from pydantic import BaseModel
class SlotRequest(BaseModel):
    slot_name: str

app = FastAPI(title="Campus Parking Agent API")

# Allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Campus Parking Agent API is running!"
    }

@app.get("/available-slots")
def available_slots():
    return {
        "slots": get_available_slots()
    }
@app.get("/occupied-slots")
def occupied_slots():
    return {
        "slots": get_occupied_slots()
    }
@app.get("/slot-status/{slot_name}")
def slot_status(slot_name: str):
    return {
        "status": check_slot_status(slot_name)
    }
@app.get("/slot-location/{slot_name}")
def slot_location(slot_name: str):
    return {
        "location": get_slot_location(slot_name)
    }
@app.post("/reserve-slot")
def reserve(request: SlotRequest):
    return {
        "message": reserve_slot(request.slot_name)
    }
@app.post("/cancel-slot")
def cancel(request: SlotRequest):
    return {
        "message": cancel_reservation(request.slot_name)
    }
@app.get("/slot-count")
def slot_count():
    return {
        "count": count_available_slots()
    }

@app.get("/dashboard")
def dashboard():
    return {
        "available": count_available_slots(),
        "occupied": count_occupied_slots(),
        "reserved": count_reserved_slots()
    }
@app.get("/parking-rules")
def parking_rules():
    return {
        "rules":
"""Campus Parking Rules

• Park only in your assigned parking slot.
• Follow the campus speed limit of 20 km/h.
• Do not block entrances or emergency exits.
• Visitors must use visitor parking areas.
• Keep your parking permit visible at all times.
• Report any parking issues to the security office.
"""
    }
@app.get("/parking-timings")
def parking_timings():
    return {
        "timings":
"""Campus Parking Timings

🕗 Monday - Friday : 8:00 AM to 6:00 PM
🕗 Saturday : 8:00 AM to 1:00 PM
❌ Sunday : Parking Closed

Visitor Parking:
9:00 AM to 5:00 PM
"""
    }