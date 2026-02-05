// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            navLinks.classList.remove('active');
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Skills Filter
const filterButtons = document.querySelectorAll('.filter-btn');
const skillCards = document.querySelectorAll('.skill-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        skillCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Form Validation
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        const name = this.querySelector('input[name="name"]');
        const email = this.querySelector('input[name="email"]');
        const message = this.querySelector('textarea[name="message"]');
        
        let isValid = true;
        
        if (!name.value.trim()) {
            showError(name, 'Name is required');
            isValid = false;
        } else {
            clearError(name);
        }
        
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email');
            isValid = false;
        } else {
            clearError(email);
        }
        
        if (!message.value.trim()) {
            showError(message, 'Message is required');
            isValid = false;
        } else {
            clearError(message);
        }
        
        if (isValid) {
            // Submit form via AJAX
            submitForm(this);
        }
    });
}

function showError(input, message) {
    const formGroup = input.parentElement;
    formGroup.classList.add('error');
    
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function clearError(input) {
    const formGroup = input.parentElement;
    formGroup.classList.remove('error');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Update the submitForm function in script.js
function submitForm(form) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    fetch(form.action, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage(form, data.message, 'success');
            form.reset();
            
            // Show success animation
            const successIcon = document.createElement('div');
            successIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
            successIcon.style.cssText = `
                font-size: 3rem;
                color: var(--success);
                text-align: center;
                margin: 20px 0;
                animation: bounce 0.5s;
            `;
            
            const messageDiv = form.querySelector('.success-message') || 
                              form.querySelector('.error-message');
            if (messageDiv) {
                messageDiv.parentNode.insertBefore(successIcon, messageDiv);
            }
            
            // Redirect to thank you page after 3 seconds (optional)
            setTimeout(() => {
                window.location.href = 'thank-you.html';
            }, 3000);
            
        } else {
            showMessage(form, data.message, 'error');
        }
    })
    .catch(error => {
        showMessage(form, '❌ Network error. Please check your connection and try again.', 'error');
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    });
}

function showMessage(form, message, type) {
    // Remove existing messages
    const existingMessages = form.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.innerHTML = message;
    messageDiv.style.cssText = `
        padding: 15px;
        border-radius: 5px;
        margin-top: 20px;
        text-align: center;
        animation: slideDown 0.3s ease-out;
    `;
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = 'var(--success)';
        messageDiv.style.color = 'white';
    } else {
        messageDiv.style.backgroundColor = 'var(--danger)';
        messageDiv.style.color = 'white';
    }
    
    form.appendChild(messageDiv);
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(-10px)';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }
}

// Add loading animation CSS
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    .btn.loading {
        position: relative;
        color: transparent !important;
    }
    
    .btn.loading::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        top: 50%;
        left: 50%;
        margin: -10px 0 0 -10px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;
document.head.appendChild(loadingStyle);
// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});
// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

// Show/hide back to top button based on scroll position
function toggleBackToTop() {
    // Show button when scrolled down 300px
    if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
        
        // Optional: Add pulse animation after 5 seconds of being at bottom
        const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
        if (isAtBottom) {
            setTimeout(() => {
                if (isAtBottom) {
                    backToTopButton.classList.add('pulse');
                }
            }, 5000);
        } else {
            backToTopButton.classList.remove('pulse');
        }
        
    } else {
        backToTopButton.classList.remove('visible');
        backToTopButton.classList.remove('pulse');
    }
    
    // Optional: Show progress indicator when scrolling fast
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(() => {
        backToTopButton.classList.remove('progress');
    }, 100);
    
    backToTopButton.classList.add('progress');
}

// Smooth scroll to top
function scrollToTop() {
    // Remove pulse animation when clicked
    backToTopButton.classList.remove('pulse');
    
    // Add progress animation
    backToTopButton.classList.add('progress');
    
    // Smooth scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Remove progress animation after scroll
    setTimeout(() => {
        backToTopButton.classList.remove('progress');
    }, 1000);
}

// Add scroll event listener
window.addEventListener('scroll', toggleBackToTop);

