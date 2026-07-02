/* ==========================================================================
   COLORFUL PORTFOLIO SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI Components
    initThemeSwitcher();
    initMobileNav();
    initHeroAnimations();
    initTypewriter();
    initParticleCanvas();
    initProjectFilter();
    initScrollReveal();
    initContactForm();

});

/* ==========================================================================
   THEME SWITCHING SYSTEM
   ========================================================================== */
function initThemeSwitcher() {
    const toggleBtn = document.getElementById('theme-panel-toggle');
    const panel = document.getElementById('theme-panel');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const root = document.documentElement;

    // Toggle panel visibility
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('active');
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
            panel.classList.remove('active');
        }
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('portfolio-theme') || 'cyber-neon';
    setTheme(savedTheme);

    // Apply active class to the correct button on load
    themeButtons.forEach(btn => {
        if (btn.getAttribute('data-theme') === savedTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Button click theme assignment
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedTheme = btn.getAttribute('data-theme');
            setTheme(selectedTheme);
            
            // Toggle active state
            themeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    function setTheme(themeName) {
        root.setAttribute('data-theme', themeName);
        localStorage.setItem('portfolio-theme', themeName);
        
        // Re-dispatch a custom event so the canvas particle background can change color if necessary
        const themeChangeEvent = new CustomEvent('themeChanged', { detail: { theme: themeName } });
        window.dispatchEvent(themeChangeEvent);
    }
}

/* ==========================================================================
   MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    // Header scroll background change
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('overflow-hidden');
    });

    // Close mobile menu when nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('overflow-hidden');
        });
    });

    // Active nav link highlight on scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   HERO LOAD ANIMATIONS
   ========================================================================== */
function initHeroAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Add animate class sequentially
    setTimeout(() => {
        fadeElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate');
            }, index * 120);
        });
    }, 100);
}

/* ==========================================================================
   TYPEWRITER HERO TEXT
   ========================================================================== */
function initTypewriter() {
    const target = document.getElementById('typewriter');
    const roles = ["Predictive Models", "Python Applications", "Data Science Trainings", "Java Algorithms"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            target.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40; // Deleting is faster
        } else {
            target.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 1800; // Delay before deleting
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before typing new word
        }

        setTimeout(type, typeSpeed);
    }

    if (target) {
        setTimeout(type, 1000);
    }
}

/* ==========================================================================
   PARTICLE CANVAS BACKGROUND
   ========================================================================== */
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    let particleCount = Math.min(80, Math.floor((width * height) / 15000)); // Dynamic particle density
    let speedControl = document.getElementById('particle-speed');
    let baseSpeed = parseFloat(speedControl ? speedControl.value : 15) / 10;
    


    // Listen to background speed customizer
    if (speedControl) {
        speedControl.addEventListener('input', (e) => {
            baseSpeed = parseFloat(e.target.value) / 10;
        });
    }

    // Color mapper based on current theme styles
    let accentColor1 = '#00f0ff';
    let accentColor2 = '#ff007f';

    function getThemeAccentColors() {
        const style = getComputedStyle(document.documentElement);
        accentColor1 = style.getPropertyValue('--accent-1').trim() || '#00f0ff';
        accentColor2 = style.getPropertyValue('--accent-2').trim() || '#ff007f';
    }

    getThemeAccentColors();
    window.addEventListener('themeChanged', () => {
        getThemeAccentColors();
        // Trigger particle regeneration with new colors
        particles.forEach(p => p.resetColor());
    });

    // Window resize
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particleCount = Math.min(80, Math.floor((width * height) / 15000));
        createParticles();
    });

    // Particle Object
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 3 + 1.5;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 15;
            
            // Random direction speeds
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.resetColor();
        }

        resetColor() {
            // Assign gradient color mix
            this.color = Math.random() > 0.5 ? accentColor1 : accentColor2;
            this.alpha = Math.random() * 0.4 + 0.2;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.shadowBlur = 4;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow for efficiency
        }

        update() {
            // Move particles with the base speed factor
            this.x += this.vx * baseSpeed;
            this.y += this.vy * baseSpeed;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;


        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Drawing connections between nearby particles (constellation effect)
    function drawConnections() {
        ctx.globalAlpha = 0.08;
        ctx.strokeStyle = accentColor1;
        ctx.lineWidth = 0.8;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.globalAlpha = 1.0;
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        drawConnections();
        requestAnimationFrame(animate);
    }

    createParticles();
    animate();
}

