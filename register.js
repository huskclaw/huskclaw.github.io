const API_BASE_URL = 'https://ets-pemrograman-web-f.cyclic.app';
// var TOKEN;

// Define a separate async function for the API request
async function registerUser(name, email, password) {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/register`, { name, email, password });
        alert("Register Succeed!");
        window.location.href = "index.html";
    } catch (error) {
        alert(error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Get user input
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Call the async function to handle the API request
        registerUser(name, email, password);
    });
});
