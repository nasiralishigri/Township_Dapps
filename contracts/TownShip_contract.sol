pragma solidity ^0.5.0;

contract TownShip_Contract {

    address payable owner;
    mapping(address => uint) balances;
    uint priceOfToken;
    mapping(address =>uint) participent_tokens;
    uint ownerTokens;
    mapping(address => uint256) balanceOf;
    uint startDate;
    uint totalToken = 5000;



    constructor () public payable {
        
        owner = msg.sender;
        participent_tokens[msg.sender] = totalToken;
        priceOfToken = 1000;
        startDate= now;
    }
    
    modifier onlyAdmin()
    {
        require(msg.sender == owner);
        _;
    }

    modifier notAdmin()
    {
        require(msg.sender != owner);
        _;
    }
    // buy Token Function
    function buyToken(uint no) public notAdmin payable returns(uint) {
        require(no >0 ,"Must be more than one Token");
        require(msg.sender.balance > no * priceOfToken , "Balance is not enough in Your Account");
        participent_tokens[owner] -= no;
        balanceOf[owner] += no *priceOfToken;
        participent_tokens[msg.sender] += no;
        //owner.transfer(no *priceOfToken);
        return no;
      
    }

// Check The NO of Tokens Received    
    function checkTokensEarned()public view returns(uint)
    {
        require(msg.sender != owner ,"The Request Sender is Owner You are Owner");
        return participent_tokens[msg.sender];

    }
    // Check the Price of Token Price
    function tokenPrice()public view returns(uint256){
        
        return priceOfToken;
    }
    
    // Function Destroy the Contract this can did by Admin only
    function selfdestructFunction()public onlyAdmin returns(bool)
    {
          selfdestruct(msg.sender); 
          return true;
    }
    
    // function for Claim to OwnereShip
    function clamOwnerShip()public view returns(uint){
             require(now > startDate+ 10000000000000000, "Time is Finished for Claim Wait for another Auction");
             require(participent_tokens[msg.sender]> 1110 , "You are Not Eligible for this OwnerShip\nYou have + 'participent_tokens[msg.sender]' Tokens Minimum Token need to be owner is 1110" );
             
    }
    // Function token sold 
    function tokenSold()public view returns(uint256) {
        return totalToken - participent_tokens[owner];        
    }
    // function token Left for Sold
    function tokenLeft() public view returns(uint){
         uint tokensSold= tokenSold();
        return totalToken - tokensSold;
    }
    // Return total token for sold 
    function totalTokens() public view returns(uint){
        return totalToken;
    }
    // Return Owner Address
    function ownerAddress()public view returns(address){
        return owner;
    }
    // Return the Caller or The User Address
    function userAddress()public view returns(address){
        return msg.sender;
    }
    // REturn Balance of The Current User
    function myBalanceIs()public view returns(uint){
        return balances[msg.sender];
    }
    
}