#ifndef LED_H
#define LED_H

#include <Arduino.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <Preferences.h>

// LED pin and PWM settings
#define LED_PIN 16 // GPIO pin connected to LED (change to your actual pin)
#define PWM_CHANNEL 0
#define PWM_FREQUENCY 5000
#define PWM_RESOLUTION 8 // 8-bit resolution (0-255)

// Function declarations
void setupLED();
void updateLED();
void handleJsonPost(AsyncWebServerRequest *request, JsonVariant &json);
void handleLEDStatus(AsyncWebServerRequest *request);
void setupLEDControl();
void loadLEDSettings();

// Global variables
extern bool ledState;
extern int brightness;

#endif