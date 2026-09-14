const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// Test API
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Hilton Hotels Clone API is working!"
    });
});

// Get all hotels
app.get("/api/hotels", (req, res) => {

    db.all("SELECT * FROM hotels", [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch hotels"
            });
        }

        res.json({
            success: true,
            count: rows.length,
            hotels: rows
        });
    });
});

// Get one hotel by ID
app.get("/api/hotels/:id", (req, res) => {

    const hotelId = req.params.id;

    db.get(
        "SELECT * FROM hotels WHERE id = ?",
        [hotelId],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (!row) {
                return res.status(404).json({
                    success: false,
                    message: "Hotel not found"
                });
            }

            res.json({
                success: true,
                hotel: row
            });
        }
    );
});

// ================= CREATE BOOKING =================

app.post("/api/bookings", (req, res) => {

    const {
        hotelId,
        hotelName,
        guestName,
        email,
        checkIn,
        checkOut,
        guests,
        totalPrice
    } = req.body;


    if (
        !hotelId ||
        !hotelName ||
        !guestName ||
        !email ||
        !checkIn ||
        !checkOut ||
        !guests ||
        totalPrice === undefined
    ) {

        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }


    if (checkOut <= checkIn) {

        return res.status(400).json({
            success: false,
            message: "Check-out date must be after check-in date."
        });
    }


    const sql = `
        INSERT INTO bookings
        (
            hotelId,
            hotelName,
            guestName,
            email,
            checkIn,
            checkOut,
            guests,
            totalPrice
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;


    db.run(
        sql,
        [
            hotelId,
            hotelName,
            guestName,
            email,
            checkIn,
            checkOut,
            guests,
            totalPrice
        ],
        function(err) {

            if (err) {

                console.error(
                    "Booking error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to create booking."
                });
            }


            res.status(201).json({
                success: true,
                message: "Booking created successfully.",
                bookingId: this.lastID
            });

        }
    );

});

// ================= GET BOOKING BY ID =================

app.get("/api/bookings/:id", (req, res) => {

    const bookingId = req.params.id;

    const sql = `
        SELECT *
        FROM bookings
        WHERE id = ?
    `;

    db.get(sql, [bookingId], (err, booking) => {

        if (err) {

            console.error(
                "Booking fetch error:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: "Failed to load booking."
            });
        }

        if (!booking) {

            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        res.json({
            success: true,
            booking: booking
        });

    });

});

// ================= GET ALL BOOKINGS =================

app.get("/api/bookings", (req, res) => {

    const sql = `
        SELECT *
        FROM bookings
        ORDER BY id DESC
    `;

    db.all(sql, [], (err, bookings) => {

        if (err) {

            console.error(
                "Bookings fetch error:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: "Failed to load bookings."
            });
        }

        res.json({
            success: true,
            bookings: bookings
        });

    });

});


// ================= DELETE BOOKING =================

app.delete("/api/bookings/:id", (req, res) => {

    const bookingId = req.params.id;

    const sql = `
        DELETE FROM bookings
        WHERE id = ?
    `;

    db.run(sql, [bookingId], function (err) {

        if (err) {

            console.error(
                "Booking delete error:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: "Failed to delete booking."
            });
        }

        if (this.changes === 0) {

            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        res.json({
            success: true,
            message: "Booking deleted successfully."
        });

    });

});

app.listen(PORT, () => {
    console.log(`Hilton Hotels Clone running at http://localhost:${PORT}`);
});