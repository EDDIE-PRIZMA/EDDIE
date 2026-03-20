document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursor = document.createElement('div');
    const follower = document.createElement('div');
    cursor.classList.add('custom-cursor');
    follower.classList.add('cursor-follower');
    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Follower with slight delay
        setTimeout(() => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        }, 50);
    });

    // Hover effects for links
    document.querySelectorAll('a, button').forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            follower.style.transform = 'translate(-50%, -50%) scale(2)';
            follower.style.borderColor = 'var(--accent-cyan)';
        });
        link.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.borderColor = 'var(--accent-purple)';
        });
    });

    // Tab switching logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const voiceCards = document.querySelectorAll('.voice-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            voiceCards.forEach(c => c.classList.remove('active'));

            // Add active classes
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 12, 0.95)';
            navbar.style.padding = '1rem 10%';
        } else {
            navbar.style.background = 'rgba(10, 10, 12, 0.8)';
            navbar.style.padding = '1.5rem 10%';
        }
    });

    // Intersection Observer for fade-in effects
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.container').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease-out';
        observer.observe(section);
    });

    // ============ PARALLAX TILT on EDDIE.webp (smooth lerp) ============
    const heroArt = document.querySelector('.hero-art');
    const heroChar = document.querySelector('.hero-character');

    if (heroArt && heroChar) {
        let targetRotateX = 0, targetRotateY = 0;
        let currentRotateX = 0, currentRotateY = 0;
        let isHovering = false;
        const lerpFactor = 0.06; // lower = smoother/slower

        function lerp(a, b, t) {
            return a + (b - a) * t;
        }

        function animateParallax() {
            currentRotateX = lerp(currentRotateX, targetRotateX, lerpFactor);
            currentRotateY = lerp(currentRotateY, targetRotateY, lerpFactor);

            heroChar.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;

            // Keep animating if hovering or if still interpolating
            if (isHovering || Math.abs(currentRotateX - targetRotateX) > 0.01 || Math.abs(currentRotateY - targetRotateY) > 0.01) {
                requestAnimationFrame(animateParallax);
            } else {
                // Fully settled — restore float
                heroChar.style.transform = '';
                heroChar.style.animation = 'float 5s ease-in-out infinite';
            }
        }

        heroArt.addEventListener('mouseenter', () => {
            isHovering = true;
            heroChar.style.animation = 'none';
            requestAnimationFrame(animateParallax);
        });

        heroArt.addEventListener('mousemove', (e) => {
            const rect = heroArt.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            targetRotateY = x * 18;   // max ±9°
            targetRotateX = -y * 14;  // max ±7°
        });

        heroArt.addEventListener('mouseleave', () => {
            isHovering = false;
            targetRotateX = 0;
            targetRotateY = 0;
            // animateParallax will continue running until settled
            requestAnimationFrame(animateParallax);
        });
    }

    // ============ GALLERY LIGHTBOX ============
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxLabel = document.getElementById('lightbox-label');
    const lightboxDownload = document.getElementById('lightbox-download');
    const lightboxClose = document.getElementById('lightbox-close');

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const label = item.querySelector('.gallery-overlay span');
            const src = img.getAttribute('src');

            lightboxImg.src = src;
            lightboxImg.alt = img.alt;
            lightboxLabel.textContent = label ? label.textContent : '';
            lightboxDownload.href = src;

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
});
