// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract nexyohub {
  uint _minstake = 32000000000000000000;
  mapping(string => bool) private pointerExists;
  mapping(address => bool) private DataOwners;
  mapping(uint => address) public owners;
  mapping(uint => string) public pointers;
  mapping(uint => uint) public prices;
  mapping(uint => bool) public sellable;
  string name_;
  string sign_;
  address payable owner;
  uint token_id=0;
  uint stdPrice=1000000000000000000;

  constructor(string memory _name) {
    require(msg.sender.balance >= _minstake, 'Please provide suffient Funds');
    name_=_name;
    sign_='NXNFT';
    owner=payable(msg.sender);
    DataOwners[address(this)]=true;
  }

  modifier onlyOwner {
    require(owner==msg.sender, 'This Operation can only be accessed by the contract owner');
    require(msg.sender.balance >= _minstake, 'Please provide suffient Funds');
    _;
  }

  event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);

  event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

  event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

  function makePointer (string memory pointer) public onlyOwner {
    pointerExists[pointer]=true;
  }

  function revokePointer (string memory pointer) public onlyOwner {
    pointerExists[pointer]=false;
  }

  function mint_to (address newowner, string memory pointer) public {
    require(isDataOwnerthere(newowner), 'No Account with this Hub');
    require(isPointerthere(pointer));
    owners[token_id]=newowner;
    pointers[token_id]=pointer;
    prices[token_id]=stdPrice;
    sellable[token_id]=false;
    token_id++;
  }

  function mint (string memory pointer) public onlyOwner {
    require(isPointerthere(pointer), 'Provided Pointer does not exist with contract');
    owners[token_id]=address(this);
    pointers[token_id]=pointer;
    prices[token_id]=stdPrice;
    sellable[token_id]=true;
    token_id++;
  }

  function setPrice (uint price, uint token) public {
    require(owners[token]==msg.sender, 'This Operation can only be accessed by the token owner');
    prices[token]=price;
  }

  function transferFrom(address _from, address _to, uint _tokenId) external payable {
    require(owners[_tokenId]==_from, 'Address does not hold specific token');
    require(prices[_tokenId]==msg.value, 'Please provide sufficient funds');
    payable(_from).transfer(msg.value);
    owners[_tokenId]=_to;
  }

  function ownerOf(uint256 _tokenId) external view returns (address) {
    return owners[_tokenId];
  }

  function addDataOwner(address dataowner) public onlyOwner {
    DataOwners[dataowner]=true;
  }

  function whoisOwner() public view returns(address) {
    return owner;
  }

  function isPointerthere (string memory pointer) public view returns (bool){
    return pointerExists[pointer]==true;
  }

  function isDataOwnerthere (address dataowner) public view returns (bool){
    return DataOwners[dataowner]==true;
  }

  function nextNFTid () public view returns(uint){
    return token_id;
  }

  function returnContractName () public view returns (string memory){
    return name_;
  }

  function terminate() public onlyOwner {
    selfdestruct(owner);
  }
}
