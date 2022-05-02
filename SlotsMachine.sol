//SPDX-License-Identifier: GPL-3.0
 
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract SlotsMachine is ERC20{
    address public owner;
    mapping(address => uint)  public  deposited;
    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;
    uint256 totalSupply_ = 1000000 ether;
    address public jackpot;
    address private devwallet;
    
    event Deposit(address sender, uint value);
    
    

    

     constructor() ERC20("SlotzMachine", "Slotz") { 
        _mint(msg.sender, 1000000 * 10 ** decimals());
        owner = msg.sender;
        balances[msg.sender] = totalSupply_ /2;
        jackpot = address(this);
        balances[address(this)] = totalSupply_ /2;
    }

    function balanceOf(address tokenOwner) public override view returns (uint256) {
        return balances[tokenOwner];
    }
    function totalSupply() public override view returns (uint256) {
    return totalSupply_;
    }
    function approve(address spender, uint256 tokens) public override returns (bool) {
        allowed[msg.sender][spender] += tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }
    function allowance(address sender, address spender) public override view returns (uint) {
        return allowed[sender][spender];
    }
    function transferFrom(address sender, address receiver, uint256 numTokens) public override returns (bool) {
        require(balances[sender] >= numTokens);
        require(allowed[sender][receiver] >= numTokens);

        balances[owner]-= numTokens;
        allowed[sender][receiver] -= numTokens;
        balances[receiver]+= numTokens;
        balances[sender]-= numTokens;

        emit Transfer(sender, receiver, numTokens);
        return true;
    }
    function transfer(address receiver, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] -= numTokens;
        balances[receiver] += numTokens;
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }
    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }
    //sets devwallet
    function setDevWallet (address newAddress) onlyOwner public {
        devwallet = newAddress;
    }
    
    // manages the funds added by the wallets and deposited to the contract
    function loadFunds( uint256 tokens) public payable {
        require(balances[msg.sender] >= tokens);       
        require(allowed[msg.sender][jackpot] >= tokens);
        balances[msg.sender]-= tokens;
        allowed[msg.sender][jackpot] -= tokens;
        balances[devwallet]+= (tokens*5)/100;
        balances[jackpot]+= (tokens*95)/100;
        deposited[msg.sender] += (tokens*95)/100;
        allowed[jackpot][msg.sender] += (tokens*95)/100;
        emit Deposit(msg.sender, msg.value);
    }
    // records every spin
    function spin (uint256 _spinAmount, uint256 _inGameTokens)public {
        require(deposited[msg.sender] >= _spinAmount);
        deposited[msg.sender] -= _spinAmount;
        allowed[jackpot][msg.sender] -= _spinAmount;

        if(_inGameTokens > 0){
            deposited[msg.sender] += _inGameTokens;
        }
    }

    // manages withdrawls 
    function withdrawFunds(uint256 tokensRequested) public payable {
            require(balances[jackpot] >= tokensRequested);
            require(deposited[msg.sender] >= tokensRequested);
            balances[jackpot] -= tokensRequested;
            balances[msg.sender] += (tokensRequested*95)/100;
            balances[devwallet]+= (tokensRequested*5)/100;
            deposited[msg.sender] -= tokensRequested;
    }

    function checkDeposit(address addy) public view returns(uint){
        return deposited[addy];
    }


    

    

    receive() external payable{
        balances[jackpot] += msg.value;
    }


    
}