/* ==========================================================================
   PROJECT FILTERING SYSTEM
   ========================================================================== */
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active status
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hide');
                    // Add micro delay for smooth scaling entry animation
                    setTimeout(() => {
                        card.classList.add('show');
                    }, 50);
                } else {
                    card.classList.remove('show');
                    card.classList.add('hide');
                }
            });
        });
    });
}

/* ==========================================================================
   SCROLL REVEAL INTERSECTION OBSERVER
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    // Section reveal observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // Skill progress bars observer
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                skillsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    skillBars.forEach(bar => {
        skillsObserver.observe(bar);
    });
}

/* ==========================================================================
   CONTACT FORM VALIDATION & INTERACTIVITY
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('portfolio-contact-form');
    if (!form) return;

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = form.querySelector('.btn-submit');

    // Success popup elements
    const successPopup = document.getElementById('success-popup');
    const successPopupMessage = document.getElementById('success-popup-message');
    const closeX = document.getElementById('success-popup-close-x');
    const closeBtn = document.getElementById('success-popup-close-btn');

    // Input blur dynamic validations
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });

        // Clear error class when typing
        input.addEventListener('input', () => {
            input.parentElement.classList.remove('invalid');
        });
    });

    // Helper functions to open and close success modal
    function openSuccessModal(name) {
        if (successPopup && successPopupMessage) {
            successPopupMessage.textContent = `Thank you, ${name}! Your message has been sent successfully. I will get back to you as soon as possible.`;
            successPopup.classList.add('active');
            document.body.classList.add('overflow-hidden'); // Prevent background scrolling
        }
    }

    function closeSuccessModal() {
        if (successPopup) {
            successPopup.classList.remove('active');
            document.body.classList.remove('overflow-hidden');
        }
    }

    // Event listeners to close the success modal
    if (closeX) closeX.addEventListener('click', closeSuccessModal);
    if (closeBtn) closeBtn.addEventListener('click', closeSuccessModal);
    if (successPopup) {
        successPopup.addEventListener('click', (e) => {
            if (e.target === successPopup) {
                closeSuccessModal();
            }
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate all fields
        const isNameValid = validateInput(nameInput);
        const isEmailValid = validateInput(emailInput);
        const isMessageValid = validateInput(messageInput);

        if (isNameValid && isEmailValid && isMessageValid) {
            // Disable submit button and show loading state
            submitBtn.disabled = true;
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            feedback.className = 'form-feedback';
            feedback.style.display = 'none';

            // Send form data to Formspree via AJAX
            fetch("https://formspree.io/f/mgojpekn", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: nameInput.value,
                    email: emailInput.value,
                    message: messageInput.value
                })
            })
            .then(response => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;

                if (response.ok) {
                    // Open gorgeous success popup message
                    openSuccessModal(nameInput.value);
                    form.reset();
                    feedback.style.display = 'none';
                } else {
                    response.json().then(data => {
                        if (data && data.errors) {
                            feedback.textContent = data.errors.map(error => error.message).join(", ");
                        } else {
                            feedback.textContent = "Oops! There was a problem submitting your form.";
                        }
                        feedback.className = 'form-feedback error';
                        feedback.style.display = 'block';
                    });
                }
            })
            .catch(error => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
                feedback.textContent = "Oops! There was a network error. Please check your connection and try again.";
                feedback.className = 'form-feedback error';
                feedback.style.display = 'block';
            });
        } else {
            feedback.textContent = "Please fill in all fields with valid information.";
            feedback.className = 'form-feedback error';
            feedback.style.display = 'block';
        }
    });

    function validateInput(input) {
        const value = input.value.trim();
        let isValid = true;

        if (value === "") {
            isValid = false;
        } else if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        }

        if (!isValid) {
            input.parentElement.classList.add('invalid');
        } else {
            input.parentElement.classList.remove('invalid');
        }

        return isValid;
    }
}

/* ==========================================================================
   UPTIME COUNTER
   ========================================================================== */

