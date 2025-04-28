#include "LED.h"
#include "accesspoint.h" // For server and preferences

// Global variables for LED
bool ledState = false;
int ledBrightness = 100; // Default 100%

// Maps to store digital pin states and brightness
std::map<String, bool> pinStates;
std::map<String, int> pinBrightness;

// Pin definitions
const int digitalPins[] = {D1_PIN, D2_PIN, D3_PIN, D4_PIN, D5_PIN, D6_PIN, D7_PIN, D8_PIN};
const int laserPins[] = {LASER_12V_PIN, LASER_5V_PIN};
const int fanPin = FAN_PIN;

// PWM channels for each pin type
const int ledPwmChannel = 0;
const int digitalPwmChannels[] = {1, 2, 3, 4, 5, 6, 7, 8};
const int laserPwmChannels[] = {9, 10};
const int fanPwmChannel = 11;

void setupLED()
{
    // Configure LED PWM
    ledcSetup(ledPwmChannel, PWM_FREQUENCY, PWM_RESOLUTION);
    ledcAttachPin(LED_PIN, ledPwmChannel);

    // Initialize LED to off
    ledcWrite(ledPwmChannel, 0);

    // Setup digital pins with PWM
    for (int i = 0; i < 8; i++)
    {
        ledcSetup(digitalPwmChannels[i], PWM_FREQUENCY, PWM_RESOLUTION);
        ledcAttachPin(digitalPins[i], digitalPwmChannels[i]);
        ledcWrite(digitalPwmChannels[i], 0);

        // Initialize pin states in maps
        String pinId = "D" + String(i + 1);
        pinStates[pinId] = false;
        pinBrightness[pinId] = 100; // Default to 100%
    }

    // Setup laser pins with PWM
    ledcSetup(laserPwmChannels[0], PWM_FREQUENCY, PWM_RESOLUTION);
    ledcAttachPin(laserPins[0], laserPwmChannels[0]);
    ledcWrite(laserPwmChannels[0], 0);
    pinStates["LASER-12V"] = false;
    pinBrightness["LASER-12V"] = 100;

    ledcSetup(laserPwmChannels[1], PWM_FREQUENCY, PWM_RESOLUTION);
    ledcAttachPin(laserPins[1], laserPwmChannels[1]);
    ledcWrite(laserPwmChannels[1], 0);
    pinStates["LASER-5V"] = false;
    pinBrightness["LASER-5V"] = 100;

    // Setup fan pin with PWM
    ledcSetup(fanPwmChannel, PWM_FREQUENCY, PWM_RESOLUTION);
    ledcAttachPin(fanPin, fanPwmChannel);
    ledcWrite(fanPwmChannel, 0);
    pinStates["FAN"] = false;
    pinBrightness["FAN"] = 100;
}

void updateLED()
{
    if (ledState)
    {
        // Convert percentage (0-100) to PWM value (0-255)
        int pwmValue = map(ledBrightness, 0, 100, 0, 255);
        ledcWrite(ledPwmChannel, pwmValue);
    }
    else
    {
        ledcWrite(ledPwmChannel, 0); // Turn off LED
    }
}

void updateDigitalPin(const String &pinId, bool state, int brightness)
{
    // Check if this is a valid digital pin
    int pinNumber = -1;
    int pwmChannel = -1;

    if (pinId.startsWith("D") && pinId.length() == 2)
    {
        int index = pinId.substring(1).toInt() - 1;
        if (index >= 0 && index < 8)
        {
            pinNumber = digitalPins[index];
            pwmChannel = digitalPwmChannels[index];
        }
    }

    if (pinNumber == -1 || pwmChannel == -1)
        return;

    // Update state in map
    pinStates[pinId] = state;
    pinBrightness[pinId] = brightness;

    // Update actual pin
    if (state)
    {
        int pwmValue = map(brightness, 0, 100, 0, 255);
        ledcWrite(pwmChannel, pwmValue);
    }
    else
    {
        ledcWrite(pwmChannel, 0); // Turn off
    }

    // Save to preferences
    preferences.begin("pin-prefs", false);
    preferences.putBool(pinId.c_str(), state);
    preferences.putInt((pinId + "-bright").c_str(), brightness);
    preferences.end();
}

void updateLaserPin(const String &pinId, bool state, int brightness)
{
    int pwmChannel = -1;

    if (pinId == "LASER-12V")
    {
        pwmChannel = laserPwmChannels[0];
    }
    else if (pinId == "LASER-5V")
    {
        pwmChannel = laserPwmChannels[1];
    }

    if (pwmChannel == -1)
        return;

    // Update state in map
    pinStates[pinId] = state;
    pinBrightness[pinId] = brightness;

    // Update actual pin
    if (state)
    {
        int pwmValue = map(brightness, 0, 100, 0, 255);
        ledcWrite(pwmChannel, pwmValue);
    }
    else
    {
        ledcWrite(pwmChannel, 0); // Turn off
    }

    // Save to preferences
    preferences.begin("pin-prefs", false);
    preferences.putBool(pinId.c_str(), state);
    preferences.putInt((pinId + "-bright").c_str(), brightness);
    preferences.end();
}

void updateFanPin(const String &pinId, bool state, int brightness)
{
    if (pinId != "FAN")
        return;

    // Update state in map
    pinStates[pinId] = state;
    pinBrightness[pinId] = brightness;

    // Update actual pin
    if (state)
    {
        int pwmValue = map(brightness, 0, 100, 0, 255);
        ledcWrite(fanPwmChannel, pwmValue);
    }
    else
    {
        ledcWrite(fanPwmChannel, 0); // Turn off
    }

    // Save to preferences
    preferences.begin("pin-prefs", false);
    preferences.putBool(pinId.c_str(), state);
    preferences.putInt((pinId + "-bright").c_str(), brightness);
    preferences.end();
}

