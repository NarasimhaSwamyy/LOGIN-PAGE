document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const passwordToggle = document.getElementById("passwordToggle");

    passwordToggle.addEventListener("click", () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            passwordToggle.classList.remove("fa-eye-slash");
            passwordToggle.classList.add("fa-eye");
        } else {
            passwordInput.type = "password";
            passwordToggle.classList.remove("fa-eye");
            passwordToggle.classList.add("fa-eye-slash");
        }
    });

    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const rememberMe = document.getElementById("rememberMe").checked;

        let valid = true;

        if (!validateEmail(email)) {
            valid = false;
            document.getElementById("emailError").textContent = "Please enter a valid email.";
        } else {
            document.getElementById("emailError").textContent = "";
        }

        if (!validatePassword(password)) {
            valid = false;
            document.getElementById("passwordError").textContent = "Password must be at least 6 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters.";
        } else {
            document.getElementById("passwordError").textContent = "";
        }

        if (valid) {
            document.getElementById("message").textContent = "";
            try {
                const response = await login(email, password);
                
                if (response) {
                    document.getElementById("message").textContent = "Login successful!";
                    document.getElementById("message").style.color = "white";

                    if (rememberMe) {
                        localStorage.setItem("email", email);
                        localStorage.setItem("password", password);
                    } else {
                        localStorage.removeItem("email");
                        localStorage.removeItem("password");
                    }
                } else {
                    document.getElementById("message").textContent = "Login failed. Please try again.";
                    document.getElementById("message").style.color = "red";
                }
            } catch (error) {
                document.getElementById("message").textContent = "Login failed. Please try again.";
                document.getElementById("message").style.color = "red";
            }
        } else {
            document.getElementById("message").textContent = "Login failed. Please check the errors and try again.";
            document.getElementById("message").style.color = "red";
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePassword(password) {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return re.test(password);
    }

    async function login(email, password) {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: email,
                password: password,
            }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return response.json();
    }

    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");

    if (savedEmail && savedPassword) {
        document.getElementById("email").value = savedEmail;
        document.getElementById("password").value = savedPassword;
        document.getElementById("rememberMe").checked = true;
    }
});
