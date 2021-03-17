const nexyohub=artifacts.require('nexyohub');

contract('nexyohub', () => {
  let hub=null;
  let address=null;
  let pointer=null;
  let owner=null;
  let name=null;
  let addresses=null;
  let gasUsed=null;
  before(async () =>{
    await web3.eth.getAccounts().then(function(result){addresses=result});
    hub=await nexyohub.deployed();
    address=await hub.address;
    name=await hub.returnContractName();
    owner=await hub.whoisOwner();
    pointer='nexyo.com';
    console.log('Contract Name:',name);
    console.log('Contract Address:',address);
    console.log('Contract Owner:',owner);
    console.log('Ganache enviromente:\n', addresses);
  });
  it('Check if it deploys', async () => {
      await web3.eth.getBalance(
        addresses[0]).then(function(result){gasUsed=result});
      assert(address !== '');
  });
  it('Check if it creates new pointer', async () => {
      await hub.makePointer(pointer);
      const result= await hub.isPointerthere(pointer);
      assert(result==true);
  });
  it('Check if it makes itself dataowner', async () => {
      const response=await hub.isDataOwnerthere(address);
      assert(response==true);
  });
  it('Try out mint function', async () => {
    const id=await hub.nextNFTid();
    await hub.mint(pointer);
    const nextid=await hub.nextNFTid();
    assert(id!==nextid);
  });
  it('Add Data Owner', async () => {
    await hub.addDataOwner(addresses[1]);
    const result=await hub.isDataOwnerthere(addresses[1]);
    assert(result==true);
  });
  it('Try out mint to function', async () => {
    const id=await hub.nextNFTid();
    await hub.mint_to(addresses[1],pointer);
    const nextid=await hub.nextNFTid();
    assert(id!==nextid);
  });
  it('Transfer Token', async () => {
    const id=await hub.nextNFTid()-1;
    await hub.transferFrom(addresses[1],addresses[2],id,{
        from:addresses[2], value:1000000000000000000});
    const tokenowner=await hub.ownerOf(id);
    assert (tokenowner==addresses[2])
  });
  it('Retransfer Token', async () => {
    const id=await hub.nextNFTid()-1;
    await hub.transferFrom(addresses[2],addresses[1],id,{
        from:addresses[1], value:1000000000000000000});
    const tokenowner=await hub.ownerOf(id);
    assert (tokenowner==addresses[1])
  });
  it('Disapproved pointer', async () => {
    await hub.revokePointer(pointer);
    const isPointerthere=await hub.isPointerthere(pointer);
    assert (isPointerthere==false);
  });
  it('Test Gas Used', async () => {
    const receipt=await hub.terminate();
    await web3.eth.getBalance(
      addresses[0]).then(function(result){gasUsed=gasUsed-result});
    const tx=await web3.eth.getTransaction(receipt.tx);
    const gasPrice=tx.gasPrice;
    assert(gasUsed!==0);
    console.log('Unit Test Gas Usage:',Math.round(gasUsed/gasPrice));
  });
});
