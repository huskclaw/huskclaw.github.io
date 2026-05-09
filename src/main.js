document.addEventListener('DOMContentLoaded', () => {
    // ================================================================
    //  DOM REFS
    // ================================================================
    const wheelCanvas = document.getElementById('wheel-canvas');
    const ctx = wheelCanvas.getContext('2d');
    const spinBtn = document.getElementById('spin-button');
    const spinsLeftEl = document.getElementById('spins-left');

    // Candy overlay
    const candyOverlay = document.getElementById('candy-overlay');
    const candyTitle = document.getElementById('candy-title');
    const closeCandyBtn = document.getElementById('close-candy');

    // Gacha overlay (4*/5*)
    const gachaOverlay = document.getElementById('gacha-overlay');
    const meteor = document.getElementById('meteor');
    const meteorPhase = document.getElementById('meteor-phase');
    const silPhase = document.getElementById('silhouette-phase');
    const gachaSil = document.getElementById('gacha-silhouette');
    const revPhase = document.getElementById('reveal-phase');
    const revFlash = document.getElementById('reveal-flash');
    const gachaRev = document.getElementById('gacha-reveal');
    const gachaTitle = document.getElementById('gacha-title');
    const revBadge = document.getElementById('reveal-rarity-badge');
    const closeGachaBtn = document.getElementById('close-gacha');

    // Rickroll
    const rickrollOverlay = document.getElementById('rickroll-overlay');
    const rickrollGif = document.getElementById('rickroll-gif');
    const rickrollAudio = document.getElementById('rickroll-audio');
    const rickrollMsg = document.getElementById('rickroll-message');
    const closeRickrollBtn = document.getElementById('close-rickroll');

    // Audio
    const bgm = document.getElementById('bgm');
    const spinSound = document.getElementById('spin-sound');
    const pullSound = document.getElementById('pull-sound');
    const revealSound = document.getElementById('reveal-sound');

    // ================================================================
    //  STATE
    // ================================================================
    let spinsLeft = 10;
    let currentSpinIndex = 0;
    let isSpinning = false;
    let wheelAngle = 0;          // current resting angle in radians
    let wheelAnimId = null;      // rAF id for the spin animation

    // BGM on first click
    document.body.addEventListener('click', () => {
        if (bgm && bgm.paused) {
            bgm.volume = 0.3;
            bgm.play().catch(() => {});
        }
    }, { once: true });

    // ================================================================
    //  SEQUENCE GENERATOR
    // ================================================================
    const sequence = generateSequence();

    function generateSequence() {
        let seq;
        while (true) {
            const pool = [
                { type: 3, name: 'Candy' },
                { type: 3, name: 'Candy' },
                { type: 3, name: 'Candy' },
                { type: 3, name: 'Candy' },
                { type: 3, name: 'Candy' },
                { type: 3, name: 'Candy' },
                { type: 4, name: 'Keychain', img: 'assets/keychain1.png' },
                { type: 4, name: 'Keychain', img: 'assets/keychain2.png' },
                { type: 4, name: 'Keychain', img: 'assets/keychain3.png' },
            ];
            // Fisher-Yates shuffle
            for (let i = pool.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pool[i], pool[j]] = [pool[j], pool[i]];
            }
            // Validate: no two adjacent 4*
            let ok = true;
            for (let i = 0; i < pool.length - 1; i++) {
                if (pool[i].type === 4 && pool[i + 1].type === 4) { ok = false; break; }
            }
            if (ok) { seq = pool; break; }
        }
        // Spin 10 = Rickroll (wheel visually lands on 5* but it's a prank)
        // Spin 11 = Real 5* Lego
        seq.push({ type: 'rickroll' });
        seq.push({ type: 5, name: 'Lego F1 Car', img: 'assets/lego.png' });
        return seq;
    }

    // ================================================================
    //  WHEEL DRAWING (Canvas)
    // ================================================================
    const SEGMENTS = [
        { label: '★★★★★', color: '#b45309', textColor: '#fef3c7', rarity: 5 },
        { label: '★★★',   color: '#1e40af', textColor: '#bfdbfe', rarity: 3 },
        { label: '★★★★',  color: '#6b21a8', textColor: '#e9d5ff', rarity: 4 },
        { label: '★★★',   color: '#0f766e', textColor: '#ccfbf1', rarity: 3 },
        { label: '★★★★',  color: '#9333ea', textColor: '#f3e8ff', rarity: 4 },
        { label: '★★★',   color: '#1d4ed8', textColor: '#dbeafe', rarity: 3 },
        { label: '★★★★',  color: '#7e22ce', textColor: '#ede9fe', rarity: 4 },
        { label: '★★★',   color: '#0e7490', textColor: '#cffafe', rarity: 3 },
    ];
    const SEGMENT_ARC = (2 * Math.PI) / SEGMENTS.length;

    // Map rarity to segment indices for targeted landing
    const RARITY_SEGMENTS = {
        3: SEGMENTS.map((s, i) => i).filter(i => SEGMENTS[i].rarity === 3), // [1,3,5,7]
        4: SEGMENTS.map((s, i) => i).filter(i => SEGMENTS[i].rarity === 4), // [2,4,6]
        5: SEGMENTS.map((s, i) => i).filter(i => SEGMENTS[i].rarity === 5), // [0]
    };

    function drawWheel(angle) {
        const w = wheelCanvas.width;
        const h = wheelCanvas.height;
        const cx = w / 2, cy = h / 2, r = w / 2 - 2;

        ctx.clearRect(0, 0, w, h);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        for (let i = 0; i < SEGMENTS.length; i++) {
            const startA = i * SEGMENT_ARC;
            const endA = startA + SEGMENT_ARC;

            // Slice
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, r, startA, endA);
            ctx.closePath();
            ctx.fillStyle = SEGMENTS[i].color;
            ctx.fill();

            // Border between slices
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Label
            ctx.save();
            ctx.rotate(startA + SEGMENT_ARC / 2);
            ctx.textAlign = 'center';
            ctx.fillStyle = SEGMENTS[i].textColor;
            ctx.font = 'bold 16px Inter, sans-serif';
            ctx.fillText(SEGMENTS[i].label, r * 0.6, 5);
            ctx.restore();
        }

        // Center circle
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, 2 * Math.PI);
        ctx.fillStyle = '#1e293b';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    drawWheel(wheelAngle);

    // ================================================================
    //  WHEEL SPIN ANIMATION
    // ================================================================

    /**
     * Calculate the final wheel angle so the pointer (at top, -π/2)
     * lands on a segment matching the given rarity.
     */
    function calcTargetAngle(targetRarity) {
        // Pick a random segment of the correct rarity
        const candidates = RARITY_SEGMENTS[targetRarity];
        const segIdx = candidates[Math.floor(Math.random() * candidates.length)];

        // The pointer sits at the top of the wheel = -π/2 in canvas coords.
        // When the wheel is drawn at angle θ, the pointer points at the
        // wheel-local angle (-π/2 - θ).  We want that to land inside segment segIdx.
        //   segIdx * ARC  ≤  (-π/2 - θ) mod 2π  <  (segIdx+1) * ARC
        // Solving for θ:  θ = -π/2 - (segIdx * ARC + offset)   (mod 2π)
        // where 0 < offset < ARC  (random spot inside the segment)
        const offset = SEGMENT_ARC * (0.15 + Math.random() * 0.7); // avoid edges
        let target = -(Math.PI / 2) - (segIdx * SEGMENT_ARC + offset);

        // Normalise to [0, 2π)
        target = ((target % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        return target;
    }

    function spinWheel(targetRarity, callback) {
        const totalDuration = 4000; // ms
        const startAngle = wheelAngle;

        // Figure out where we need to end up (mod 2π)
        const targetMod = calcTargetAngle(targetRarity);

        // Build the total rotation: at least 5 full turns + whatever extra
        // is needed to reach targetMod from the current angle.
        const minFullTurns = 5;
        const baseRotation = minFullTurns * 2 * Math.PI;
        // How much extra past full turns do we need?
        const currentMod = ((startAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        let extra = targetMod - currentMod;
        if (extra <= 0) extra += 2 * Math.PI;
        const totalRotation = baseRotation + extra;

        const startTime = performance.now();

        // Easing: deceleration (cubic ease-out)
        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function animate(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / totalDuration, 1);
            const eased = easeOutCubic(progress);

            wheelAngle = startAngle + totalRotation * eased;
            drawWheel(wheelAngle);

            if (progress < 1) {
                wheelAnimId = requestAnimationFrame(animate);
            } else {
                wheelAnimId = null;
                callback();
            }
        }

        wheelAnimId = requestAnimationFrame(animate);
    }

    // ================================================================
    //  SPIN BUTTON
    // ================================================================
    spinBtn.addEventListener('click', () => {
        if (isSpinning) return;
        if (currentSpinIndex >= sequence.length) return;

        isSpinning = true;
        spinBtn.disabled = true;
        tryPlay(spinSound);

        const result = sequence[currentSpinIndex];
        // For the wheel visual: rickroll lands on 5* segment for the fake-out surprise
        const visualRarity = (result.type === 'rickroll') ? 5 : result.type;

        spinWheel(visualRarity, () => {
            tryPause(spinSound);

            // Decrement counter (not for rickroll)
            if (result.type !== 'rickroll') {
                spinsLeft--;
                if (spinsLeft < 0) spinsLeft = 0;
                spinsLeftEl.textContent = spinsLeft;
            }

            currentSpinIndex++;
            handleResult(result);
        });
    });

    // ================================================================
    //  RESULT HANDLER
    // ================================================================
    function handleResult(result) {
        if (result.type === 'rickroll') {
            triggerRickroll();
        } else if (result.type === 3) {
            triggerCandy(result);
        } else {
            triggerGacha(result);
        }
    }

    // ================================================================
    //  3-STAR CANDY (quick pop)
    // ================================================================
    function triggerCandy(result) {
        candyTitle.textContent = result.name;
        candyOverlay.classList.remove('hidden');
        tryPlay(revealSound);
    }

    closeCandyBtn.addEventListener('click', () => {
        candyOverlay.classList.add('hidden');
        unlockSpin();
    });

    // ================================================================
    //  4-STAR / 5-STAR GACHA ANIMATION
    // ================================================================
    let gachaTimeouts = [];

    function triggerGacha(result) {
        // Reset phases
        clearGachaTimeouts();
        meteorPhase.classList.remove('hidden');
        silPhase.classList.add('hidden');
        revPhase.classList.add('hidden');

        // Reset meteor animation
        meteor.className = '';

        const is5 = result.type === 5;
        const starClass = is5 ? 'animate-5star' : 'animate-4star';
        const silClass = is5 ? 'sil-5star' : 'sil-4star';
        const titleClass = is5 ? 'title-5star' : 'title-4star';
        const badgeClass = is5 ? 'rarity-5' : 'rarity-4';
        const badgeText = is5 ? '★★★★★' : '★★★★';

        // Set images
        gachaSil.src = result.img;
        gachaRev.src = result.img;
        gachaTitle.textContent = result.name;
        gachaTitle.className = titleClass;
        revBadge.className = 'rarity-badge ' + badgeClass;
        revBadge.textContent = badgeText;

        // Show overlay
        gachaOverlay.classList.remove('hidden');
        tryPlay(pullSound);

        // Force reflow so animation restarts
        void meteor.offsetWidth;
        meteor.classList.add(starClass);

        // Phase 2: Silhouette after meteor
        const silDelay = is5 ? 2200 : 1800;
        gachaTimeouts.push(setTimeout(() => {
            meteorPhase.classList.add('hidden');
            gachaSil.className = silClass;
            silPhase.classList.remove('hidden');
        }, silDelay));

        // Phase 3: Reveal after silhouette
        const revDelay = silDelay + 2000;
        gachaTimeouts.push(setTimeout(() => {
            silPhase.classList.add('hidden');

            // Reset flash animation
            revFlash.style.animation = 'none';
            void revFlash.offsetWidth;
            revFlash.style.animation = '';

            // Reset reveal pop animation
            gachaRev.style.animation = 'none';
            void gachaRev.offsetWidth;
            gachaRev.style.animation = '';

            // Reset title animation
            gachaTitle.style.animation = 'none';
            void gachaTitle.offsetWidth;
            gachaTitle.style.animation = '';

            revPhase.classList.remove('hidden');
            tryPlay(revealSound);
        }, revDelay));
    }

    function clearGachaTimeouts() {
        gachaTimeouts.forEach(t => clearTimeout(t));
        gachaTimeouts = [];
    }

    closeGachaBtn.addEventListener('click', () => {
        clearGachaTimeouts();
        gachaOverlay.classList.add('hidden');
        meteorPhase.classList.add('hidden');
        silPhase.classList.add('hidden');
        revPhase.classList.add('hidden');
        meteor.className = '';
        unlockSpin();
    });

    // ================================================================
    //  RICKROLL
    // ================================================================
    const RICKROLL_DURATION_MS = 8000; // audio is 8 seconds

    function triggerRickroll() {
        // Show the rickroll overlay fullscreen
        rickrollOverlay.classList.remove('hidden');
        rickrollMsg.classList.add('hidden');
        tryPause(bgm);

        rickrollGif.src = 'assets/rickroll.gif';
        rickrollAudio.currentTime = 0;
        rickrollAudio.play().catch(() => {});

        // After exactly 8s: hide gif/overlay, show just-kidding popup over main screen
        setTimeout(() => {
            rickrollAudio.pause();
            rickrollAudio.currentTime = 0;
            rickrollGif.src = ''; // stop the gif
            rickrollOverlay.classList.add('hidden');
            rickrollMsg.classList.remove('hidden'); // show over main screen
        }, RICKROLL_DURATION_MS);
    }

    closeRickrollBtn.addEventListener('click', () => {
        rickrollMsg.classList.add('hidden');
        bgm.play().catch(() => {});

        // Grant bonus spin
        spinsLeft = 1;
        spinsLeftEl.textContent = spinsLeft;
        spinsLeftEl.classList.add('golden');
        unlockSpin();
    });

    // ================================================================
    //  HELPERS
    // ================================================================
    function unlockSpin() {
        isSpinning = false;
        spinBtn.disabled = (currentSpinIndex >= sequence.length);
    }

    function tryPlay(audio) {
        if (audio && audio.readyState >= 2) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }
    }

    function tryPause(audio) {
        if (audio && !audio.paused) {
            audio.pause();
        }
    }

    // ================================================================
    //  PARTICLE BACKGROUND
    // ================================================================
    const pCanvas = document.getElementById('particles');
    const pCtx = pCanvas.getContext('2d');
    let particles = [];

    function resizeParticles() {
        pCanvas.width = window.innerWidth;
        pCanvas.height = window.innerHeight;
    }
    resizeParticles();
    window.addEventListener('resize', resizeParticles);

    function createParticle() {
        return {
            x: Math.random() * pCanvas.width,
            y: Math.random() * pCanvas.height,
            r: Math.random() * 1.5 + 0.5,
            dx: (Math.random() - 0.5) * 0.3,
            dy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.5 + 0.2,
            dAlpha: (Math.random() - 0.5) * 0.005,
        };
    }

    for (let i = 0; i < 80; i++) particles.push(createParticle());

    function animateParticles() {
        pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);

        for (const p of particles) {
            p.x += p.dx;
            p.y += p.dy;
            p.alpha += p.dAlpha;
            if (p.alpha <= 0.1 || p.alpha >= 0.7) p.dAlpha *= -1;
            if (p.x < 0) p.x = pCanvas.width;
            if (p.x > pCanvas.width) p.x = 0;
            if (p.y < 0) p.y = pCanvas.height;
            if (p.y > pCanvas.height) p.y = 0;

            pCtx.beginPath();
            pCtx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
            pCtx.fillStyle = `rgba(148, 163, 184, ${p.alpha})`;
            pCtx.fill();
        }

        requestAnimationFrame(animateParticles);
    }
    animateParticles();
});
