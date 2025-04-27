#include "LED.h"
#include "AccessPoint.h" // For server and preferences

// Global variables
bool ledState = false;
int brightness = 100; // Default 100%

void setupLED()
{
    // Configure LED PWM
    ledcSetup(PWM_CHANNEL, PWM_FREQUENCY, PWM_RESOLUTION);
    ledcAttachPin(LED_PIN, PWM_CHANNEL);

    // Initialize LED to off
    ledcWrite(PWM_CHANNEL, 0);
}

void updateLED()
{
    if (ledState)
    {
        // Convert percentage (0-100) to PWM value (0-255)
        int pwmValue = map(brightness, 0, 100, 0, 255);
        ledcWrite(PWM_CHANNEL, pwmValue);
    }
    else
    {
        ledcWrite(PWM_CHANNEL, 0); // Turn off LED
    }
}

void handleJsonPost(AsyncWebServerRequest *request, JsonVariant &json)
{
    JsonObject jsonObj = json.as<JsonObject>();

    // Extract values from JSON
    if (jsonObj.containsKey("state"))
    {
        ledState = jsonObj["state"].as<bool>();
    }

    if (jsonObj.containsKey("brightness"))
    {
        brightness = jsonObj["brightness"].as<int>();
        // Make sure brightness is within range
        if (brightness < 0)
            brightness = 0;
        if (brightness > 100)
            brightness = 100;
    }

    // Update LED with new values
    updateLED();

    // Save settings to preferences
    preferences.begin("led-prefs", false);
    preferences.putBool("ledState", ledState);
    preferences.putInt("brightness", brightness);
    preferences.end();

    // Send response back
    request->send(200, "application/json", "{\"success\":true}");
}

void setupLEDControl()
{
    // Add JSON handler for LED control
    AsyncCallbackJsonWebHandler *handler = new AsyncCallbackJsonWebHandler("/submit", handleJsonPost);
    server.addHandler(handler);
}

void loadLEDSettings()
{
    preferences.begin("led-prefs", false);
    // Restore previous state if available
    ledState = preferences.getBool("ledState", false);
    brightness = preferences.getInt("brightness", 100);
    preferences.end();

    // Apply settings
    updateLED();
}