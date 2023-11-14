# 6. 浏览器数据来源拆解

## 6.1 参考
  
（1）Etherscan API中文版

http://cw.hubwiz.com/card/c/etherscan-api/

（2）Etherscan API官方版

https://cn.etherscan.com/apis

（3）how-to-get-contract-internal-transactions

https://ethereum.stackexchange.com/questions/3417/how-to-get-contract-internal-transactions

## 6.2 浏览器页面/接口拆解

### ✅ HOME页【优先级-A】

**链接：**https://hecoinfo.com/

**分析:**

(1) WEB SOCKET实时更新，数据拉取最新块信息。

```javascript
eth_getBlockByNumber获取
```

(2) 跟价格相关的，需要单独喂价或者查询更新。

**数据库设计:**



**问题:**

（1）ACTIVE VALIDATOR, TOTAL STAKED的获取方式？- 

（2）关于市场相关的价格信息是查询外部价格获取吗？还是WEB SOCKET实时更新呢？



### BLOCK页

#### ✅ BLOCK 列表页【优先级-A】

**链接：**https://hecoinfo.com/blocks

**分析：**

[1] Gas Used 表示跟Gas Limit对比的使用百分比，是稳定的。

[2] Reward的值怎么计算的？

```
eth_getBlockByNumber只有区块的"gasLimit"，"gasUsed"
每一笔交易的"gas"(指该笔交易的gasLimit)，"gasPrice"
```

还需要针对每笔交易计算实际的使用值

```
eth_getTransactionReceipt的gasUsed，
```

然后汇总计算得区块的激励。

**数据库设计:**



**问题:**

#### ✅ BLOCK详情页【优先级-A】

**链接：**https://hecoinfo.com/block/4433827 (无合约内部交易)

https://hecoinfo.com/block/4436336（4个合约内部交易）



**分析：**

（1）

```
eth_getBlockByNumber + eth_getTransactionReceipt可以获得所有信息。
```

