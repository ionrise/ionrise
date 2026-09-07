// Mobile Navigation
class MobileNav {
  constructor() {
    this.toggle = document.querySelector('.nav-toggle');
    this.menu = document.querySelector('.nav-menu');
    this.links = document.querySelectorAll('.nav-link');
    
    if (this.toggle) {
      this.init();
    }
  }
  
  init() {
    this.toggle.addEventListener('click', () => this.toggleMenu());
    this.links.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    window.addEventListener('resize', () => this.handleResize());
  }
  
  toggleMenu() {
    this.menu.classList.toggle('active');
  }
  
  closeMenu() {
    this.menu.classList.remove('active');
  }
  
  handleResize() {
    if (window.innerWidth > 768) {
      this.closeMenu();
    }
  }
}

// Scroll Animations
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      this.observerOptions
    );
    this.init();
  }
  
  init() {
    const elements = document.querySelectorAll(
      '.service-card, .about-grid, .stats-grid'
    );
    elements.forEach(el => this.observer.observe(el));
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }
}

// Smooth Scroll for Anchor Links
class SmoothScroll {
  constructor() {
    this.init();
  }
  
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
}

// Active Navigation Link
class ActiveNav {
  constructor() {
    this.links = document.querySelectorAll('.nav-link');
    this.init();
  }
  
  init() {
    window.addEventListener('scroll', () => this.updateActive());
    window.addEventListener('load', () => this.updateActive());
  }
  
  updateActive() {
    const currentPage = window.location.pathname;
    this.links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentPage || 
          (currentPage === '/' && link.getAttribute('href') === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
}

// Lazy Loading for Images
class LazyLoadImages {
  constructor() {
    if ('IntersectionObserver' in window) {
      this.init();
    }
  }
  
  init() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '50px 0px' }
    );
    
    images.forEach(img => imageObserver.observe(img));
  }
}

// Performance Monitor
class PerformanceMonitor {
  constructor() {
    this.init();
  }
  
  init() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 3000) {
              console.warn(`Slow task detected: ${entry.name} (${entry.duration.toFixed(0)}ms)`);
            }
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // LongTask API not supported
      }
    }
  }
}

// Initialize everything on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new MobileNav();
  new ScrollAnimations();
  new SmoothScroll();
  new ActiveNav();
  new LazyLoadImages();
  new PerformanceMonitor();
  
  // Update year in footer
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Add loading state management
  window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0.8';
  });
});

// Preload critical images
function preloadImage(url) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;
  document.head.appendChild(link);
}

// Utility: Debounce
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

// Utility: Throttle
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