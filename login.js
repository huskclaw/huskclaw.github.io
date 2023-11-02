document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("loginForm");

    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await axios.post('https://ets-pemrograman-web-f.cyclic.app/users/login', {
            email,
            password
        });

        if (response.data.status == 'success') {
            localStorage.setItem('accessToken', response.data.data.access_token);
            alert('Login success!');
            window.location.href = "game.html";
        } else {
            alert(response.data.error);
        }
    });

    const playguestLink = document.querySelector(".play-guest a");

    playguestLink.addEventListener("click", function (e) {
        localStorage.setItem('accessToken', null);
        window.location.href = "game.html";

        e.preventDefault();
    });
});