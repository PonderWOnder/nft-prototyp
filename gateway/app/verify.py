from web3 import Web3
from web3.auto import w3
from os import path
import json

class connect():

    def __init__ (self,node=None,location=None):
        self.node='http://172.18.0.2:8545' if node==None else node
        self.web3 = Web3(Web3.HTTPProvider(self.node))
        print('Gateway is connected:',self.web3.isConnected())
        self.recover=w3.eth.account.recoverHash

        self.location='/contracts/nexyohub.json' if location==None else location
        with open(path.abspath(self.location),'r') as data:
            self.contract_json=json.load(data)
        abi=self.contract_json['abi']
        Caddress=self.contract_json['networks'][self.web3.net.version]['address']
        self.contract=self.web3.eth.contract(address=Caddress,abi=abi)



    def getaddress (self, msghash: str, sig: str):
        return self.recover(msghash,signature=sig)

    def getin (self,add: str):
        offset=len(add)-199
        return self.checksig(add[66:67+offset],add[:66],add[67+offset:])

    def checksig (self,token_id: str,msghash: str, sig: str):
        tokens=self.contract.functions.myTokens(self.getaddress(msghash,sig)).call()
        owner=self.contract.functions.ownerOf(int(token_id)).call()
        pointer=self.contract.functions.pointerOf(int(token_id)).call()
        text=owner[2:]+pointer
        localhash=self.web3.keccak(text=text).hex()
        if int(token_id) in tokens and msghash==localhash:
            return True,pointer
        else:
            return False,pointer

class dataclass(): #own class is propably overkill but let's see were this goes...

    def __init__(self):
        self.owners={}
        self.logins={}
