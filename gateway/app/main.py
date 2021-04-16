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

class pointer(BaseModel):
    URI: str
    User: str=''
    PW: str=''

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


@app.post("/apply")
async def set_login(Pointer:pointer):
    try:
        data.logins[Pointer.URI]={'User':Pointer.User,'PW':Pointer.PW}
        print('Got Data in')
        return data.logins[Pointer.URI]
    except Exception as e:
        print('Something went wrong')
        raise ValueError(status_code=404, detail=str(e))
