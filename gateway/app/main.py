from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from verify import getaddress

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}


class VerifySignatureRequest(BaseModel):
    hash: str
    signature: str


@app.post("/verify-signature")
async def verify_signature(vsr: VerifySignatureRequest):
    try:
        return getaddress(vsr.hash, vsr.signature)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))