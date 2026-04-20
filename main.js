document.addEventListener('DOMContentLoaded', function(){
    // Typed.js for dynamic role text
    const typedTarget = document.querySelector('.text');
    if (typedTarget && typeof Typed !== 'undefined') {
        new Typed('.text', {
            strings: ['Ethical Hacker', 'Web Developer', 'Penetration Tester', 'Bug Hunter', 'Freelancer'],
            typeSpeed: 90,
            backSpeed: 60,
            backDelay: 1200,
            loop: true
        });
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const header = document.querySelector('.header');
    const navbar = document.querySelector('.navbar');
    
    // Ensure menu starts closed
    if(menuToggle){
        menuToggle.setAttribute('aria-expanded', 'false');
    }
    if(header){
        header.classList.remove('open');
    }
    
    if(menuToggle && header){
        menuToggle.addEventListener('click', function(e){
            e.stopPropagation();
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!expanded));
            header.classList.toggle('open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e){
            if(header.classList.contains('open') && 
               !header.contains(e.target) && 
               e.target !== menuToggle){
                menuToggle.setAttribute('aria-expanded', 'false');
                header.classList.remove('open');
            }
        });
    }
    
    // Close menu when a navigation link is clicked
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(){
            if(menuToggle && header.classList.contains('open')){
                menuToggle.setAttribute('aria-expanded', 'false');
                header.classList.remove('open');
            }
        });
    });
    // Scroll-hide header: hide on scroll down, show on scroll up
    let lastScroll = 0;
    window.addEventListener('scroll', function(){
        const currentScroll = window.pageYOffset;
        if(currentScroll > lastScroll && currentScroll > 100){
            // scrolling down & past threshold
            header.classList.add('hide');
        } else {
            // scrolling up
            header.classList.remove('hide');
        }
        lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    });

    // Theme toggle (persisted)
    const themeToggle = document.getElementById('theme-toggle');
    const saved = localStorage.getItem('theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const initial = saved || (prefersLight ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', initial);
    if(themeToggle){
        themeToggle.addEventListener('click', function(){
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            this.classList.toggle('active', next === 'light');
        });
    }

    // Scroll reveal using IntersectionObserver for elements with .reveal
    const io = new IntersectionObserver((entries)=>{
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('active');
                io.unobserve(entry.target);
            }
        });
    }, {threshold: 0.12});
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // Proper lazy-loading for images using IntersectionObserver
    const lazyImages = document.querySelectorAll('img[data-src]');
    if('IntersectionObserver' in window){
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if(src){
                        img.setAttribute('src', src);
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, { rootMargin: '50px' });
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            const src = img.getAttribute('data-src');
            if(src) img.setAttribute('src', src);
        });
    }

    // Video optimization: disable autoplay and remove videos on slow connections or mobile
    const videos = document.querySelectorAll('.background-video');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSlowConnection = navigator.connection && 
                              (navigator.connection.effectiveType === '3g' || 
                               navigator.connection.effectiveType === '4g');
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if(prefersReducedMotion || isMobileDevice || isSlowConnection){
        videos.forEach(video => {
            video.remove(); // Completely remove video elements on mobile/slow connections
        });
    } else {
        // On desktop/fast connections, still disable autoplay if needed
        videos.forEach(video => {
            video.autoplay = false;
            video.pause();
        });
    }

    // Skills progress bar animation
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItems = entry.target.querySelectorAll('.skill-item');
                skillItems.forEach((item, index) => {
                    setTimeout(() => {
                        const progress = item.querySelector('.progress');
                        const percentage = item.querySelector('.percentage').textContent;
                        const width = percentage.replace('%', '');
                        progress.style.setProperty('--progress-width', width + '%');
                        progress.style.animationPlayState = 'running';
                    }, index * 200);
                });
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // Hide header on scroll down, show on scroll up
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 70) {
            // Scrolling down - hide header
            header.classList.add('header-hidden');
        } else {
            // Scrolling up - show header
            header.classList.remove('header-hidden');
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // Contact form validation
    const contactForm = document.getElementById('contactForm');
    if(contactForm){
        contactForm.addEventListener('submit', function(e){
            e.preventDefault();
            let valid = true;
            const fields = ['name','email','message'];
            fields.forEach(id => {
                const input = document.getElementById(id);
                const error = input.nextElementSibling;
                if(!input.checkValidity()){
                    valid = false;
                    if(input.validity.valueMissing){
                        error.textContent = 'This field is required';
                    } else if(input.validity.typeMismatch){
                        error.textContent = 'Please enter a valid value';
                    } else {
                        error.textContent = 'Invalid input';
                    }
                } else {
                    error.textContent = '';
                }
            });
            if(valid){
                // simulate submission
                alert('Thank you for your message, we will get back to you soon.');
                contactForm.reset();
            }
        });
    }

    // Cursor follower animation with throttling for better performance
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if(cursorFollower && !isMobileDevice) {
        let mouseX = 0;
        let mouseY = 0;
        let ticking = false;

        function updateCursorFollower() {
            cursorFollower.style.transform = `translate3d(${mouseX - 15}px, ${mouseY - 15}px, 0)`;
            ticking = false;
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!ticking) {
                requestAnimationFrame(updateCursorFollower);
                ticking = true;
            }
        });

        // Hide cursor follower when mouse leaves window
        document.addEventListener('mouseleave', () => {
            cursorFollower.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursorFollower.style.opacity = '1';
        });
    } else if (cursorFollower) {
        // Hide cursor follower on mobile
        cursorFollower.style.display = 'none';
    }
});