// Handler for LED updates
void handleLEDPost(AsyncWebServerRequest *request, JsonVariant &json)
{
    JsonObject jsonObj = json.as<JsonObject>();

    // Extract values from JSON
    if (jsonObj.containsKey("state"))
    {
        ledState = jsonObj["state"].as<bool>();
    }

    if (jsonObj.containsKey("brightness"))
    {
        ledBrightness = jsonObj["brightness"].as<int>();
        // Make sure brightness is within range
        if (ledBrightness < 0)
            ledBrightness = 0;
        if (ledBrightness > 100)
            ledBrightness = 100;
    }

    // Update LED with new values
    updateLED();

    // Save settings to preferences
    preferences.begin("led-prefs", false);
    preferences.putBool("ledState", ledState);
    preferences.putInt("brightness", ledBrightness);
    preferences.end();

    // Send response back
    request->send(200, "application/json", "{\"success\":true}");
}

// Handler for digital pin updates
void handleDigitalPost(AsyncWebServerRequest *request, JsonVariant &json)
{
    handleGenericPinRequest(request, json, updateDigitalPin);
}

// Handler for laser pin updates
void handleLaserPost(AsyncWebServerRequest *request, JsonVariant &json)
{
    handleGenericPinRequest(request, json, updateLaserPin);
}

// Handler for fan pin updates
void handleFanPost(AsyncWebServerRequest *request, JsonVariant &json)
{
    handleGenericPinRequest(request, json, updateFanPin);
}

void handleSystemStatus(AsyncWebServerRequest *request)
{
    // Create JSON response with current state of all pins
    DynamicJsonDocument doc(2048);
    JsonObject root = doc.to<JsonObject>();
    JsonObject pins = root.createNestedObject("pins");

    // Add LED state
    JsonObject led = pins.createNestedObject("LED");
    led["isOn"] = ledState;
    led["level"] = ledBrightness;

    // Add all digital pins
    for (int i = 0; i < 8; i++)
    {
        String pinId = "D" + String(i + 1);
        JsonObject pin = pins.createNestedObject(pinId);
        pin["isOn"] = pinStates[pinId];
        pin["level"] = pinBrightness[pinId];
    }

    // Add laser pins
    JsonObject laser12v = pins.createNestedObject("LASER-12V");
    laser12v["isOn"] = pinStates["LASER-12V"];
    laser12v["level"] = pinBrightness["LASER-12V"];

    JsonObject laser5v = pins.createNestedObject("LASER-5V");
    laser5v["isOn"] = pinStates["LASER-5V"];
    laser5v["level"] = pinBrightness["LASER-5V"];

    // Add fan pin
    JsonObject fan = pins.createNestedObject("FAN");
    fan["isOn"] = pinStates["FAN"];
    fan["level"] = pinBrightness["FAN"];

    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
}

void setupPinControlHandlers()
{
    // Add JSON handler for LED control
    AsyncCallbackJsonWebHandler *ledHandler = new AsyncCallbackJsonWebHandler("/led", handleLEDPost);
    server.addHandler(ledHandler);

    // Add JSON handler for digital pin control
    AsyncCallbackJsonWebHandler *digitalHandler = new AsyncCallbackJsonWebHandler("/digital", handleDigitalPost);
    server.addHandler(digitalHandler);

    // Add JSON handler for laser pin control
    AsyncCallbackJsonWebHandler *laserHandler = new AsyncCallbackJsonWebHandler("/laser", handleLaserPost);
    server.addHandler(laserHandler);

    // Add JSON handler for fan pin control
    AsyncCallbackJsonWebHandler *fanHandler = new AsyncCallbackJsonWebHandler("/fan", handleFanPost);
    server.addHandler(fanHandler);

    // Add status endpoint for all pins
    server.on("/status", HTTP_GET, handleSystemStatus);
}

void loadAllPinSettings()
{
    // Load LED settings
    preferences.begin("led-prefs", false);
    ledState = preferences.getBool("ledState", false);
    ledBrightness = preferences.getInt("brightness", 100);
    preferences.end();

    // Apply LED settings
    updateLED();

    // Load settings for all other pins
    preferences.begin("pin-prefs", false);

    // Load digital pins
    for (int i = 0; i < 8; i++)
    {
        String pinId = "D" + String(i + 1);
        bool state = preferences.getBool(pinId.c_str(), false);
        int brightness = preferences.getInt((pinId + "-bright").c_str(), 100);

        // Apply settings
        updateDigitalPin(pinId, state, brightness);
    }

    // Load laser pins
    bool laser12vState = preferences.getBool("LASER-12V", false);
    int laser12vBrightness = preferences.getInt("LASER-12V-bright", 100);
    updateLaserPin("LASER-12V", laser12vState, laser12vBrightness);

    bool laser5vState = preferences.getBool("LASER-5V", false);
    int laser5vBrightness = preferences.getInt("LASER-5V-bright", 100);
    updateLaserPin("LASER-5V", laser5vState, laser5vBrightness);

    // Load fan pin
    bool fanState = preferences.getBool("FAN", false);
    int fanBrightness = preferences.getInt("FAN-bright", 100);
    updateFanPin("FAN", fanState, fanBrightness);

    preferences.end();
}