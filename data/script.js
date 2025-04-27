document.addEventListener('DOMContentLoaded', function () {
    const ledToggle = document.getElementById('led-toggle');
    const brightnessSlider = document.getElementById('brightness-slider');
    const brightnessControl = document.getElementById('brightness-control');
    const brightnessValue = document.getElementById('brightness-value');
    const rangeProgress = document.getElementById('range-progress');
    const ledIcon = document.getElementById('led-icon');
    const container = document.getElementById('container');
    const statusLabel = document.getElementById('status-label');
    const ledRays = document.getElementById('led-rays');
    const particles = document.getElementById('particles');

    // Create particles
    for (let i = 0; i < 50; i++) {
        createParticle();
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 5 + 1;
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        const speed = Math.random() * 1 + 0.5;
        const delay = Math.random() * 5;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.opacity = Math.random() * 0.5 + 0.3;

        particles.appendChild(particle);

        animateParticle(particle, speed, delay);
    }

    function animateParticle(particle, speed, delay) {
        setTimeout(() => {
            particle.style.transition = `transform ${5 / speed}s linear, opacity 1s ease`;
            particle.style.transform = `translateY(-${window.innerHeight}px)`;
            particle.style.opacity = '0';

            setTimeout(() => {
                particle.style.transition = 'none';
                particle.style.transform = 'translateY(0)';

                const posX = Math.random() * window.innerWidth;
                particle.style.left = `${posX}px`;
                particle.style.top = `${window.innerHeight}px`;
                particle.style.opacity = Math.random() * 0.5 + 0.3;

                animateParticle(particle, speed, 0);
            }, (5 / speed) * 1000);
        }, delay * 1000);
    }

    // 3D Hover effect
    // document.addEventListener('mousemove', function (e) {
    //     if (!ledToggle.checked) return;

    //     const containerRect = container.getBoundingClientRect();
    //     const containerCenterX = containerRect.left + containerRect.width / 2;
    //     const containerCenterY = containerRect.top + containerRect.height / 2;

    //     const mouseX = e.clientX;
    //     const mouseY = e.clientY;

    //     const angleX = (mouseY - containerCenterY) / (containerRect.height / 2) * 10;
    //     const angleY = (containerCenterX - mouseX) / (containerRect.width / 2) * 10;

    //     container.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
    // });

    // Reset transform when mouse leaves
    container.addEventListener('mouseleave', function () {
        container.style.transform = 'rotateX(10deg) rotateY(0)';
    });

    // Toggle LED state
    ledToggle.addEventListener('change', function () {
        const isOn = this.checked;

        // Show status label
        statusLabel.innerHTML = `
            <svg class="icon-power" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                <line x1="12" y1="2" x2="12" y2="12"></line>
            </svg>
            <span>LED is ${isOn ? 'ON' : 'OFF'}</span>
        `;
        statusLabel.classList.add('show');
        statusLabel.classList.toggle('on', isOn);
        statusLabel.classList.toggle('off', !isOn);

        // Add/remove active classes
        document.body.classList.toggle('led-on', isOn);
        brightnessControl.classList.toggle('active', isOn);
        container.classList.toggle('active', isOn);
        particles.classList.toggle('active', isOn);

        // Update brightness
        updateBrightness(brightnessSlider.value, isOn);

        // Hide status label after delay
        setTimeout(() => {
            statusLabel.classList.remove('show');
        }, 2000);
    });

    // Update brightness
    brightnessSlider.addEventListener('input', function () {
        updateBrightness(this.value, ledToggle.checked);
    });

    function updateBrightness(value, isOn) {
        if (!isOn) return;

        const brightness = value / 100;
        brightnessValue.textContent = `${value}%`;
        rangeProgress.style.width = `${value}%`;

        // Update LED glow intensity
        document.documentElement.style.setProperty('--brightness', brightness);

        // Adjust LED glow size based on brightness
        const glowSize = 10 + (brightness * 30);
        document.documentElement.style.setProperty('--glow-size', `${glowSize}px`);

        // Adjust ray length based on brightness
        const rayScale = 0.5 + (brightness * 0.5);
        ledRays.style.transform = `scale(${rayScale})`;

        // Update particle speed based on brightness
        document.documentElement.style.setProperty('--particle-speed', `${5 - (brightness * 3)}s`);
    }

    // Initialize brightness on page load
    updateBrightness(brightnessSlider.value, ledToggle.checked);

    // Handle window resize for particles
    window.addEventListener('resize', function () {
        // Remove all particles
        while (particles.firstChild) {
            particles.removeChild(particles.firstChild);
        }

        // Recreate particles for new window size
        for (let i = 0; i < 50; i++) {
            createParticle();
        }
    });

    // Save state to localStorage
    function saveState() {
        const state = {
            isOn: ledToggle.checked,
            brightness: brightnessSlider.value
        };
        localStorage.setItem('ledControllerState', JSON.stringify(state));
    }

    // Load state from localStorage
    function loadState() {
        const savedState = localStorage.getItem('ledControllerState');
        if (savedState) {
            const state = JSON.parse(savedState);
            ledToggle.checked = state.isOn;
            brightnessSlider.value = state.brightness;

            // Trigger change events to update UI
            ledToggle.dispatchEvent(new Event('change'));
            brightnessSlider.dispatchEvent(new Event('input'));
        }
    }

    // Save state when changed
    ledToggle.addEventListener('change', saveState);
    brightnessSlider.addEventListener('input', saveState);

    // Load saved state on page load
    loadState();
});