// ===== JUNTIX LANDING PAGE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function () {
    // === Mobile Menu Toggle ===
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function () {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
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

        // Video starts muted due to autoplay policies, unmute after first interaction
        let hasInteracted = false;

        // Play/Pause functionality
        playPauseBtn.addEventListener('click', () => {
            if (!hasInteracted) {
                heroVideo.muted = false;
                volumeIcon.classList.remove('hidden');
                muteIcon.classList.add('hidden');
                hasInteracted = true;
            }

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

        // Mute/Unmute functionality
        muteBtn.addEventListener('click', () => {
            hasInteracted = true;

            if (heroVideo.muted) {
                heroVideo.muted = false;
                volumeIcon.classList.remove('hidden');
                muteIcon.classList.add('hidden');
            } else {
                heroVideo.muted = true;
                volumeIcon.classList.add('hidden');
                muteIcon.classList.remove('hidden');
            }
        });

        // Update button states when video plays/pauses
        heroVideo.addEventListener('play', () => {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        });

        heroVideo.addEventListener('pause', () => {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        });

        // Initialize button states
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
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // === Scroll Animations ===
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // === Smooth Scroll for Anchor Links ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href !== '#') {
                e.preventDefault();

                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // === Header Background on Scroll ===
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }

        lastScroll = currentScroll;
    });

    // === Counter Animation for Values (optional enhancement) ===
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target.toLocaleString('pt-BR');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start).toLocaleString('pt-BR');
            }
        }, 16);
    }

    // === Preload Images for Better Performance ===
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.dataset.src) {
            const preloadImage = new Image();
            preloadImage.src = img.dataset.src;
            preloadImage.onload = () => {
                img.src = img.dataset.src;
                img.classList.add('loaded');
            };
        }
    });

    // === Click Tracking for CTA Buttons (Analytics Ready) ===
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function () {
            const buttonText = this.textContent.trim();
            const buttonHref = this.getAttribute('href');

            // Log for debugging (can be replaced with actual analytics)
            console.log('CTA Clicked:', {
                text: buttonText,
                href: buttonHref,
                timestamp: new Date().toISOString()
            });
        });
    });

    // === Add Active State to Navigation Based on Scroll Position ===
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // === Initialize First FAQ Item as Open (Optional) ===
    // const firstFaq = document.querySelector('.faq-item');
    // if (firstFaq) {
    //     firstFaq.classList.add('active');
    // }

    console.log('✅ Juntix Landing Page loaded successfully!');
});

// === Utility: Debounce Function for Scroll Events ===
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
