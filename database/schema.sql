CREATE TABLE parking_slots (
    slot_id INTEGER PRIMARY KEY,
    slot_name TEXT NOT NULL,
    vehicle_type TEXT,
    status TEXT,
    location TEXT
);

INSERT INTO parking_slots (slot_name, vehicle_type, status, location) VALUES
('A1','Car','Available','Block A'),
('A2','Car','Occupied','Block A'),
('A3','Car','Available','Block A'),
('B1','Bike','Available','Block B'),
('B2','Bike','Occupied','Block B'),
('B3','Bike','Available','Block B'),
('C1','EV','Available','Block C'),
('C2','EV','Occupied','Block C');