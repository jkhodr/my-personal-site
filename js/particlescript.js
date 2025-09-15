class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -1000, y: -1000 };
        this.connectionDistance = 120;
        this.particleCount = window.innerWidth < 768 ? 60 : 100;
        this.nameChars = 'JOHNATHAN KHODR'; // All uppercase
        this.isRunning = false;

        this.resize();
        this.init();
        this.start();
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        this.ctx.scale(dpr, dpr);

        if (this.particles.length > 0) {
            this.init();
        }
    }

    init() {
        this.particles = [];
        const width = window.innerWidth;
        const height = window.innerHeight;
        const fixedRadius = 2;        // same size as original dots
        const fixedOpacity = 0.3;     // same as original dot opacity

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                radius: fixedRadius,
                opacity: fixedOpacity,
                char: this.nameChars[i % this.nameChars.length]
            });
        }
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    animate() {
        if (!this.isRunning) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        this.ctx.clearRect(0, 0, width, height);

        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Boundary collision
            if (particle.x < 0 || particle.x > width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > height) particle.vy *= -1;

            // Mouse interaction
            if (this.mouse.x > -500 && this.mouse.y > -500) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    particle.vx += dx * force * 0.001;
                    particle.vy += dy * force * 0.001;
                }
            }

            // Draw particle as uniform letter
            this.ctx.font = `bold 10px Inter`; // fixed size, matches hero section font
            this.ctx.fillStyle = `rgba(0,0,0,${particle.opacity})`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(particle.char, particle.x, particle.y);
        });

        // Connections
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(0,0,0,${opacity})`;
                    this.ctx.stroke();
                }
            }
        }

        // Mouse connections
        if (this.mouse.x > -500 && this.mouse.y > -500) {
            this.particles.forEach(particle => {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 200) {
                    const opacity = (1 - distance / 200) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.strokeStyle = `rgba(0,0,0,${opacity})`;
                    this.ctx.stroke();
                }
            });
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize
let particleSystem;
function initParticleSystem() {
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        particleSystem = new ParticleSystem(canvas);
    }
}

// Initialize everything when DOM is ready
function initializeAll() {
    // Initialize particle system
    initParticleSystem();
    
    // Initialize menu toggle
    initMenuToggle();
    
    // Initialize other event listeners
    setupEventListeners();
}

// Smooth scrolling for navigation links
function setupEventListeners() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.section-title, .about-text, .timeline-item').forEach(el => {
        observer.observe(el);
    });

    // Skills animation
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-fill');
                skillBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, 500);
                });
            }
        });
    }, observerOptions);

    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // Timeline item click to expand
    document.querySelectorAll('.timeline-content').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('expanded');
        });
    });

    // Performance optimization - reduce particle count on mobile
    if (window.innerWidth < 768 && particleSystem) {
        particleSystem.particleCount = 50;
        particleSystem.init();
    }
}

// Fixed hamburger menu toggle
function initMenuToggle() {
    const toggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    
    if (toggle && navLinks) {
        // Remove any existing event listeners to prevent duplicates
        toggle.replaceWith(toggle.cloneNode(true));
        const newToggle = document.getElementById("menu-toggle");
        
        newToggle.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Menu toggle clicked"); // Debug log
            navLinks.classList.toggle("active");
        });
        
        // Close menu when clicking on nav links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!newToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
} else {
    initializeAll();
}