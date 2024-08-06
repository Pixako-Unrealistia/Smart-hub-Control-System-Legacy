from fastapi import APIRouter
from handlers.meter_handler import get_meter_data, get_meter_display_name

router = APIRouter()

@router.get("/meter/{meter_id}")
async def get_meter(meter_id: str):
    return get_meter_data(meter_id)

@router.get("/name/{meter_id}")
async def get_meter_display_name_route(meter_id: str):
    return get_meter_display_name(meter_id)
