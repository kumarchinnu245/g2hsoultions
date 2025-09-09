// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const statNumbers = document.querySelectorAll('.stat-number');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Update active nav link
            updateActiveNavLink(link);
        }
    });
});

// Update Active Navigation Link
function updateActiveNavLink(clickedLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    clickedLink.classList.add('active');
}

// Scroll-based Active Navigation
window.addEventListener('scroll', () => {
    const sections = ['home', 'about', 'services', 'process', 'contact'];
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const correspondingNavLink = document.querySelector(`[href="#${sectionId}"]`);
                if (correspondingNavLink) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingNavLink.classList.add('active');
                }
            }
        }
    });
});

// Enhanced Animated Counter Function
function animateCounter(element, target, duration = 2500) {
    const startValue = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use easing function for smooth animation
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (target * easeProgress);
        
        // Handle different number formats based on data-target values
        const targetStr = element.getAttribute('data-target');
        
        if (targetStr === '250') {
            element.textContent = Math.floor(currentValue) + '+';
        } else if (targetStr === '97') {
            element.textContent = Math.floor(currentValue) + '%';
        } else if (targetStr === '7') {
            element.textContent = Math.floor(currentValue) + '+';
        } else if (targetStr === '750') {
            element.textContent = Math.floor(currentValue) + '+';
        } else if (targetStr === '99') {
            element.textContent = Math.floor(currentValue) + '%';
        } else if (targetStr === '50') {
            element.textContent = Math.floor(currentValue) + '%';
        } else {
            element.textContent = Math.floor(currentValue) + '+';
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Enhanced Intersection Observer for Statistics Animation
const statsSection = document.getElementById('statistics');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            console.log('Statistics section is visible, starting animation...');
            
            // Add a small delay to make the animation more noticeable
            setTimeout(() => {
                statNumbers.forEach((statNumber, index) => {
                    const targetValue = parseInt(statNumber.getAttribute('data-target'));
                    console.log(`Animating stat ${index + 1}: target = ${targetValue}`);
                    
                    // Stagger the animations slightly
                    setTimeout(() => {
                        animateCounter(statNumber, targetValue);
                    }, index * 200);
                });
            }, 300);
        }
    });
}, {
    threshold: 0.3, // Trigger when 30% of the section is visible
    rootMargin: '0px 0px -100px 0px'
});

if (statsSection) {
    statsObserver.observe(statsSection);
}

// Initialize stats with 0 values
document.addEventListener('DOMContentLoaded', () => {
    statNumbers.forEach(statNumber => {
        statNumber.textContent = '0';
        statNumber.style.opacity = '1';
        statNumber.style.transition = 'all 0.3s ease';
    });
});

// Enhanced Contact Form Handling with Formspree Integration
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const formFields = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message')
        };
        
        // Validate form fields
        if (validateForm(formFields)) {
            await handleFormSubmission(formData);
        }
    });
}

// Form Validation Function with Improved Phone Number Validation
function validateForm(fields) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // More flexible phone number regex that accepts various common formats
    const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{7,20}$/;
    
    // Clear previous error styling
    document.querySelectorAll('.form-input').forEach(input => {
        input.style.borderColor = 'var(--input-border)';
    });
    
    // Remove existing error messages
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    
    let isValid = true;
    
    // Name validation
    if (!fields.name || fields.name.trim().length < 2) {
        showFieldError('name', 'Please enter a valid name (at least 2 characters)');
        isValid = false;
    }
    
    // Email validation
    if (!fields.email || !emailRegex.test(fields.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Improved phone validation - accepts common formats
    if (!fields.phone || !phoneRegex.test(fields.phone.trim())) {
        showFieldError('phone', 'Please enter a valid phone number (e.g., +1 (555) 123-4567 or 5551234567)');
        isValid = false;
    }
    
    // Message validation
    if (!fields.message || fields.message.trim().length < 10) {
        showFieldError('message', 'Please enter a message (at least 10 characters)');
        isValid = false;
    }
    
    return isValid;
}

// Show Field Error Function
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (field) {
        field.style.borderColor = '#e74c3c';
        field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
        
        // Create error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.cssText = `
            color: #e74c3c;
            font-size: 14px;
            margin-top: 5px;
            font-weight: 500;
        `;
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
        
        // Focus on the field with error
        field.focus();
    }
}

// Enhanced Form Submission with Formspree
async function handleFormSubmission(formData) {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.7';
    
    try {
        // Submit to Formspree
        const response = await fetch('https://formspree.io/f/xpzgkqko', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Success
            contactForm.reset();
            showSuccessMessage('Thank you for your message! We\'ll get back to you within 2 business hours.');
            
            // Log success (for development purposes)
            console.log('Form submitted successfully');
        } else {
            // Handle Formspree errors
            const errorData = await response.json();
            throw new Error(errorData.error || 'Form submission failed');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage('Sorry, there was an error sending your message. Please try again or contact us directly.');
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
    }
}

// Show Success Message Function
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        background: var(--leadgen-dot);
        color: white;
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 20px;
        text-align: center;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(149, 231, 220, 0.3);
        animation: slideInDown 0.5s ease;
    `;
    successDiv.textContent = message;
    
    contactForm.insertBefore(successDiv, contactForm.firstChild);
    
    // Remove success message after 7 seconds
    setTimeout(() => {
        if (successDiv) {
            successDiv.style.animation = 'slideOutUp 0.5s ease';
            setTimeout(() => successDiv.remove(), 500);
        }
    }, 7000);
}

// Show Error Message Function
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message-banner';
    errorDiv.style.cssText = `
        background: #e74c3c;
        color: white;
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 20px;
        text-align: center;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
        animation: slideInDown 0.5s ease;
    `;
    errorDiv.textContent = message;
    
    contactForm.insertBefore(errorDiv, contactForm.firstChild);
    
    // Remove error message after 7 seconds
    setTimeout(() => {
        if (errorDiv) {
            errorDiv.style.animation = 'slideOutUp 0.5s ease';
            setTimeout(() => errorDiv.remove(), 500);
        }
    }, 7000);
}

