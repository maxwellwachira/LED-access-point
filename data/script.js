document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('container');
    const statusLabel = document.getElementById('status-label');
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

    // 3D tilt effect for container
    if (container) {
        container.addEventListener('mousemove', function (e) {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            container.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
    }

    // Define all the pins we need to create
    const pinsList = [
        { id: 'LED', type: 'led', icon: 'bulb', endpoint: '/led' },
        { id: 'D1', type: 'digital', icon: 'chip', endpoint: '/digital' },
        { id: 'D2', type: 'digital', icon: 'chip', endpoint: '/digital' },
        { id: 'D3', type: 'digital', icon: 'chip', endpoint: '/digital' },
        { id: 'D4', type: 'digital', icon: 'chip', endpoint: '/digital' },
        { id: 'D5', type: 'digital', icon: 'chip', endpoint: '/digital' },
        { id: 'D6', type: 'digital', icon: 'chip', endpoint: '/digital' },
        { id: 'D7', type: 'digital', icon: 'chip', endpoint: '/digital' },
        { id: 'D8', type: 'digital', icon: 'chip', endpoint: '/digital' },
        { id: 'LASER-12V', type: 'laser-12v', icon: 'zap', endpoint: '/laser' },
        { id: 'LASER-5V', type: 'laser-5v', icon: 'zap', endpoint: '/laser' },
        { id: 'FAN', type: 'fan', icon: 'fan', endpoint: '/fan' }
    ];

    // Create pin cards
    const pinsGrid = document.getElementById('pins-grid');
    if (pinsGrid) {
        createPinCards(pinsList);
    }

    function getIconSvg(iconName) {
        const icons = {
            'chip': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pin-icon">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                <rect x="9" y="9" width="6" height="6"></rect>
                <line x1="9" y1="2" x2="9" y2="4"></line>
                <line x1="15" y1="2" x2="15" y2="4"></line>
                <line x1="9" y1="20" x2="9" y2="22"></line>
                <line x1="15" y1="20" x2="15" y2="22"></line>
                <line x1="2" y1="9" x2="4" y2="9"></line>
                <line x1="2" y1="15" x2="4" y2="15"></line>
                <line x1="20" y1="9" x2="22" y2="9"></line>
                <line x1="20" y1="15" x2="22" y2="15"></line>
            </svg>`,
            'zap': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pin-icon">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>`,
            'fan': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pin-icon">
                <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M15.32 15.32c-1.34 1.32 -2.12 1.89 -3.32 1.89c-2.1 0 -3.07 -.77 -3.77 -2.21l-2.08 -4.25a.3 .3 0 0 1 .25 -.48h7.19c3.04 0 4.12 1.46 4.16 3.05c.04 1.6 -.49 2.86 -2.43 2z"></path>
                <path d="M12.89 3.42c1.33 -.15 2.42 .17 3.11 1.09c1.25 1.64 1.15 2.88 .71 4.28l-1.32 4.25a.3 .3 0 0 1 -.5 .16l-5.08 -5.08c-2.15 -2.15 -2.3 -3.93 -1.5 -5.28c.8 -1.35 2.09 -1.73 3.11 -1.59"></path>
                <path d="M3.28 12.46c-.15 -1.33 .17 -2.42 1.09 -3.11c1.64 -1.25 2.88 -1.15 4.28 -.71l4.25 1.32a.3 .3 0 0 1 .16 .5l-5.08 5.08c-2.15 2.15 -3.93 2.3 -5.28 1.5c-1.35 -.8 -1.73 -2.09 -1.59 -3.11"></path>
            </svg>`,
            'bulb': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pin-icon">
                <path d="M9 18h6"></path>
                <path d="M10 22h4"></path>
                <path d="M12 2v5"></path>
                <path d="M12 8a4 4 0 0 1 0 8"></path>
                <path d="M12 8a4 4 0 1 0 0 8"></path>
            </svg>`
        };

        return icons[iconName] || icons['chip'];
    }

    function createPinCards(pins) {
        pins.forEach(pin => {
            // Create card element
            const card = document.createElement('div');
            card.className = `pin-card ${pin.type}`;
            card.id = `card-${pin.id.toLowerCase()}`;

            // Create pin indicator
            const indicator = document.createElement('div');
            indicator.className = 'pin-indicator';

            // Create header with title and toggle
            const header = document.createElement('div');
            header.className = 'pin-header';

            const title = document.createElement('div');
            title.className = 'pin-title';
            title.innerHTML = `${getIconSvg(pin.icon)} ${pin.id}`;

            const toggleContainer = document.createElement('div');
            toggleContainer.className = 'toggle-container';

            const toggleLabel = document.createElement('span');
            toggleLabel.className = 'toggle-label';
            toggleLabel.textContent = '';

            const toggle = document.createElement('label');
            toggle.className = 'toggle';

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = `toggle-${pin.id.toLowerCase()}`;

            const slider = document.createElement('span');
            slider.className = 'slider';

            toggle.appendChild(input);
            toggle.appendChild(slider);

            toggleContainer.appendChild(toggleLabel);
            toggleContainer.appendChild(toggle);

            header.appendChild(title);
            header.appendChild(toggleContainer);

            // Create intensity control
            const intensityControl = document.createElement('div');
            intensityControl.className = 'brightness-control';
            intensityControl.id = `intensity-control-${pin.id.toLowerCase()}`;

            const intensityHeader = document.createElement('div');
            intensityHeader.className = 'brightness-header';

            const intensityLabel = document.createElement('span');
            intensityLabel.className = 'toggle-label';
            intensityLabel.textContent = 'Level';

            const intensityValueSpan = document.createElement('span');
            intensityValueSpan.className = 'brightness-value';
            intensityValueSpan.id = `intensity-value-${pin.id.toLowerCase()}`;
            intensityValueSpan.textContent = '50%';

            intensityHeader.appendChild(intensityLabel);
            intensityHeader.appendChild(intensityValueSpan);

            const rangeContainer = document.createElement('div');
            rangeContainer.className = 'range-container';

            const range = document.createElement('input');
            range.type = 'range';
            range.min = '0';
            range.max = '100';
            range.value = '50';
            range.className = 'range';
            range.id = `range-${pin.id.toLowerCase()}`;

            const rangeProgress = document.createElement('div');
            rangeProgress.className = 'range-progress';
            rangeProgress.id = `range-progress-${pin.id.toLowerCase()}`;
            rangeProgress.style.width = '50%';

            rangeContainer.appendChild(range);
            rangeContainer.appendChild(rangeProgress);

            intensityControl.appendChild(intensityHeader);
            intensityControl.appendChild(rangeContainer);

            // Create LED-specific rays element for LED pin
            if (pin.type === 'led') {
                const ledRays = document.createElement('div');
                ledRays.id = 'led-rays';
                ledRays.className = 'led-rays';
                card.appendChild(ledRays);
            }

            // Assemble card
            card.appendChild(indicator);
            card.appendChild(header);
            card.appendChild(intensityControl);

            pinsGrid.appendChild(card);

            // Add event listeners
            input.addEventListener('change', function () {
                const isOn = this.checked;
                card.classList.toggle('active', isOn);
                intensityControl.classList.toggle('active', isOn);

                // Show a temporary status notification
                showPinStatus(pin.id, isOn);

                // For LED, update brightness
                if (pin.type === 'led') {
                    updateLEDBrightness(range.value, isOn);
                }

                // Send update to ESP32
                sendUpdateToESP(pin.id, isOn, range.value, pin.endpoint);

                // Save state
                saveState();
            });

            range.addEventListener('input', function () {
                const value = this.value;
                intensityValueSpan.textContent = value + '%';
                rangeProgress.style.width = value + '%';

                // For LED, update visual brightness on UI
                if (pin.type === 'led' && input.checked) {
                    updateLEDBrightness(value, true);
                }
            });

            // Send update to ESP32 when slider is released (not continuously)
            range.addEventListener('change', function () {
                if (input.checked) {
                    sendUpdateToESP(pin.id, true, this.value, pin.endpoint);
                }
                saveState();
            });
        });
    }

    // Update LED visual brightness (for the LED card only)
    function updateLEDBrightness(value, isOn) {
        if (!isOn) return;

        const brightness = value / 100;

        // Update LED glow intensity
        document.documentElement.style.setProperty('--brightness', brightness);

        // Adjust LED glow size based on brightness
        const glowSize = 10 + (brightness * 30);
        document.documentElement.style.setProperty('--glow-size', `${glowSize}px`);

        // Adjust ray length based on brightness
        const ledRays = document.getElementById('led-rays');
        if (ledRays) {
            const rayScale = 0.5 + (brightness * 0.5);
            ledRays.style.transform = `scale(${rayScale})`;
        }

        // Update particle speed based on brightness
        document.documentElement.style.setProperty('--particle-speed', `${5 - (brightness * 3)}s`);
    }

    function showPinStatus(pinId, isOn) {
        // Show status label
        if (statusLabel) {
            let iconName = 'power';

            // Different icon based on pin type
            if (pinId.includes('LASER')) {
                iconName = 'zap';
            } else if (pinId === 'FAN') {
                iconName = 'fan';
            } else if (pinId === 'LED') {
                iconName = 'bulb';
            }

            statusLabel.innerHTML = `
                <svg class="icon-${iconName}" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                    <line x1="12" y1="2" x2="12" y2="12"></line>
                </svg>
                <span>${pinId} is ${isOn ? 'ON' : 'OFF'}</span>
            `;
            statusLabel.classList.add('show');
            statusLabel.classList.toggle('on', isOn);
            statusLabel.classList.toggle('off', !isOn);

            // Hide status label after delay
            setTimeout(() => {
                statusLabel.classList.remove('show');
            }, 2000);
        }

        // Create a temporary notification
        const notification = document.createElement('div');
        notification.className = `status-notification ${isOn ? 'on' : 'off'}`;
        notification.innerHTML = `${pinId} ${isOn ? 'ON' : 'OFF'}`;

        document.body.appendChild(notification);

        // Animate the notification
        setTimeout(() => {
            notification.classList.add('show');

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 1500);
        }, 10);
    }

    // Function to send updates to ESP32
    function sendUpdateToESP(pinId, state, brightness, endpoint = '/submit') {
        const data = {
            pin: pinId,
            state: state,
            brightness: parseInt(brightness)
        };

        // Display sending indicator
        document.body.classList.add('sending');

        // Send the update to ESP32
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                // Remove sending indicator
                document.body.classList.remove('sending');

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error updating pin:', error);
                statusLabel.innerHTML = 'Connection error!';
                statusLabel.classList.add('show', 'error');

                setTimeout(() => {
                    statusLabel.classList.remove('show');
                }, 2000);
            });
    }

    function getAllPinStates() {
        const states = {};

        pinsList.forEach(pin => {
            const toggle = document.getElementById(`toggle-${pin.id.toLowerCase()}`);
            const range = document.getElementById(`range-${pin.id.toLowerCase()}`);

            if (toggle && range) {
                states[pin.id] = {
                    isOn: toggle.checked,
                    level: range.value
                };
            }
        });

        return states;
    }

    function loadPinStates(states) {
        for (const [pinId, state] of Object.entries(states)) {
            const toggle = document.getElementById(`toggle-${pinId.toLowerCase()}`);
            const range = document.getElementById(`range-${pinId.toLowerCase()}`);

            if (toggle && range) {
                toggle.checked = state.isOn;
                range.value = state.level;

                // Trigger events to update UI
                toggle.dispatchEvent(new Event('change'));
                range.dispatchEvent(new Event('input'));
            }
        }
    }

    // Save state to localStorage
    function saveState() {
        const state = {
            pins: getAllPinStates()
        };
        localStorage.setItem('esp32ControllerState', JSON.stringify(state));
    }

    // Load state from localStorage and from ESP32
    function loadState() {
        // First check local storage
        const savedState = localStorage.getItem('esp32ControllerState');
        if (savedState) {
            const state = JSON.parse(savedState);

            // Load pin states if available
            if (state.pins) {
                loadPinStates(state.pins);
            }
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
                console.log('Current ESP32 state:', data);

                // Update all pins based on received state
                if (data.pins) {
                    loadPinStates(data.pins);
                }
            })
            .catch(error => {
                console.warn('Could not fetch state from ESP32, using local storage instead:', error);
            });
    }

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

    // Check ESP32 connection every 30 seconds
    function checkConnection() {
        fetch('/ping')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Server not responding');
                }
                return response.json();
            })
            .then(data => {
                // Successful connection
                document.body.classList.remove('disconnected');
                console.log('ESP32 connection OK');
            })
            .catch(error => {
                // Connection failed
                document.body.classList.add('disconnected');
                console.error('ESP32 connection failed:', error);

                // Show error message
                statusLabel.innerHTML = 'ESP32 disconnected!';
                statusLabel.classList.add('show', 'error');

                setTimeout(() => {
                    statusLabel.classList.remove('show');
                }, 3000);
            });
    }

    // Check connection on load and periodically
    checkConnection();
    setInterval(checkConnection, 30000);

    // Load saved state on page load
    loadState();
});