"""
AquaGuard USB Serial to Firebase Bridge
---------------------------------------
If the ESP32 cannot connect to Wi-Fi at your venue/demo, plug the ESP32 into 
your laptop via USB. This script reads the real sensor data directly from the 
COM port and uploads it to Firebase using your laptop's internet connection.

Requirements:
  pip install pyserial requests

Usage:
  python serial_bridge.py
"""

import re
import time
import requests
try:
    import serial
    import serial.tools.list_ports
except ImportError:
    serial = None

FIREBASE_URL = "https://aquaguard-fee42-default-rtdb.asia-southeast1.firebasedatabase.app/aquaguard/sensors.json"

def find_esp32_port():
    if not serial:
        print("[!] pyserial not installed. Run: pip install pyserial requests")
        return None
    ports = list(serial.tools.list_ports.comports())
    for p in ports:
        desc = p.description.lower()
        if "cp210" in desc or "ch340" in desc or "usb-serial" in desc or "uart" in desc:
            return p.device
    if ports:
        return ports[0].device
    return None

def main():
    if not serial:
        print("Please install pyserial and requests first:\n  pip install pyserial requests")
        return

    port = find_esp32_port() or "COM3"
    print(f"[*] Detected port: {port} (change in script if your ESP32 is on another port)")
    print("[*] Connecting to ESP32 at 115200 baud...")

    try:
        ser = serial.Serial(port, 115200, timeout=1)
        time.sleep(2)
        print("[✓] Connected to ESP32! Reading live data and streaming to Firebase...\n")
    except Exception as e:
        print(f"[X] Could not open {port}: {e}")
        print("    Available ports:")
        for p in serial.tools.list_ports.comports():
            print(f"      - {p.device}: {p.description}")
        return

    # Regex patterns matching the ESP32 Serial output:
    # "TDS: 45 PPM | Voltage: 0.500 V | Flow: 1.20 L/min | Status: NORMAL"
    tds_pattern = re.compile(r"TDS:\s*(\d+)")
    flow_pattern = re.compile(r"Flow:\s*([\d\.]+)")

    while True:
        try:
            line = ser.readline().decode('utf-8', errors='ignore').strip()
            if not line:
                continue

            print(f"[ESP32] {line}")

            tds_match = tds_pattern.search(line)
            flow_match = flow_pattern.search(line)

            if tds_match and flow_match:
                tds = int(tds_match.group(1))
                flow = float(flow_match.group(1))

                payload = {
                    "tds": tds,
                    "flowrate": flow,
                    "esp_Connected": True,
                    "lastupdated": time.strftime("%H:%M:%S")
                }

                # Push directly to Firebase REST API
                res = requests.put(FIREBASE_URL, json=payload, timeout=3)
                if res.status_code == 200:
                    print(f"  --> [Firebase OK] TDS: {tds} PPM, Flow: {flow} L/min synced to cloud!")
                else:
                    print(f"  --> [Firebase Error] Status {res.status_code}: {res.text}")

        except KeyboardInterrupt:
            print("\nStopped by user.")
            break
        except Exception as err:
            print(f"[!] Error: {err}")
            time.sleep(1)

if __name__ == "__main__":
    main()
