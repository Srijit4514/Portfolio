// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initSmoothScroll();
    initTypingEffect();
    //loadProjects(); // <- THIS LINE is the problem
    initContactForm();
    initParticles();
});


// Navbar functionality
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const themeToggle = document.querySelector('.theme-toggle');
    
    // Scroll event for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active link based on scroll position
        updateActiveNavLink();
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });
    
    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });
    
    // Theme toggle functionality (if implemented)
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            
            // Update icon
            if (document.body.classList.contains('light-mode')) {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        });
    }
    
    // Initial active link update
    updateActiveNavLink();
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 200)) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default if it's not just a '#' link
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Typing effect for the hero section
function initTypingEffect() {
    const element = document.querySelector('.typing-text');
    
    if (element) {
        const text = element.getAttribute('data-text');
        const roles = JSON.parse(text);
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        function type() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                // Deleting text
                element.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                // Typing text
                element.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }
            
            // If word is complete
            if (!isDeleting && charIndex === currentRole.length) {
                // Pause at the end of typing
                isDeleting = true;
                typingSpeed = 1000; // Wait before deleting
            } else if (isDeleting && charIndex === 0) {
                // Move to next word when deleted
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 500; // Pause before typing next word
            }
            
            setTimeout(type, typingSpeed);
        }
        
        // Start the typing effect
        setTimeout(type, 1000);
    }
}

// Load projects from sample data
function loadProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    
    if (projectsGrid) {
        // Sample project data (can be replaced with actual data)
        const projects = [
            {
                title: "Data Analysis Dashboard",
                description: "Interactive dashboard for visualizing complex datasets with filtering capabilities.",
                tech: ["Python", "Flask", "D3.js", "Pandas"],
                github: "#",
                demo: "#"
            },
            {
                title: "Linux System Monitor",
                description: "A tool to monitor system resources and processes on Linux distributions.",
                tech: ["Python", "Bash", "GTK"],
                github: "#",
                demo: null
            },
            {
                title: "Personal Portfolio Website",
                description: "A responsive portfolio website showcasing skills and projects.",
                tech: ["HTML", "CSS", "JavaScript"],
                github: "#",
                demo: "#"
            },
            {
                title: "Network Traffic Analyzer",
                description: "Tool for analyzing and visualizing network traffic patterns.",
                tech: ["Python", "Wireshark API", "Matplotlib"],
                github: "#",
                demo: null
            }
        ];
        
        // Clear existing content
        projectsGrid.innerHTML = '';
        
        // Add projects to the grid
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            // Create project image/placeholder
            const projectImg = document.createElement('div');
            projectImg.className = 'project-img';
            const imgPlaceholder = document.createElement('div');
            imgPlaceholder.className = 'project-img-placeholder';
            imgPlaceholder.innerHTML = '<i class="fas fa-code"></i>';
            projectImg.appendChild(imgPlaceholder);
            
            // Create project content
            const projectContent = document.createElement('div');
            projectContent.className = 'project-content';
            
            // Project title
            const title = document.createElement('h3');
            title.textContent = project.title;
            
            // Project description
            const description = document.createElement('p');
            description.textContent = project.description;
            
            // Project technologies
            const techContainer = document.createElement('div');
            techContainer.className = 'project-tech';
            project.tech.forEach(tech => {
                const techSpan = document.createElement('span');
                techSpan.textContent = tech;
                techContainer.appendChild(techSpan);
            });
            
            // Project links
            const linksContainer = document.createElement('div');
            linksContainer.className = 'project-links';
            
            // GitHub link
            const githubLink = document.createElement('a');
            githubLink.className = 'project-link';
            githubLink.href = project.github;
            githubLink.target = '_blank';
            githubLink.innerHTML = '<i class="fab fa-github"></i> GitHub';
            linksContainer.appendChild(githubLink);
            
            // Demo link (if available)
            if (project.demo) {
                const demoLink = document.createElement('a');
                demoLink.className = 'project-link';
                demoLink.href = project.demo;
                demoLink.target = '_blank';
                demoLink.innerHTML = '<i class="fas fa-external-link-alt"></i> Live Demo';
                linksContainer.appendChild(demoLink);
            }
            
            // Append all elements to project content
            projectContent.appendChild(title);
            projectContent.appendChild(description);
            projectContent.appendChild(techContainer);
            projectContent.appendChild(linksContainer);
            
            // Append image and content to project card
            projectCard.appendChild(projectImg);
            projectCard.appendChild(projectContent);
            
            // Append project card to grid
            projectsGrid.appendChild(projectCard);
        });
    }
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = this.querySelector('#name').value;
            const email = this.querySelector('#email').value;
            const message = this.querySelector('#message').value;
            
            // Basic validation
            if (!name || !email || !message) {
                showFormMessage('Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission (replace with actual form submission)
            showFormMessage('Thanks for your message! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        });
    }
}

// Show form submission message
function showFormMessage(message, type) {
    const formMessage = document.querySelector('.form-message');
    
    if (!formMessage) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        
        const contactForm = document.querySelector('#contact-form');
        contactForm.parentNode.insertBefore(messageDiv, contactForm.nextSibling);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    } else {
        formMessage.className = `form-message ${type}`;
        formMessage.textContent = message;
        
        // Remove message after 5 seconds
        setTimeout(() => {
            formMessage.remove();
        }, 5000);
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize particles background
function initParticles() {
    const particlesContainer = document.getElementById('particles-js');
    
    if (particlesContainer && window.particlesJS) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#00e5ff'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    },
                    polygon: {
                        nb_sides: 5
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00b8d4',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    } else {
        console.warn('Particles.js not loaded or container not found');
        
        // Fallback simple animation if particles.js is not available
        if (particlesContainer) {
            particlesContainer.style.background = 'radial-gradient(circle, rgba(18,18,18,1) 0%, rgba(30,30,30,1) 100%)';
        }
    }
}

// Reveal animations on scroll
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const revealTop = element.getBoundingClientRect().top;
            
            if (revealTop < windowHeight - revealPoint) {
                element.classList.add('revealed');
            }
        });
    }
    
    // Initial check
    checkReveal();
    
    // Check on scroll
    window.addEventListener('scroll', checkReveal);
}