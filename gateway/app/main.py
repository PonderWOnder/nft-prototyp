import requests
from typing import Optional
from starlette.responses import RedirectResponse
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from verify import connect, dataclass

con = connect()
app = FastAPI()
data=dataclass()
characters=[chr(i) for i in range(48,58)]+[chr(a) for a in range(97,123)]

app.add_middleware(CORSMiddleware,allow_origins=['http://localhost:3000'],allow_methods=['POST'],allow_headers=['*'])
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
        response=requests.get('http://'+pointer).content if res else '<table><tr><td><img src=\'https://cdn3.iconfinder.com/data/icons/universal-signs-symbols/128/do-not-enter-128.png\'/></td><td><h1>You really should own what you want!<br>One day you get it...<br>more luck next time!</h1></td></tr></table>'
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


@app.get("/apply/{add}")
async def logins(add: str):
    try:
        return data.logins[add]
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
