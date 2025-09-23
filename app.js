// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen first
    initLoadingScreen();
    
    // Initialize all other functionality after loading
    setTimeout(() => {
        initNavigation();
        initMobileMenu();
        initProgressBar();
        initAnimatedCounters();
        initScrollAnimations();
        initContactForm();
        initSmoothScrolling();
        initPageTransitions();
        
        // Set initial page
        showPage('home');
    }, 100);
});

// Loading Screen functionality
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Show loading screen for 2.5 seconds
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        // Show progress bar after loading screen disappears
        setTimeout(() => {
            const progressBar = document.getElementById('progress-bar');
            if (progressBar) {
                progressBar.classList.add('visible');
            }
        }, 500);
        
        // Initialize animations after loading
        setTimeout(() => {
            initAnimatedCounters();
            initScrollAnimations();
        }, 800);
        
    }, 2500);
}

// Progress Bar functionality
function initProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progressFill = document.getElementById('progress-fill');
    
    if (!progressBar || !progressFill) return;
    
    function updateProgressBar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressFill.style.width = Math.min(scrollPercent, 100) + '%';
    }
    
    // Update progress bar on scroll
    window.addEventListener('scroll', updateProgressBar);
    
    // Update on page change
    window.addEventListener('resize', updateProgressBar);
    
    // Initial update
    updateProgressBar();
}

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target page
            const targetPage = this.getAttribute('data-page');
            
            // Show target page
            showPage(targetPage);
            
            // Close mobile menu if open
            closeMobileMenu();
        });
    });
    
    // Demo button functionality
    const demoBtn = document.querySelector('.nav-demo-btn');
    if (demoBtn) {
        demoBtn.addEventListener('click', function() {
            showPage('contact');
            setActiveNavLink('contact');
            closeMobileMenu();
        });
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
}

function closeMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (navMenu && navToggle) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
}

// Page transition functionality
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    
    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Reinitialize animations for the new page
        setTimeout(() => {
            initScrollAnimations();
            if (pageId === 'home') {
                initAnimatedCounters();
            }
        }, 100);
    }
}

function setActiveNavLink(pageId) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
}

// Animated counters
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        // Reset counter
        counter.textContent = '0';
        counter.classList.add('counting');
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
                counter.classList.remove('counting');
                
                // Add appropriate suffix
                const suffix = counter.parentElement.querySelector('.stat-label').textContent;
                if (suffix.includes('Satisfaction') || suffix.includes('Accuracy') || suffix.includes('Conversion')) {
                    counter.textContent = target + '%';
                } else if (suffix.includes('Clients') || suffix.includes('Campaigns')) {
                    counter.textContent = target + '+';
                } else if (suffix.includes('Experience')) {
                    counter.textContent = target + '+';
                }
            }
        };
        
        // Start animation with delay
        setTimeout(updateCounter, Math.random() * 500);
    });
}

// Scroll animations
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.service-card, .stat-card, .testimonial-card, .value-item, .blog-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-up');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

// Enhanced Contact form functionality with Web3Forms
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitBtn = document.getElementById('submit-btn');
            const messageDiv = document.getElementById('form-message');
            const formFields = contactForm.querySelectorAll('.form-control');
            
            // Reset previous errors
            formFields.forEach(field => {
                field.classList.remove('error');
            });
            messageDiv.style.display = 'none';
            
            // Validate required fields
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                }
            });
            
            // Email validation
            const emailField = contactForm.querySelector('input[type="email"]');
            if (emailField && emailField.value && !isValidEmail(emailField.value)) {
                emailField.classList.add('error');
                isValid = false;
            }
            
            if (!isValid) {
                showFormMessage('Please fill in all required fields correctly.', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            try {
                // For demo purposes, we'll simulate the form submission
                // In real implementation, this would submit to Web3Forms
                
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Check if this is a real Web3Forms access key
                const accessKey = formData.get('access_key');
                
                if (accessKey === 'your-access-key-here') {
                    // Demo mode - show success message
                    showFormMessage('Demo Mode: Form would be submitted successfully! Please add your Web3Forms access key to enable real submissions.', 'success');
                    contactForm.reset();
                } else {
                    // Real submission to Web3Forms
                    const response = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        body: formData
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        showFormMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
                        contactForm.reset();
                    } else {
                        throw new Error(result.message || 'Submission failed');
                    }
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormMessage(message, type) {
    const messageDiv = document.getElementById('form-message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Scroll message into view
        messageDiv.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
        
        // Auto-hide success messages after 8 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 8000);
        }
    }
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '10px',
        zIndex: '10000',
        fontSize: '16px',
        fontWeight: '500',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'success' ? '#4CAF50' : '#ff4444',
        color: 'white',
        maxWidth: '350px',
        wordWrap: 'break-word'
    });
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Smooth scrolling functionality
function initSmoothScrolling() {
    // Add smooth scrolling to all internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Page transition animations
function initPageTransitions() {
    // Add fade-in animation to pages when they become active
    const pages = document.querySelectorAll('.page');
    
    pages.forEach(page => {
        page.style.opacity = '0';
        page.style.transition = 'opacity 0.5s ease';
    });
    
    // Show active page
    const activePage = document.querySelector('.page.active');
    if (activePage) {
        setTimeout(() => {
            activePage.style.opacity = '1';
        }, 100);
    }
}

// Service card interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('service-btn')) {
        e.preventDefault();
        showPage('services');
        setActiveNavLink('services');
        
        // Scroll to relevant service
        setTimeout(() => {
            const serviceTitle = e.target.parentElement.querySelector('.service-title').textContent;
            const serviceDetailed = Array.from(document.querySelectorAll('.service-detailed h3')).find(h3 => 
                h3.textContent.includes(serviceTitle.split(' ')[0])
            );
            
            if (serviceDetailed) {
                serviceDetailed.parentElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 300);
    }
});

// Blog interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('blog-read-more')) {
        e.preventDefault();
        
        const blogTitle = e.target.parentElement.querySelector('.blog-title').textContent;
        showBlogPost(blogTitle);
    }
});

