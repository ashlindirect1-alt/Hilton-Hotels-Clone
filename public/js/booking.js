// ================= GET HOTEL ID =================

const params =
    new URLSearchParams(window.location.search);

const hotelId =
    params.get("hotelId");


// ================= VARIABLES =================

let selectedHotel = null;


// ================= ELEMENTS =================

const hotelSummary =
    document.getElementById("hotelSummary");

const bookingForm =
    document.getElementById("bookingForm");

const checkInInput =
    document.getElementById("checkIn");

const checkOutInput =
    document.getElementById("checkOut");

const pricePerNight =
    document.getElementById("pricePerNight");

const numberOfNights =
    document.getElementById("numberOfNights");

const totalPrice =
    document.getElementById("totalPrice");

const formMessage =
    document.getElementById("formMessage");


// ================= CHECK HOTEL ID =================

if (!hotelId) {

    hotelSummary.innerHTML = `
        <div class="loading">
            <h2>Hotel not selected</h2>
            <p>Please select a hotel first.</p>
        </div>
    `;

    bookingForm.style.display = "none";

} else {

    loadHotel();

}


// ================= LOAD HOTEL =================

async function loadHotel() {

    try {

        const response =
            await fetch(`/api/hotels/${hotelId}`);

        const data =
            await response.json();

        if (!data.success) {
            throw new Error("Hotel not found");
        }

        selectedHotel =
            data.hotel;

        displayHotel();

        updatePrice();

    } catch (error) {

        console.error(error);

        hotelSummary.innerHTML = `
            <div class="loading">

                <h2>
                    Hotel not found
                </h2>

                <p>
                    We could not load the selected hotel.
                </p>

            </div>
        `;

        bookingForm.style.display = "none";
    }
}


// ================= DISPLAY HOTEL =================

function displayHotel() {

    hotelSummary.innerHTML = `

        <img
            src="${selectedHotel.image}"
            alt="${selectedHotel.name}"
            class="booking-hotel-image"
        >

        <div class="booking-hotel-content">

            <h2>
                ${selectedHotel.name}
            </h2>

            <p class="booking-hotel-location">
                📍 ${selectedHotel.location}
            </p>

            <p class="booking-hotel-rating">
                ⭐ ${selectedHotel.rating}
                (${selectedHotel.reviews} reviews)
            </p>

            <p class="booking-hotel-description">
                ${selectedHotel.description}
            </p>

        </div>
    `;

    pricePerNight.textContent =
        `$${selectedHotel.price}`;
}


// ================= CALCULATE PRICE =================

function calculateNights() {

    const checkIn =
        checkInInput.value;

    const checkOut =
        checkOutInput.value;


    if (!checkIn || !checkOut) {
        return 0;
    }


    const start =
        new Date(checkIn);

    const end =
        new Date(checkOut);


    const difference =
        end - start;


    const nights =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );


    return nights > 0 ? nights : 0;
}


// ================= UPDATE PRICE =================

function updatePrice() {

    if (!selectedHotel) {
        return;
    }


    const nights =
        calculateNights();


    const total =
        nights * selectedHotel.price;


    numberOfNights.textContent =
        nights;


    totalPrice.textContent =
        `$${total}`;
}


// ================= DATE EVENTS =================

checkInInput.addEventListener(
    "change",
    updatePrice
);

checkOutInput.addEventListener(
    "change",
    updatePrice
);


// ================= FORM SUBMIT =================

bookingForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        formMessage.textContent = "";
        formMessage.style.color = "";


        const guestName =
            document.getElementById("guestName").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const checkIn =
            checkInInput.value;

        const checkOut =
            checkOutInput.value;

        const guests =
            Number(
                document.getElementById("guests").value
            );


        // ================= VALIDATION =================

        if (
            !guestName ||
            !email ||
            !checkIn ||
            !checkOut ||
            !guests
        ) {

            formMessage.textContent =
                "Please fill in all fields.";

            return;
        }


        const nights =
            calculateNights();


        if (nights <= 0) {

            formMessage.textContent =
                "Check-out date must be after check-in date.";

            return;
        }


        const total =
            nights * selectedHotel.price;


        // ================= BOOKING DATA =================

        const bookingData = {

            hotelId: selectedHotel.id,

            hotelName: selectedHotel.name,

            guestName: guestName,

            email: email,

            checkIn: checkIn,

            checkOut: checkOut,

            guests: guests,

            totalPrice: total
        };


        try {

            const response =
                await fetch("/api/bookings", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(bookingData)
                });


            const data =
                await response.json();


            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Booking failed"
                );
            }


            // ================= SUCCESS =================

            window.location.href =
                `confirmation.html?booking=${data.bookingId}`;


        } catch (error) {

            console.error(error);

            formMessage.textContent =
                error.message ||
                "Unable to complete booking.";

        }

    }
);