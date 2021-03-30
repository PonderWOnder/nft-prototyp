from web3.auto import w3
recover=w3.eth.account.recoverHash

def getaddress (msghash: str, sig: str):
    return recover(msghash,signature=sig)
