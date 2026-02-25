import requests
import time

PATHWAY_URL = "http://localhost:8081/v1/inputs"
BACKEND_URL = "http://localhost:3000/api/v9/alert"

def test_pipeline():
    print("🚀 Testing Pathway Integration...")

    # 1. Send Data to Pathway
    payload = {"user_id": "test_script", "lat": 28.7041, "lon": 77.1025}
    try:
        print(f"📡 Sending data to Pathway: {payload}")
        res = requests.post(PATHWAY_URL, json=payload, timeout=2)
        if res.status_code == 200:
            print("✅ Pathway received data.")
        else:
            print(f"❌ Pathway Error: {res.status_code} {res.text}")
            return
    except Exception as e:
        print(f"❌ Pathway Service Unreachable: {e}")
        return

    # 2. Polling Backend for Alert (Wait a bit for processing)
    print("⏳ Waiting for backend processing...")
    time.sleep(2)

    try:
        print(f"📥 Checking Backend for alerts...")
        res = requests.get(BACKEND_URL, timeout=2)
        if res.status_code == 200:
            data = res.json()
            if data.get("success") and data.get("alert"):
                alert = data["alert"]
                print(f"✅ Alert Received from Backend: {alert}")
                print("🎉 INTEGRATION SUCCESSFUL!")
            else:
                print("⚠️ No alert found in backend yet.")
                print(f"Response: {data}")
        else:
            print(f"❌ Backend Error: {res.status_code} {res.text}")
    except Exception as e:
         print(f"❌ Backend Unreachable: {e}")

if __name__ == "__main__":
    test_pipeline()
