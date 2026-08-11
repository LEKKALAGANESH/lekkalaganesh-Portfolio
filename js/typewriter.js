// ========== TYPEWRITER EFFECT ==========
(function () {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const roles = [
        'AI/ML Engineer',
        'LLM Application Developer',
        'Conversational AI Engineer',
        'Data Science Engineer'
    ];

    // The span ships with roles[0] already rendered so the title survives no-JS and
    // crawlers. Resume from that text instead of retyping it over itself, which would
    // flash the title away 1.4s after paint.
    let roleIndex = 0;
    let charIndex = el.textContent.trim().length;
    let isDeleting = charIndex > 0;

    const TYPING_SPEED = 80;
    const DELETING_SPEED = 40;
    const PAUSE_AFTER_TYPED = 2000;
    const PAUSE_AFTER_DELETED = 400;

    function type() {
        const currentRole = roles[roleIndex];

        if (!isDeleting) {
            // Typing
            el.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentRole.length) {
                // Finished typing — pause then start deleting
                isDeleting = true;
                setTimeout(type, PAUSE_AFTER_TYPED);
                return;
            }
            setTimeout(type, TYPING_SPEED);
        } else {
            // Deleting
            el.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                // Finished deleting — move to next role
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(type, PAUSE_AFTER_DELETED);
                return;
            }
            setTimeout(type, DELETING_SPEED);
        }
    }

    // Start after hero animations play
    setTimeout(type, 1400);
})();