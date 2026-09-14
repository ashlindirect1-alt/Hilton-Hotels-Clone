const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./hilton.db", (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to Hilton Hotels database.");
    }
});

db.serialize(() => {

    // Hotels table
    db.run(`
        CREATE TABLE IF NOT EXISTS hotels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            rating REAL,
            reviews INTEGER,
            image TEXT,
            amenities TEXT
        )
    `);

    // Bookings table
    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hotelId INTEGER NOT NULL,
            hotelName TEXT NOT NULL,
            guestName TEXT NOT NULL,
            email TEXT NOT NULL,
            checkIn TEXT NOT NULL,
            checkOut TEXT NOT NULL,
            guests INTEGER NOT NULL,
            totalPrice REAL NOT NULL,
            status TEXT DEFAULT 'Confirmed'
        )
    `);

    // Check whether hotels already exist
    db.get("SELECT COUNT(*) AS count FROM hotels", (err, row) => {

        if (err) {
            console.error("Error checking hotels:", err.message);
            return;
        }

        if (row.count === 0) {

            const hotels = [
                [
                    "Hilton Lahore",
                    "Lahore",
                    "A comfortable luxury hotel in Lahore with modern rooms and excellent facilities.",
                    120,
                    4.8,
                    325,
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945",
                    "Free WiFi,Swimming Pool,Restaurant,Gym,Parking"
                ],
                [
                    "Hilton Islamabad",
                    "Islamabad",
                    "A premium stay offering comfortable rooms and beautiful city surroundings.",
                    140,
                    4.9,
                    410,
                    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
                    "Free WiFi,Restaurant,Gym,Spa,Parking"
                ],
                [
                    "Hilton Murree",
                    "Murree",
                    "A relaxing mountain stay with comfortable rooms and scenic views.",
                    110,
                    4.7,
                    280,
                    "https://images.unsplash.com/photo-1510798831971-661eb04b3739",
                    "Free WiFi,Restaurant,Mountain View,Parking"
                ],
                [
                    "Hilton Karachi",
                    "Karachi",
                    "A modern hotel offering stylish rooms and convenient facilities.",
                    130,
                    4.6,
                    350,
                    "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
                    "Free WiFi,Swimming Pool,Restaurant,Gym"
                ],
                [
                    "Hilton Dubai",
                    "Dubai",
                    "A luxury hotel experience with modern rooms and premium facilities.",
                    180,
                    4.9,
                    520,
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
                    "Free WiFi,Swimming Pool,Spa,Restaurant,Gym"
                ],
                [
                    "Hilton Abu Dhabi",
                    "Abu Dhabi",
                    "An elegant hotel with comfortable accommodation and excellent services.",
                    160,
                    4.8,
                    390,
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
                    "Free WiFi,Swimming Pool,Restaurant,Parking,Spa"
                ]
            ];

            const stmt = db.prepare(`
                INSERT INTO hotels
                (name, location, description, price, rating, reviews, image, amenities)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

            hotels.forEach((hotel) => {
                stmt.run(hotel);
            });

            stmt.finalize();

            console.log("Hotel data inserted successfully.");
        } else {
            console.log("Hotel data already exists.");
        }
    });
});

module.exports = db;