import json
import os
from fastapi import HTTPException
import os
import time
import pandas as pd



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

def read_meter_csv(meter_id: str):
    try:
        IDENTIFIER = meter_id
        FILE_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "mock_data", "individuals")
        FILENAME = f"{meter_id}.csv"

        DIR = FILE_PATH

        print(DIR)
        # Read the CSV file
        df = pd.read_csv(os.path.join(DIR, FILENAME))
        
        # Iterate through the rows with the specific LCLid
        for index, row in df[df['LCLid'] == IDENTIFIER].iterrows():
            print("-" * 10)
            print(row)
            time.sleep(1)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Meter file not found {DIR}/{FILENAME}")

# list all meter in the system
def scan_all_meter():
    try:
        FILE_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "mock_data", "individuals")
        DIR = FILE_PATH
        print(DIR)
        # List all the files in the directory
        files = os.listdir(DIR)
        return files
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Meter files not found")