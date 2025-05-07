document.addEventListener('DOMContentLoaded', function() {
    // ==============================================
    // 1. CONSTANTS AND INITIAL SETUP
    // ==============================================
    
    // DOM Elements
    const DOM = {
        year: document.getElementById('year'),
        hamburger: document.querySelector('.hamburger'),
        navLinks: document.querySelector('.nav-links'),
        navbar: document.getElementById('navbar'),
        loginModal: document.getElementById('admin-login-modal'),
        loginForm: document.getElementById('admin-login-form'),
        passwordInput: document.getElementById('admin-password'),
        loginBtn: document.getElementById('login-btn'),
        logoutBtn: document.getElementById('logout-btn'),
        adminControls: document.querySelectorAll('.admin-control'),
        adminAccessBtn: document.getElementById('admin-access-btn'),
        closeModal: document.querySelector('.close-modal')
    };

    // Configuration (CHANGE THIS IN PRODUCTION)
    const CONFIG = {
        ADMIN_PASSWORD: "YourSecurePassword123!", // Change to your strong password
        SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
        SESSION_KEY: 'portfolio_admin_session'
    };

    // State Management
    const STATE = {
        isAuthenticated: false,
        sessionTimer: null
    };
        // ==============================================
    // 2. UTILITY FUNCTIONS
    // ==============================================

    // Show toast notification
    function showToast(message, type = 'success') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Toggle admin controls visibility
    function toggleAdminControls() {
        DOM.adminControls.forEach(control => {
            control.style.display = STATE.isAuthenticated ? 'block' : 'none';
        });

        if (DOM.adminAccessBtn) {
            DOM.adminAccessBtn.style.display = STATE.isAuthenticated ? 'none' : 'block';
        }
    }

    // Start session timer
    function startSessionTimer() {
        clearTimeout(STATE.sessionTimer);
        STATE.sessionTimer = setTimeout(() => {
            handleLogout();
            showToast('Session expired. Please login again.', 'info');
        }, CONFIG.SESSION_TIMEOUT);
    }
        // ==============================================
    // 3. AUTHENTICATION FUNCTIONS
    // ==============================================

    // Check for existing session
    function checkSession() {
        const session = localStorage.getItem(CONFIG.SESSION_KEY);
        if (session && session === CONFIG.ADMIN_PASSWORD) {
            authenticate();
            startSessionTimer();
        }
    }

    // Handle login
    function handleLogin() {
        const enteredPassword = DOM.passwordInput.value.trim();
        
        if (enteredPassword === CONFIG.ADMIN_PASSWORD) {
            authenticate();
            localStorage.setItem(CONFIG.SESSION_KEY, CONFIG.ADMIN_PASSWORD);
            startSessionTimer();
            closeModal();
            showToast('Admin access granted!', 'success');
        } else {
            showToast('Incorrect password!', 'error');
            DOM.passwordInput.value = '';
            DOM.passwordInput.focus();
        }
    }

    // Handle logout
    function handleLogout() {
        STATE.isAuthenticated = false;
        localStorage.removeItem(CONFIG.SESSION_KEY);
        clearTimeout(STATE.sessionTimer);
        toggleAdminControls();
        showToast('Logged out successfully', 'success');
    }

    // Authenticate user
    function authenticate() {
        STATE.isAuthenticated = true;
        toggleAdminControls();
    }
        // ==============================================
    // 4. MODAL AND UI FUNCTIONS
    // ==============================================

    // Show modal
    function showModal() {
        if (DOM.loginModal) {
            DOM.loginModal.style.display = 'block';
            DOM.passwordInput.focus();
            document.body.style.overflow = 'hidden';
        }
    }

    // Close modal
    function closeModal() {
        if (DOM.loginModal) {
            DOM.loginModal.style.display = 'none';
            DOM.passwordInput.value = '';
            document.body.style.overflow = '';
        }
    }

    // Initialize mobile navigation
    function initMobileNav() {
        if (DOM.hamburger && DOM.navLinks) {
            DOM.hamburger.addEventListener('click', function() {
                this.classList.toggle('active');
                DOM.navLinks.classList.toggle('active');
                document.body.style.overflow = DOM.navLinks.classList.contains('active') 
                    ? 'hidden' 
                    : '';
            });

            // Close mobile menu when clicking a link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    DOM.hamburger.classList.remove('active');
                    DOM.navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
    }
        // ==============================================
    // 5. NAVIGATION AND SCROLL FUNCTIONS
    // ==============================================

    // Initialize navbar scroll effect
    function initNavbarScroll() {
        if (DOM.navbar) {
            window.addEventListener('scroll', function() {
                DOM.navbar.classList.toggle('scrolled', window.scrollY > 100);
            });
        }
    }

    // Initialize smooth scrolling
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            // Skip for admin access and logout buttons
            if (anchor.id === 'admin-access-btn' || 
                anchor.parentElement.id === 'logout-btn') {
                return;
            }
            
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const navbarHeight = DOM.navbar ? DOM.navbar.offsetHeight : 0;
                    const targetPosition = targetElement.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (DOM.hamburger && DOM.navLinks) {
                        DOM.hamburger.classList.remove('active');
                        DOM.navLinks.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            });
        });
    }
        // ==============================================
    // 6. EVENT LISTENERS AND INITIALIZATION
    // ==============================================

    // Setup event listeners
    function setupEventListeners() {
        // Login form submission
        if (DOM.loginForm) {
            DOM.loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleLogin();
            });
        }

        // Logout button
        if (DOM.logoutBtn) {
            DOM.logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleLogout();
            });
        }

        // Close modal button
        if (DOM.closeModal) {
            DOM.closeModal.addEventListener('click', closeModal);
        }

        // Admin access button
        if (DOM.adminAccessBtn) {
            DOM.adminAccessBtn.addEventListener('click', showModal);
        }

        // Close modal when clicking outside
        document.addEventListener('click', function(e) {
            if (e.target === DOM.loginModal) {
                closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && DOM.loginModal.style.display === 'block') {
                closeModal();
            }
        });
    }

    // Initialize all components
    function init() {
        // Set current year in footer
        if (DOM.year) {
            DOM.year.textContent = new Date().getFullYear();
        }

        checkSession();
        setupEventListeners();
        initMobileNav();
        initNavbarScroll();
        initSmoothScrolling();
    }

    // Start the application
    init();
});
