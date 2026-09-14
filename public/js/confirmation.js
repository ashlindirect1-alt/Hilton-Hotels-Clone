// ================= GET BOOKING ID =================

const params =
    new URLSearchParams(window.location.search);

const bookingId =
    params.get("booking");


// ================= CONTAINER =================

const container =
    document.getElementById("confirmationContent");


// ================= CHECK BOOKING ID =================

if (!bookingId) {

    container.innerHTML = `
        <div class="error-message">

            <h2>
                Booking Not Found
            </h2>

            <p>
                No booking ID was provided.
            </p>

            <a href="index.html">
                Return to Home
            </a>

        </div>
    `;

} else {

    loadBooking();

}


// ================= LOAD BOOKING =================

async function loadBooking() {

    try {

        const response =
            await fetch(`/api/bookings/${bookingId}`);

        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message || "Booking not found"
            );

        }


        displayBooking(data.booking);


    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="error-message">

                <h2>
                    Unable to Load Booking
                </h2>

                <p>
                    ${error.message}
                </p>

                <a href="index.html">
                    Return to Home
                </a>

            </div>
        `;
    }
}


// ================= DISPLAY BOOKING =================

function displayBooking(booking) {

    container.innerHTML = `

        <div class="confirmation-card">

            <div class="success-icon">
                ✓
            </div>

            <h1>
                Booking Confirmed!
            </h1>

            <p class="confirmation-text">
                Your hotel reservation has been successfully confirmed.
            </p>


            <div class="booking-details">

                <h2>
                    Reservation Details
                </h2>


                <div class="detail-row">
                    <span>Booking ID</span>
                    <strong>#${booking.id}</strong>
                </div>


                <div class="detail-row">
                    <span>Hotel</span>
                    <strong>${booking.hotelName}</strong>
                </div>


                <div class="detail-row">
                    <span>Guest Name</span>
                    <strong>${booking.guestName}</strong>
                </div>


                <div class="detail-row">
                    <span>Email</span>
                    <strong>${booking.email}</strong>
                </div>


                <div class="detail-row">
                    <span>Check-in</span>
                    <strong>${booking.checkIn}</strong>
                </div>


                <div class="detail-row">
                    <span>Check-out</span>
                    <strong>${booking.checkOut}</strong>
                </div>


                <div class="detail-row">
                    <span>Guests</span>
                    <strong>${booking.guests}</strong>
                </div>


                <div class="detail-row total">
                    <span>Total Price</span>
                    <strong>$${booking.totalPrice}</strong>
                </div>

            </div>


            <a
                href="index.html"
                class="home-btn"
            >
                Return to Home
            </a>

        </div>
    `;
}