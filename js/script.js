/* ===================================
   Global Variables & Setup
   =================================== */

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

/* ===================================
   Mobile Menu Toggle
   =================================== */

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

/* ===================================
   Smooth Scrolling & Active Navigation
   =================================== */

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-section');
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
            link.classList.add('active');
        }
    });
});

/* ===================================
   Sticky Navbar on Scroll
   =================================== */

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
});

/* ===================================
   Back to Top Button
   =================================== */

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

/* ===================================
   Scroll to Section Function
   =================================== */

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/* ===================================
   Form Validation
   =================================== */

// Email validation pattern
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation pattern (basic)
const phonePattern = /^[\d\s\-\+\(\)]{10,}$/;

// Form field validation rules
const validationRules = {
    fullName: {
        validate: (value) => value.trim().length >= 2,
        errorMessage: 'Full name must be at least 2 characters long'
    },
    email: {
        validate: (value) => emailPattern.test(value),
        errorMessage: 'Please enter a valid email address'
    },
    phone: {
        validate: (value) => phonePattern.test(value.replace(/\s/g, '')),
        errorMessage: 'Please enter a valid phone number'
    },
    subject: {
        validate: (value) => value.trim().length >= 3,
        errorMessage: 'Subject must be at least 3 characters long'
    },
    message: {
        validate: (value) => value.trim().length >= 10,
        errorMessage: 'Message must be at least 10 characters long'
    }
};

// Validate individual field
function validateField(fieldName, value) {
    const rule = validationRules[fieldName];

    if (!rule) return true;

    const isValid = rule.validate(value);

    // Get error message element
    const errorElement = document.getElementById(`${fieldName}Error`);
    const inputElement = document.getElementById(fieldName);

    if (!isValid) {
        if (errorElement) {
            errorElement.textContent = rule.errorMessage;
        }
        if (inputElement) {
            inputElement.classList.add('error');
        }
        return false;
    } else {
        if (errorElement) {
            errorElement.textContent = '';
        }
        if (inputElement) {
            inputElement.classList.remove('error');
        }
        return true;
    }
}

// Validate entire form
function validateForm() {
    let isValid = true;

    for (const fieldName in validationRules) {
        const input = document.getElementById(fieldName);
        if (input) {
            if (!validateField(fieldName, input.value)) {
                isValid = false;
            }
        }
    }

    return isValid;
}

// Real-time validation on input
document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(field => {
    field.addEventListener('blur', () => {
        validateField(field.name, field.value);
    });

    field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
            validateField(field.name, field.value);
        }
    });
});

/* ===================================
   Form Submission
   =================================== */

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Hide previous success message
    successMessage.classList.remove('show');

    // Validate form
    if (!validateForm()) {
        console.log('Form validation failed');
        return;
    }

    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    // Simulate form submission
    // In a real application, you would send this data to a server
    console.log('Form submitted with data:', formData);

    // Show success message
    successMessage.classList.add('show');

    // Reset form
    contactForm.reset();

    // Clear error states
    document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(field => {
        field.classList.remove('error');
    });

    // Hide success message after 5 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 5000);

    // Optional: Scroll to success message
    successMessage.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
});

/* ===================================
   Scroll Reveal Animations
   =================================== */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideUpReveal 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe service cards and stat cards for animation
document.querySelectorAll('.service-card, .stat-card, .info-item').forEach(element => {
    element.style.opacity = '0';
    observer.observe(element);
});

/* ===================================
   Utility Functions
   =================================== */

// Debounce function for better performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ===================================
   Initialize on Page Load
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded successfully');

    // Initialize form
    resetFormValidation();

    // Check if form has pre-filled data on page load
    checkFormFields();
});

// Reset form validation on page load
function resetFormValidation() {
    document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(field => {
        field.classList.remove('error');
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
    });
}

// Check form fields and remove error on valid input
function checkFormFields() {
    document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(field => {
        if (field.value.trim() !== '') {
            validateField(field.name, field.value);
        }
    });
}

/* ===================================
   Keyboard Navigation Support
   =================================== */

document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }

    // Navigate sections with arrow keys
    if (e.key === 'ArrowDown') {
        const sections = ['home', 'about', 'services', 'contact'];
        const currentIndex = sections.findIndex(id => {
            const element = document.getElementById(id);
            return element && element.getBoundingClientRect().top >= 0;
        });

        if (currentIndex < sections.length - 1) {
            scrollToSection(sections[currentIndex + 1]);
        }
    }
});

/* ===================================
   Performance Optimization
   =================================== */

// Lazy load images if they were present
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

/* ===================================
   Accessibility Enhancements
   =================================== */

// Add focus styles for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-focused');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-focused');
});

// Announce page changes to screen readers
function announceToScreenReaders(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.textContent = message;
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    document.body.appendChild(announcement);

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/* ===================================
   Error Handling
   =================================== */

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Error:', event.error);
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
});

/* ===================================
   Ready State
   =================================== */

console.log('JavaScript loaded and initialized');
