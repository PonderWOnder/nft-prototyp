// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./nexyohub.sol";
import "./nexyocircle.sol";

contract nexyotransact {
  address payable[] private hubs;
  address payable[] private circles;
  nexyohub private HubContract;
  nexyocircle private CircleContract;
  struct retarr {
    address _add;
    address _oadd;
    string _net;
    string _sign;
  }

  function addhub(address _add) external {
    require(!addressin(_add),'Address already in use'); //there needs to be some way to ID contracts to be part of the nexyo network. I have to think about this!!!
    hubs.push(payable(_add));
  }

  function addcircle(address _add) external {
    require(!addressin(_add),'Address already in use'); //there needs to be some way to ID contracts to be part of the nexyo network. I have to think about this!!!
    circles.push(payable(_add));
  }

  function addressin(address _add) internal view returns (bool) {
    bool isitin=false;
    uint len=hubs.length;
    for (uint x=0;x<len;x++) {
      if (hubs[x]==_add) {
        isitin=true;
      }
    }
    if (!isitin) {
      len=circles.length;
      for (uint x=0;x<len;x++) {
        if (circles[x]==_add) {
          isitin=true;
        }
      }
    }
    return isitin;
  }

  function listcontracts() external view returns (retarr[] memory) {
    uint lenh=hubs.length;
    uint lenc=circles.length;
    uint totlen=lenh+lenc;
    require(totlen>0, "There are no contracts");
    retarr[] memory retarr_=new retarr[](totlen);
    for (uint x=0;x<totlen;x++) {
      if (x<lenh) {
        retarr_[x]=retarr(hubs[x],whoisOwnerHub(hubs[x]),nexyohub(hubs[x]).returnContractName(),nexyohub(hubs[x]).returnSign());
      } else {
        retarr_[x]=retarr(circles[x-lenh],nexyocircle(circles[x-lenh]).whoisOwner(),nexyocircle(circles[x-lenh]).returnContractName(),nexyocircle(circles[x-lenh]).returnSign());
      }
    }
    return retarr_;
  }

  function returnNumberofHubswithinNetwork() public view returns (uint) {
    return hubs.length;
  }

  function mytokens() external view returns (uint) {
    uint len=hubs.length;
    uint tokens=0;
    require(len>0, "There are no contracts");
    for (uint x=0;x<len;x++) {
      uint[] memory tokenarr;
      tokenarr=myTokensHub(hubs[x],msg.sender);
      tokens=tokens+tokenarr.length;
    }
    return tokens;
  }

  function myhubs() external view returns (string[] memory) {
    uint len=hubs.length;
    uint z=0;
    string[] memory hubnames=new string[](z);
    if (len>0) {
      uint inter1;
      bool inter2;
      address inter3;
      for (uint x=0;x<len;x++) {
        inter1=myTokensHub(hubs[x],msg.sender).length;
        inter2=isDataOwnerthereHub(hubs[x],msg.sender);
        inter3=whoisOwnerHub(hubs[x]);
        if (inter1>0 || inter2 || msg.sender==inter3) {
          z++;
          string[] memory interarr=new string[](z);
          if (z>1) {
            for(uint y=0;y<hubnames.length;y++) {
              interarr[y]=hubnames[y];
            }
          }
          hubnames=interarr;
          hubnames[z-1]=nexyohub(hubs[x]).returnSign();
        }
      }
    }
    return hubnames;
  }

  function mycircles() external view returns (string[] memory) {
    uint len=circles.length;
    bool inter;
    bool[] memory truearr=new bool[](len);
    uint z=0;
    if (len>0) {
      for (uint x=0;x<len;x++) {
        inter=amIUserCircle(circles[x],msg.sender);
        truearr[x]=inter;
        if (inter) {z++;}
      }
    }
    string[] memory arr=new string[](z);
    uint i=0;
    for (uint y=0;y<len;y++) {
      if (truearr[y]) {
        arr[i]=nexyocircle(circles[y]).returnSign();
        i++;
      }
    }
    return arr;
  }

  function amIUserCircle(address payable _add,address _sender) public view returns(bool) {
    return nexyocircle(_add).amIUser(_sender);
  }

  function myTokensHub(address payable _add,address _sender) public view returns(uint[] memory) {
    return nexyohub(_add).myTokens(_sender);
  }

  function isDataOwnerthereHub(address payable _add,address _sender) public view returns(bool) {
    return nexyohub(_add).isDataOwnerthere(_sender);
  }

  function whoisOwnerHub(address payable _add) public view returns(address) {
    return nexyohub(_add).whoisOwner();
  }

  function returncontract(address payable _add) external view returns (address payable){ //kick this one from verify and delete it
    address payable add_;
    if(addressin(_add)) {
      return _add;
    } else {
      return add_;
    }
  }

  function returncontractaddresses() public view returns(address[] memory) {
    uint lenh=hubs.length;
    uint lenc=circles.length;
    uint totlen=lenh+lenc;
    address[] memory addarr=new address[](totlen);
    for (uint x=0;x<totlen;x++) {
      if (x<lenh) {
        addarr[x]=hubs[x];
      } else {
        addarr[x]=circles[x-lenh];
      }
    }
    return addarr;
  }

  function deletecircle(address _add) external {
    require(addressin(msg.sender),'Only registered Contracts can call this Function');
    address payable[] memory newaddarr=new address payable[](circles.length-1);
    uint z=0;
    for (uint x=0;x<circles.length;x++) {
      if (circles[x]==_add) {
        z++;
      } else {
        newaddarr[x-z]=circles[x];
      }
    }
    circles=newaddarr;
  }

  function returnaddress() public view returns (address) {
    return address(this);
  }
}
