// LED.h
#ifndef LED_H
#define LED_H

#include <Arduino.h>
#include <AsyncJson.h>
#include <ArduinoJson.h>
#include <map>
#include <functional>

// Pin definitions
#define LED_PIN 2  // Built-in LED on most ESP32 boards

// Digital pins (adjust as needed for your board)
#define D1_PIN 13
#define D2_PIN 12
#define D3_PIN 14
#define D4_PIN 27
#define D5_PIN 26
#define D6_PIN 25
#define D7_PIN 33
#define D8_PIN 32

// Laser pins 
#define LASER_12V_PIN 19
#define LASER_5V_PIN 18

// Fan pin
#define FAN_PIN 23

// PWM properties
#define PWM_FREQUENCY 5000
#define PWM_RESOLUTION 8  // 8-bit resolution, 0-255

// Function declarations
void setupLED();
void updateLED();
void setupPinControlHandlers();
void loadAllPinSettings();
void updateDigitalPin(const String &pinId, bool state, int brightness);
void updateLaserPin(const String &pinId, bool state, int brightness);
void updateFanPin(const String &pinId, bool state, int brightness);

#endif
