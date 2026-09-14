// =========================
// LOAD ALL BOOKINGS
// =========================

async function loadBookings() {

    const bookingsList = document.getElementById("bookingsList");

    try {

        const response = await fetch("/api/bookings");

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Failed to load bookings.");
        }

        if (data.bookings.length === 0) {

            bookingsList.innerHTML = `
                <div class="no-bookings">

                   <h2>
                      No bookings yet
                    </h2>

                    <p>
                        You don't have any hotel reservations yet.
                    </p>

                    <a
                      href="hotels.html"
                      class="browse-hotels-btn"
                    >
                       Browse Hotels
                    </a>

                 </div>
            `;

            return;
        }


        bookingsList.innerHTML = data.bookings.map(booking => {

            return `
                <div class="booking-card">

                    <h2>${booking.hotelName}</h2>

                    <div class="booking-info">

                        <p>
                            <strong>Booking ID:</strong>
                            ${booking.id}
                        </p>

                        <p>
                            <strong>Guest Name:</strong>
                            ${booking.guestName}
                        </p>

                        <p>
                            <strong>Email:</strong>
                            ${booking.email}
                        </p>

                        <p>
                            <strong>Check-in:</strong>
                            ${booking.checkIn}
                        </p>

                        <p>
                            <strong>Check-out:</strong>
                            ${booking.checkOut}
                        </p>

                        <p>
                            <strong>Guests:</strong>
                            ${booking.guests}
                        </p>

                        <p>
                            <strong>Total Price:</strong>
                            $${booking.totalPrice}
                        </p>

                    </div>

                    <button
                        class="delete-btn"
                        onclick="deleteBooking(${booking.id})">
                        Delete Booking
                    </button>

                </div>
            `;

        }).join("");

    } catch (error) {

        console.error("Bookings error:", error);

        bookingsList.innerHTML = `
            <p class="error-message">
                Unable to load bookings.
            </p>
        `;
    }
}


// =========================
// DELETE BOOKING
// =========================

async function deleteBooking(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `/api/bookings/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!data.success) {
            alert(data.message || "Failed to delete booking.");
            return;
        }

        alert("Booking deleted successfully.");

        loadBookings();

    } catch (error) {

        console.error("Delete booking error:", error);

        alert("Unable to delete booking.");
    }
}


// =========================
// START
// =========================

loadBookings();