function showBlogPost(title) {
    // Create modal for blog post
    const modal = document.createElement('div');
    modal.className = 'blog-modal';
    modal.innerHTML = `
        <div class="blog-modal-content">
            <div class="blog-modal-header">
                <h2>${title}</h2>
                <button class="blog-modal-close">&times;</button>
            </div>
            <div class="blog-modal-body">
                <p>This would contain the full blog post content. In a real implementation, this would be fetched from a content management system or database.</p>
                <p>The blog post would include detailed insights, practical tips, and actionable strategies for lead generation and business growth.</p>
                <p>Our team at G2H Solutions continuously researches the latest trends and best practices in lead generation to provide you with valuable, actionable insights.</p>
                <p>Stay tuned for more comprehensive content and industry insights from G2H Solutions!</p>
            </div>
        </div>
    `;
    
    // Add modal styles
    Object.assign(modal.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    });
    
    const modalContent = modal.querySelector('.blog-modal-content');
    Object.assign(modalContent.style, {
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative'
    });
    
    const modalHeader = modal.querySelector('.blog-modal-header');
    Object.assign(modalHeader.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '20px',
        borderBottom: '1px solid #e1e5c7'
    });
    
    const closeBtn = modal.querySelector('.blog-modal-close');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        fontSize: '30px',
        cursor: 'pointer',
        color: '#699d6b'
    });
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Enhanced button interactions
document.addEventListener('click', function(e) {
    // Get Started button
    if (e.target.textContent === 'Get Started') {
        e.preventDefault();
        showPage('contact');
        setActiveNavLink('contact');
    }
    
    // Learn More button
    if (e.target.textContent === 'Learn More') {
        e.preventDefault();
        showPage('about');
        setActiveNavLink('about');
    }
    
    // Learn Our Story button
    if (e.target.textContent === 'Learn Our Story') {
        e.preventDefault();
        showPage('about');
        setActiveNavLink('about');
    }
});

// Footer link interactions
document.addEventListener('click', function(e) {
    if (e.target.matches('.footer-section a[href^="#"]')) {
        e.preventDefault();
        const targetPage = e.target.getAttribute('href').substring(1);
        showPage(targetPage);
        setActiveNavLink(targetPage);
    }
});

// Scroll to top on page change
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Enhanced navbar scroll effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.nav');
    const progressBar = document.getElementById('progress-bar');
    
    if (window.scrollY > 100) {
        nav.style.backgroundColor = 'rgba(183, 238, 209, 0.95)';
        nav.style.backdropFilter = 'blur(15px)';
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        
        // Show progress bar when scrolling
        if (progressBar && !progressBar.classList.contains('visible')) {
            progressBar.classList.add('visible');
        }
    } else {
        nav.style.backgroundColor = '';
        nav.style.backdropFilter = 'blur(10px)';
        nav.style.boxShadow = '';
    }
});

// Add loading animation
window.addEventListener('load', function() {
    // Remove any loading states
    document.body.classList.add('loaded');
});

// Handle browser back/forward buttons
window.addEventListener('popstate', function(e) {
    if (e.state && e.state.page) {
        showPage(e.state.page);
        setActiveNavLink(e.state.page);
    }
});

// Add page state to browser history
function addToHistory(page) {
    const title = `G2H Solutions - ${page.charAt(0).toUpperCase() + page.slice(1)}`;
    const url = `#${page}`;
    
    history.pushState({ page: page }, title, url);
    document.title = title;
}

// Enhanced page showing with history
const originalShowPage = showPage;
showPage = function(pageId) {
    originalShowPage(pageId);
    addToHistory(pageId);
};

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC key to close modals
    if (e.key === 'Escape') {
        const modal = document.querySelector('.blog-modal');
        if (modal) {
            document.body.removeChild(modal);
        }
    }
});

// Performance optimization - lazy load heavy content
function lazyLoadContent() {
    const observerOptions = {
        rootMargin: '50px 0px',
        threshold: 0.01
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Load content when needed
                const element = entry.target;
                if (element.dataset.content) {
                    element.innerHTML = element.dataset.content;
                    observer.unobserve(element);
                }
            }
        });
    }, observerOptions);
    
    const lazyElements = document.querySelectorAll('[data-content]');
    lazyElements.forEach(el => observer.observe(el));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadContent);

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    .notification {
        font-family: var(--font-family);
    }
    
    .blog-modal-content h2 {
        color: var(--heading-color);
        font-family: var(--font-family);
        margin: 0;
    }
    
    .blog-modal-body p {
        color: var(--subheading-color);
        font-family: var(--font-family);
        line-height: 1.6;
        margin-bottom: 15px;
    }
    
    .loaded .page.active {
        animation: fadeInPage 0.5s ease forwards;
    }
    
    @keyframes fadeInPage {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .counting {
        animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    @media (max-width: 768px) {
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
    
    .loading-screen.hidden {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }
`;

document.head.appendChild(style);

// Initialize on page load if DOM is already ready
if (document.readyState === 'loading') {
    // DOM is still loading
    document.addEventListener('DOMContentLoaded', function() {
        // Already handled above
    });
} else {
    // DOM is already loaded
    setTimeout(() => {
        initLoadingScreen();
    }, 0);
}