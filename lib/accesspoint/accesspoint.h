#include <Arduino.h>
#include <WiFi.h>
#include <AsyncJson.h>
#include <ArduinoJson.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>
#include <Preferences.h>


#define WIFI_SSID "LED Controller"
#define WIFI_PWD "12345678!"


void accessPointInit (bool debug = false);
void serveHTML(bool debug = false);
void getData(bool debug = false);