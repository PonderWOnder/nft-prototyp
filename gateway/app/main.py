from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from verify import connect

con = connect()
app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/verify/{add}")
async def verify_signature(add: str):
    try:
        response='praise the lord' if con.getin(add) else 'more luck next time'
        return {'You are in': response}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
