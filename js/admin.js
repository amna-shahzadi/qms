document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const contentSections = document.querySelectorAll('.dashboard-card');
    const userTableBody = document.getElementById('user-table-body');
    const statsGrid = document.querySelector('.stats-grid');
    const activityLog = document.getElementById('recent-activity-log');
    const logoutLink = document.getElementById('logout-link');

    // --- Simulated Admin Data ---

    const adminStats = {
        totalUsers: 450,
        totalQuizzes: 120,
        activeTeachers: 15,
        totalSubmissions: 3500
    };

    const userData = [
        { id: 'T001', name: 'Zeeshan Khan', role: 'Teacher', status: 'Active' },
        { id: 'S101', name: 'Ayesha Bibi', role: 'Student', status: 'Active' },
        { id: 'S102', name: 'Faisal Iqbal', role: 'Student', status: 'Inactive' },
        { id: 'T002', name: 'Hina Latif', role: 'Teacher', status: 'Active' },
        { id: 'S103', name: 'Kashif Ali', role: 'Student', status: 'Active' },
    ];

    const recentActivity = [
        "User S101 registered.",
        "Quiz 'Calculus I' published by T002.",
        "Admin logged in.",
        "User S102 account set to Inactive."
    ];

    // --- Core Functions ---

    /** Initializes the Admin Dashboard data */
    function initDashboard() {
        renderStatsGrid();
        renderActivityLog();
        renderUserTable(userData);
    }

    /** Renders the top summary statistics cards */
    function renderStatsGrid() {
        statsGrid.innerHTML = `
            <div class="stat-card stat-total-users">
                <h4>Total Users</h4>
                <div class="stat-value">${adminStats.totalUsers}</div>
            </div>
            <div class="stat-card stat-total-quizzes">
                <h4>Total Quizzes</h4>
                <div class="stat-value">${adminStats.totalQuizzes}</div>
            </div>
            <div class="stat-card stat-active-teachers">
                <h4>Active Teachers</h4>
                <div class="stat-value">${adminStats.activeTeachers}</div>
            </div>
            <div class="stat-card stat-submissions">
                <h4>Total Submissions</h4>
                <div class="stat-value">${adminStats.totalSubmissions}</div>
            </div>
        `;
    }

    /** Renders the list of recent system activities */
    function renderActivityLog() {
        activityLog.innerHTML = recentActivity.map((activity, index) => `
            <div class="activity-item">
                <span class="activity-timestamp">${new Date().toLocaleTimeString()}</span>
                <span class="activity-action">${activity}</span>
            </div>
        `).join('');
    }

    /** Renders the user management table */
    function renderUserTable(users) {
        userTableBody.innerHTML = '';
        users.forEach(user => {
            const row = userTableBody.insertRow();
            const statusClass = user.status === 'Active' ? 'status-active' : 'status-inactive';

            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.role}</td>
                <td><span class="${statusClass}">${user.status}</span></td>
                <td>
                    <button class="edit-user-btn" data-id="${user.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="delete-user-btn" data-id="${user.id}"><i class="fas fa-trash"></i> Delete</button>
                </td>
            `;
        });
    }

    // --- Event Handlers ---

    /** Handles sidebar navigation to switch content views */
    function handleSidebarNavigation(event) {
        event.preventDefault();
        const targetId = event.currentTarget.dataset.content;

        // 1. Update Sidebar Active Link
        sidebarLinks.forEach(link => link.classList.remove('active'));
        event.currentTarget.classList.add('active');

        // 2. Switch Content Section Visibility
        contentSections.forEach(section => {
            if (section.id === targetId) {
                section.classList.remove('hidden-content');
                section.classList.add('active-content');
            } else {
                section.classList.add('hidden-content');
                section.classList.remove('active-content');
            }
        });
    }

    // --- Event Listeners ---

    // Sidebar Links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', handleSidebarNavigation);
    });

    // Logout Link
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to log out?")) {
            // Redirect to the role selection page
            window.location.href = 'index.html';
        }
    });

    // Dummy Button Listeners (for demonstration)
    document.getElementById('add-user-btn').addEventListener('click', () => {
        alert("Add User functionality TBD (To be developed)");
    });

    // Start initialization
    initDashboard();
});