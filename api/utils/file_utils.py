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
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        FILE_PATH = os.path.join(BASE_DIR, "mock_data", "individuals")
        FILENAME = f"{meter_id}.csv"

        # Full path to the CSV file
        file_path = os.path.join(FILE_PATH, FILENAME)

        # Check if the file exists
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File {file_path} does not exist.")

        # Read the CSV file
        df = pd.read_csv(file_path)
        
        # Filter the dataframe by the specific LCLid
        filtered_df = df[df['LCLid'] == IDENTIFIER]
        
        # Convert the filtered dataframe to JSON
        json_str = filtered_df.to_json(orient="records")
        
        # Parse the JSON string to remove escape characters
        json_data = json.loads(json_str)

        # Return the parsed JSON data
        return json_data

    except FileNotFoundError as fnf_error:
        print(f"File not found error: {fnf_error}")
        return None
    except pd.errors.EmptyDataError:
        print("The CSV file is empty.")
        return None
    except KeyError as ke:
        print(f"Missing expected column: {ke}")
        return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

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