页面的Transactions的标识HT交易的记录transactions和[15 contract internal transactions](https://hecoinfo.com/txsInternal?block=4433820)的记录。

根据条件查询HT交易列表和HT内部交易列表即可。

（2）以太坊存在叔块的情况。叔块，一个孤立的块是一个块，它也是合法的，但是发现的稍晚，或者是网络传输稍慢，而没有能成为最长的链的一部分。以太坊鼓励矿工打包叔块进区块，叔块生产者和打包叔块的矿工都会有一定的奖励。eth_getBlockByNumber的uncles表明打包了哪些叔叔区块。



**数据库设计:**



**问题:**

（1）怎么查询pending状态的区块呢？-可以采用newBlockFilter获得当前最新块，暂无用处。可代码确认下跟blockNumber对比，同一个区块的前后顺序？

### ✅ Forked分叉区块列表页【优先级-B】

**链接：**https://hecoinfo.com/blocks_forked

**分析：**

（1）分叉块列表不是链上查询出来的，而是区块链组织时记录下来的。

（2）以太坊源码解读（6）blockchain区块插入和校验分析 https://blog.csdn.net/lj900911/article/details/83622887

【分析】reorg()函数的主要功能就是处理分叉：将原来的分叉链设置成规范链，将旧规范链上存在但新规范链上不存在的交易信息找出来，删除他们在数据库中的查询入口信息。

原理：
1、找出新链和老链的共同祖先；
2、将新链插入到规范链中，同时收集插入到规范链中的所有交易；
3、找出待删除列表中的那些不在待添加的交易列表的交易，并从数据库中删除它们的交易查询入口
4、向外发送区块被重新组织的事件，以及日志删除的事件。

**执行这个方法的前提是：newBlock的总难度大于oldBlock，且newBlock的父区块不是oldBlock。**

所以，区块链浏览器在组织区块时也需要反向做这些事情，包括日志删除的事件，交易，ERC20,ERC721交易的事件。

不重复，已删除的事件需要标识成不可查询。



**数据库设计:**



**问题:**



### ✅ Forked分叉区块详情页【优先级-B】

**链接：**https://hecoinfo.com/block/4439696/f

**分析：**

分叉块是刚好被这个同步节点获取了。他只有在组织时发现，无法从链上查询得到。

**数据库设计:**



**问题:**





### ✅ HT交易列表页【优先级-A】

**链接：**

(1) https://hecoinfo.com/txs?block=4433820

(2) https://hecoinfo.com/txs

(3) https://hecoinfo.com/txs?a=0xfb03e11d93632d97a8981158a632dd5986f5e909

**分析：**

（1）区块下的HT交易列表页，显示的是成功或者失败的交易，不包括pengding的。

```
eth_getBlockByNumber + eth_getTransactionReceipt可以获得所有信息,Txn Fee = gasPrice * gasUsed
```

eth_getTransactionReceipt的status有`1` (success) or `0` (failure)

（2）pending的交易可以通过eth_newPendingTransactionFilter筛选查找出来。此处不涉及。

**数据库设计:**



**问题:**

（1）

### HT交易详情

#### ❓ Overview【优先级-A】

**链接：**

（1）SUCC

https://hecoinfo.com/tx/0x8c48773d2500f6e3e80f899719b660b7de28dce5fa94df6cc477adf66850590c

（2）Dropped & Replaced

https://cn.etherscan.com/tx/0x1099db2515e62e2bc84ac4c94d49149df3a7743dc889784f819456d7909831dd

[说明]这笔交易被重置取消，用什么可以查出结果呢？原来有区块号的，后来区块号被取消了。查询reception会一直返回null。

（3） Pending 一直处于Pending态

https://cn.etherscan.com/tx/0x4d4713e5a8d99dba9de636c6b57ab608cb37a78d9a06913759a86635e3b7c810

[说明] 区块信息也没有。

(4) Fail

https://hecoinfo.com/tx/0x2c869d246ecf103cb67bc2e1f448f23f6e33ed466758ce7156205fea93ecd8fc

[说明] [4492138](https://hecoinfo.com/block/4492138) 区块号，有9个区块证实了。Warning! Error encountered during contract execution [**execution reverted**，Fail with error 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT'。

**分析：**

```
eth_getBlockByNumber的To的地址可以解析为外部账户地址还是合约地址，从合约地址的ABI解密可以分析有没有HT TRANSFER交易记录；
```

```
如果to对应的是 Contract地址，则可能存在着Internal交易记录，也要筛选出来。
```



```
Tokens Transferred字段包含ERC20和ERC721的内部交易信息列表，点击可以跳转ERC20,ERC721的详细页面分析。
```



```
Input Data:提供Original和DefaultView形式，DefaultView能翻译成函数选择器和TOPIC的ABI信息，需要跟合约函数的ABI对应。

Function: swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)

MethodID: 0x7ff36ab5
```



```
成功和失败的都可以通过eth_getTransactionReceipt查询出来结果。
"status": "0x0"
```





**数据库设计:**



**问题:**

（1）从合约地址的ABI解密可以分析有没有HT TRANSFER交易记录？-需要验证

Tokens Transferred

（2）此处内部交易Internal Txns列表只有1笔，Tokens Transferred有3笔。如何解析关系呢？

-内部交易只针对HT，不是Tokens Transferred

#### Internal Txns【优先级-B】

**链接：**（1）https://hecoinfo.com/tx/0x8c48773d2500f6e3e80f899719b660b7de28dce5fa94df6cc477adf66850590c#internal

（2）https://cn.etherscan.com/txsInternal

**分析：**

（1）无内部交易的话，一般无Internal Txns表。

内部交易这笔也是HT转账交易，是指有合约账户地址发给其他地址的HT交易记录。

These are transfers that occur where the `fromAddress` is an internal (smart contract) address.  (ex: a smart contract calling another smart contract or smart contract calling another external address).

Transactions是**“钱包地址”调用“代币合约”**发起转账，而Internal Transactions是**“调用用户”调用“钱包地址”**发起转账。因为转账方式不同，所以区块链浏览器显示的调用流程不一样。

（2）内部交易的类型有self-destruct，call，create



**参考：**

http://cw.hubwiz.com/card/c/geth-rpc-api/1/2/20/

https://geth.ethereum.org/docs/rpc/ns-debug#debug_tracetransaction

https://ethereum.stackexchange.com/questions/3417/how-to-get-contract-internal-transactions

**问题描述**

执行traceTransaction失败，原因是未采用 `--syncmode=full`同步模式。

```
> eth.syncing
false
## 发生在区块未同步到对应的交易位置
> debug.traceTransaction("0x8c48773d2500f6e3e80f899719b660b7de28dce5fa94df6cc477adf66850590c")
Error: transaction 8c48773d2500f6e3e80f899719b660b7de28dce5fa94df6cc477adf66850590c not found
	at web3.js:6347:37(47)
	at web3.js:5081:62(37)
	at <eval>:1:23(4)
	
>debug.traceTransaction("0x8c48773d2500f6e3e80f899719b660b7de28dce5fa94df6cc477adf66850590c")
Error: required historical state unavailable (reexec=128)
	at web3.js:6347:37(47)
	at web3.js:5081:62(37)
	at <eval>:1:23(4)
	
```

**解决办法：**

（1）节点启动全量同步。--syncmode full

（2）gcmode=archive

（3）调用可以获得相关信息：-所有的记录

debug.traceTransaction("0xaa3f75b12883b60c93948653cdabbf4357b2785623e16c95c4406625eb9d6d9d")

- 有限，想要的部分信息

  用'CREATE', 'CALL', 'CALLCODE' and 'DELEGATECALL' 等操作码把交易记录提取出来。

  有点小复杂，要分析内部交易的汇编关键字，还能提取记录。

```
> debug.traceTransaction("0xaa3f75b12883b60c93948653cdabbf4357b2785623e16c95c4406625eb9d6d9d",{tracer: '{data: [], fault: function(log) {}, step: function(log) { if(log.op.toString() == "CALL") this.data.push(log.stack.peek(0)); }, result: function() { return this.data; }}'})
["0", "51864", "25359"]
```

In NodeJS样例:

```js
var web3 = require('web3').web3;
web3.currentProvider.sendAsync({
    method: "debug_traceTransaction",
    params: ['0x3fac854179691e377fc1aa180b71a4033b6bb3bde2a7ef00bc8e78f849ad356e', {}],
    jsonrpc: "2.0",
    id: "2"
}, function (err, result) {
    ...
});
```



JSON-RPC:

```
{
    "jsonrpc" : "2.0",
    "id" : 0,
    "method" : "debug_traceTransaction",
    "params" : ["0xc6f08309fa47a817b97a6eae3db04b3818fd7c12296b92098a0fa7c42de4ded4", {"tracer": "callTracer"}]
}
```

Option的写法：

```
debug.traceCall({
	from: "0xdeadbeef292929291929394949595949339292929, 
	to:"0xde929f939d939d393f939393f93939f393929023", 
	gas: "0x7a120", 
	data: "0xf00d4b5d00000000000000000000000001291230982139282304923482304912923823920000000000000000000000001293123098123928310239129839291010293810"
	}, 
	"latest", {disableStorage:true, disableMemory: true})
```







**数据库设计:**



**问题:**

(1) 内部交易怎么提取呢？



#### Logs【优先级-A】

**链接：**https://hecoinfo.com/tx/0x8c48773d2500f6e3e80f899719b660b7de28dce5fa94df6cc477adf66850590c#eventlog

**分析：**

```
eth_getTransactionReceipt可以获取所有的Event LOG, sha3合约可以解析函数名称。
```

**数据库设计:**



**问题:**



### ❓ HRC20交易详情【优先级-A】

**链接：**https://hecoinfo.com/tx/0x05a565e1e97b2cd4f089584e5d4786eebdae0144f0f24921cefb2e32982080bd

[1笔交易]

https://hecoinfo.com/tx/0xad21ace2d03848abce0d4daf22373d1a259a0080f02d0700add2ea0750640e09

**分析：**

ERC20的交易从EVENT LOG中提取？



（2）针对单笔交易分析

https://hecoinfo.com/tx/0xad21ace2d03848abce0d4daf22373d1a259a0080f02d0700add2ea0750640e09

ERC20的交易本质是一笔HT的交易，包含Input Data而已。



**Input Data: **

0xa9059cbb000000000000000000000000f731a187cb77d278b817939ce874741b074e3de8000000000000000000000000000000000000000000000000000000e8d6ef0000

**View Input an default:**

Function: transfer(address _to, uint256 _value)

MethodID: 0xa9059cbb

[0]: 000000000000000000000000f731a187cb77d278b817939ce874741b074e3de8
[1]: 000000000000000000000000000000000000000000000000000000e8d6ef0000

**分析：**

[1] transfer(address,uint256) 的keccak-256值为0xa9059cbb2ab09eb219583f4a59a5d0623ade346d962bcd4e46b11da047c9049b,取前4字节为0xa9059cbb

后面为目标地址和金额。

[2] 能触发ERC20转账的有transfer，transferFrom函数，他们都会调用Transfer(_from, _to, _value)事件；

[3] ERC20智能合约部署时也会触发Transfer(address(0), msg.sender, totalSupply_)事件。

[4] Transfer(address,address,uint256)的keccak-256值为0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef

[5] 如果依赖transfer函数

**结论：通过EventLog的Transfer(address,address,uint256)来监控HRC20的转账记录。**

**数据库设计:**



**问题:**

### ❓ HRC20合约部署交易详情【优先级-A】

**链接：**https://hecoinfo.com/tx/0xe0427e01ef8fe1085b797ec44476d1d84f84c305e96eb145ea7f45ac54d94b58

**分析：**

部署合约包含所有的合约ABI编码信息。构建函数产生Transfer事件，ERC20由0x0000账户转移给管理账户。

ERC20的交易从EVENT LOG中提取？

ERC20的交易本质是一笔HT的交易，包含Input Data而已。

**数据库设计:**



**问题:**



### HRC721交易详情【优先级-B】

**链接：**https://hecoinfo.com/tx/0x6e85a53fc205337e37061ff282ee63f8efa4f201f3c4e2feb94269f99e485b0a

**分析：**

ERC721中有TOKEN交易和发生EVENT的分析：

(1) transferFrom(address from, address to, uint256 tokenId)

​     调用function _transfer(address from, address to, uint256 tokenId)，触发事件LOG：

​     emit Transfer(from, to, tokenId); 

（2）safeTransferFrom(address from, address to, uint256 tokenId, bytes _data)

（3）safeTransferFrom(address from, address to, uint256 tokenId)

（4）safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data)

最终都调用  _transfer(from, to, tokenId)转账函数。

_transfer(address,address,uint256)，对应的keccak256为0x30e0789ed23094f42b5810cbdf4e48a0478aec0b37810e24e912443dd0032b3c

 （5）_mint(address to, uint256 tokenId)触发了Transfer(address(0), to, tokenId)的事件。

（6）EVENT: Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

Transfer(address,address,uint256)对应的keccak256为ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef，包含3个TOPIC

（7）创建的时候没有触发Transfer事件。

**结论：**通过EventLog的Transfer(address,address,uint256)来监控HRC721的转账记录。

ERC721的交易本质是一笔HT的交易，包含Input Data而已。



**数据库设计:**



**问题:**

### HRC721合约部署交易详情【优先级-B】

**链接：**https://hecoinfo.com/tx/0xf3e27e26db785f24a8738f16bbe7d386c347b6ab39fef6bf0b8d307aabfcf71c

**分析：**

HRC721源码分析：

_transferFrom(address from, address to, uint256 tokenId)



**数据库设计:**



**问题:**



### Pending交易列表页【优先级-B】

**链接：**https://hecoinfo.com/txsPending

**分析：**

(1) 还处于Pending的交易，无法获取区块号，从区块查询时查询不出内容的。

(2) 可以通过设置eth_newPendingTransactionFilter来监控Pengding的交易，当出现时，把他收录进来临时保存。

```
var addr = "0xbfb2e296d9cf3e593e79981235aed29ab9984c0f"
var filter = web3.eth.newPendingTransactionFilter({fromBlock:0, toBlock:'latest', address: addr});
filter.get(function (err, transactions) {
  transactions.forEach(function (tx) {
    var txInfo = web3.eth.getTransaction(tx.transactionHash);
    //这时可以将交易信息txInfo存入数据库
  });
});
```

(3) Pending的区块也需要通过过滤器取出来。但是其用途不大清楚。



**数据库设计:**



**问题:**

（1） 有没有区块不是pendign状态，但是交易是pending状态的呢？-没有的。

### 合约Internal交易列表页【优先级-B】

**链接：**https://hecoinfo.com/txsInternal

**分析：**

（1）按照区块号组织筛选出所有的内部交易。参考“HT交易详情”的"Internal Txns"主题，比较复杂，后面版本研究。

**数据库设计:**



**问题:**

（1）合约Internal交易列表的信息如何提取？

### 合约地址详情页

#### ❓ 概要【优先级-A】

**链接：**

（1）https://hecoinfo.com/address/0xfb03e11d93632d97a8981158a632dd5986f5e909

（2）https://cn.etherscan.com/tx/0xdb90f7eaa3875bdd5b04077d42df54bf2e0743281b479ca19df0610ce64d5544

**分析：**

（1）记录HT 余额和HRC20的TOKEN列表和金额，该合约的创建记录。



**数据库设计:**



**问题:**

（1）此处关于HRC20的TOKEN列表和金额是不是需要建立一个快照保存呢？

#### transactions【优先级-A】

**链接：**https://hecoinfo.com/address/0xfb03e11d93632d97a8981158a632dd5986f5e909

**分析：**

（1）统计该地址发生的最近25笔的出/入的交易记录和HT金额，费用。

（2）可以跳转到按该地址查询所有的HT交易记录。https://hecoinfo.com/txs?a=0xfb03e11d93632d97a8981158a632dd5986f5e909

**数据库设计:**



**问题:**





#### HRC-20 Token【优先级-A】

**链接：**https://hecoinfo.com/address/0xfb03e11d93632d97a8981158a632dd5986f5e909#tokentxns

**分析：**

(1) 统计该地址发生的最近25笔的HRC-20 Token Transfer Events出/入的交易HASH，时间，FROM/TO地址，HT金额，币的TOKEN信息。这个信息可以从HRC-20交易记录中筛选出来。

(2) 点击可跳转到这个合约地址发生的HRC20交易列表；

https://hecoinfo.com/tokentxns?a=0xfb03e11d93632d97a8981158a632dd5986f5e909

(3) 支持下载交易记录为XLS/CSV格式文件。

数据库设计:**



**问题:**



#### Contract【优先级-A】

**链接：**https://hecoinfo.com/address/0xfb03e11d93632d97a8981158a632dd5986f5e909#code

##### Code

**分析：**

状态：Contract Source Code Verified (Exact Match)：跟合约验证匹配

基本信息：Contract Name，Optimization Enabled，Compiler Version，Other Settings: default evmVersion, MIT （用户选择）-这些选择会影响合约验证。

Contract Source Code (Solidity)：用户上传的源码

Contract ABI:Export ABI

Contract Creation Code:合约创建时的输入数据，Decompile ByteCode 采用Panoramix decompiler可以把ABI转换为合约字节码；可以切换到Opcodes操作码视图；

Constructor Arguments：函数选择器和TOPIC

Deployed ByteCode Sourcemap：

Swarm Source：

**数据库设计:**

**问题:**

（1）Deployed ByteCode Sourcemap：

Swarm Source：?



##### Read Contract

见HRC20详情描述对应的页面



##### Write Contract

见HRC20详情描述对应的页面



#### Events【优先级-A】

**链接：**https://hecoinfo.com/address/0xfb03e11d93632d97a8981158a632dd5986f5e909#events

**分析：**

该合约对应的最近25笔LOG事件解析

**数据库设计:**



**问题:**

#### Analytics【优先级-C】

**链接：**https://hecoinfo.com/address/0xfb03e11d93632d97a8981158a632dd5986f5e909#analytics

**分析：**

(1) 按照HT Balance(HT Account Balance, Historic USD Val, Current USD Val, Txn Count)的时间维度进行分析;

(2) Transacitions

(3) TxnFees

(4) HT Transfers

(5) Token Transfers

**数据库设计:**



**问题:**





### HRC20 TOKEN详情页

#### ❓ 概要【优先级-A】

**链接：**

（1）经过验证的合约

https://hecoinfo.com/token/0x26db8742da87d2e74911bfa4a349d4f6f7fc6037

（2）未经过验证的合约

https://ropsten.etherscan.io/token/0xd48d08ec6513c1549733e1bba1132a5d6f53e351#readContract

**分析：**

（1）当合约未验证时，Max Total Supply，Holders显示为0，Decimals能显示正确?

（2）Official Site，Social Profiles是验证合约时填写的；其他是统计或者喂价的；

（3）还有对应的菜单有Check previous token supply,Add Token to Web3 Wallet, Update Token Info,Update Name Tag, Submit Label, Report/Flag Address, Add to Ignore List 后面再研究

**数据库设计:**



**问题:**



#### Transfer列表 【优先级-A】

**链接：**https://hecoinfo.com/token/0x26db8742da87d2e74911bfa4a349d4f6f7fc6037

**分析：**

ERC20 TOKEN交易列表，点击可跳转到HT的交易详情页；

**数据库设计:**



**问题:**

#### Holder列表【优先级-A】

**链接：**https://hecoinfo.com/token/0x26db8742da87d2e74911bfa4a349d4f6f7fc6037#balances

**分析：**

拥有该TOKEN的地址，数量占比和图标分析。

**数据库设计:**



**问题:**



#### Info【优先级-A】

**链接：**https://hecoinfo.com/token/0x26db8742da87d2e74911bfa4a349d4f6f7fc6037#tokenInfo

**分析：**

显示市场相关信息。

**数据库设计:**



**问题:**



#### Read Contract【优先级-A】

**链接：**https://hecoinfo.com/token/0x26db8742da87d2e74911bfa4a349d4f6f7fc6037#readContract

**分析：**

(1) 合约的所有不需要改变状态的读函数，可调取结果。

(2) 当没有做合约验证时，EVNETS的函数名称和参数根据推断匹配产生。

**数据库设计:**



**问题:**





#### Write Contract【优先级-A】

**链接：**https://hecoinfo.com/token/0x26db8742da87d2e74911bfa4a349d4f6f7fc6037#writeContract

**分析：**

(1) Connect to Web3能链接到MetaMask

(2) 读出函数列表，可连接后执行交易；

**数据库设计:**



**问题:**





#### Analytics【优先级-C】

**链接：**https://hecoinfo.com/token/0x26db8742da87d2e74911bfa4a349d4f6f7fc6037#tokenAnalytics

**分析：**

涉及Transfer Amount, Transfers Count, Unique Receivers, Unique Sender, Total Uniques等第一TAB数据在时间维度的统计。

**数据库设计:**



**问题:**

### 验证节点排行榜页【优先级-B】

**链接：**https://hecoinfo.com/validators

**分析：**

（1）包含排名序号，Address，产出的第一个块，最后一个块，1/7/30天出块统计[要提前归纳吗？]，当前状态Active（Yes/No）

（2）统计信息应该从eth_getBlockByNumber的miner中提取统计出来。

（3）当前状态应该从huobi-eco-contracts中查询当前状态，使用eth_getStorageAt获取全局变量validatorInfo.status的值。使用web3的myContract.methods.getActiveValidators()获取各个节点的当前状态。

**数据库设计:**



**问题:**

(1) 这个矿工节点是从eth_getBlockByNumber的miner字段提取出来的？

对应的验证者从智能合约提取，应该使用web3.js的方法，而不是直接RPC的方法。

(2) 目前该合约的字节码信息不同于链上的信息，待朱斌穿刺确认。



### 验证节点设置信息页【优先级-B】

**链接：**https://hecoinfo.com/validatorset

**分析：**

（1）包含时间，区块号，Validators(21个)，Total Voting Power，Total Jailed，Total Incoming信息列表，对应的是出块这一刻的验证者和收入情况。

（2）点击Validators(21个)可调转到“Validators Set Info By Block”页面。

**数据库设计:**



**问题:**

（1）Total Voting Power，Total Jailed，Total Incoming从哪儿获取呢？

### 区块索引的验证节点分配页【优先级-B】

**链接：**https://hecoinfo.com/validatorset/snapshot/4490558

**分析：**

（1）包括对这个区块经过验证的节点总数，INCOMING，JAILED的统计梳理，以及验证者列表的地址，Fee Address，Jailed，分配的收入Incoming（远超交易GAS的收入）。

**数据库设计:**



**问题:**

（1）针对这个区块的快照信息包括各个验证者节点的收入Incoming用什么方式获取？



### 验证节点详情页【优先级-B】

#### 概要

 **链接：**https://hecoinfo.com/address/0x558c6bb5a0f440c686b78a864909e935ffd2c0e8

**分析：**

（1）这个矿工0x558c6Bb5A0f440C686B78a864909E935fFd2C0E8对应的收益地址为0xbd50fc491fcc24247eca065dc9e867b3ebd41541

（2）这个页面不同于合约地址页面和外部地址页面，包括Blocks Validated的区块数量，以及其他一些信息。

（3）感觉像是内置合约。地址：

（4）https://github.com/HuobiGroup/huobi-eco-contracts 公布了验证者节点的信息。

合约地址信息：

```
# alloc 配置了初始账户信息，可以用来进行资产预分配和系统合约的预初始化；

0xdaf88b74fca1246c6144bc846aaa3441ed095191 //创世 HT 锁定地址
000000000000000000000000000000000000F000 //validators 合约
000000000000000000000000000000000000F001 // punish 合约
000000000000000000000000000000000000F002 // proposal 合约
```



智能合约相关参数：

```
  enum Status {
        // validator not exist, default status
        NotExist,
        // validator created
        Created,
        // anyone has staked for the validator
        Staked,
        // validator's staked coins < MinimalStakingCoin
        Unstaked,
        // validator is jailed by system(validator have to repropose)
        Jailed
    }

    struct Description {
        string moniker;
        string identity;
        string website;
        string email;
        string details;
    }

    struct Validator {
        address payable feeAddr;
        Status status;
        uint256 coins;
        Description description;
        uint256 hbIncoming;
        uint256 totalJailedHB;
        uint256 lastWithdrawProfitsBlock;
        // Address list of user who has staked for this validator
        address[] stakers;
    }

    struct StakingInfo {
        uint256 coins;
        // unstakeBlock != 0 means that you are unstaking your stake, so you can't
        // stake or unstake
        uint256 unstakeBlock;
        // index of the staker list in validator
        uint256 index;
    }

    mapping(address => Validator) validatorInfo;
    // staker => validator => info
    mapping(address => mapping(address => StakingInfo)) staked;
    // current validator set used by chain
    // only changed at block epoch
    address[] public currentValidatorSet;
    // highest validator set(dynamic changed)
    address[] public highestValidatorsSet;
    // total stake of all validators
    uint256 public totalStake;
    // total jailed hb
    uint256 public totalJailedHB;
```





**数据库设计:**



**问题:**

（1）有没有合约地址呢？

#### transactions

 **链接：**https://hecoinfo.com/address/0x558c6bb5a0f440c686b78a864909e935ffd2c0e8

**分析：**

（1）作为普通的外部账户地址，显示HT的来往记录，不包括内部交易。

这儿的记录应该是解析区块和交易时解析出来的。



**数据库设计:**



**问题:**





#### HRC20 Token Txns

 **链接：**https://hecoinfo.com/address/0x558c6bb5a0f440c686b78a864909e935ffd2c0e8#tokentxns

**分析：**

该地址对应的ERC20 TOKEN的交易记录。

**数据库设计:**



**问题:**

#### Validated Blocks

 **链接：**https://hecoinfo.com/address/0x558c6bb5a0f440c686b78a864909e935ffd2c0e8#mine

**分析：**

这个是指这个节点挖出的区块列表的信息，包括该区块的Transaction笔数，Gas Used, 交易奖励。

这个是指针对区块的统计一部分查询。

**数据库设计:**



**问题:**



#### Validators SetInfo

 **链接：**https://hecoinfo.com/address/0x558c6bb5a0f440c686b78a864909e935ffd2c0e8#validatorset

**分析：**

这个节点作为验证者节点，获取的Block，Fee Address，Jailed，Incoming等信息。可以从“验证节点设置信息”列表中筛选出来。

**数据库设计:**



**问题:**



#### Analytics

 **链接：**https://hecoinfo.com/address/0x558c6bb5a0f440c686b78a864909e935ffd2c0e8#analytics

**分析：**



**数据库设计:**



**问题:**



### HRC721详情页【优先级-B】

#### 概要

**链接：**

https://hecoinfo.com/token/0x2d36c7c7c28b1442c0f2ebb2015e469147845144

**分析：**

Social Profiles和一些统计信息。

**数据库设计:**



**问题:**



#### Transfers

**链接：**https://hecoinfo.com/token/0x2d36c7c7c28b1442c0f2ebb2015e469147845144



**分析：**



**数据库设计:**



**问题:**



#### Holders

**链接：**https://hecoinfo.com/token/0x2d36c7c7c28b1442c0f2ebb2015e469147845144#balances



**分析：**



**数据库设计:**



**问题:**



#### Inventory(库存)

**链接：**https://hecoinfo.com/token/0x2d36c7c7c28b1442c0f2ebb2015e469147845144#inventory



**分析：**

活跃的TOKEN ID

**数据库设计:**



**问题:**





#### INFO

**链接：**https://hecoinfo.com/token/0x2d36c7c7c28b1442c0f2ebb2015e469147845144#tokenInfo

**分析：**

ICO相关信息

**数据库设计:**



**问题:**



#### Read Contract

**链接：**https://hecoinfo.com/token/0x2d36c7c7c28b1442c0f2ebb2015e469147845144#readContract

https://cn.etherscan.com/token/0x06012c8cf97bead5deae237070f9587f8e7a266d#readContract

**分析：**

（1）合约验证后，才可以解析读和写；

（2）以太坊的加密猫合约可以进行读写。

**数据库设计:**



**问题:**



#### Write Contract

**链接：**https://hecoinfo.com/token/0x2d36c7c7c28b1442c0f2ebb2015e469147845144#writeContract

**分析：**

合约验证后，才可以解析读和写；

**数据库设计:**



**问题:**





### ✅ HRC20市值排行榜页【优先级-A】

**链接：**https://hecoinfo.com/tokens

**分析：**

Holders是统计出来的，其他是喂价出来的。

**数据库设计:**



**问题:**

### ✅ HRC20交易量排行榜页【优先级-A】

**链接：**https://hecoinfo.com/tokens

**分析：**

Holders是统计出来的;

其中的Unique Senders, Unique Receivers

**数据库设计:**



**问题:**

（1）其中的Unique Senders, Unique Receivers怎么来的呢？有什么用处呢？



### ✅ HRC20交易记录列表页【优先级-A】

**链接：**https://hecoinfo.com/tokentxns

**分析：**

按交易远近时间排序的，该时间取确认区块的时间。

**数据库设计:**



**问题:**

### **HRC-721排行榜**页【优先级-B】

**链接：**https://hecoinfo.com/tokens-nft

**分析：**

根据24小时，7天的交易量排序

**数据库设计:**



**问题:**

### HRC-721交易列表页【优先级-B】

**链接：**https://hecoinfo.com/tokentxns-nft

**分析：**

按时间倒序排列，多出TokenID

**数据库设计:**



**问题:**

### ✅验证合约列表页【优先级-A】

**链接：**https://hecoinfo.com/contractsVerified

**分析：**

（1）License 为开源授权类型，MIT，GNU GPLv2授权等；

（2）Audited一直为空，是不是留给以后审计公司使用；

Setting有Optimization Enabled闪电标志，Constructor Arguments扳手标识。

待MOZIK验证时核对。

（3）筛选开关有 Latest 500 Contracts Verified, Open Source License,Solidity Compiler,Vyper Compiler,Contract Security Audit等选项。

**数据库设计:**



**问题:**

### ✅ 验证和发布合约源码页【优先级-A】

**链接：**https://hecoinfo.com/verifyContract

**分析：**

输入合约地址，编译器类型(单文件形式)-Solidity单文件，Solidity多文件，标准Standand-Json-Input，Vyper(Experimental), Compiler Version,Open Source License Type后，进行合约验证。

**数据库设计:**



**问题:**



### 字节码到操作码反汇编【优先级-B】

**链接：**https://hecoinfo.com/opcode-tool

**分析：**

就是把Contract Creation Code的ABI字节码反汇编成操作码。



**数据库设计:**



**问题:**

### ***页

**链接：**

**分析：**

**数据库设计:**



**问题:**

## 6.3 问题和解答

### （1）验证者节点相关信息如何获取

https://hecoinfo.com/validators，https://hecoinfo.com/validatorset，https://hecoinfo.com/validatorset/snapshot/4496038 这3个页面对应的大部分信息从GETH RPC消息中无法提取的。怎么获得呢？

​      创世文件信息中有合约地址。

### （2）内部交易目前分析是通过debug.traceTransaction实现。内部机制比较复杂，用处不大。建议一期不实现。

https://hecoinfo.com/txsInternal，智能合约发起的。





### （3）关于市场相关的价格信息是查询外部接口获取吗？接口信息呢？

 heco这里统计的市场价格和交易量，也都是dex发生的。

### （4）合约部署失败

**问题描述：**部署Validators失败，提示为“Contract creation initialization returns data with length of more than 24576 bytes. The deployment will likely fails.”

**解决方法：**

编译时启动“Enable Optimization”。

对应链接：https://testnet.hecoinfo.com/tx/0x5aac9e2bf806206fcb1671ac4f76c718838b308d7002e1dd61517dc5abc3606e

签名 用sm2 

hash sm3 

(邮箱+密码+公钥) 签名

sm2 用私钥计算公钥

sm2 私钥签名 身份验证 

sm3  密码加密

sm4 用密码对私钥加密

登录第2步
(时间戳+用户名+公钥(后台返回)) verify 

