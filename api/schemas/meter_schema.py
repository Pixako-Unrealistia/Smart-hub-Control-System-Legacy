from pydantic import BaseModel

class MeterStateUpdate(BaseModel):
    state: bool