// Add click event to back to top button
backToTopButton.addEventListener('click', scrollToTop);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check initial position
    toggleBackToTop();
    
    // Add keyboard support
    backToTopButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToTop();
        }
    });
    
    // Optional: Add scroll to top with keyboard shortcut (Ctrl + ↑)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'ArrowUp') {
            e.preventDefault();
            scrollToTop();
        }
    });
});


// ======================
// Theme Toggle Functionality
// ======================

class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle?.querySelector('.theme-icon i');
        this.themeText = this.themeToggle?.querySelector('.theme-text');
        this.html = document.documentElement;
        this.prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        this.init();
    }
    
    init() {
        if (!this.themeToggle) return;
        
        // Load saved theme or detect system preference
        this.loadTheme();
        
        // Add event listeners
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.prefersDarkScheme.addEventListener('change', (e) => this.handleSystemThemeChange(e));
        
        // Listen for storage events (sync across tabs)
        window.addEventListener('storage', (e) => {
            if (e.key === 'theme') {
                this.applyTheme(e.newValue);
            }
        });
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            this.applyTheme(savedTheme);
        } else {
            // No saved theme, use system preference
            this.applySystemTheme();
        }
    }
    
    applyTheme(theme) {
        // Add class to disable transitions during theme change
        this.html.classList.add('theme-changing');
        
        // Apply theme
        this.html.setAttribute('data-theme', theme);
        this.updateToggle(theme);
        
        // Save to localStorage
        localStorage.setItem('theme', theme);
        
        // Update meta theme-color
        this.updateMetaThemeColor(theme);
        
        // Remove transition disabling class
        setTimeout(() => {
            this.html.classList.remove('theme-changing');
        }, 100);
        
        // Dispatch custom event
        this.dispatchThemeChangeEvent(theme);
    }
    
    applySystemTheme() {
        const systemTheme = this.prefersDarkScheme.matches ? 'dark' : 'light';
        this.applyTheme(systemTheme);
    }
    
    toggleTheme() {
        const currentTheme = this.html.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }
    
    updateToggle(theme) {
        if (!this.themeIcon || !this.themeText) return;
        
        if (theme === 'dark') {
            this.themeIcon.className = 'fas fa-sun';
            this.themeText.textContent = 'Light Mode';
            this.themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            this.themeIcon.className = 'fas fa-moon';
            this.themeText.textContent = 'Dark Mode';
            this.themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
    
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = theme === 'dark' ? '#0f172a' : '#2563eb';
    }
    
    handleSystemThemeChange(e) {
        // Only apply system theme if user hasn't explicitly set a preference
        if (!localStorage.getItem('theme')) {
            this.applySystemTheme();
        }
    }
    
    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themechange', {
            detail: { theme }
        });
        window.dispatchEvent(event);
    }
    
    // Public method to get current theme
    getCurrentTheme() {
        return this.html.getAttribute('data-theme') || 'light';
    }
    
    // Public method to set theme programmatically
    setTheme(theme) {
        if (['light', 'dark'].includes(theme)) {
            this.applyTheme(theme);
        }
    }
}

// Initialize Theme Manager
let themeManager;

document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
    
    // Optional: Add theme change effects
    window.addEventListener('themechange', (e) => {
        console.log(`Theme changed to: ${e.detail.theme}`);
        // You can add additional theme-dependent logic here
    });
});

// ======================
// Theme-Dependent Animations
// ======================

// Optional: Add theme-aware animations
function setupThemeAnimations() {
    // Add pulse animation to theme toggle when system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const toggle = document.getElementById('themeToggle');
            if (toggle) {
                toggle.classList.add('pulse');
                setTimeout(() => toggle.classList.remove('pulse'), 1000);
            }
        }
    });
}

// Call this after DOM is loaded
setupThemeAnimations();

// ======================
// Theme Utilities
// ======================

// Utility function to check if dark mode is active
function isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark' || 
           (window.matchMedia('(prefers-color-scheme: dark)').matches && 
            !localStorage.getItem('theme'));
}

// Utility function to toggle theme from anywhere
function toggleTheme() {
    if (themeManager) {
        themeManager.toggleTheme();
    }
}

// Export for use in console (optional)
window.themeManager = {
    toggle: toggleTheme,
    isDark: isDarkMode,
    set: (theme) => themeManager?.setTheme(theme),
    get: () => themeManager?.getCurrentTheme()
};