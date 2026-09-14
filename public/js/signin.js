const signinForm = document.getElementById("signinForm");
const signinMessage = document.getElementById("signinMessage");

signinForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        signinMessage.textContent = "Please enter your email and password.";
        return;
    }

    signinMessage.textContent = "Sign in successful!";

    setTimeout(() => {
        window.location.href = "bookings.html";
    }, 1000);
});