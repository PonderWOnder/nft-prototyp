from web3 import Web3
from web3.auto import w3
from os import path
from time import time
import json


class connect():

    def __init__ (self,node=None,location=None):
        self.node='http://node:8545' if node==None else node
        self.web3 = Web3(Web3.HTTPProvider(self.node))
        print('Gateway is connected:',self.web3.isConnected())
        self.recover=w3.eth.account.recoverHash

        self.location='/contracts/nexyohub.json' if location==None else location
        with open(path.abspath(self.location),'r') as data:
            self.contract_json=json.load(data)
        self.abi=self.contract_json['abi']
        self.Caddress=self.contract_json['networks'][self.web3.net.version]['address']
        self.contract=self.web3.eth.contract(address=self.Caddress,abi=self.abi)

    def reconnect(self,add):
        if add!=self.Caddress:
            self.Caddress=add
            self.contract=self.web3.eth.contract(address=self.Caddress,abi=self.abi)

    def getaddress (self, msghash: str, sig: str):
        return self.recover(msghash,signature=sig)

    def getin (self,add: str):
        offset=len(add)-241
        print(add[67+offset:199+offset],add[199+offset:])
        self.reconnect(add[199+offset:])
        return self.checksig(add[66:67+offset],add[:66],add[67+offset:199+offset])

    def checksig (self,token_id: str,msghash: str, sig: str):
        tokens=self.contract.functions.myTokens(self.getaddress(msghash,sig)).call()
        owner=self.contract.functions.ownerOf(int(token_id)).call()
        pointer=self.contract.functions.pointerOf(int(token_id)).call()
        expirer=self.contract.functions.tokenexpires(int(token_id)).call()
        text=owner[2:]+pointer
        localhash=self.web3.keccak(text=text).hex()
        if int(token_id) in tokens and msghash==localhash and (expirer==0 or time()<expirer):
            return True,pointer
        else:
            return False,pointer

class dataclass(): #own class is propably overkill but let's see were this goes...

    def __init__(self):
        self.owners={}
        self.logins={}
        self.rootcontract=''
