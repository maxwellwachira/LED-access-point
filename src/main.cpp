#include <Arduino.h>
#include "accesspoint.h"
#include "LED.h"

void setup()
{
  Serial.begin(115200);

  // Setup LED
  setupLED();

  // Load saved LED settings
  loadLEDSettings();

  // Initialize AP
  accessPointInit(true);

  // Start web server and serve HTML
  serveHTML(true);

  // Setup LED control endpoints
  setupLEDControl();

  Serial.println("System initialized");
}

void loop()
{
  // Nothing needed in loop for this application
  delay(100);
}