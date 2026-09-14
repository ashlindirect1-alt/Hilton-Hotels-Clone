let allHotels = [];
let filteredHotels = [];


// ================= GET SEARCH PARAMETERS =================

const params = new URLSearchParams(window.location.search);

const locationSearch =
    params.get("location") || "";

const checkIn =
    params.get("checkIn") || "";

const checkOut =
    params.get("checkOut") || "";

const guests =
    params.get("guests") || "2";


// ================= LOAD HOTELS =================

async function loadHotels() {

    try {

        const response =
            await fetch("/api/hotels");

        const data =
            await response.json();

        if (!data.success) {
            throw new Error("Unable to load hotels.");
        }

        allHotels = data.hotels;

        updateSearchSummary();

        applyFilters();

    } catch (error) {

        console.error(error);

        document.getElementById("hotelResults").innerHTML = `
            <div class="no-results">
                <h2>Something went wrong</h2>
                <p>Unable to load hotels.</p>
            </div>
        `;
    }
}


// ================= SEARCH SUMMARY =================

function updateSearchSummary() {

    const summary =
        document.getElementById("searchSummary");

    let text = "Showing available hotels";

    if (locationSearch) {
        text += ` in ${locationSearch}`;
    }

    if (checkIn && checkOut) {
        text += ` from ${checkIn} to ${checkOut}`;
    }

    if (guests) {
        text += ` for ${guests} guest(s)`;
    }

    summary.textContent = text;
}


// ================= APPLY FILTERS =================

function applyFilters() {

    const maxPrice =
        document.getElementById("priceFilter").value;

    const minRating =
        parseFloat(
            document.getElementById("ratingFilter").value
        );

    const selectedAmenities =
        Array.from(
            document.querySelectorAll(".amenity-filter:checked")
        ).map(
            checkbox => checkbox.value
        );


    filteredHotels =
        allHotels.filter(hotel => {

            // Location filter

            if (locationSearch) {

                const hotelLocation =
                    hotel.location.toLowerCase();

                const searchLocation =
                    locationSearch.toLowerCase();

                if (
                    !hotelLocation.includes(searchLocation)
                ) {
                    return false;
                }
            }


            // Price filter

            if (
                maxPrice !== "all" &&
                hotel.price > Number(maxPrice)
            ) {
                return false;
            }


            // Rating filter

            if (hotel.rating < minRating) {
                return false;
            }


            // Amenities filter

            if (selectedAmenities.length > 0) {

                const hotelAmenities =
                    hotel.amenities
                        .split(",")
                        .map(item => item.trim());

                const hasAllAmenities =
                    selectedAmenities.every(
                        amenity =>
                            hotelAmenities.includes(amenity)
                    );

                if (!hasAllAmenities) {
                    return false;
                }
            }

            return true;
        });


    applySorting();

}


// ================= SORT =================

function applySorting() {

    const sortValue =
        document.getElementById("sortFilter").value;


    if (sortValue === "price-low") {

        filteredHotels.sort(
            (a, b) => a.price - b.price
        );

    } else if (sortValue === "price-high") {

        filteredHotels.sort(
            (a, b) => b.price - a.price
        );

    } else if (sortValue === "rating-high") {

        filteredHotels.sort(
            (a, b) => b.rating - a.rating
        );
    }


    displayHotels();
}


// ================= DISPLAY HOTELS =================

function displayHotels() {

    const container =
        document.getElementById("hotelResults");

    const resultCount =
        document.getElementById("resultCount");


    resultCount.textContent =
        `${filteredHotels.length} hotel(s) found`;


    if (filteredHotels.length === 0) {

        container.innerHTML = `
            <div class="no-results">

                <h2>No hotels found</h2>

                <p>
                    Try changing your destination
                    or filters.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML = "";


    filteredHotels.forEach(hotel => {

        const amenities =
            hotel.amenities
                .split(",")
                .map(item => item.trim());


        const card =
            document.createElement("article");

        card.className =
            "listing-card";


        card.innerHTML = `

            <img
                src="${hotel.image}"
                alt="${hotel.name}"
            >


            <div class="listing-content">

                <h2>
                    ${hotel.name}
                </h2>

                <p class="listing-location">
                    📍 ${hotel.location}
                </p>

                <p class="listing-rating">
                    ⭐ ${hotel.rating}
                    (${hotel.reviews} reviews)
                </p>

                <p class="listing-description">
                    ${hotel.description}
                </p>


                <div class="amenities">

                    ${amenities.map(amenity => `
                        <span class="amenity">
                            ${amenity}
                        </span>
                    `).join("")}

                </div>


                <div class="listing-bottom">

                    <div class="listing-price">

                        $${hotel.price}

                        <small>
                            / night
                        </small>

                    </div>


                    <a
                        href="hotel-details.html?id=${hotel.id}"
                        class="view-hotel-btn"
                    >
                        View Hotel
                    </a>

                </div>

            </div>
        `;


        container.appendChild(card);

    });
}


// ================= FILTER EVENTS =================

document
    .getElementById("priceFilter")
    .addEventListener(
        "change",
        applyFilters
    );


document
    .getElementById("ratingFilter")
    .addEventListener(
        "change",
        applyFilters
    );


document
    .querySelectorAll(".amenity-filter")
    .forEach(checkbox => {

        checkbox.addEventListener(
            "change",
            applyFilters
        );

    });


document
    .getElementById("sortFilter")
    .addEventListener(
        "change",
        applySorting
    );


// ================= CLEAR FILTERS =================

document
    .getElementById("clearFilters")
    .addEventListener(
        "click",
        () => {

            document.getElementById(
                "priceFilter"
            ).value = "all";


            document.getElementById(
                "ratingFilter"
            ).value = "0";


            document
                .querySelectorAll(".amenity-filter")
                .forEach(checkbox => {
                    checkbox.checked = false;
                });


            document.getElementById(
                "sortFilter"
            ).value = "recommended";


            applyFilters();
        }
    );


// ================= START =================

loadHotels();