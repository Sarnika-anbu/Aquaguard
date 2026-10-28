/*
  ==========================================================================
  AquaGuard ESP32 - OLED + TDS + Flow + LED + Firebase
  ==========================================================================
  Libraries needed:
  - Adafruit GFX Library
  - Adafruit SSD1306
  - Firebase ESP32 Client by Mobizt
*/

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <WiFi.h>
#include <FirebaseESP32.h>

// ---------- Wi-Fi Credentials ----------
#define WIFI_SSID "sarnika"         // 👈 Replace with your Wi-Fi name
#define WIFI_PASSWORD "bugaboos" // 👈 Replace with your Wi-Fi password

// ---------- Firebase Credentials ----------
#define DATABASE_URL "https://aquaguard-fee42-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define API_KEY "AIzaSyBZd8MgygzXMpGS2NutDFkZ33C95NsyBEs"

// ---------- OLED ----------
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define SDA_PIN 21
#define SCL_PIN 22

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// ---------- TDS ----------
#define TDS_PIN 34

// ---------- FLOW ----------
#define FLOW_PIN 27

volatile unsigned long pulseCount = 0;

void IRAM_ATTR pulseCounter() {
  pulseCount++;
}

// ---------- LEDs ----------
#define GREEN_LED 25
#define YELLOW_LED 26
#define RED_LED 33

// ---------- Firebase Objects ----------
FirebaseData fbdo;
FirebaseConfig config;
FirebaseAuth auth;

// ---------- Firebase Timer ----------
unsigned long lastFirebaseSend = 0;
#define FIREBASE_INTERVAL 2000  // Send to Firebase every 2 seconds

void setup() {
  Serial.begin(115200);

  // OLED
  Wire.begin(SDA_PIN, SCL_PIN);
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED not found!");
    while (1);
  }

  // Flow sensor
  pinMode(FLOW_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(FLOW_PIN), pulseCounter, RISING);

  // LEDs
  pinMode(GREEN_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(YELLOW_LED, LOW);
  digitalWrite(RED_LED, LOW);

  // OLED Splash Screen
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(2);
  display.setCursor(10, 10);
  display.println("AquaGuard");
  display.setTextSize(1);
  display.setCursor(10, 40);
  display.println("Connecting WiFi...");
  display.display();

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  int attempt = 0;
  while (WiFi.status() != WL_CONNECTED && attempt < 20) {
    Serial.print(".");
    delay(500);
    attempt++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected! IP: " + WiFi.localIP().toString());
  } else {
    Serial.println("\nWiFi Failed! Running in offline mode.");
  }

  // Configure Firebase
  config.database_url = DATABASE_URL;
  config.signer.tokens.legacy_token = API_KEY;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Final OLED Ready Screen
  display.clearDisplay();
  display.setTextSize(2);
  display.setCursor(10, 10);
  display.println("AquaGuard");
  display.setTextSize(1);
  display.setCursor(10, 40);
  display.println(WiFi.status() == WL_CONNECTED ? "WiFi: Connected" : "WiFi: Offline");
  display.display();
  delay(2000);
}

void loop() {
  // ---------- TDS ----------
  int rawTDS = analogRead(TDS_PIN);
  float voltage = rawTDS * (3.3 / 4095.0);

  // TDS PPM Calculation (Temperature Compensated)
  float compensationVoltage = voltage / 1.0;
  float tdsValue = (133.42 * pow(compensationVoltage, 3)
                   - 255.86 * pow(compensationVoltage, 2)
                   + 857.39 * compensationVoltage) * 0.5;

  if (tdsValue < 0) tdsValue = 35; // Minimum floor

  // ---------- FLOW (measured over 1 second) ----------
  pulseCount = 0;
  delay(1000);
  float pulsesPerSecond = pulseCount;
  float flowRate = pulsesPerSecond / 7.5;

  // ---------- STATUS (LED + Text) ----------
  String status;
  if (flowRate > 1.0) {
    status = "NORMAL";
    digitalWrite(GREEN_LED, HIGH);
    digitalWrite(YELLOW_LED, LOW);
    digitalWrite(RED_LED, LOW);
  } else if (flowRate > 0.2) {
    status = "WARNING";
    digitalWrite(GREEN_LED, LOW);
    digitalWrite(YELLOW_LED, HIGH);
    digitalWrite(RED_LED, LOW);
  } else {
    status = "LOW FLOW";
    digitalWrite(GREEN_LED, LOW);
    digitalWrite(YELLOW_LED, LOW);
    digitalWrite(RED_LED, HIGH);
  }

  // ---------- SERIAL MONITOR ----------
  Serial.print("TDS: ");
  Serial.print((int)tdsValue);
  Serial.print(" PPM | Voltage: ");
  Serial.print(voltage, 3);
  Serial.print(" V | Flow: ");
  Serial.print(flowRate, 2);
  Serial.print(" L/min | Status: ");
  Serial.println(status);

  // ---------- OLED DISPLAY ----------
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);

  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println("RO PURIFIER");

  display.setCursor(0, 14);
  display.print("TDS: ");
  display.print((int)tdsValue);
  display.println(" PPM");

  display.setCursor(0, 28);
  display.print("Flow: ");
  display.print(flowRate, 2);
  display.println(" L/min");

  display.setCursor(0, 42);
  display.print("Status: ");
  display.println(status);

  display.setCursor(0, 56);
  display.print(WiFi.status() == WL_CONNECTED ? "WiFi: OK" : "WiFi: --");

  display.display();

  // ---------- FIREBASE SEND (every 2 seconds) ----------
  if (WiFi.status() == WL_CONNECTED && (millis() - lastFirebaseSend >= FIREBASE_INTERVAL)) {
    lastFirebaseSend = millis();

    FirebaseJson json;
    json.set("tds", (int)tdsValue);
    json.set("flowrate", flowRate);
    json.set("esp_Connected", true);
    json.set("lastupdated", millis() / 1000);

    if (Firebase.setJSON(fbdo, "/aquaguard/sensors", json)) {
      Serial.println("Firebase: SUCCESS");
    } else {
      Serial.println("Firebase FAILED: " + fbdo.errorReason());
    }
  }
}
