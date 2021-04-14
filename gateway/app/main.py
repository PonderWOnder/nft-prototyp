import requests
from typing import Optional
from starlette.responses import RedirectResponse
from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel
from verify import connect, dataclass

con = connect()
app = FastAPI()
data=dataclass()
characters=[chr(i) for i in range(48,58)]+[chr(a) for a in range(97,123)]

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/verify/{add}")
async def verify_signature(add: str):
    try:
        res,pointer=con.getin(add)
        response=requests.get('http://'+pointer).content if res else {'One day you get it':'more luck next time'}
        return Response(content=response)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/apply")
def return_applicants():
    try:
        return data.owners['apply']
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.post("/apply")
async def set_applicants(address: str):
    try:
        if len(address)!=42: raise
        for ch in address.lower():
            if ch not in characters: raise
        data.owners['apply'].append(address)
        return address
    except Exception as e:
        raise ValueError(status_code=404, detail=str(e))
