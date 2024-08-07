from fastapi import FastAPI
from routes import meter_routes
import sys


app = FastAPI()

app.include_router(meter_routes.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}


# for debugging | will be removed in production
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)



    # gunicorn -k uvicorn.workers.UvicornWorker -w 4 -b 0.0.0.0:8000 main:app --reload
