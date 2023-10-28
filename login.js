const API_BASE_URL = 'https://ets-pemrograman-web-f.cyclic.app';
var TOKEN;

// Define a separate async function for the API request
async function loginUser(email, password) {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/login`, { email, password });
        ACCESS_TOKEN = response.data.data.access_token;
        alert("Login Succeed!");
        window.location.href = "game.html";
    } catch (error) {
        alert(error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("loginForm");

    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Get user input
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Call the async function to handle the API request
        loginUser(email, password);
    });
});
