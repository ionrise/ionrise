// main.js - Připoj k HTML: <script src="main.js" defer></script>

// Mobile Navigation Toggle
class MobileNav {
    constructor() {
        this.nav = document.querySelector('nav');
        this.hamburger = document.createElement('button');
        this.init();
    }
    
    init() {
        this.createHamburger();
        this.addEventListeners();
        this.handleResize();
    }
    
    createHamburger() {
        this.hamburger.className = 'hamburger';
        this.hamburger.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        this.hamburger.setAttribute('aria-label', 'Toggle menu');
        document.querySelector('.header-content').appendChild(this.hamburger);
    }
    
    addEventListeners() {
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking on links
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        window.addEventListener('resize', () => this.handleResize());
    }
    
    toggleMenu() {
        this.nav.classList.toggle('active');
        this.hamburger.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    }
    
    closeMenu() {
        this.nav.classList.remove('active');
        this.hamburger.classList.remove('active');
        document.body.classList.remove('nav-open');
    }
    
    handleResize() {
        if (window.innerWidth > 900) {
            this.closeMenu();
        }
    }
}

// FAQ Accordion
class FAQAccordion {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }
    
    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => this.toggleItem(item));
        });
    }
    
    toggleItem(item) {
        const isActive = item.classList.contains('active');
        
        // Close all items
        this.faqItems.forEach(i => i.classList.remove('active'));
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    }
}

// Animated Counter
class Counter {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        this.init();
    }
    
    init() {
        if (this.counters.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// Smooth Scroll for Anchor Links
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Form Validation
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.validateForm(e));
        
        // Real-time validation
        this.form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });
    }
    
    validateForm(e) {
        let isValid = true;
        const fields = this.form.querySelectorAll('input[required], textarea[required]');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            this.showMessage('Vyplňte prosím všechny povinné pole správně.', 'error');
        } else {
            this.showMessage('Formulář se odesílá...', 'success');
        }
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        // Remove previous error states
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Required field validation
        if (field.hasAttribute('required') && value === '') {
            isValid = false;
            this.showFieldError(field, 'Toto pole je povinné.');
        }
        
        // Email validation
        if (field.type === 'email' && value !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                this.showFieldError(field, 'Zadejte platný email.');
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value !== '') {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                this.showFieldError(field, 'Zadejte platné telefonní číslo.');
            }
        }
        
        if (isValid) {
            field.classList.add('success');
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 4px;';
        field.parentNode.appendChild(errorElement);
    }
    
    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) existingMessage.remove();
        
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            padding: 12px;
            margin: 16px 0;
            border-radius: 8px;
            font-weight: 500;
            ${type === 'error' ? 'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;' : 'background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0;'}
        `;
        
        this.form.insertBefore(messageElement, this.form.firstChild);
        
        if (type === 'success') {
            setTimeout(() => messageElement.remove(), 3000);
        }
    }
}

// Image Lazy Loading
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            this.images.forEach(img => observer.observe(img));
        } else {
            // Fallback for older browsers
            this.images.forEach(img => this.loadImage(img));
        }
    }
    
    loadImage(img) {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        img.onload = () => img.classList.add('loaded');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components only if they exist on the page
    if (document.querySelector('nav')) new MobileNav();
    if (document.querySelector('.faq-item')) new FAQAccordion();
    if (document.querySelector('[data-count]')) new Counter();
    new SmoothScroll();
    if (document.getElementById('contact-form')) new FormValidator('contact-form');
    if (document.querySelector('img[data-src]')) new LazyLoader();
    
    // Add loading animation to cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.service-card, .card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});