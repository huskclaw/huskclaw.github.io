document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const nama = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        const response = await axios.post('https://ets-pemrograman-web-f.cyclic.app/users/register', {
            nama,
            email,
            password
        });

        if (response.data.status == 'success') {
            alert('Registration success!');
            window.location.href = "index.html";
        } else {
            alert(response.data.error);
        }
    });
});


