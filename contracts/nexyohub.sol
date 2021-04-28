// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract nexyohub {
//The actual NFT
  mapping(uint => address) public owners;
  mapping(uint => string) public pointers;
  mapping(uint => uint) public prices;
  mapping(uint => bool) public sellable;
//Contract capabilities to make the app possible
  mapping(uint => bool) private resell;
  mapping(uint => uint) private clock;
  mapping(uint => uint) private expirer;
  mapping(string => uint8) private pointerExists; //Keeps Track of Pointer Status. 0 Does not exists, 1 Pointer is useable, 2 Pointer was revoked, 3 Pointer still needs Owner approval.
  mapping(address => uint[]) private DataOwners; //Tracks the Pointers owned by a specific address
  mapping(address => uint[]) private OwnerShip; //Tracks NFT Ownership for fast ownership requests
  mapping(uint => uint) private NFTArrayPos; //Tracks NFT postion in Ownership Array for fast ownership requests
  string name_;
  string sign_;
  address payable owner;
  uint token_id=0;
  uint pointer_id=0;
  uint pointer_uid=0;
  uint pointerstoapprove=0;
  string[] pointerarray; //I don't like how this is structured. It really needs a rework!
  address[] PointerOwners; //Same here! Also this makes it practacally impossible to use a revoked Pointer by another User...

  uint _minstake=32000000000000000000;
  uint stdPrice=1000000000000000000;

  constructor(string memory _name) { //sign_ will get an option too!
    require(msg.sender.balance >= _minstake, 'Please provide suffient Funds');
    name_=_name;
    sign_='NXNFT';
    owner=payable(msg.sender);
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
  //This sets the value to a key in the mapping pointerExists to one which represents the existens of a pointer. Furthermore the pointer it self is added to an array of pointers.
  function makePointer (string memory pointer) public {
      require(DataOwners[msg.sender].length>0 || msg.sender==owner, 'Not a Data Owner');
      require(pointerExists[pointer]!=1 && pointerExists[pointer]!=3,'Pointer is already in use');
      if (pointerExists[pointer]==0) {
        if (msg.sender==owner) {
          pointerExists[pointer]=1;
        } else {
          pointerExists[pointer]=3;
          pointerstoapprove++;
          pointer_uid++;
        }
        pointerarray.push(pointer);
        PointerOwners.push(msg.sender);
        if (DataOwners[msg.sender].length>0) {
          if (DataOwners[msg.sender][0]>pointer_id) { //checks if first entry is approval entry
            DataOwners[msg.sender][0]=pointer_id;
          } else {
            DataOwners[msg.sender].push(pointer_id);
          }
        } else {
          DataOwners[msg.sender].push(pointer_id);
        }
        pointer_id++;
      } else {
        pointerExists[pointer]=1;
        pointer_uid--;
      }
  }

  function revokePointers (string[] memory _pointers) public onlyOwner {
    uint len=_pointers.length;
    for (uint i=0;i<len;i++) {
      require(isPointerthere(_pointers[i])!=true,'Pointer is already unuseable');
      if(pointerExists[_pointers[i]]==3) {
        pointerstoapprove--;}
      pointerExists[_pointers[i]]=2;
    }
  }

  function approvePointers (string[] memory _pointers) public onlyOwner {
    uint len=_pointers.length;
    for (uint i=0;i<len;i++) {
      if(pointerExists[_pointers[i]]==3){
        pointerExists[_pointers[i]]=1;
        pointerstoapprove--;
        pointer_uid--;
      }
    }
  }

  function mint_to (address newowner, string memory pointer) public {
    require(isDataOwnerthere(newowner), 'No Account with this Hub');
    require(isPointerthere(pointer));
    require(doyouownPointer(pointer), 'You do not own this pointer');
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

  function mint (string memory pointer) public {
    require(isPointerthere(pointer), 'Provided Pointer does not exist with contract');
    require(isDataOwnerthere(msg.sender), 'You have not sufficient rights for this action');
    //require(doyouownPointer(pointer), 'You do not own this pointer');
    owners[token_id]=msg.sender;
    uint len;
    OwnerShip[msg.sender].push(token_id);
    len=OwnerShip[msg.sender].length-1;
    NFTArrayPos[token_id]=len;
    pointers[token_id]=pointer;
    prices[token_id]=stdPrice;
    sellable[token_id]=false;
    resell[token_id]=false;
    clock[token_id]=0;
    token_id++;
  }

  function mintwithOptions (string memory pointer, bool _resell, uint _timeLock, bool _sell) public {
    require(isPointerthere(pointer), 'Provided Pointer does not exist with contract');
    require(isDataOwnerthere(msg.sender), 'You have not sufficient rights for this action');
    require(doyouownPointer(pointer), 'You do not own this pointer');
    owners[token_id]=msg.sender;
    uint len;
    OwnerShip[msg.sender].push(token_id);
    len=OwnerShip[msg.sender].length-1;
    NFTArrayPos[token_id]=len;
    pointers[token_id]=pointer;
    prices[token_id]=stdPrice;
    sellable[token_id]=_sell;
    if (!_resell) {
      resell[token_id]=!_resell;
    }
    if (_timeLock!=0) {
      clock[token_id]=_timeLock;
    }
    token_id++;
  }

  function setPrice (uint cost, uint token) public {
    require(owners[token]==msg.sender, 'This Operation can only be accessed by the Token Owner');
    prices[token]=cost*stdPrice;
  }

  function resellOptions(uint _tokenid, bool _resell, uint _timeLock) external {
    require(doyouownPointer(pointers[_tokenid]));
    if (!_resell) {
      resell[_tokenid]=!_resell;
    }
    if (_timeLock!=0) {
      clock[_tokenid]=_timeLock;
    }
  }

  function sendback (uint _tokenid) external {
    address sendbackaddress=whoownsPointer(pointers[token_id]);
    require((msg.sender==owners[_tokenid] || msg.sender==owner || msg.sender==sendbackaddress) && (clock[_tokenid]<block.timestamp && clock[token_id]>0), 'Return your own Token, Punk!');
    uint oldprice=prices[_tokenid];
    prices[token_id]=0;
    transferFrom(msg.sender,sendbackaddress,_tokenid);
    prices[token_id]=oldprice;
  }

  //Main transactional function. Manages all necessary Database entries regarding ownership
  function transferFrom(address _from, address _to, uint _tokenId) public payable {
    require(owners[_tokenId]==_from, 'Address does not hold specific token'); //_from being an option is insecure af!
    require(prices[_tokenId]<=msg.value, 'Please provide sufficient funds');
    if (msg.value!=0) {payable(_from).transfer(msg.value);}
    redoOwnerShipArray (_from,_to,_tokenId);
    owners[_tokenId]=_to;
    emit Transfer(_from, _to, _tokenId);
  }

  //this manages the OwnerShip mapping. If an ID drops from the array because coresponding token has a new owner this logic rebuilds the array.
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
    require(newlen<len,'Arrays are of equal size and suggest that nothing much happend');
    OwnerShip[_from]=newarray;
    OwnerShip[_to].push(_tokenId);
    pos=OwnerShip[_to].length-1;
    NFTArrayPos[_tokenId]=pos;
  }

  /*function redoOwnerShipArraypub (address _from, address _to, uint _tokenId) public {
    redoOwnerShipArray (_from,_to,_tokenId);
  }*/

  function buy(uint _tokenid) external payable {
    require(sellable[_tokenid]==true, "You only can buy NFTs marked as sellable");
    transferFrom(owners[_tokenid], msg.sender, _tokenid);
    if (clock[_tokenid]!=0) {expirer[_tokenid]=block.timestamp+clock[_tokenid];}
    sellable[_tokenid]=false; // Still a design choice where to put the sell inteaction
  }

  function sell(uint _tokenid) external {
    require(owners[_tokenid]==msg.sender, "You only can sell stuff you own");
    if (!doyouownPointer(pointers[_tokenid])) {require(resell[_tokenid]==false, "You only can sell stuff you own");}
    sellable[_tokenid]=true;
  }

  //this needs a redo since only the contract can sell tokens block.timestamp. Using a parameter in external view is suboptimal
  function buyableTokens(address sender) external view returns(uint[] memory) {
    uint x=0;
    for (uint i=0; i<token_id; i++) {
      if (sellable[i]==true && owners[i]!=sender) {
        x++;
      }
    }
    uint[] memory newarray = new uint[](x);
    x=0;
    for (uint i=0; i<token_id; i++) {
      if (sellable[i]==true && owners[i]!=sender) {
        newarray[x]=i;
        x++;
      }
    }
    return newarray;
  }

  //returns the length of the OwnerShipArray coresponding to the address of the message sender.
  function balance(address sender) external view returns (uint) {
    uint len;
    len=OwnerShip[sender].length;
    return len;
  }

  //returns the token ids of the address given as parameter. Using a parameter in external view is suboptimal
  function myTokens(address sender) external view returns(uint[] memory) {
    uint len=OwnerShip[sender].length;
    if (len>0) {
      uint x=0;
      for (uint i=0; i<len; i++) {
        if ((expirer[OwnerShip[sender][i]]==0 || expirer[OwnerShip[sender][i]]>=block.timestamp) || !resell[i]==true) {
          x++;
        }
      }
      uint[] memory array = new uint[](x);
      x=0;
      for (uint i=0; i<len; i++) {
        if ((expirer[OwnerShip[sender][i]]==0 || expirer[OwnerShip[sender][i]]>=block.timestamp) || !resell[i]==true) {
          array[x]=OwnerShip[sender][i];
          x++;
        }
      }
      return array;
    } else {
      uint[] memory array = OwnerShip[sender];
      return array;
    }
  }

  //returns all pointers currently available
  function useablePointers() external view onlyOwner returns (string[] memory) {
    string[] memory somepointers= new string[](pointer_id-pointer_uid);
    uint len=pointerarray.length;
    uint x=0;
    string memory point;
    for (uint i=0; i<len; i++) {
      point=pointerarray[i];
      if (isPointerthere(point)) {
        somepointers[x]=point;
        x++;
      }
    }
    return somepointers;
  }

  function whatownsDataOwner(address dataowner) public view returns(uint[] memory) {
    uint x=0;
    uint len=DataOwners[dataowner].length;
    if (len==0) {
      return new uint[](0);
    } else {
      for (uint i=0;i<len;i++) {
        if (DataOwners[dataowner][i]<pointer_id){x++;}
      }
      if (x==len) {return DataOwners[dataowner];}
      else{
        uint[] memory pointer_ids= new uint[](x);
        for (uint i=0;i<len;i++) {
          if (DataOwners[dataowner][i]<pointer_id){
            pointer_ids[x]=DataOwners[dataowner][i];
            x--;
          }
        }
        return pointer_ids;
      }
    }
  }

  function doyouownPointer(string memory pointer) public view returns(bool) { //should propably be internal
    bool result=false;
    uint[] memory valuables=whatownsDataOwner(msg.sender);
    for(uint x=0; x<valuables.length; x++) {
      if (compareStrings(pointerarray[valuables[x]],pointer)) {
        result=true;
      }
    }
    return result;
  }

    function priceOf(uint _tokenId) external view returns (uint) {
      return prices[_tokenId];
    }

    function ownerOf(uint _tokenId) external view returns (address) {
      return owners[_tokenId];
    }

    function pointerOf(uint _tokenId) external view returns (string memory) {
      return pointers[_tokenId];
    }

    function tokensellable(uint _tokenId) external view returns (bool) {
      return sellable[_tokenId];
    }

    function tokenresellable(uint _tokenId) external view returns (bool) {
      return resell[_tokenId];
    }

    function tokenownable(uint _tokenId) external view returns (uint) {
      return clock[_tokenId];
    }

    function tokenexpires(uint _tokenId) external view returns (uint) {
      return expirer[_tokenId];
    }

  function addDataOwner(address dataowner) external onlyOwner {
    DataOwners[dataowner].push(pointer_id+10**15); //The offset used here is incredibly unelegant and should be replaced with a different mechanism
  }

  function dataowned(address ow) public view returns(uint[] memory) {
    return DataOwners[ow];
  }

  function compareStrings(string memory s1, string memory s2) internal pure returns(bool){
    return keccak256(abi.encodePacked(s1))==keccak256(abi.encodePacked(s2));
  }

  function whoisOwner() public view returns(address) {
    return owner;
  }

  function PointerstoApprove () external onlyOwner returns(string[] memory) {
    string[] memory variouspointers = new string[](pointerstoapprove);
    uint pos=0;
    uint len;
    len=pointerarray.length;
    for(uint x=0;x<len;x++) {
      if (pointerExists[pointerarray[x]]==3) {
        variouspointers[pos]=pointerarray[x];
        pos++;
      }
    }
    return variouspointers;
  }

  function isPointerthere (string memory pointer) public view returns (bool){
    return pointerExists[pointer]==1;
  }

  function isDataOwnerthere (address dataowner) public view returns (bool){
    return DataOwners[dataowner].length!=0;
  }

  function whoownsPointer (string memory _pointer) internal view returns (address) {
    uint len=pointerarray.length;
    for (uint i=0; i<len;) {
      if (compareStrings(pointerarray[i],_pointer)) {
        return PointerOwners[i];
        break;
      }
    }
  }

  function nextNFTid () public view returns(uint){
    return token_id;
  }

  function nextPointerid () public view returns(uint){
    return pointer_id;
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
