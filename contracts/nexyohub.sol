// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract nexyohub {
  uint _minstake = 32000000000000000000;
  mapping(string => uint8) private pointerExists;
  mapping(address => bool) private DataOwners;
  mapping(uint => address) public owners;
  mapping(uint => string) public pointers;
  mapping(uint => uint) public prices;
  mapping(uint => bool) public sellable;
  mapping(address => uint[]) private OwnerShip;
  mapping(uint => uint) private NFTArrayPos;
  string name_;
  string sign_;
  address payable owner;
  uint token_id=0;
  uint pointer_id=0;
  uint pointer_uid=0;
  string[] pointerarray;
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

  modifier onlyContract {
    require(address(this)==msg.sender, 'The function you are trying to enter is prohibited');
    _;
  }

  event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);

  event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

  event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

  event contracttookmymoney(address thisContract, uint myMoney);

  receive () external payable {
      emit contracttookmymoney(address(this), msg.value);
  }

  function makePointer (string memory pointer) public onlyOwner {
    require(pointerExists[pointer]!=1,'Pointer is already useable');
    if (pointerExists[pointer]==0) {
      pointerExists[pointer]=1;
      pointerarray.push(pointer);
      pointer_id++;
    } else {
      pointerExists[pointer]=1;
      pointer_uid--;
    }
  }

  function revokePointer (string memory pointer) public onlyOwner {
    require(isPointerthere(pointer)==true,'Pointer is already unuseable');
    pointerExists[pointer]=2;
    pointer_uid++;
  }

  function mint_to (address newowner, string memory pointer) public {
    require(isDataOwnerthere(newowner), 'No Account with this Hub');
    require(isPointerthere(pointer));
    owners[token_id]=newowner;
    uint len;
    OwnerShip[newowner].push(token_id);
    len=OwnerShip[newowner].length-1;
    NFTArrayPos[token_id]=len;
    pointers[token_id]=pointer;
    prices[token_id]=stdPrice;
    sellable[token_id]=false;
    token_id++;
  }

  function mint (string memory pointer) public onlyOwner {
    require(isPointerthere(pointer), 'Provided Pointer does not exist with contract');
    owners[token_id]=address(this);
    uint len;
    OwnerShip[address(this)].push(token_id);
    len=OwnerShip[address(this)].length-1;
    NFTArrayPos[token_id]=len;
    pointers[token_id]=pointer;
    prices[token_id]=stdPrice;
    sellable[token_id]=true;
    token_id++;
  }

  function setPrice (uint cost, uint token) public {
    require(owners[token]==msg.sender, 'This Operation can only be accessed by the token owner');
    prices[token]=cost*stdPrice;
  }

  function transferFrom(address _from, address _to, uint _tokenId) public payable {
    require(owners[_tokenId]==_from, 'Address does not hold specific token');
    require(prices[_tokenId]<=msg.value, 'Please provide sufficient funds');
    payable(_from).transfer(msg.value);
    redoOwnerShipArray (_from,_to,_tokenId);
    owners[_tokenId]=_to;
    emit Transfer(_from, _to, _tokenId);
  }

  function redoOwnerShipArray (address _from, address _to, uint _tokenId) internal {
    uint pos;
    uint arraylen;
    pos=NFTArrayPos[_tokenId];
    arraylen=OwnerShip[_from].length;
    uint[] memory array=new uint[](arraylen);
    array=OwnerShip[_from];
    uint[] memory newarray=new uint[](arraylen-1);
    for (uint i=0; i<pos; i++){
      newarray[i]=array[i];
    }
    uint len;
    len=array.length;
    for (uint i=pos+1; i<len; i++){
      newarray[i-1]=array[i];
    }
    uint newlen=newarray.length;
    require(newlen<len,'Arrays are of equal distance and suggest that nothing much happend');
    OwnerShip[_from]=newarray;
    OwnerShip[_to].push(_tokenId);
    pos=OwnerShip[_to].length-1;
    NFTArrayPos[_tokenId]=pos;
  }

  function redoOwnerShipArraypub (address _from, address _to, uint _tokenId) public {
    redoOwnerShipArray (_from,_to,_tokenId);
  }

  function buy(uint _tokenid) external payable {
    require(owners[_tokenid]==address(this), "You only can by from this contract");
    transferFrom(address(this), msg.sender, _tokenid);
  }

  function buyableTokens() external view returns(uint[] memory) {
    uint[] memory array;
    uint len;
    array=OwnerShip[address(this)];
    len=array.length;
    uint x;
    for (uint i=0; i<len; i++) {
      if (sellable[array[i]]==true) {
        x++;
      }
    }
    uint[] memory newarray = new uint[](x);
    x=0;
    for (uint i=0; i<len; i++) {
      if (sellable[array[i]]==true) {
        newarray[x]=array[i];
        x++;
      }
    }
    return newarray;
  }

  function balance() external view returns (uint) {
    uint len;
    len=OwnerShip[msg.sender].length;
    return len;
  }

  function myTokens(address sender) external view returns(uint[] memory) {
    uint[] memory array;
    array=OwnerShip[sender];
    return array;
  }

  function useablePointers() external view returns (string[] memory) {
    string[] memory somepointers= new string[](pointer_id-pointer_uid);
    uint len=pointerarray.length;
    uint x=0;
    string memory point='';
    for (uint i=0; i<len; i++) {
      point=pointerarray[i];
      if (isPointerthere(point)) {
        somepointers[x]=point;
        x++;
      }
    }
    return somepointers;
  }

  function price(uint token) external view returns (uint) {
    return prices[token];
  }

  function ownerOf(uint256 _tokenId) external view returns (address) {
    return owners[_tokenId];
  }

  function pointerOf(uint256 _tokenId) external view returns (string memory) {
    return pointers[_tokenId];
  }

  function addDataOwner(address dataowner) public onlyOwner {
    DataOwners[dataowner]=true;
  }

  function whoisOwner() public view returns(address) {
    return owner;
  }

  function isPointerthere (string memory pointer) public view returns (bool){
    return pointerExists[pointer]==1;
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

  function returnAddress () public view returns (address){
    return address(this);
  }

  function returnSign () public view returns (string memory){
    return sign_;
  }

  function terminate() public onlyOwner {
    selfdestruct(owner);
  }
}
