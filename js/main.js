// ========== DOM REFERENCES ==========
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinkEls = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// ========== NAVBAR SCROLL EFFECT ==========
let lastScroll = 0;

function handleNavScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    lastScroll = window.scrollY;
}

window.addEventListener('scroll', handleNavScroll, { passive: true });

// ========== MOBILE MENU ==========
// Guarded: a throw here would abort the rest of this file, and the scroll-reveal
// observer below is what makes the page's content visible.
function setMenu(open) {
    navLinks.classList.toggle('open', open);
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    // Locking the page scroll hands the only scroll path to the panel itself,
    // which is why .nav-links carries overflow-y: auto.
    document.body.style.overflow = open ? 'hidden' : '';
}

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));

    navLinkEls.forEach(link => link.addEventListener('click', () => setMenu(false)));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) setMenu(false);
    });
}

// ========== ACTIVE NAV LINK ON SCROLL ==========
const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinkEls.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    },
    {
        rootMargin: '-40% 0px -60% 0px',
        threshold: 0
    }
);

sections.forEach(section => sectionObserver.observe(section));

// ========== SCROLL ANIMATIONS (Intersection Observer) ==========
// The pre-reveal state is CSS-gated on `html.js`, so if anything below fails to
// run, the safe move is to drop that class — content returns to visible rather
// than staying at opacity 0 forever.
const animateElements = document.querySelectorAll('.animate-on-scroll');

function revealAll() {
    document.documentElement.classList.remove('js');
}

if (!('IntersectionObserver' in window)) {
    revealAll();
} else {
    const animationObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    animationObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    animateElements.forEach(el => animationObserver.observe(el));
}

// Last resort: if any element is still unrevealed well after load, show it.
// A reveal animation is an enhancement; the content is the product.
window.addEventListener('load', () => {
    setTimeout(() => {
        const stuck = [...animateElements].filter(el => !el.classList.contains('visible'));
        const allOffscreen = stuck.every(el => el.getBoundingClientRect().top > window.innerHeight);
        if (stuck.length && !allOffscreen) revealAll();
    }, 3000);
});

// ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});