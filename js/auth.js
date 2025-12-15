// Get DOM elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');
const authHeading = document.getElementById('auth-heading');
const pageTitle = document.getElementById('page-title');

// 1. Get Role from URL and set Heading/Title
function setAuthPageDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');

    if (!role) {
        authHeading.innerText = "Error: Role Not Specified";
        return;
    }

    // Capitalize the role for display
    const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);

    // Update Heading and Title
    authHeading.innerText = `${capitalizedRole} Account Access`;
    pageTitle.innerText = `${capitalizedRole} Login/Signup`;

    // 2. Form Submission Handling (FRONTEND ONLY DEMO)

    // Login Submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // --- NOTE: In a real app, this is where you send data to the backend ---
        alert(`Simulated Login successful as ${capitalizedRole}. Redirecting...`);

        // Frontend Redirection to respective dashboard (admin.html, teacher.html, etc.)
        window.location.href = `${role}.html`;
    });

    // Signup Submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // --- NOTE: In a real app, this is where you send data to the backend ---
        alert(`Simulated Signup successful for ${capitalizedRole}. Please log in now.`);

        // Show the login form after simulated successful signup
        showForm('login');
    });
}

// 3. Form Switching Logic (Login <-> Signup)
function showForm(formType) {
    if (formType === 'login') {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    }
}

// Event Listeners for switching
showSignupLink.addEventListener('click', () => showForm('signup'));
showLoginLink.addEventListener('click', () => showForm('login'));

// Initialize the page
setAuthPageDetails();