// Particle System - Enhanced with better initialization and debugging
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -1000, y: -1000 };
        this.connectionDistance = 120;
        this.particleCount = window.innerWidth < 768 ? 60 : 100;
        this.isRunning = false;
        
        // Ensure canvas is properly sized
        this.resize();
        this.init();
        this.start();
        
        // Event listeners
        this.setupEventListeners();
        
        console.log('Particle system initialized with', this.particles.length, 'particles');
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            console.log('Mouse:', this.mouse.x, this.mouse.y); // Add this debug line
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
        
        // Reinitialize particles if canvas was resized
        if (this.particles.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.particles = [];
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.6 + 0.4
            });
        }
        console.log('Particles initialized:', this.particles.length);
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
        
        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary collision
            if (particle.x < 0 || particle.x > width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(width, particle.x));
            }
            if (particle.y < 0 || particle.y > height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(height, particle.y));
            }
            
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
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(100, 255, 218, ${particle.opacity})`;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = 'rgba(100, 255, 218, 0.5)';
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
        
        // Draw connections between particles
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.4;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(100, 255, 218, ${opacity})`;
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw mouse connections
        if (this.mouse.x > -500 && this.mouse.y > -500) {
            this.particles.forEach(particle => {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    const opacity = (1 - distance / 200) * 0.6;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.strokeStyle = `rgba(100, 255, 218, ${opacity})`;
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                    this.ctx.lineWidth = 1;
                }
            });
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system when DOM is loaded
let particleSystem;

function initParticleSystem() {
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        particleSystem = new ParticleSystem(canvas);
        console.log('Particle system started successfully');
    } else {
        console.error('Canvas not found!');
    }
}

// Initialize immediately and also on load as backup
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticleSystem);
} else {
    initParticleSystem();
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
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

skillsObserver.observe(document.querySelector('#skills'));

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
