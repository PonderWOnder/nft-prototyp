# nft-prototyp

NFT Prototyp


## Install Dependencies

```
sudo apt install nodejs
```

## install truffle via npm

```
npm install -g truffle
```

### Metamask

Setup metamask and select `localhost:8545` network.

## Run

### Start setup
```
docker-compose up
```
Sometimes the startup order get mixed up. If so restart the gateway docker container by typing
```
docker restart gateway
```

### Load contract into ganache
```
npx truffle migrate
```
Have fun!

### Setup metamask account

[MetaMask](https://metamask.io/) is a wallet software that can interact with most ERC compliant Ethereum Tokens. You can download MetaMask from [here](https://metamask.io/download.html)!
To setup MetaMask, first connect to the Test RPC ganache had setup for you. Click on the network list on top of the MetaMask window and connect to the Test RPC by creating a custom RPC using the URL http://localhost:8545 under the chain ID 5777.
<img src="/img/rpc.png" width="250">

After you managed to connect to the right network, from the docker-compose log output copy the first private key and create a account in MetaMask.
|Copy Key to-->|MetaMask|
|------------|-------------|
|<img src="/img/ganache_log.png">|<img src="/img/wallet.png">|

#### Private Keys:
Private Keys are 256 Bit (64 Hex) Hash Values generated by Elliptic Curve Encoding. To this Purpose the Nonce, Pass Value and Message Digest are fed into the keccak256 Function. Therefore Private Keys are pseudo-randomly generated Values that are the Corner Stone of Ethereum Encryption.

#### Public Keys:
Derived from the Private Key, Public Keys are asymmetrical 160 Bit (40 Hex) Derivatives of the secret Private Key. This means they can be deduced by the Private Key and all Messages encode by the Private Key but can not be used to determine the Private Key or encode Messages in a similar Way. This is very helpful to determine the Identity of an Message Sender since only the Holder of the secret Private Key can have signed a Message showing the corresponding Public Key.



## Misc
### Exec into ganache container

```
docker exec -it node /bin/sh
```

### To test run within the /nft-prototyp

```
npx truffle test
```
