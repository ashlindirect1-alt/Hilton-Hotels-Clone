// ================= GET HOTEL ID =================

const params =
    new URLSearchParams(window.location.search);

const hotelId =
    params.get("id");


// ================= CONTAINER =================

const container =
    document.getElementById("hotelDetails");


// ================= CHECK HOTEL ID =================

if (!hotelId) {

    container.innerHTML = `
        <div class="error-message">

            <h2>
                Hotel not found
            </h2>

            <p>
                No hotel was selected.
            </p>

        </div>
    `;

} else {

    loadHotel();

}


// ================= LOAD HOTEL =================

async function loadHotel() {

    container.innerHTML = `
        <div class="loading">
            Loading hotel details...
        </div>
    `;


    try {

        const response =
            await fetch(`/api/hotels/${hotelId}`);


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message || "Hotel not found"
            );

        }


        displayHotel(data.hotel);


    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="error-message">

                <h2>
                    Hotel not found
                </h2>

                <p>
                    We could not load this hotel.
                </p>

            </div>
        `;

    }

}


// ================= DISPLAY HOTEL =================

function displayHotel(hotel) {

    const amenities =
        hotel.amenities
            .split(",")
            .map(item => item.trim());


    container.innerHTML = `

        <div class="details-layout">


            <!-- HOTEL IMAGE -->

            <div>

                <img
                    class="details-image"
                    src="${hotel.image}"
                    alt="${hotel.name}"
                >

            </div>


            <!-- HOTEL INFORMATION -->

            <div class="details-content">

                <h1>
                    ${hotel.name}
                </h1>


                <p class="details-location">
                    📍 ${hotel.location}
                </p>


                <p class="details-rating">
                    ⭐ ${hotel.rating}
                    (${hotel.reviews} reviews)
                </p>


                <p class="details-description">
                    ${hotel.description}
                </p>


                <h2>
                    Amenities
                </h2>


                <div class="details-amenities">

                    ${amenities.map(amenity => `

                        <span class="details-amenity">
                            ${amenity}
                        </span>

                    `).join("")}

                </div>


                <div class="price-box">

                    <p class="details-price">
                        $${hotel.price}
                        <small>/ night</small>
                    </p>


                    <a
                        href="booking.html?hotelId=${hotel.id}"
                        class="book-btn"
                    >
                        Book Now
                    </a>

                </div>

            </div>

        </div>
    `;
}