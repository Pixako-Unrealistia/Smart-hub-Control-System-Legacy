from fastapi import HTTPException
from utils.file_utils import read_file

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
