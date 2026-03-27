// ===== JUNTIX LANDING PAGE - PREMIUM JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function () {

    // === Cursor Glow Effect (Desktop only) ===
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow && window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }

    // === Mobile Menu Toggle ===
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function () {
            const isOpen = this.classList.toggle('active');
            navLinks.classList.toggle('active');
            this.setAttribute('aria-expanded', isOpen);
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // === Hero Video Controls ===
    const heroVideo = document.getElementById('heroVideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteBtn = document.getElementById('muteBtn');

    if (heroVideo && playPauseBtn && muteBtn) {
        const playIcon = playPauseBtn.querySelector('.play-icon');
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');
        const volumeIcon = muteBtn.querySelector('.volume-icon');
        const muteIcon = muteBtn.querySelector('.mute-icon');

        // Try to play with sound; browsers may block unmuted autoplay
        heroVideo.muted = false;
        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Browser blocked unmuted autoplay, fallback to muted
                heroVideo.muted = true;
                heroVideo.play();
                volumeIcon.classList.add('hidden');
                muteIcon.classList.remove('hidden');
            });
        }

        playPauseBtn.addEventListener('click', () => {
            if (heroVideo.paused) {
                heroVideo.play();
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
            } else {
                heroVideo.pause();
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
            }
        });

        muteBtn.addEventListener('click', () => {
            hasInteracted = true;
            heroVideo.muted = !heroVideo.muted;
            volumeIcon.classList.toggle('hidden', heroVideo.muted);
            muteIcon.classList.toggle('hidden', !heroVideo.muted);
        });

        heroVideo.addEventListener('play', () => {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        });

        heroVideo.addEventListener('pause', () => {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        });

        if (!heroVideo.paused) {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        }

        if (heroVideo.muted) {
            volumeIcon.classList.add('hidden');
            muteIcon.classList.remove('hidden');
        }
    }

    // === FAQ Accordion ===
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(other => {
                if (other !== item && other.classList.contains('active')) {
                    other.classList.remove('active');
                    other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            item.classList.toggle('active');
            question.setAttribute('aria-expanded', !isActive);
        });
    });

    // === Scroll Reveal Animations ===
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // === Header Scroll Effect ===
    const header = document.querySelector('.header');
    let lastScrollY = 0;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    // === Smooth Scroll for Anchor Links ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // === Active Navigation Tracking ===
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a:not(.btn)');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinksAll.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(section => navObserver.observe(section));

    // === Counter Animation ===
    function animateCounter(element, target, prefix, suffix, duration) {
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (target - start) * eased);

            element.textContent = (prefix || '') + current.toLocaleString('pt-BR') + (suffix || '');

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // Observe counter elements
    const counterElements = document.querySelectorAll('.counter-value');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target) || 0;
                const prefix = el.dataset.prefix || '';
                const suffix = el.dataset.suffix || '';
                animateCounter(el, target, prefix, suffix, 2000);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));

    // === Parallax Effect for Hero Orbs ===
    if (window.innerWidth > 768) {
        const orbs = document.querySelectorAll('.hero-orb');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                orbs.forEach((orb, i) => {
                    const speed = 0.15 + (i * 0.05);
                    orb.style.transform = `translateY(${scrollY * speed}px)`;
                });
            }
        }, { passive: true });
    }

    // === Platform Cards Tilt Effect (Desktop) ===
    if (window.innerWidth > 1024) {
        const platformCards = document.querySelectorAll('.platform-card');

        platformCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -3;
                const rotateY = (x - centerX) / centerX * 3;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // === Button Magnetic Effect (Desktop) ===
    if (window.innerWidth > 1024) {
        const magneticBtns = document.querySelectorAll('.btn-glow, .btn-gold');

        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15 - 2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // === Number Cards Counting on Scroll ===
    const numberValues = document.querySelectorAll('.number-value');
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                const prefix = el.dataset.prefix || '';
                const suffix = el.dataset.suffix || '';

                if (target === 0) {
                    animateCounter(el, 0, prefix, suffix, 800);
                } else {
                    animateCounter(el, target, prefix, suffix, 1800);
                }

                numberObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    numberValues.forEach(el => numberObserver.observe(el));

    // === Testimonials Carousel ===
    const track = document.getElementById('testimonialsTrack');
    const dotsContainer = document.getElementById('testimonialsDots');
    const counterEl = document.getElementById('testimonialCounter');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');

    if (track && dotsContainer) {
        const cards = track.querySelectorAll('.testimonial-card');
        const total = cards.length;
        let current = 0;
        let autoTimer;

        // Build dots
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Depoimento ' + (i + 1));
            dot.addEventListener('click', () => { goTo(i); restartAuto(); });
            dotsContainer.appendChild(dot);
        }

        function goTo(index) {
            current = ((index % total) + total) % total;
            track.style.transform = 'translateX(-' + (current * 100) + '%)';

            dotsContainer.querySelectorAll('.testimonial-dot').forEach((d, i) => {
                d.classList.toggle('active', i === current);
            });

            if (counterEl) {
                counterEl.textContent = (current + 1) + ' / ' + total;
            }
        }

        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        function startAuto() { autoTimer = setInterval(next, 5000); }
        function stopAuto() { clearInterval(autoTimer); }
        function restartAuto() { stopAuto(); startAuto(); }

        if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restartAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { next(); restartAuto(); });

        // Touch swipe
        let touchStartX = 0;
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            stopAuto();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
            startAuto();
        }, { passive: true });

        startAuto();
    }

    // === CTA Click Tracking ===
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function () {
            const text = this.textContent.trim();
            const href = this.getAttribute('href');

            if (typeof gtag === 'function') {
                gtag('event', 'cta_click', {
                    button_text: text,
                    button_href: href
                });
            }
        });
    });

    // === Preload Critical Images ===
    const criticalImages = ['logo/caixa.png', 'logo/jornada.png', 'logo/resumo_pay.png', 'logo/pay.png'];
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = src;
        document.head.appendChild(link);
    });

});
