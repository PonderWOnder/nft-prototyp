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

### Load contract into ganache
```
npx truffle migrate
```

### Setup metamask account

From the docker-compose log output copy the first private key and create a account in metamask.

:TODO: describe keys and roles



## Misc
### Exec into ganache container

```
docker exec -it nft-prototyp_node_1 /bin/sh
```

### To test run within the /nft-prototyp

```
npx truffle test
```
