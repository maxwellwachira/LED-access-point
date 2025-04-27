# ESP32 LED Controller

This project implements a web-based LED controller using an ESP32 microcontroller. It allows you to control an LED's on/off state and brightness through an intuitive web interface that's accessible from any device connected to the ESP32's WiFi network.

## Features

- **Access Point Mode**: The ESP32 creates its own WiFi network for direct connection
- **Intuitive Web Interface**: Control LED state (on/off) with an animated toggle switch
- **Brightness Control**: Adjust LED brightness from 0-100% using a slider
- **PWM Output**: Precise LED brightness control through PWM (Pulse Width Modulation)
- **Settings Persistence**: Your settings are saved even after power loss
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## Hardware Requirements

- ESP32 development board
- LED (any color)
- Resistor (220-330Ω recommended)
- Jumper wires
- Micro USB cable for programming/power

## Wiring

Connect your LED to the ESP32 as follows:

1. Connect the longer leg (anode/positive) of the LED to GPIO pin 16 (or the pin specified in the code) through a 220-330Ω resistor
2. Connect the shorter leg (cathode/negative) of the LED to a GND pin on the ESP32

## Software Setup

### Prerequisites

- [Arduino IDE](https://www.arduino.cc/en/software) with ESP32 support installed
- The following libraries installed through the Arduino Library Manager:
  - ESPAsyncWebServer
  - AsyncTCP
  - ArduinoJson
  - SPIFFS

### Installation

1. Clone or download this repository
2. Open the project in Arduino IDE
3. Select your ESP32 board from Tools > Board
4. Connect your ESP32 to your computer
5. Select the correct COM port from Tools > Port
6. Upload the code to your ESP32
7. Upload the SPIFFS data files via Tools > ESP32 Sketch Data Upload

### Default Configuration

- WiFi SSID: `ESP32-LED-Control`
- WiFi Password: `password123`
- Web Interface: Connect to the WiFi network and navigate to `192.168.4.1` in your browser

## Code Structure

The project is organized into modular libraries for better maintainability:

- **AccessPoint**: Handles WiFi access point setup and web server
- **LED**: Manages LED control functionality including PWM output
- **Main**: Ties everything together and initializes the system
- **Web Interface**: HTML, CSS, and JavaScript files for the user interface

## Customization

### Changing WiFi Credentials

Edit the `WIFI_SSID` and `WIFI_PWD` constants in `lib/AccessPoint/AccessPoint.h`.

### Changing LED Pin

Edit the `LED_PIN` constant in `lib/LED/LED.h` to match your hardware setup.

### Adjusting PWM Settings

The PWM frequency and resolution can be adjusted in `lib/LED/LED.h`:

```cpp
#define PWM_FREQUENCY 5000
#define PWM_RESOLUTION 8  // 8-bit resolution (0-255)
```

## Web Interface

The web interface features:

- An interactive LED icon that changes brightness to match the actual LED
- A toggle switch for turning the LED on and off
- A slider for brightness control (0-100%)
- Visual feedback for changes in LED state
- Status indicators for successful operations

## Troubleshooting

- **ESP32 not appearing in ports**: Make sure you have the proper drivers installed
- **Failed to upload SPIFFS data**: Ensure the data folder is in the correct location
- **Web interface not loading**: Verify you are connected to the ESP32's WiFi network
- **LED not responding**: Check your wiring and ensure the correct GPIO pin is specified in the code
