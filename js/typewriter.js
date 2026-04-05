// ========== TYPEWRITER EFFECT ==========
(function () {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const roles = [
        'Full-Stack Web Developer',
        'AI Application Developer',
        'Accessible Web Engineer'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

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