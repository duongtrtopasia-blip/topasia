/* ╔════════════════════════════════════════════╗
   ║  TOP ASIA – ULTRA PREMIUM INTERACTIONS     ║
   ║  Particles · Tilt · Reveal · Counters      ║
   ╚════════════════════════════════════════════╝ */

document.addEventListener('DOMContentLoaded', () => {

    // ═══ PRELOADER ═══
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => preloader.classList.add('hidden'), 1600);
    });
    // Fallback
    setTimeout(() => preloader.classList.add('hidden'), 3000);

    // ═══ CURSOR GLOW ═══
    const glow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
    (function animateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    })();

    // ═══ HEADER ═══
    const header = document.getElementById('header');
    const btt = document.getElementById('btt');
    const bttProgress = btt.querySelector('.btt-progress');
    const circumference = 2 * Math.PI * 21;
    bttProgress.style.strokeDasharray = circumference;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollY / docHeight;

        // Header
        header.classList.toggle('scrolled', scrollY > 60);

        // BTT
        btt.classList.toggle('visible', scrollY > 500);
        const offset = circumference - (scrollPercent * circumference);
        bttProgress.style.strokeDashoffset = offset;
    });

    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ═══ MOBILE MENU ═══
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Mobile dropdown
    document.querySelectorAll('.has-dropdown > .nav-link').forEach(link => {
        link.addEventListener('click', e => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                link.parentElement.classList.toggle('open');
            }
        });
    });

    // Close on nav click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (nav && nav.classList.contains('active') && !link.parentElement.classList.contains('has-dropdown')) {
                if (hamburger) hamburger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // ═══ HERO SLIDER ═══
    const heroBgs = document.querySelectorAll('.hero-bg');
    const sliderDots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    let slideTimer;

    function goSlide(index) {
        if (heroBgs.length === 0) return;
        heroBgs.forEach(bg => bg.classList.remove('active'));
        sliderDots.forEach(d => d.classList.remove('active'));
        currentSlide = ((index % heroBgs.length) + heroBgs.length) % heroBgs.length;
        if (heroBgs[currentSlide]) heroBgs[currentSlide].classList.add('active');
        if (sliderDots[currentSlide]) sliderDots[currentSlide].classList.add('active');
    }

    function startSlider() { 
        if (heroBgs.length > 1) {
            slideTimer = setInterval(() => goSlide(currentSlide + 1), 6000); 
        }
    }
    function resetSlider() { clearInterval(slideTimer); startSlider(); }

    sliderDots.forEach(dot => {
        dot.addEventListener('click', () => {
            goSlide(parseInt(dot.dataset.slide));
            resetSlider();
        });
    });
    if (heroBgs.length > 0) {
        startSlider();
    }

    // ═══ HERO PARTICLES ═══
    const canvas = document.getElementById('heroParticles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 60;

        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.4 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) particles.push(new Particle());

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255,255,255,${0.06 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            connectParticles();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ═══ SCROLL REVEAL ═══
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));

    // ═══ NUMBER COUNTER ═══
    const stats = document.querySelectorAll('.stat-number');
    let hasCounted = false;
    function countUp() {
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-count');
            const count = +stat.innerText;
            const inc = target / 50;
            if (count < target) {
                stat.innerText = Math.ceil(count + inc);
                setTimeout(countUp, 40);
            } else {
                stat.innerText = target;
            }
        });
    }

    // ═══ FAQ ACCORDION ═══
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.nextElementSibling;
            const icon = btn.querySelector('i');
            const isOpen = answer.style.maxHeight !== '0px' && answer.style.maxHeight;
            
            document.querySelectorAll('.faq-answer').forEach(ans => {
                ans.style.maxHeight = '0px';
            });
            document.querySelectorAll('.faq-question i').forEach(i => {
                i.className = 'fas fa-plus';
                i.style.transform = 'rotate(0deg)';
            });

            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.className = 'fas fa-minus';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // ═══ COUNTER ANIMATION ═══
    const statValues = document.querySelectorAll('.stat-value');
    let statsAnimated = false;

    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = 2200;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4); // ease out quartic
            const value = Math.floor(eased * target);
            el.textContent = value.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target.toLocaleString() + suffix;
        }
        requestAnimationFrame(tick);
    }

    const statsSection = document.getElementById('stats');
    if (statsSection) {
        const statsObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    statValues.forEach(el => animateCounter(el));
                }
            });
        }, { threshold: 0.3 });
        statsObs.observe(statsSection);
    }

    // ═══ 3D TILT CARDS ═══
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ═══ SMOOTH SCROLL ═══
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = link.getAttribute('href');
            if (target === '#') return;
            const el = document.querySelector(target);
            if (el) {
                e.preventDefault();
                const headerH = header.offsetHeight;
                window.scrollTo({
                    top: el.getBoundingClientRect().top + window.scrollY - headerH,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ═══ ACTIVE NAV ═══
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 150) current = sec.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
        });
    });

    // ═══ ESC KEY ═══
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    console.log('🏭 Top Asia Ultra Premium – Loaded ✨');
});
