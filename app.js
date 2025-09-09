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
        
        if (targetStr === '100') {
            element.textContent = Math.floor(currentValue) + '+';
        } else if (targetStr === '95') {
            element.textContent = Math.floor(currentValue) + '%';
        } else if (targetStr === '5') {
            element.textContent = Math.floor(currentValue) + '+';
        } else if (targetStr === '500') {
            element.textContent = Math.floor(currentValue) + '+';
        } else if (targetStr === '98') {
            element.textContent = Math.floor(currentValue) + '%';
        } else if (targetStr === '40') {
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

// Contact Form Validation and Submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
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
            // Simulate form submission
            handleFormSubmission(formFields);
        }
    });
}

// Form Validation Function
function validateForm(fields) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    
    // Clear previous error styling
    document.querySelectorAll('.form-input').forEach(input => {
        input.style.borderColor = 'var(--input-border)';
    });
    
    let isValid = true;
    
    // Name validation
    if (!fields.name || fields.name.trim().length < 2) {
        showFieldError('name', 'Please enter a valid name');
        isValid = false;
    }
    
    // Email validation
    if (!fields.email || !emailRegex.test(fields.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation
    if (!fields.phone || !phoneRegex.test(fields.phone.replace(/\s/g, ''))) {
        showFieldError('phone', 'Please enter a valid phone number');
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
        
        // Create or update error message
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = '#e74c3c';
            errorElement.style.fontSize = '14px';
            errorElement.style.marginTop = '5px';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorElement) {
                errorElement.remove();
                field.style.borderColor = 'var(--input-border)';
            }
        }, 5000);
    }
}

// Handle Form Submission
function handleFormSubmission(formData) {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset form
        contactForm.reset();
        
        // Show success message
        showSuccessMessage('Thank you for your message! We will get back to you soon.');
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Log form data (in production, this would be sent to server)
        console.log('Form submitted:', formData);
    }, 2000);
}

// Show Success Message Function
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        background: var(--leadgen-dot);
        color: white;
        padding: 15px;
        border-radius: 12px;
        margin-bottom: 20px;
        text-align: center;
        font-weight: 500;
    `;
    successDiv.textContent = message;
    
    contactForm.insertBefore(successDiv, contactForm.firstChild);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Button Click Handlers
document.addEventListener('DOMContentLoaded', () => {
    // Book a Demo buttons
    const demoButtons = document.querySelectorAll('.btn-demo, #book-consultation');
    demoButtons.forEach(button => {
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
    
    // Learn More button
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

// Add hover effects to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
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

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

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

// Prevent form submission on Enter key in input fields (except textarea)
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

// Social media link handlers
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

// Manual trigger for testing statistics animation
window.testStatsAnimation = () => {
    statNumbers.forEach((statNumber, index) => {
        const targetValue = parseInt(statNumber.getAttribute('data-target'));
        setTimeout(() => {
            animateCounter(statNumber, targetValue);
        }, index * 200);
    });
};

// Big stat animation for the "10 Million+ Emails Sent"
const bigStatElement = document.querySelector('.big-stat-number');
if (bigStatElement) {
    const bigStatObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate the big stat number
                let currentValue = 0;
                const targetValue = 10;
                const duration = 2000;
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