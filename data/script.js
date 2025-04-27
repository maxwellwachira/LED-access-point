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

        // Send update to ESP32
        sendUpdateToESP();
    });

    // Update brightness
    brightnessSlider.addEventListener('input', function () {
        updateBrightness(this.value, ledToggle.checked);
    });

    // Send actual update to ESP32 when slider is released
    brightnessSlider.addEventListener('change', function () {
        sendUpdateToESP();
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

    // Function to send updates to ESP32
    function sendUpdateToESP() {
        const state = {
            state: ledToggle.checked,
            brightness: parseInt(brightnessSlider.value)
        };

        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(state)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error updating LED:', error);
                statusLabel.innerHTML = 'Connection error!';
                statusLabel.classList.add('show', 'error');

                setTimeout(() => {
                    statusLabel.classList.remove('show');
                }, 2000);
            });
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

    // Load state from localStorage and from ESP32
    function loadState() {
        // First check local storage
        const savedState = localStorage.getItem('ledControllerState');
        if (savedState) {
            const state = JSON.parse(savedState);
            ledToggle.checked = state.isOn;
            brightnessSlider.value = state.brightness;

            // Trigger change events to update UI
            ledToggle.dispatchEvent(new Event('change', { bubbles: true }));
            brightnessSlider.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Then try to fetch current state from ESP32
        fetch('/status')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Current LED state:', data);
                ledToggle.checked = data.state;
                brightnessSlider.value = data.brightness;

                // Trigger change events to update UI
                ledToggle.dispatchEvent(new Event('change', { bubbles: true }));
                brightnessSlider.dispatchEvent(new Event('input', { bubbles: true }));
            })
            .catch(error => {
                console.warn('Could not fetch LED state from ESP32, using local storage instead:', error);
            });
    }

    // Save state when changed
    ledToggle.addEventListener('change', saveState);
    brightnessSlider.addEventListener('input', saveState);

    // Load saved state on page load
    loadState();
});