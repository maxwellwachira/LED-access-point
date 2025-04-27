#include "AccessPoint.h"

// Global variables
AsyncWebServer server(80);
Preferences preferences;

void accessPointInit(bool debug) {
  // Connect to Wi-Fi network with SSID and password
  if(debug) Serial.print("Setting AP (Access Point)...");
  
  // Remove the password parameter if you want the AP to be open
  WiFi.softAP(WIFI_SSID, WIFI_PWD);
  delay(2000); // To avoid crash on WiFi Connection
  
  IPAddress IP = WiFi.softAPIP();
  if(debug) {
    Serial.print("AP IP address: ");
    Serial.println(IP);
  }
}

void serveHTML(bool debug) {
  // Initialize SPIFFS
  if (!SPIFFS.begin(true)) {
    if(debug) Serial.println("An error occurred while mounting SPIFFS");
    return;
  }

  if(debug) Serial.println("SPIFFS mounted");

  // Start the server
  server.begin();
  if(debug) Serial.println("Server started");

  // Serve the HTML, CSS, and JS files
  server.onNotFound([](AsyncWebServerRequest *request){
    request->send(404, "text/plain", "Not found");
  });

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index.html", "text/html");
  });
  
  server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/style.css", "text/css");
  });
  
  server.on("/script.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/script.js", "application/javascript");
  });
}