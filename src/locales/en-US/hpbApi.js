const hpbApi = {
    'hpbApi.title': 'HPB Chain Developer APIs',
    'hpbApi.tip1': 'Access Blockchain Data',
    'hpbApi.tip2': 'Building DAPPs',
    'hpbApi.tip3': 'Verify Contracts',
    'hpbApi.tip4': 'Community Driven',
    'hpbApi.Introduction': 'Introduction',

    'hpbApi.Introduction.tip1': 'The HPB Chain Developer APIs are provided as a community service and without warranty, so please use what you need and no more. We support both GET/POST requests and there is a rate limit of 5 calls per sec/IP.',
    'hpbApi.Introduction.tip2':'Note: Source attribution via a link back or mention that your app is "Powered by hpb.io APIs" is required except for personal/private usage.',

    'hpbApi.Accounts': 'Accounts',
    'hpbApi.Accounts.tip1': 'Get HPB Balance for a single Address',
    'hpbApi.Accounts.tip2': 'Get HPB Balance for multiple Addresses in a single call',
    'hpbApi.Accounts.tip3': 'Separate addresses by comma, up to a maxium of 20 accounts in a single batch',
    'hpbApi.Accounts.tip4': 'Get HRC20-Token Account Balance for TokenContractAddress',
    'hpbApi.Accounts.tip5': `Get a list of 'Normal' Transactions By Address`,
    'hpbApi.Accounts.tip6': `[Optional Parameters] startblock: starting blockNo to retrieve results, endblock: ending blockNo to retrieve results`,
    'hpbApi.Accounts.tip7': `Returns up to a maximum of the last 10000 transactions only`,
    'hpbApi.Accounts.tip8': `or`,
    'hpbApi.Accounts.tip9': `To get paginated results use page=<page number> and offset=<max records to return>`,
    'hpbApi.Accounts.tip10': `Get a list of 'Internal' Transactions by Address`, 
    'hpbApi.Accounts.tip11': `Get "Internal Transactions" by Transaction Hash`, 
    'hpbApi.Accounts.tip12': `Get "Internal Transactions" by Block Range`, 
    'hpbApi.Accounts.tip13': `Get a list of "HRC-20 - Token Transfer Events" by Address`, 
    'hpbApi.Accounts.tip14': `To get transfer events for a specific token contract, include the contractaddress parameter`, 
    'hpbApi.Accounts.tip15': `Get a list of "HRC-721 - Token Transfer Events" by Address`, 
    'hpbApi.Accounts.tip16': `Get list of Blocks Validated by Address`, 


    'hpbApi.Contracts': 'Contracts',

    'hpbApi.Contracts.tip1': 'Get Contract ABI for Verified Contract Source Codes ',
    'hpbApi.Contracts.tip2': 'Get Contract Source Code for Verified Contract Source Codes',

    'hpbApi.Transaction': 'Transaction',
    'hpbApi.Transaction.tip1': 'Check Transaction Receipt Status',
    'hpbApi.Transaction.tip2': 'Note: status: 0 = Fail, 1 = Pass.',
    

    'hpbApi.Block': 'Block',

    'hpbApi.Block.tip1': 'Get Block Rewards by BlockNo',
    'hpbApi.Block.tip2': 'Get Estimated Block Countdown Time by BlockNo',
    'hpbApi.Block.tip3': 'Get Block Number by Timestamp',
    'hpbApi.Block.tip4': `[Parameters] timestamp format: Unix timestamp (supports Unix timestamps in seconds), closest value: 'before' or 'after'`,

    'hpbApi.Log': 'Log',
    'hpbApi.Log.tip1': 'The Event Log API was designed to provide an alternative to the native eth_getLogs. This is a POST request.',
    'hpbApi.Log.tip2': 'Here are some example of how this api may be used',
    'hpbApi.Log.tip3': `Get event logs from block number 13920200 to block number 13920300, where log address is 0x715aA09E6950ffDBda55Cea77f72dd7F52Ae1A62 and topic0 is "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"`,
    'hpbApi.Log.tip4': `Get event logs from block number 13920200 to block number 13920300, where log address is 0x715aA09E6950ffDBda55Cea77f72dd7F52Ae1A62 and topic0,topic1 is nay and topic3 is "0x00000000000000000000000075ecd1ab06c4e34763a47e1033e80de614d09fa4"`,
    'hpbApi.Log.tip5':'Tips: max range between "fromBlock" and "toBlock" is 10000.',
    
    'hpbApi.Proxy': 'Proxy',
    'hpbApi.Proxy.tip1': 'The following are the limited list of supported Proxied APIs for HPB available through HScan.',
    'hpbApi.Proxy.tip2': 'Returns the number of most recent block',
    'hpbApi.Proxy.tip3': 'Returns information about a block by block number',
    'hpbApi.Proxy.tip4': 'Returns the number of transactions in a block from a block matching the given block number',
    'hpbApi.Proxy.tip5': 'Returns the information about a transaction requested by transaction hash',
    'hpbApi.Proxy.tip6': 'Returns information about a transaction by block number and transaction index position',
    'hpbApi.Proxy.tip7': 'Returns the number of transactions sent from an address',
    'hpbApi.Proxy.tip8': 'Creates new message call transaction or a contract creation for signed transactions',
    'hpbApi.Proxy.tip9': 'Replace the hex value with your raw hex encoded transaction that you want to send.',
    'hpbApi.Proxy.tip10': 'Returns the receipt of a transaction by transaction hash',
    'hpbApi.Proxy.tip11': 'Executes a new message call immediately without creating a transaction on the block chain',
    'hpbApi.Proxy.tip12': 'The gas parameter to eth_call is 10000000',
    'hpbApi.Proxy.tip13': 'Returns code at a given address',
    'hpbApi.Proxy.tip14': 'Returns the value from a storage position at a given address',
    'hpbApi.Proxy.tip15': 'Returns the current price per gas in wei',
    'hpbApi.Proxy.tip16': `Makes a call or transaction, which won't be added to the blockchain and returns the used gas, which can be used for estimating the used gas`,
    'hpbApi.Proxy.tip17': `The gas parameter to eth_estimateGas is 10000000`,


    'hpbApi.Tokens': 'Tokens',
    'hpbApi.Tokens.tip1': 'Get HRC20-Token TotalSupply by ContractAddress',
    'hpbApi.Tokens.tip2': 'Get HRC20-Token Circulating Supply by ContractAddress',
    'hpbApi.Tokens.tip3': 'Get HRC20-Token Account Balance for TokenContractAddress',

    'hpbApi.Stats': 'Stats',
    'hpbApi.Stats.tip1': 'Get Total Supply of HPB on the HPB Chain',
    'hpbApi.Stats.tip2': 'Result returned in Wei, to get value in HPB divide the ResultAbove/1000000000000000000',
    'hpbApi.Stats.tip3': 'Get MarketCap of HPB on the HPB Chain',
    'hpbApi.Stats.tip4': 'Get HPB Last Price',
    'hpbApi.Stats.tip5': 'Get HPB Circulating Supply',
    'hpbApi.Stats.tip6': 'Get Token Price by Address',

    'hpbApi.RPC': 'Public RPC Nodes',
    'hpbApi.RPC.tip1': 'Public HPB RPC Nodes',
    'hpbApi.RPC.tip2': 'Mainnet HPB RPC Nodes',
    'hpbApi.RPC.tip3': 'Mainnet HPB RPC Endpoints (ChainID 269)',
    'hpbApi.RPC.tip4': 'Usage Notes',
    'hpbApi.RPC.tip5': 'Start',
    'hpbApi.RPC.tip6': 'You can start the HTTP JSON-RPC with the --rpc flag',
    'hpbApi.RPC.tip7': 'geth attach  https://hpbnode.com ',
    'hpbApi.RPC.tip8': 'JSON-RPC methods',
    'hpbApi.RPC.tip9': 'Please refer to this wiki page or use Postman',

    'hpbApi.RandomNumber': 'Random Number',
    'hpbApi.RandomNumber.tip1': 'Get Random Number on the HPB Chain',
    'hpbApi.RandomNumber.tip2': 'Get Random Number By Timestamp on the HPB Chain',
    'hpbApi.RandomNumber.tip3': `The random number is obtained according to the timestamp. The timestamp parameter represents the timestamp accuracy to seconds.
    Format represents the returned format. If not written, the default is 16-base string, and dec represents 10-base. 
    Decimals represents the number of bits reserved in 10-base return.`,
    'hpbApi.RandomNumber.tip4':'Get Random Number By Block on the HPB Chain',
    'hpbApi.RandomNumber.tip5':` The random number is obtained according to the block height, and the blockno parameter represents the block height. 
    Format represents the returned random number format. 
    If not written, the default is 16-base string, and dec represents 10-base. Decimals represents the number of bits reserved in 10-base return.`,
     
  };
  
  export default hpbApi;
  