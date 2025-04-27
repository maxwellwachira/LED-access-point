#ifndef ACCESSPOINT_H
#define ACCESSPOINT_H

#include <Arduino.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>
#include <ArduinoJson.h>
#include <Preferences.h>

// WiFi credentials - modify these as needed
#define WIFI_SSID "LED-Control"
#define WIFI_PWD "password123"

// Function declarations
void accessPointInit(bool debug);
void serveHTML(bool debug);
extern AsyncWebServer server;
extern Preferences preferences;

#endif