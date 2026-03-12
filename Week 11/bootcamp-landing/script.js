document.addEventListener('DOMContentLoaded', () => {

    /* --- Navbar Scroll Effect --- */
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- Mobile Menu Toggle --- */
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileClose = document.getElementById('mobile-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    mobileToggle.addEventListener('click', toggleMenu);
    mobileClose.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    /* --- Parallax Effect for Hero Background --- */
    const heroBg = document.getElementById('parallax-bg');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        // Move the background image slightly on scroll (parallax)
        if (heroBg && scrolled < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });

    /* --- Scroll Reveal Animations --- */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* --- Form Submission (Prevent Default for Demo) --- */
    const form = document.querySelector('.lead-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            
            // Simple visual feedback
            btn.textContent = 'Application Sent!';
            btn.classList.add('bg-success'); // Assuming a class exists or handles styling
            btn.style.background = 'var(--success)';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                form.reset();
            }, 3000);
        });
    }

});
