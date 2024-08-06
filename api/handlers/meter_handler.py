from fastapi import HTTPException
from utils.file_utils import read_file
import json
import os

def get_meter_data(meter_id: str):
    data = read_file()
    for meter_data in data:
        if meter_data['meter_id'] == meter_id:
            return meter_data
    raise HTTPException(status_code=404, detail="Meter not found")

def get_meter_display_name(meter_id: str):
    data = read_file()
    for meter_data in data:
        if meter_data['meter_id'] == meter_id:
            return {"display_name": meter_data['display_name']}
    raise HTTPException(status_code=404, detail="Meter not found")

def update_meter_state(meter_id: str, state: bool):
    print(f"Updating meter state for {meter_id} to {state}")  # Debugging statement
    data = read_file()
    for meter_data in data:
        if meter_data['meter_id'] == meter_id:
            meter_data['state'] = state
            # Assuming you want to save the updated data back to the file
            file_path = os.path.join(os.path.dirname(__file__), '..', '..', 'config', 'default.json')
            with open(file_path, 'w') as file:
                json.dump(data, file, indent=4)
            return {"message": "Meter state updated successfully"}
    raise HTTPException(state_code=404, detail="Meter not found")
