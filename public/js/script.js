// ================= LOAD FEATURED HOTELS =================

async function loadFeaturedHotels() {

    try {

        const response = await fetch("/api/hotels");

        const data = await response.json();

        const container =
            document.getElementById("featuredHotels");

        container.innerHTML = "";

        data.hotels.slice(0, 6).forEach(hotel => {

            const card = document.createElement("div");

            card.className = "hotel-card";

            card.innerHTML = `
                <img
                    src="${hotel.image}"
                    alt="${hotel.name}"
                >

                <div class="hotel-card-content">

                    <h3>
                        ${hotel.name}
                    </h3>

                    <p class="hotel-location">
                        ${hotel.location}
                    </p>

                    <p class="hotel-rating">
                        ⭐ ${hotel.rating}
                        (${hotel.reviews} reviews)
                    </p>

                    <p class="hotel-price">
                        $${hotel.price}
                        <small> / night</small>
                    </p>

                    <a
                        href="hotel-details.html?id=${hotel.id}"
                        class="view-btn"
                    >
                        View Hotel
                    </a>

                </div>
            `;

            container.appendChild(card);

        });

    } catch (error) {

        console.error(
            "Error loading hotels:",
            error
        );

    }
}


// ================= SEARCH =================

function searchHotels() {

    const destination =
        document.getElementById("destination").value.trim();

    const checkIn =
        document.getElementById("checkIn").value;

    const checkOut =
        document.getElementById("checkOut").value;

    const guests =
        document.getElementById("guests").value;


    if (!destination) {

        alert("Please enter a destination.");

        return;
    }


    if (!checkIn || !checkOut) {

        alert("Please select check-in and check-out dates.");

        return;
    }


    if (checkOut <= checkIn) {

        alert("Check-out date must be after check-in date.");

        return;
    }


    const url =
        `hotels.html?location=${encodeURIComponent(destination)}` +
        `&checkIn=${encodeURIComponent(checkIn)}` +
        `&checkOut=${encodeURIComponent(checkOut)}` +
        `&guests=${encodeURIComponent(guests)}`;

    window.location.href = url;
}


// ================= START =================

document.addEventListener(
    "DOMContentLoaded",
    loadFeaturedHotels
);