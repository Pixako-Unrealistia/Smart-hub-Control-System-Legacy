from fastapi import APIRouter
from handlers.meter_handler import get_meter_data, get_meter_display_name, update_meter_state
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