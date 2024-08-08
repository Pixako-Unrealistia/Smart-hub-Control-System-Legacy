# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import meter_routes

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",  # Add your frontend's origin
    # Add more origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(meter_routes.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}

# for debugging | will be removed in production
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
