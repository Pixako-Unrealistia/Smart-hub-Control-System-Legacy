from fastapi import APIRouter
from handlers.meter_handler import get_meter_data, get_meter_display_name, update_meter_state, read_meter, scan_meter
from schemas.meter_schema import MeterStateUpdate

import json
from fastapi import Body
router = APIRouter()

@router.get("/meter/{meter_id}")
async def get_meter(meter_id: str):
    return get_meter_data(meter_id)

@router.get("/name/{meter_id}")
async def get_meter_display_name_route(meter_id: str):
    return get_meter_display_name(meter_id)

# # update meter status
# @router.put("/meter/{meter_id}")
# async def update_meter_status(meter_id: str, status: str):
#     return update_meter_status(meter_id, status)

@router.put("/meter/{meter_id}/state")
async def update_meter_state_route(meter_id: str, meter_state: MeterStateUpdate):
    return update_meter_state(meter_id, meter_state.state)

# switch on meter
@router.put("/meter/{meter_id}/on")
async def switch_on_meter(meter_id: str):
    return update_meter_state(meter_id, True)

# switch off meter
@router.put("/meter/{meter_id}/off")
async def switch_off_meter(meter_id: str):
    return update_meter_state(meter_id, False)

@router.get("/meter/{meter_id}/read")
async def read_meter_route(meter_id: str):
    return read_meter(meter_id)

@router.get("/scan")
async def scan_meter_route():
    return scan_meter()

