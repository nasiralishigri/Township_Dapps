App = {
  web3Provider: null,
	contracts: {},
	account: '0X0',
	tokenPrice: 1000000,
	tokenSold: 0,
	totalTokens:500000,
	loading: false,
	ownerAddress: '0X0',
	contract_Status: false,
  
  init: function() {
		console.log("App Is Initialized");
    return App.initWeb3();
  },

  initWeb3: async function() {
    /*
     * Replace me...
     */
	 // Modern dapp browsers...
								if (window.ethereum) {
								  App.web3Provider = window.ethereum;
								  try {
									// Request account access
									await window.ethereum.enable();
								  } catch (error) {
									// User denied account access...
									console.error("User denied account access")
								  }
								}
								// Legacy dapp browsers...
								else if (window.web3) {
								  App.web3Provider = window.web3.currentProvider;
								}
								// If no injected web3 instance is detected, fall back to Ganache
								else {
									App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
									
								}
								web3 = new Web3(App.web3Provider);

     return  App.initContract();
  },

  initContract: function() {
    /*
     * Replace me...
     */
	           console.log("Init Contract Function");
								 jQuery.getJSON("TownShip_Contract.json" , function(data) {
							  // Get the necessary contract artifact file and instantiate it with truffle-contract
							  var TownshipArtifact = data;
							  App.contracts.TownShip_Contract = TruffleContract(TownshipArtifact);

							  // Set the provider for our contract
							  App.contracts.TownShip_Contract.setProvider(App.web3Provider);

								// Initialaze our Smart Contract or Deploy on one account
								App.contracts.TownShip_Contract.deployed().then(function(townShopToken){
									console.log("Your Contract Address : "+townShopToken.address);
								});
							}).done(function(townShipToken){
								App.contracts.DappToken = TruffleContract(townShipToken);

							  // Set the provider for our contract
							  App.contracts.DappToken.setProvider(App.web3Provider);

								// Initialaze our Smart Contract or Deploy on one account
								App.contracts.DappToken.deployed().then(function(townShipTokenAdd){
									console.log("Your Token Address : "+townShipTokenAdd.address);
							
								});
								})
						

    return App.render();
  },

  render: function() {

							if(App.loading){
								return;
														}
							App.loading = true;
							
							var loader= $('#loader');
							var content= $('.container');

							loader.show();
							content.hide();
																		var tokenInstance;
																		web3.eth.getCoinbase(function(err, account){
																			if(err === null){
																				console.log("Account : "+ account);
																				App.account=account;
																				$('#accountAddress').html("Your Account is : " + account);
																			}
																		})
	
												jQuery.getJSON("TownShip_Contract.json" , function(data) {
													// Get the necessary contract artifact file and instantiate it with truffle-contract
													var TownshipArtifact = data;
													App.contracts.TownShip_Contract = TruffleContract(TownshipArtifact);

													// Set the provider for our contract
													App.contracts.TownShip_Contract.setProvider(App.web3Provider);

												App.contracts.TownShip_Contract.deployed().then(function(instance){
													tokenInstance=instance;
													return tokenInstance.tokenPrice();
												}).then(function(tokenPrice){ // Get The Price of Token 
													App.tokenPrice = tokenPrice;
													console.log("Check Token Price: "+ App.tokenPrice.toNumber());
											return tokenInstance.ownerAddress();
											}).then(function(ownerAddress){ // Get The Contract Deployer Address or Owner Address

												console.log("Owner Address: "+ ownerAddress);
												App.ownerAddress = ownerAddress;
												return tokenInstance.totalTokens();
											}).then(function(totalToken){ // Get The Total Token For Sale from Owner
												
												totalTokens = totalToken.toNumber();
												console.log("Total Token :  ",totalToken.toNumber());
												$('#totalToken').html(totalToken.toNumber());
											return tokenInstance.tokenSold();
										}).then(function(tokenSold){ // Get the No of Token Sold for showing the Progress Bar Percentage to the User
										console.log("Token Sold:  "+ tokenSold);
										$('#tokenSold').html(tokenSold.toNumber());

										var progressBar = (tokenSold /totalTokens) * 100;
										$('#progress_bar').css('width', progressBar + '%');
										App.loading = false;
										loader.hide();
										content.show();

										});
													});
			// Onclick on Any Button
		console.log("init Bind Event Function");
		App.loading = false;
		loader.hide();
		content.show();
		// On Click on Buy Token Button this Function called
		$('#btn_buyToken').click(function()
		{
  var NoOftokens = $('#tokenInput').val();
				if(NoOftokens <1 ){
				alert("Please Enter Token Number Between 1 - 2000");
				$('#tokenInput').val("");
				$('#tokenInput').attr('placeholder'," Token Between 1 - 1000");
				return;
													}
					if(App.ownerAddress == App.account){
					alert("You Are Owner Of This BoSS\n Make Other Peoples fool \n Still You Want To Buy HAHA..\n");
					$('#tokenInput').val("");
					return;
					}								
App.contracts.TownShip_Contract.deployed().then(function(instance)
{
	tokenInstance = instance;
	return tokenInstance.buyToken(NoOftokens);
}).then(function(noOfToken){
	return tokenInstance.tokenSold();
		}).then(function(tokenSold){ // Get the No of Token Sold
	console.log("Token Sold:  "+ tokenSold);
App.tokenSold=tokenSold.toNumber();
	$('#tokenSold').html(tokenSold.toNumber());
	var progressBar = (tokenSold /totalTokens) * 100;
	$('#progress_bar').css('width', progressBar + '%');

}).catch(function(err)
{
console.log(err);
});
		});
// Click on Token Price 
		jQuery('#btn_tokenPrice').click(function(){
			console.log(" Token Price Button Clcked");
			$('#btn_data').toggle();
    $('#btn_data').html("1 Token Price is : " +web3.fromWei(App.tokenPrice.toNumber() , 'ether') + "  ETH");
		});
  //  Token Earned Check
		$('#btnTokenEarned').click(function(){
			 console.log("Button Earned Clicked");
			 if(App.ownerAddress == App.account){ // if caller is owner then stop to access this account
				alert("You are owner You Cant Call This Function \n All You Check Tokens Left in your Account\n");
						return ;
			}
			App.contracts.TownShip_Contract.deployed().then(function(instance){
				tokenInstance = instance;
			
				return tokenInstance.checkTokensEarned();
				 }).then(function(tokenPrice){
					 $('#btn_data').toggle();
				 $('#btn_data').html("You have : " + tokenPrice.toNumber() + "   Token in Your Wallet ");
				 });
				
		});


			// Check Balance
			$('#btn_checkBalance').click(function(){
				web3.eth.getBalance(App.account, function (error, wei) {
					if (!error) {
							var balance = web3.fromWei(wei, 'ether');
							console.log(balance + " ETH");
							$('#btn_data').toggle();
							$('#btn_data').html("Your Balance is:  " + balance + "  ETH");
					}
			});
			});

		  //  Token Left for Sold
			$('#btnTokenLeft').click(function(){
				console.log("Button Token left");
			 App.contracts.TownShip_Contract.deployed().then(function(instance){
				 tokenInstance = instance;
				 return tokenInstance.tokenLeft();
					}).then(function(tokenPrice){
						$('#btn_data').toggle();
					$('#btn_data').html("Token Left : " + tokenPrice.toNumber() + "   for Sold ");
					});
		 });


 //  Button Destroy Contract Only By Admin
 $('#btnCloseContract').click(function(){
	console.log("Button Close/ Destroy Contract Call");
	if(App.account != App.ownerAddress){
		alert("This Permision is only for Admin\n Thanks");
		return;
	}
	var confirmation = confirm("You are Going To Destroy Contract\nDid You Want To Destroy Confirm!\n");
	if(confirmation == false){
		alert("Thanks You Contract is Running ...!")
		return;
	}
	var reason_CDest = prompt("Please Tell User To Reason of Destruction of Contract");
 App.contracts.TownShip_Contract.deployed().then(function(instance){
	 tokenInstance = instance;
	 return tokenInstance.selfdestructFunction();
		}).then(function(status){
			App.contract_Status = status;
			$('#btn_data').toggle();
		$('#btn_data').html(" \nThe Contract is Destroyed \n No more Longer Found\n");
		});
});


	}
	}
jQuery(function() {
		jQuery(window).on('load',function() {
			App.init();
		});
	});
