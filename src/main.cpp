#include "LED.h"
#include "accesspoint.h"

const bool DEBUG = true;

void setup()
{
  if (DEBUG)
  {
    // Initialize Serial for debugging
    Serial.begin(115200);
    delay(1000); // Give time for serial to connect
    Serial.println("ESP32 Controller Starting...");
  }

  // Initialize hardware components
  setupLED();

  // Set up WiFi access point
  accessPointInit(DEBUG);

  // Set up web server
  serveHTML(DEBUG);

  // Set up pin control handlers
  setupPinControlHandlers();

  // Load saved settings
  loadAllPinSettings();

  if (DEBUG)
    Serial.println("Setup complete!");
}

void loop()
{
  // Main loop is empty because we're using asynchronous web server
  // Everything is handled by callbacks

  // Add any periodic checks or updates here if needed
  delay(100);
}