// Button Click Handlers
document.addEventListener('DOMContentLoaded', () => {
    // Get Started / Book Consultation buttons
    const ctaButtons = document.querySelectorAll('.btn-demo, #book-consultation');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Scroll to contact form
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const offsetTop = contactSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Focus on name field after scrolling
                setTimeout(() => {
                    const nameField = document.getElementById('name');
                    if (nameField) {
                        nameField.focus();
                    }
                }, 1000);
            }
        });
    });
    
    // Discover Our Approach button
    const learnMoreButton = document.getElementById('learn-more');
    if (learnMoreButton) {
        learnMoreButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Scroll to about section
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const offsetTop = aboutSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
});

// Scroll-triggered Animations for Cards
const animatedElements = document.querySelectorAll('.service-card, .process-card, .quality-card, .testimonial-card');

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger animation for multiple elements
            setTimeout(() => {
                entry.target.classList.add('animate-on-scroll');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

animatedElements.forEach(element => {
    // Set initial state for animation
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease';
    animationObserver.observe(element);
});

// Navbar Background Change on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'var(--nav-bg)';
        navbar.style.backdropFilter = 'blur(15px)';
        navbar.style.boxShadow = '0 2px 20px rgba(50,85,71,0.15)';
    } else {
        navbar.style.background = 'var(--nav-bg)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.boxShadow = '0 2px 20px var(--box-shadow)';
    }
});

// Enhanced Button Hover Effects
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', () => {
        if (!button.disabled) {
            button.style.transform = 'translateY(-2px)';
        }
    });
    
    button.addEventListener('mouseleave', () => {
        if (!button.disabled) {
            button.style.transform = 'translateY(0)';
        }
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        if (this.disabled) return;
        
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOutUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Big stat animation for the "15 Million+ Strategic Connections Made"
const bigStatElement = document.querySelector('.big-stat-number');
if (bigStatElement) {
    const bigStatObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate the big stat number
                let currentValue = 0;
                const targetValue = 15;
                const duration = 2500;
                const startTime = performance.now();
                
                function updateBigStat(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    currentValue = easeProgress * targetValue;
                    
                    bigStatElement.textContent = currentValue.toFixed(1) + ' Million+';
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateBigStat);
                    }
                }
                
                requestAnimationFrame(updateBigStat);
                bigStatObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    bigStatObserver.observe(bigStatElement);
}

// Initialize all animations when page loads
window.addEventListener('load', () => {
    // Add loaded class to body for any CSS animations
    document.body.classList.add('loaded');
    
    console.log('G2H Solutions website loaded successfully!');
});

// Handle window resize for responsive design
window.addEventListener('resize', () => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Enhanced keyboard navigation for form
document.querySelectorAll('.form-input:not(textarea)').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Move to next field or submit if it's the last field
            const formInputs = Array.from(contactForm.querySelectorAll('.form-input'));
            const currentIndex = formInputs.indexOf(input);
            if (currentIndex < formInputs.length - 1) {
                formInputs[currentIndex + 1].focus();
            } else {
                contactForm.dispatchEvent(new Event('submit'));
            }
        }
    });
});

// Social media link handlers with updated URLs
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const linkText = link.textContent.toLowerCase();
        let url = '';
        
        switch(linkText) {
            case 'linkedin':
                url = 'https://www.linkedin.com/company/g2h-solutions';
                break;
            case 'facebook':
                url = 'https://www.facebook.com/g2hsolutions';
                break;
            case 'twitter':
                url = 'https://twitter.com/g2hsolutions';
                break;
            case 'instagram':
                url = 'https://www.instagram.com/g2hsolutions';
                break;
        }
        
        if (url) {
            window.open(url, '_blank');
        }
    });
});

// Form field focus effects
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentNode.style.transform = 'scale(1.02)';
        input.parentNode.style.transition = 'transform 0.2s ease';
    });
    
    input.addEventListener('blur', () => {
        input.parentNode.style.transform = 'scale(1)';
        // Clear any existing errors when user starts typing
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage && input.value.trim() !== '') {
            errorMessage.remove();
            input.style.borderColor = 'var(--input-border)';
            input.style.boxShadow = 'none';
        }
    });
});

// Development helper function for testing statistics animation
window.testStatsAnimation = () => {
    statsAnimated = false;
    statNumbers.forEach(stat => stat.textContent = '0');
    statNumbers.forEach((statNumber, index) => {
        const targetValue = parseInt(statNumber.getAttribute('data-target'));
        setTimeout(() => {
            animateCounter(statNumber, targetValue);
        }, index * 200);
    });
};

// Add scroll to top functionality on page load
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});