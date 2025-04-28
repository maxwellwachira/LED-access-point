// AccessPoint.h
#ifndef ACCESSPOINT_H
#define ACCESSPOINT_H

#include <Arduino.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>
#include <Preferences.h>
#include <ArduinoJson.h>
#include <functional>

// WiFi credentials - modify these as needed
#define WIFI_SSID "LED-Control"
#define WIFI_PWD "password123"

// Global variables accessible from other files
extern AsyncWebServer server;
extern Preferences preferences;

// Function declarations
void accessPointInit(bool debug = true);
void serveHTML(bool debug = true);
void handleGenericPinRequest(AsyncWebServerRequest *request, JsonVariant &json,
                             std::function<void(const String &, bool, int)> callback);

#endif
