document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling for Navigation
    document.querySelectorAll('.nav-link').forEach(anchor => {
        // Check if the link is an internal section link (starts with '#')
        if (anchor.getAttribute('href').startsWith('#')) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) { // Ensure the target element exists
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }

                // Close mobile nav if open
                if (document.body.classList.contains('nav-open')) {
                    document.body.classList.remove('nav-open');
                }
            });
        }
    });

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) { // Ensure navToggle exists before adding event listener
        navToggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
        });
    }

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        threshold: 0.1 // When 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjust threshold: link becomes active when section is near the top of the viewport
            if (pageYOffset >= sectionTop - window.innerHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Only apply 'active' class to internal navigation links
            if (link.getAttribute('href').startsWith('#')) {
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            }
        });
    });
});