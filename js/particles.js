// ========== SECTION-AWARE PARTICLE BACKGROUND ==========
(function () {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');
    let animationId;
    let isMobile = window.innerWidth < 768;
    let time = 0;
    let particles = [];
    let activeSection = 'hero';

    // ── Section IDs in DOM order ──
    const sectionIds = ['hero', 'about', 'skills', 'experience', 'projects', 'education', 'contact'];

    // ── Base counts: [mobile, desktop, 1920+, 2560+/4K] ──
    const COUNTS = {
        hero:       [25, 55, 85, 120],
        about:      [15, 35, 55, 75],
        skills:     [20, 45, 70, 100],
        experience: [18, 40, 60, 85],
        projects:   [20, 50, 80, 110],
        education:  [12, 30, 50, 70],
        contact:    [15, 35, 55, 75]
    };
    function getCount(key) {
        const w = window.innerWidth;
        if (w >= 2560) return COUNTS[key][3];
        if (w >= 1920) return COUNTS[key][2];
        if (w < 768) return COUNTS[key][0];
        return COUNTS[key][1];
    }

    // Scale line distances and particle sizes for large screens
    function getLineDistance(base) {
        const w = window.innerWidth;
        if (w >= 2560) return Math.round(base * 1.8);
        if (w >= 1920) return Math.round(base * 1.4);
        return base;
    }

    function getSizeRange(range) {
        const w = window.innerWidth;
        if (w >= 2560) return [range[0] * 1.6, range[1] * 1.6];
        if (w >= 1920) return [range[0] * 1.25, range[1] * 1.25];
        return range;
    }

    // ── Pattern configs per section ──
    // Each section gets a unique visual personality while staying in the cyan-blue family
    const PATTERNS = {
        hero: {
            color: [0, 212, 255],
            speed: 0.4,
            sizeRange: [1, 2.5],
            lines: true,
            lineDistance: 150,
            lineOpacity: 0.12,
            movement: 'network'
        },
        about: {
            color: [0, 200, 240],
            speed: 0.2,
            sizeRange: [1.5, 4],
            lines: false,
            lineDistance: 0,
            lineOpacity: 0,
            movement: 'breathe'
        },
        skills: {
            color: [0, 235, 210],
            speed: 0.5,
            sizeRange: [0.8, 1.8],
            lines: true,
            lineDistance: 100,
            lineOpacity: 0.08,
            movement: 'matrix'
        },
        experience: {
            color: [80, 200, 255],
            speed: 0.5,
            sizeRange: [1, 3],
            lines: false,
            lineDistance: 0,
            lineOpacity: 0,
            movement: 'rise'
        },
        projects: {
            color: [120, 180, 255],
            speed: 0.1,
            sizeRange: [0.5, 3],
            lines: true,
            lineDistance: 180,
            lineOpacity: 0.06,
            movement: 'constellation'
        },
        education: {
            color: [150, 160, 255],
            speed: 0.4,
            sizeRange: [1, 3],
            lines: false,
            lineDistance: 0,
            lineOpacity: 0,
            movement: 'orbit'
        },
        contact: {
            color: [0, 255, 210],
            speed: 0.3,
            sizeRange: [1.5, 3.5],
            lines: false,
            lineDistance: 0,
            lineOpacity: 0,
            movement: 'firefly'
        }
    };

    // ── Smooth color transition ──
    let currentColor = [...PATTERNS.hero.color];
    let targetColor = [...PATTERNS.hero.color];

    function lerpColor() {
        for (let i = 0; i < 3; i++) {
            currentColor[i] += (targetColor[i] - currentColor[i]) * 0.02;
        }
    }

    // ── Resize ──
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // ── Particle factory ──
    function makeParticle(cfg) {
        const sr = getSizeRange(cfg.sizeRange);
        const orbitScale = window.innerWidth >= 2560 ? 2 : window.innerWidth >= 1920 ? 1.5 : 1;
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * cfg.speed,
            vy: (Math.random() - 0.5) * cfg.speed,
            size: sr[0] + Math.random() * (sr[1] - sr[0]),
            baseSize: sr[0] + Math.random() * (sr[1] - sr[0]),
            opacity: 0.3 + Math.random() * 0.5,
            baseOpacity: 0.3 + Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2,
            // Orbit properties
            orbitCX: Math.random() * canvas.width,
            orbitCY: Math.random() * canvas.height,
            orbitR: (40 + Math.random() * 120) * orbitScale,
            orbitSpeed: 0.004 + Math.random() * 0.012,
            angle: Math.random() * Math.PI * 2
        };
    }

    function createParticles(sectionKey) {
        const cfg = PATTERNS[sectionKey];
        const count = getCount(sectionKey);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(makeParticle(cfg));
        }
    }

    // ── Smoothly adjust particle count & properties on section change ──
    function transitionTo(sectionKey) {
        const cfg = PATTERNS[sectionKey];
        const count = getCount(sectionKey);
        targetColor = [...cfg.color];

        // Match particle count
        while (particles.length < count) {
            particles.push(makeParticle(cfg));
        }
        while (particles.length > count) {
            particles.pop();
        }

        // Update properties but keep positions for smooth flow
        for (const p of particles) {
            p.baseSize = cfg.sizeRange[0] + Math.random() * (cfg.sizeRange[1] - cfg.sizeRange[0]);
            p.baseOpacity = 0.3 + Math.random() * 0.5;
            const dir = Math.atan2(p.vy, p.vx);
            p.vx = Math.cos(dir) * cfg.speed;
            p.vy = Math.sin(dir) * cfg.speed;
        }
    }

    // ── Movement behaviours ──
    function moveNetwork(p) {
        p.x += p.vx;
        p.y += p.vy;
    }

    function moveBreathe(p) {
        p.x += p.vx;
        p.y += p.vy + Math.sin(time * 0.5 + p.phase) * 0.15;
        p.size = p.baseSize + Math.sin(time * 2 + p.phase) * 0.8;
        p.opacity = p.baseOpacity + Math.sin(time * 1.5 + p.phase) * 0.15;
    }

    function moveMatrix(p) {
        p.x += Math.sin(time * 0.8 + p.phase) * 0.15;
        p.y += Math.abs(p.vy) * 0.6 + 0.25;
        if (p.y > canvas.height + 10) {
            p.y = -10;
            p.x = Math.random() * canvas.width;
        }
    }

    function moveRise(p) {
        p.x += Math.sin(time * 0.4 + p.phase) * 0.3;
        p.y -= Math.abs(p.vy) * 0.6 + 0.2;
        p.opacity = p.baseOpacity * Math.max(0.1, p.y / canvas.height);
        if (p.y < -10) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
            p.opacity = p.baseOpacity;
        }
    }

    function moveConstellation(p) {
        p.x += p.vx * 0.25;
        p.y += p.vy * 0.25;
        p.opacity = p.baseOpacity * (0.4 + 0.6 * Math.sin(time * 3 + p.phase));
        p.size = p.baseSize * (0.7 + 0.3 * Math.sin(time * 2 + p.phase));
    }

    function moveOrbit(p) {
        p.angle += p.orbitSpeed;
        p.x = p.orbitCX + Math.cos(p.angle) * p.orbitR;
        p.y = p.orbitCY + Math.sin(p.angle) * p.orbitR * 0.6;
        p.opacity = p.baseOpacity * (0.6 + 0.4 * Math.sin(p.angle * 2));
        // Gently drift orbit centers
        p.orbitCX += Math.sin(time * 0.1 + p.phase) * 0.05;
        p.orbitCY += Math.cos(time * 0.1 + p.phase) * 0.05;
    }

    function moveFirefly(p) {
        p.vx += (Math.random() - 0.5) * 0.06;
        p.vy += (Math.random() - 0.5) * 0.06;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        p.opacity = p.baseOpacity * (0.3 + 0.7 * Math.sin(time * 2.5 + p.phase));
    }

    const moveFns = {
        network: moveNetwork,
        breathe: moveBreathe,
        matrix: moveMatrix,
        rise: moveRise,
        constellation: moveConstellation,
        orbit: moveOrbit,
        firefly: moveFirefly
    };

    // ── Wrap edges (used by most patterns) ──
    function wrapEdges(p) {
        if (p.x < -15) p.x = canvas.width + 15;
        if (p.x > canvas.width + 15) p.x = -15;
        if (p.y < -15) p.y = canvas.height + 15;
        if (p.y > canvas.height + 15) p.y = -15;
    }

    // Patterns that handle their own boundary logic
    const selfBoundary = { matrix: 1, rise: 1 };

    // ── Main draw loop ──
    function draw() {
        time += 0.016;
        lerpColor();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cfg = PATTERNS[activeSection];
        const c = currentColor;
        const moveFn = moveFns[cfg.movement];

        // ── Draw connecting lines ──
        if (cfg.lines) {
            const ld = getLineDistance(cfg.lineDistance);
            const lw = window.innerWidth >= 2560 ? 1 : window.innerWidth >= 1920 ? 0.75 : 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < ld) {
                        const alpha = cfg.lineOpacity * (1 - dist / ld);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${alpha})`;
                        ctx.lineWidth = lw;
                        ctx.stroke();
                    }
                }
            }
        }

        // ── Update & draw particles ──
        for (const p of particles) {
            moveFn(p);

            if (!selfBoundary[cfg.movement]) {
                wrapEdges(p);
            }

            const s = Math.max(0.5, p.size);
            const o = Math.max(0, Math.min(1, p.opacity));

            // Glow effect for firefly & breathe
            if (cfg.movement === 'firefly' || cfg.movement === 'breathe') {
                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, s * 4);
                grad.addColorStop(0, `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${o * 0.25})`);
                grad.addColorStop(1, `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},0)`);
                ctx.beginPath();
                ctx.arc(p.x, p.y, s * 4, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            }

            // Trail for rising particles
            if (cfg.movement === 'rise') {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x - p.vx * 4, p.y + 8);
                ctx.strokeStyle = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${o * 0.15})`;
                ctx.lineWidth = s * 0.8;
                ctx.stroke();
            }

            // Core dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${o})`;
            ctx.fill();
        }

        animationId = requestAnimationFrame(draw);
    }

    // ── IntersectionObserver: detect which section is most visible ──
    function setupObserver() {
        const ratios = {};

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(e => { ratios[e.target.id] = e.intersectionRatio; });

                let best = activeSection;
                let max = 0;
                for (const id of sectionIds) {
                    if ((ratios[id] || 0) > max) {
                        max = ratios[id];
                        best = id;
                    }
                }

                if (best !== activeSection && PATTERNS[best]) {
                    activeSection = best;
                    transitionTo(best);
                }
            },
            { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
        );

        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
    }

    // ── Init ──
    resize();
    createParticles('hero');
    setupObserver();
    draw();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            isMobile = window.innerWidth < 768;
            resize();
            createParticles(activeSection);
        }, 200);
    });
})();
