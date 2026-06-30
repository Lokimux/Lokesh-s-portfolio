document.addEventListener('DOMContentLoaded', () => {

    // ================================================================
    //  1. PARTICLE CANVAS — Circuit-board style animated background
    // ================================================================
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: -1000, y: -1000 };
        let animationId;

        function resizeCanvas() {
            const hero = canvas.parentElement;
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.15;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Mouse interaction — subtle push away
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    this.x += (dx / dist) * force * 1.5;
                    this.y += (dy / dist) * force * 1.5;
                }

                // Wrap around edges
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 140) {
                        const opacity = (1 - dist / 140) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawConnections();
            animationId = requestAnimationFrame(animateParticles);
        }

        // Track mouse for particle interaction
        const heroSection = document.getElementById('home');
        if (heroSection) {
            heroSection.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            });
            heroSection.addEventListener('mouseleave', () => {
                mouse.x = -1000;
                mouse.y = -1000;
            });
        }

        resizeCanvas();
        initParticles();
        animateParticles();

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });
    }


    // ================================================================
    //  2. CURSOR GLOW — Follows mouse on hero section
    // ================================================================
    const cursorGlow = document.getElementById('cursor-glow');
    const heroEl = document.getElementById('home');

    if (cursorGlow && heroEl) {
        heroEl.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            cursorGlow.classList.add('visible');
        });

        heroEl.addEventListener('mouseleave', () => {
            cursorGlow.classList.remove('visible');
        });
    }


    // ================================================================
    //  3. TYPEWRITER EFFECT — Hero title
    // ================================================================
    const typedName = document.getElementById('typed-name');
    if (typedName) {
        const nameText = 'Lokesh K';
        let charIndex = 0;

        function typeChar() {
            if (charIndex < nameText.length) {
                typedName.textContent += nameText.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 120);
            }
        }

        // Start typing after hero fade-in (0.6s delay in CSS)
        setTimeout(typeChar, 700);
    }


    // ================================================================
    //  4. SCROLL REVEAL — Directional with stagger
    // ================================================================
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If it's a section title, also trigger the underline
                if (entry.target.classList.contains('section-title')) {
                    entry.target.classList.add('revealed');
                }
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el, index) => {
        // Add stagger delay for siblings
        const parent = el.parentElement;
        if (parent) {
            const siblings = parent.querySelectorAll(':scope > [data-reveal]');
            if (siblings.length > 1) {
                const siblingIndex = Array.from(siblings).indexOf(el);
                el.style.transitionDelay = `${siblingIndex * 0.1}s`;
            }
        }
        revealObserver.observe(el);
    });


    // ================================================================
    //  5. 3D CARD TILT — Project cards
    // ================================================================
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });


    // ================================================================
    //  6. HEADER SCROLL EFFECT — Background solidifies on scroll
    // ================================================================
    const header = document.getElementById('site-header');

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (header) {
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        lastScroll = currentScroll;
    }, { passive: true });


    // ================================================================
    //  7. SMOOTH NAVIGATION — Scrolling & active link
    // ================================================================
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(anchor => {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#')) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
                // Close mobile nav
                document.body.classList.remove('nav-open');
            });
        }
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY + window.innerHeight / 3;
        let current = '';

        sections.forEach(section => {
            if (scrollY >= section.offsetTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.startsWith('#') && href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav(); // Run on load


    // ================================================================
    //  8. MOBILE NAVIGATION
    // ================================================================
    const navToggle = document.getElementById('nav-toggle');
    const navOverlay = document.getElementById('nav-overlay');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', () => {
            document.body.classList.remove('nav-open');
        });
    }


    // ================================================================
    //  9. REDUCED MOTION — Disable canvas and glow
    // ================================================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        // Stop canvas animation
        if (typeof animationId !== 'undefined') {
            cancelAnimationFrame(animationId);
        }
        // Immediately show typed name
        if (typedName) {
            typedName.textContent = 'Lokesh K';
        }
    }
});