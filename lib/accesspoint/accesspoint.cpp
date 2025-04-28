#include "accesspoint.h"

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
  
  // Add ping endpoint for connection checking
  server.on("/ping", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "application/json", "{\"status\":\"ok\"}");
  });
}

// Common JSON request handler that extracts pin, state, and brightness
void handleGenericPinRequest(AsyncWebServerRequest *request, JsonVariant &json, 
                            std::function<void(const String&, bool, int)> callback) {
  JsonObject jsonObj = json.as<JsonObject>();
  
  // Default values
  String pinId = "";
  bool state = false;
  int brightness = 0;
  
  // Extract values from JSON
  if (jsonObj.containsKey("pin")) {
    pinId = jsonObj["pin"].as<String>();
  }
  
  if (jsonObj.containsKey("state")) {
    state = jsonObj["state"].as<bool>();
  }
  
  if (jsonObj.containsKey("brightness")) {
    brightness = jsonObj["brightness"].as<int>();
    // Make sure brightness is within range
    if (brightness < 0) brightness = 0;
    if (brightness > 100) brightness = 100;
  }
  
  // Process the pin update using the callback
  if (pinId != "") {
    callback(pinId, state, brightness);
  }
  
  // Send response back
  request->send(200, "application/json", "{\"success\":true}");
}