import json
import os
from fastapi import HTTPException

def read_file():
    try:
        # Adjust the path to the config file
        file_path = os.path.join(os.path.dirname(__file__), '..', '..', 'config', 'default.json')
        print(f"Reading file from: {file_path}")  # Debugging statement
        with open(file_path, 'r') as file:
            data = json.load(file)
            print("Data loaded successfully")  # Debugging statement
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Config file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decoding JSON")
    return data
