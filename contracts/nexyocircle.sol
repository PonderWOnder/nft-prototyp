// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./boysintheband.sol";

contract nexyocircle {
  struct owners { //this is confuing
    address add;
    uint8 roll;
  }
  owners[] useraddresses;
  address payable owner;
  string network_;
  string sign_;
  address parentaddress;
  uint _minstake=5000000000000000000;

  constructor(string memory _network, string memory _sign, address _transactcont) {
    require(msg.sender.balance >= _minstake, 'Please provide suffient Funds');
    network_=_network;
    sign_=_sign;
    parentaddress=_transactcont;
    owners memory firstUser;
    owner=payable(msg.sender);
    firstUser.add=msg.sender;
    firstUser.roll=0;
    useraddresses.push(firstUser);
    nexyotransact bitb=nexyotransact(parentaddress);
    bitb.addcircle(address(this));
    emit create(useraddresses[0].add, address(this));
  }

  modifier onlyelevatedrolls {
    require(amIelevatedRoll(msg.sender), 'This Operation can only be accessed by elevated Rolls');
    _;
  }

  event create(address indexed _who, address indexed _where);

  receive () external payable {
      owner.transfer(msg.value);
  }

  function amIelevatedRoll (address _add) public view returns(bool) {
    uint len=useraddresses.length;
    bool backto=false;
    if (len>0) {
      for(uint x=0;x<len;x++) {
        if (useraddresses[x].add==_add) {
          if (useraddresses[x].roll<2) {
            backto=true;
            return backto;
          }
        }
      }
    }
    return backto;
  }

  function amIUser (address _add) public view returns(bool) {
    uint len=useraddresses.length;
    bool backto=false;
    if (len>0) {
      for(uint x=0;x<len;x++) {
        if (useraddresses[x].add==_add) {
          backto=true;
        }
      }
    }
    return backto;
  }

  function amIOwner () public view returns(bool) {
    bool backto;
    backto=useraddresses[0].add==msg.sender && useraddresses[0].roll==0;
    return backto;
  }

  function whoisOwner () public view returns(address) {
    require( useraddresses[0].roll==0, 'There has been some Problem. If you are in an elevated Roll please delete this Contract');
    return useraddresses[0].add;
  }

  function addUser (address _add, uint8 _roll) external onlyelevatedrolls {
    require(_roll>0 && !amIUser(_add),'You can not add a second Contract Owner or add the addresses more than once.');
    owners memory newUser;
    newUser.add=payable(_add);
    newUser.roll=_roll;
    useraddresses.push(newUser);
  }

  function returnallAddresses () external view returns(address[] memory) {
    uint len=useraddresses.length;
    address[] memory backtoarr = new address[](len);
    for(uint x=0;x<len;x++) {
      backtoarr[x]=useraddresses[x].add;
    }
    return backtoarr;
  }

  function returnSign () public view returns (string memory){
    return sign_;
  }

  function returnContractName () public view returns (string memory){
    return network_;
  }

  function terminate () external onlyelevatedrolls {
    require(amIOwner(), 'Once some dude did that. He is now in prison for his own safety!');
    address payable rightfull=payable(msg.sender);
    nexyotransact(parentaddress).deletecircle(address(this));
    selfdestruct(rightfull);
  }
}
