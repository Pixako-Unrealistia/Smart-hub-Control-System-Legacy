from fastapi import FastAPI, HTTPException
import json
import os

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/meter/{meter_id}")
async def get_meter(meter_id: str):
    try:
        # Adjust the path to the config file
        file_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'default.json')
        print(f"Reading file from: {file_path}")  # Debugging statement
        with open(file_path, 'r') as file:
            data = json.load(file)
            print("Data loaded successfully")  # Debugging statement
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Config file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decoding JSON")

    for meter_data in data:
        print(f"Checking meter_id: {meter_data['meter_id']}")  # Debugging statement
        if meter_data['meter_id'] == meter_id:
            return meter_data

    raise HTTPException(status_code=404, detail="Meter not found")
