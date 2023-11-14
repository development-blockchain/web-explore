# 6. 浏览器数据来源拆解

## 6.1 参考

（1）Etherscan API 中文版

http://cw.hubwiz.com/card/c/etherscan-api/

（2）Etherscan API 官方版

https://cn.etherscan.com/apis

（3）how-to-get-contract-internal-transactions

https://ethereum.stackexchange.com/questions/3417/how-to-get-contract-internal-transactions

## 6.2 浏览器页面/接口拆解

### HOME 页【优先级-A】

**链接：**https://hecoinfo.com/

**分析:**

(1) WEB SOCKET 实时更新，数据拉取最新块信息。

```javascript
eth_getBlockByNumber获取;
```

（2）ACTIVE VALIDATOR, TOTAL STAKED 的获取方式？-

等启伟实现验证者节点功能后，从数据库取。

（3）关于市场相关的价格信息是查询外部价格获取吗？还是 WEB SOCKET 实时更新呢？

[1] HT-RPICE, BTC 的标价和涨跌幅

https://api.huobi.pro/market/history/kline?symbol=htbtc&period=1min&size=2

https://api.huobi.pro/market/history/kline?symbol=htbtc&period=1min&size=2

价格涨幅我们取 2 次，截止价格的涨跌幅即可。

参考火币，这部分应该不是采用 websocket 形式的，是接口查询出来的。

[2] HT MARKET CAP 总量和美元价格

https://api.hecoinfo.com/api?module=stats&action=htsupply

先从这儿取，转到 BIBOX 后从 BIBOX 的接口取。应该不是统计 HT 了。

（4）交易总量和 TPS 是 5 分钟更新一次的，就是最近 5 分钟的交易总数/300，是查询出来的，不是 WEBSOCKET 的。

（5）交易历史图表按天查询出来的，火币有专门接口。

https://api.huobi.pro/market/history/kline?symbol=htusdt&period=1day&size=14

**数据库设计:**

**问题:**

### BLOCK 页

#### BLOCK 列表页【优先级-A】

**链接：**https://hecoinfo.com/blocks

**分析：**

[1] Gas Used 表示跟 Gas Limit 对比的使用百分比，是稳定的。

[2] Reward 的值怎么计算的？

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

#### BLOCK 详情页【优先级-A】

**链接：**

[1] https://hecoinfo.com/block/4433827 (无合约内部交易)

[2] https://hecoinfo.com/block/4436336（4个合约内部交易）

[3] https://hecoinfo.com/block/4664618 (新区块增加了 Validator Set Info Snapshot 信息)

**分析：**

（1）

```
eth_getBlockByNumber + eth_getTransactionReceipt可以获得所有信息。
```

页面的 Transactions 的标识 HT 交易的记录 transactions 和[15 contract internal transactions](https://hecoinfo.com/txsInternal?block=4433820)的记录。

根据条件查询 HT 交易列表和 HT 内部交易列表即可。

（2）以太坊存在叔块的情况。叔块，一个孤立的块是一个块，它也是合法的，但是发现的稍晚，或者是网络传输稍慢，而没有能成为最长的链的一部分。以太坊鼓励矿工打包叔块进区块，叔块生产者和打包叔块的矿工都会有一定的奖励。eth_getBlockByNumber 的 uncles 表明打包了哪些叔叔区块。

（3）从 380 多万区块开始，有了 Validator Set Info Snapshot 信息，该值从 congress_getSnapshot 查询出来。

**数据库设计:**

**问题:**

（1）怎么查询 pending 状态的区块呢？-可以采用 newBlockFilter 获得当前最新块，暂无用处。可代码确认下跟 blockNumber 对比，同一个区块的前后顺序？

### Forked 分叉区块列表页【优先级-B】

**链接：**https://hecoinfo.com/blocks_forked

**分析：**

（1）分叉块列表不是链上查询出来的，而是区块链组织时记录下来的。

（2）以太坊源码解读（6）blockchain 区块插入和校验分析 https://blog.csdn.net/lj900911/article/details/83622887

【分析】reorg()函数的主要功能就是处理分叉：将原来的分叉链设置成规范链，将旧规范链上存在但新规范链上不存在的交易信息找出来，删除他们在数据库中的查询入口信息。

原理： 1、找出新链和老链的共同祖先； 2、将新链插入到规范链中，同时收集插入到规范链中的所有交易； 3、找出待删除列表中的那些不在待添加的交易列表的交易，并从数据库中删除它们的交易查询入口 4、向外发送区块被重新组织的事件，以及日志删除的事件。

**执行这个方法的前提是：newBlock 的总难度大于 oldBlock，且 newBlock 的父区块不是 oldBlock。**

所以，区块链浏览器在组织区块时也需要反向做这些事情，包括日志删除的事件，交易，ERC20,ERC721 交易的事件。

不重复，已删除的事件需要标识成不可查询。

**数据库设计:**

**问题:**

### Forked 分叉区块详情页【优先级-B】

**链接：**https://hecoinfo.com/block/4439696/f

**分析：**

分叉块是刚好被这个同步节点获取了。他只有在组织时发现，无法从链上查询得到。

**数据库设计:**

**问题:**

### HT 余额排行榜页【优先级-A】

**链接：**

(1) https://hecoinfo.com/accounts

**分析：**

（1）显示持有 HT 最多的前 10000 个账户地址信息，和持有 HT 的比例。

**数据库设计:**

**问题:**

（1）

### HT 交易列表页【优先级-A】

**链接：**

(1) https://hecoinfo.com/txs?block=4433820

(2) https://hecoinfo.com/txs

(3) https://hecoinfo.com/txs?a=0xfb03e11d93632d97a8981158a632dd5986f5e909

**分析：**

（1）区块下的 HT 交易列表页，显示的是成功或者失败的交易，不包括 pengding 的。

```
eth_getBlockByNumber + eth_getTransactionReceipt可以获得所有信息,Txn Fee = gasPrice * gasUsed
```

eth_getTransactionReceipt 的 status 有`1` (success) or `0` (failure)

（2）pending 的交易可以通过 eth_newPendingTransactionFilter 筛选查找出来。此处不涉及。

**数据库设计:**

**问题:**

（1）

### HT 交易详情

#### Overview【优先级-A】

**链接：**

（1）SUCC

https://hecoinfo.com/tx/0x8c48773d2500f6e3e80f899719b660b7de28dce5fa94df6cc477adf66850590c

（2）Dropped & Replaced

https://cn.etherscan.com/tx/0x1099db2515e62e2bc84ac4c94d49149df3a7743dc889784f819456d7909831dd

[说明]这笔交易被重置取消，用什么可以查出结果呢？原来有区块号的，后来区块号被取消了。查询 reception 会一直返回 null。

（3） Pending 一直处于 Pending 态

https://cn.etherscan.com/tx/0x4d4713e5a8d99dba9de636c6b57ab608cb37a78d9a06913759a86635e3b7c810

[说明] 区块信息也没有。

(4) Fail

https://hecoinfo.com/tx/0x2c869d246ecf103cb67bc2e1f448f23f6e33ed466758ce7156205fea93ecd8fc

[说明] [4492138](https://hecoinfo.com/block/4492138) 区块号，有 9 个区块证实了。Warning! Error encountered during contract execution [**execution reverted**，Fail with error 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT'。

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

（1）从合约地址的 ABI 解密可以分析有没有 HT TRANSFER 交易记录？-需要验证

Tokens Transferred

（2）此处内部交易 Internal Txns 列表只有 1 笔，Tokens Transferred 有 3 笔。如何解析关系呢？

-内部交易只针对 HT，不是 Tokens Transferred

#### Internal Txns【优先级-B】

**链接：**（1）https://hecoinfo.com/tx/0x8c48773d2500f6e3e80f899719b660b7de28dce5fa94df6cc477adf66850590c#internal

（2）https://cn.etherscan.com/txsInternal

**分析：**

（1）无内部交易的话，一般无 Internal Txns 表。

内部交易这笔也是 HT 转账交易，是指有合约账户地址发给其他地址的 HT 交易记录。

These are transfers that occur where the `fromAddress` is an internal (smart contract) address. (ex: a smart contract calling another smart contract or smart contract calling another external address).

Transactions 是**“钱包地址”调用“代币合约”**发起转账，而 Internal Transactions 是**“调用用户”调用“钱包地址”**发起转账。因为转账方式不同，所以区块链浏览器显示的调用流程不一样。

（2）内部交易的类型有 self-destruct，call，create，V1.0 只解析 CALL 的。

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

### HRC20 交易详情【优先级-A】

**链接：**https://hecoinfo.com/tx/0x05a565e1e97b2cd4f089584e5d4786eebdae0144f0f24921cefb2e32982080bd

[1 笔交易]

https://hecoinfo.com/tx/0xad21ace2d03848abce0d4daf22373d1a259a0080f02d0700add2ea0750640e09

**分析：**

ERC20 的交易从 EVENT LOG 中提取？

（2）针对单笔交易分析

https://hecoinfo.com/tx/0xad21ace2d03848abce0d4daf22373d1a259a0080f02d0700add2ea0750640e09

ERC20 的交易本质是一笔 HT 的交易，包含 Input Data 而已。

**Input Data: **

0xa9059cbb000000000000000000000000f731a187cb77d278b817939ce874741b074e3de8000000000000000000000000000000000000000000000000000000e8d6ef0000

**View Input an default:**

Function: transfer(address \_to, uint256 \_value)

MethodID: 0xa9059cbb

[0]: 000000000000000000000000f731a187cb77d278b817939ce874741b074e3de8
[1]: 000000000000000000000000000000000000000000000000000000e8d6ef0000

**分析：**

[1] transfer(address,uint256) 的 keccak-256 值为 0xa9059cbb2ab09eb219583f4a59a5d0623ade346d962bcd4e46b11da047c9049b,取前 4 字节为 0xa9059cbb

后面为目标地址和金额。

[2] 能触发 ERC20 转账的有 transfer，transferFrom 函数，他们都会调用 Transfer(\_from, \_to, \_value)事件；

[3] ERC20 智能合约部署时也会触发 Transfer(address(0), msg.sender, totalSupply\_)事件。

[4] Transfer(address,address,uint256)的 keccak-256 值为 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef

[5] 如果依赖 transfer 函数

**结论：通过 EventLog 的 Transfer(address,address,uint256)来监控 HRC20 的转账记录。**

**数据库设计:**

**问题:**

### HRC20 合约部署交易详情【优先级-A】

**链接：**https://hecoinfo.com/tx/0xe0427e01ef8fe1085b797ec44476d1d84f84c305e96eb145ea7f45ac54d94b58

**分析：**

部署合约包含所有的合约 ABI 编码信息。构建函数产生 Transfer 事件，ERC20 由 0x0000 账户转移给管理账户。

ERC20 的交易从 EVENT LOG 中提取？

ERC20 的交易本质是一笔 HT 的交易，包含 Input Data 而已。

**数据库设计:**

**问题:**

### HRC721 交易详情【优先级-B】

**链接：**https://hecoinfo.com/tx/0x6e85a53fc205337e37061ff282ee63f8efa4f201f3c4e2feb94269f99e485b0a

**分析：**

ERC721 中有 TOKEN 交易和发生 EVENT 的分析：

(1) transferFrom(address from, address to, uint256 tokenId)

​ 调用 function \_transfer(address from, address to, uint256 tokenId)，触发事件 LOG：

​ emit Transfer(from, to, tokenId);

（2）safeTransferFrom(address from, address to, uint256 tokenId, bytes \_data)

（3）safeTransferFrom(address from, address to, uint256 tokenId)

（4）safeTransferFrom(address from, address to, uint256 tokenId, bytes memory \_data)

最终都调用 \_transfer(from, to, tokenId)转账函数。

\_transfer(address,address,uint256)，对应的 keccak256 为 0x30e0789ed23094f42b5810cbdf4e48a0478aec0b37810e24e912443dd0032b3c

（5）\_mint(address to, uint256 tokenId)触发了 Transfer(address(0), to, tokenId)的事件。

（6）EVENT: Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

Transfer(address,address,uint256)对应的 keccak256 为 ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef，包含 3 个 TOPIC

（7）创建的时候没有触发 Transfer 事件。

**结论：**通过 EventLog 的 Transfer(address,address,uint256)来监控 HRC721 的转账记录。

ERC721 的交易本质是一笔 HT 的交易，包含 Input Data 而已。

**数据库设计:**

**问题:**

### HRC721 合约部署交易详情【优先级-B】

**链接：**https://hecoinfo.com/tx/0xf3e27e26db785f24a8738f16bbe7d386c347b6ab39fef6bf0b8d307aabfcf71c

**分析：**

HRC721 源码分析：

\_transferFrom(address from, address to, uint256 tokenId)

**数据库设计:**

**问题:**

### Pending 交易列表页【优先级-B】

**链接：**

（1）列表：https://hecoinfo.com/txsPending

（2）Pending 详情：https://hecoinfo.com/tx/0xf52b3e8efffcb204eae56e191f2dff1b77970fb2ae40999a397f0d3550c3367c

**分析：**

(1) 本地节点同链上区块同步后，从 txpool_content 可以取到。

(2) Pending 详情相对与结果的交易，Status，Block，Timestamp，Transaction Fee 等可能无值。

**数据库设计:**

**问题:**

（1） 有没有区块不是 pendign 状态，但是交易是 pending 状态的呢？-没有的。

### 合约 Internal 交易列表页【优先级-B】

**链接：**https://hecoinfo.com/txsInternal

**分析：**

（1）按照区块号组织筛选出所有的内部交易。参考“HT 交易详情”的"Internal Txns"主题，比较复杂，后面版本研究。

**数据库设计:**

**问题:**

（1）合约 Internal 交易列表的信息如何提取？

### 账户地址详情

#### 概要 【优先级-A】

**链接：**https://hecoinfo.com/address/0xb370150fca33048c5a7abe45c407c4a156e59ec7

**分析：**

显示 balance,HT Value,Token(ERC20)列表

#### Transactions 【优先级-A】

**链接：**https://hecoinfo.com/address/0x558c6bb5a0f440c686b78a864909e935ffd2c0e8

**分析：**

显示 25 笔，有链接可以查收所有的 8759 笔数据。

#### Internal Txns 【优先级-B】

**链接：**https://hecoinfo.com/address/0xb370150fca33048c5a7abe45c407c4a156e59ec7#internaltx

**分析：**

内部交易，为其他智能合约地址发给该外部账户地址的内部合约查询。

#### HRC-20 Token Txns 【优先级-A】

**链接：**https://hecoinfo.com/address/0xb370150fca33048c5a7abe45c407c4a156e59ec7#tokentxns

**分析：**

显示 25 笔，可以显示进/出的所有 HRC20 的交易。

#### HRC-721 Token Txns 【优先级-B】

**链接：**https://hecoinfo.com/address/0xb370150fca33048c5a7abe45c407c4a156e59ec7#tokentxnsErc721

**分析：**

显示 25 笔，可以显示进/出的所有 HRC721 的交易。

#### Analytics 【优先级-C】

**链接：**https://hecoinfo.com/address/0x558c6bb5a0f440c686b78a864909e935ffd2c0e8#analytics

**数据量统计：分析：**

目前有 1,999,999 个账号，每个账号需要拉一张关于余额/价格的日统计表，一共可能有 1 ~3 年，

有 53,493 ERC20 智能合约，可能要统计地址的 ERC20 TOKEN 交易数量：

数据量有 200 万 _ 365 _ 1 \*3 = 219 亿条记录

##### HT Balance

**功能说明：**按日期统计某个地址对应的 HT 余额。

**统计点信息：**HT Balance 按钮

（1）HT Highest Balance（日期），HT Lowest Balance(日期)，USD Highest Value（日期），USD Lowest Value（日期）

（2）时间统计范围：1m,6m,1y, ALL

（3）按日期统计 HT account Balance, Historic USD Val(以历史币价计算), Current USD Val(以当前币价计算), Txn Count(交易笔数)

**实现分析：**

（1）目前没有记录地址的每日的余额和 HT 币价，币价无法获取，HT 余额可通过区块获取。

##### HT Transactions

**功能说明：** 按日期统计该地址的交易次数；

**统计点信息：**

（2）时间统计范围：1m,6m,1y, ALL

（3）按日期统计 HT 交易笔数 Huobi transations, Unique Outgoing Address, Unique Incoming Address

**实现分析：**

（1）根据 tb_transaction 的交易记录，统计 HT 交易笔数，唯一的出站，入站的地址数量

##### Txn Fees

**功能说明：** 按日期统计该地址的交易费

**统计点信息：**

（1）Total Fees Spent (As a Sender) 作为发送者花费的日交易费总额

（2）Total Fees Used (As a recipient) 作为接收者者花费的日交易费总额

（3）时间统计范围：1m,6m,1y, ALL

（4）按日期统计 HT Fee Spent, USD Fees Spent, HT Fees Used, USD Fees Used（按之前的美元计价）

**实现分析：**

（1）根据 tb_transaction 的交易记录，按日汇总统计 HT Fees Used 的数值，对应的 USD 价格

（2）HT Fee Spent, USD Fees Spent 为 0，暂不实现。

##### HT Transfers

**功能说明：** 按日期统计的该地址的 HT 数量

**统计点信息：**

（1）Sent（out） 作为发送者发出的 HT 数量

（2）Receive(In) 作为接受者收到的 HT 数量

（3）Validator Reward 作为验证者节点收到的 HT 数量

**实现分析：**

（1）根据该地址的 tb_transaction 的交易记录按日进行统计；

（2）Validator Reward 从 tb_validator_snapshot 表进行统计；

##### Token Transfers

**功能说明：** 按日期统计的该地址的 ERC20 的 TOKEN 交易数量

**统计点信息：**

（1）Token Transfers：统计的 ERC20 的交易笔数

（2）Token Contracts Count：TOKEN 合约数量，为 1

（3）Outbound Transfers：出站笔数

（4）Inbound Transfers：入站笔数

（5）Unique Address Sent： 单向发送的地址数量

（6）Unique Address Received：单向接收的地址数量

**实现分析：**

（1）从表 tb_contract_transaction 中按日期统计相关信息。

**数据库设计:**

**问题:**

（1）HT Fee Spent 和 HT Fees Used 的区别是什么，HT Fees Used 目前看到的都是 0。

### 合约地址详情页

#### 概要【优先级-A】

**链接：**

（1）验证过的 HRC20 合约

https://hecoinfo.com/address/0xfb03e11d93632d97a8981158a632dd5986f5e909

（2）未验证过的 HRC20 合约

https://cn.etherscan.com/address/0x000000000000006f6502b7f2bbac8c30a3f67e9a#code

（3） 含 HRC20 和 HRC721 和内部交易:

https://hecoinfo.com/address/0x6d0bf3091cfee5e608b5f34e29d68b6d16553309#tokentxns

（4）创始地址的记录：

https://hecoinfo.com/address/0x0000000000000000000000000000000000000000

**分析：**

（1）记录 HT 余额和 HRC20 的 TOKEN 列表和金额，该合约的创建记录。

**数据库设计:**

**问题:**

（1）此处关于 HRC20 的 TOKEN 列表和金额是不是需要建立一个快照保存呢？

#### transactions【优先级-A】

**链接：**https://hecoinfo.com/address/0xfb03e11d93632d97a8981158a632dd5986f5e909

**分析：**

（1）统计该地址发生的最近 25 笔的出/入的交易记录和 HT 金额，费用。

（2）可以跳转到按该地址查询所有的 HT 交易记录。https://hecoinfo.com/txs?a=0xfb03e11d93632d97a8981158a632dd5986f5e909

**数据库设计:**

**问题:**

#### Internal Txns【优先级-B】

**链接：**https://hecoinfo.com/address/0x6d0bf3091cfee5e608b5f34e29d68b6d16553309#internaltx

**分析：**

**数据库设计:**

**问题:**

#### HRC-20 Token Txns【优先级-A】

**链接：**https://hecoinfo.com/address/0xfb03e11d93632d97a8981158a632dd5986f5e909#tokentxns

**分析：**

(1) 统计该地址发生的最近 25 笔的 HRC-20 Token Transfer Events 出/入的交易 HASH，时间，FROM/TO 地址，HT 金额，币的 TOKEN 信息。这个信息可以从 HRC-20 交易记录中筛选出来。

(2) 点击可跳转到这个合约地址发生的 HRC20 交易列表；

https://hecoinfo.com/tokentxns?a=0xfb03e11d93632d97a8981158a632dd5986f5e909

(3) 支持下载交易记录为 XLS/CSV 格式文件。

数据库设计:\*\*

**问题:**

#### HRC-721 Token Txns【优先级-B】

**链接：**https://hecoinfo.com/address/0x6d0bf3091cfee5e608b5f34e29d68b6d16553309#tokentxnsErc721

**分析：**

**数据库设计:**

**问题:**

#### Contract【优先级-A】-任艳多

**链接：**

(1) 已验证过的 ERC20

https://hecoinfo.com/address/0xfb03e11d93632d97a8981158a632dd5986f5e909#code

(2) 未验证合约

https://hecoinfo.com/address/0xf815bf3dd1b0a0c92e9f4aee370bdf9fa063bbd8#code

（2) 未验证过的 ERC721

https://hecoinfo.com/address/0x2d36c7c7c28b1442c0f2ebb2015e469147845144#code

（3）已验证过的 ERC721

https://cn.etherscan.com/token/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85#readContract

##### Code

**分析：**

状态：Contract Source Code Verified (Exact Match)：跟合约验证匹配

基本信息：Contract Name，Optimization Enabled，Compiler Version，Other Settings: default evmVersion, MIT （用户选择）-这些选择会影响合约验证。

Contract Source Code (Solidity)：用户上传的源码

Contract ABI:Export ABI

Contract Creation Code:合约创建时的输入数据，Decompile ByteCode 采用 Panoramix decompiler 可以把 ABI 转换为合约字节码；可以切换到 Opcodes 操作码视图；

Constructor Arguments：函数选择器和 TOPIC

Deployed ByteCode Sourcemap：

Swarm Source：

**数据库设计:**

**问题:**

（1）Deployed ByteCode Sourcemap：

Swarm Source：?

##### Read Contract

见 HRC20 详情描述对应的页面

##### Write Contract

见 HRC20 详情描述对应的页面

#### Events【优先级-A】

**链接：**https://hecoinfo.com/address/0xfb03e11d93632d97a8981158a632dd5986f5e909#events

**分析：**

该合约对应的最近 25 笔 LOG 事件解析

**数据库设计:**

**问题:**

#### Analytics【优先级-C】

**链接：**https://hecoinfo.com/address/0xfb03e11d93632d97a8981158a632dd5986f5e909#analytics

**分析：**

(1) 按照 HT Balance(HT Account Balance, Historic USD Val, Current USD Val, Txn Count)的时间维度进行分析;

(2) Transacitions

(3) TxnFees

(4) HT Transfers

(5) Token Transfers

**实现分析：**参考“账户地址详情”的”Analytics 【优先级-C】“实现。

**数据库设计:**

**问题:**

### HRC20 TOKEN 详情页

#### 概要【优先级-A】

**链接：**

（1）经过验证的合约

https://hecoinfo.com/token/0x26db8742da87d2e74911bfa4a349d4f6f7fc6037

（2）未经过验证的合约

https://ropsten.etherscan.io/token/0xd48d08ec6513c1549733e1bba1132a5d6f53e351#readContract

**分析：**

（1）当合约未验证时，Max Total Supply，Holders 显示为 0，Decimals 能显示正确?

（2）Official Site，Social Profiles 是验证合约时填写的；其他是统计或者喂价的；

（3）还有对应的菜单有 Check previous token supply,Add Token to Web3 Wallet, Update Token Info,Update Name Tag, Submit Label, Report/Flag Address, Add to Ignore List 后面再研究

**数据库设计:**

**问题:**

#### Transfer 列表 【优先级-A】

**链接：**https://hecoinfo.com/token/0x26db8742da87d2e74911bfa4a349d4f6f7fc6037

**分析：**

ERC20 TOKEN 交易列表，点击可跳转到 HT 的交易详情页；

**数据库设计:**

**问题:**

#### Holder 列表【优先级-A】

**链接：**https://hecoinfo.com/token/0x26db8742da87d2e74911bfa4a349d4f6f7fc6037#balances

**分析：**

拥有该 TOKEN 的地址，数量占比和图标分析。

**数据库设计:**

**问题:**

#### Info【优先级-A】

**链接：**https://hecoinfo.com/token/0x26db8742da87d2e74911bfa4a349d4f6f7fc6037#tokenInfo

**分析：**

显示市场相关信息。

**数据库设计:**

**问题:**

#### Read Contract【优先级-A】-任艳多

**链接：**https://hecoinfo.com/token/0x26db8742da87d2e74911bfa4a349d4f6f7fc6037#readContract

**分析：**

(1) 合约的所有不需要改变状态的读函数，可 WEB3.JS 调取结果。-前端朱斌

(2) 当没有做合约验证时，EVNETS 的函数名称和参数根据推断匹配产生。

(3） 读出函数列表，供前端显示。

**数据库设计:**

**问题:**

#### Write Contract【优先级-A】-任艳多

**链接：**https://hecoinfo.com/token/0x26db8742da87d2e74911bfa4a349d4f6f7fc6037#writeContract

**分析：**

(1) Connect to Web3 能链接到 MetaMask-前端朱斌

(2) 读出函数列表，可连接后执行交易；

**数据库设计:**

**问题:**

#### Analytics【优先级-C】

**链接：**https://hecoinfo.com/token/0x26db8742da87d2e74911bfa4a349d4f6f7fc6037#tokenAnalytics

第 3 页，2021 年 3 月 15 日的交易记录。

**分析：**

（1）Token Contract Overview，按日期分析 Transfer Amount, Transfers Count, Unique Receivers, Unique Sender, Total Uniques 等第一 TAB 数据在时间维度的统计。

（2）Transfer Amount ： 按日期汇总对应的 ERC20 的 TOKEN 的数量；

（3）Transfers Count： 统计发生 ERC20 的交易笔数；

（4）Unique Receivers：统计去重接收者地址的交易笔数 ；

（5）Unique Sender：统计去重发送者地址的交易笔数 ；

（6）Total Uniques：发送和接收去重地址统计；

**数据库设计:**

**问题:**

### 验证节点排行榜页【优先级-B】

**链接：**https://hecoinfo.com/validators

**分析：**

（1）包含排名序号，Address，产出的第一个块，最后一个块，1/7/30 天出块统计[要提前归纳吗？]，当前状态 Active（Yes/No）

（2）统计信息应该从 eth_getBlockByNumber 的 miner 中提取统计出来。

（3）当前状态可以通过输入区块号的 congress_getValidators 获得当前的激活验证者。

**数据库设计:**

**问题:**

(1) 这个矿工节点是从 eth_getBlockByNumber 的 miner 字段提取出来的？

(2) 目前该合约的字节码信息不同于链上的信息，待朱斌穿刺确认。

- 不用合约，用 RPC 接口。

### 验证节点设置信息页【优先级-B】

**链接：**https://hecoinfo.com/validatorset

https://hecoinfo.com/address/0xfc20f6a8a1a65a91f838247b4f460437a5a68bca#validatorset

**分析：**

（1）包含时间，区块号，Validators(21 个)，Total Voting Power，Total Jailed，Total Incoming 信息列表，对应的是出块这一刻的验证者和收入情况，详细见下面解答。

（2）Validators(21 个)可以由 API 的 congress_getValidators 获取。

（2）点击 Validators(21 个)可调转到“Validators Set Info By Block”页面。

**数据库设计:**

**问题:**

（1）Total Voting Power，Total Jailed，Total Incoming 从哪儿获取呢？

目前分析下来，RPC 通过 getTopValidators() , getValidatorInfo(address val) 获得每个区块对应的值的状态，来更新 SNAPSHOP 数据。

distributeBlockReward 函数触发 event LogDistributeBlockReward( address indexed coinbase,uint256 blockReward, uint256 time ); 事件，对应的是该区块的 Total Voting Power 和 Total Incoming 信息。

Total Jailed 从 congress_getValidators 查询出来。

### 区块索引的验证节点信息页【优先级-B】

**链接：**

（1）矿工分配页面：https://hecoinfo.com/validatorset/snapshot/4572778

（2）https://hecoinfo.com/address/0x000000000000000000000000000000000000F000#internaltx

搜到 4572778 区块。

**分析：**

（1）包括对这个区块经过验证的节点总数，INCOMING，JAILED 的统计梳理，以及验证者列表的地址，Fee Address，Jailed，分配的收入 Incoming（远超交易 GAS 的收入）。

（2）可以知道https://hecoinfo.com/tx/0xa7123c3918fa19b4aa5a6cee7ecf9f8372013288391706f9417a106703c14475对应的是 function withdrawProfits(address validator) 函数调用，并不是 distributeBlockReward 分配函数，这个函数对应的事件也没有找到。-heco 现在显示的是异常的数据库信息，我们按实际实现即可。

收入逻辑同上。

**数据库设计:**

**问题:**

### 验证节点索引的验证节点信息页【优先级-B】

**链接：**

（1）https://hecoinfo.com/validatorset/snapshot/0x558c6bb5a0f440c686b78a864909e935ffd2c0e8

**分析：**

搜索条件为 0x558c6bb5a0f440c686b78a864909e935ffd2c0e8 这个验证者地址。

**数据库设计:**

**问题:**

### 验证节点详情页

#### 概要 【优先级-B】

**链接：**https://hecoinfo.com/address/0x558c6bb5a0f440c686b78a864909e935ffd2c0e8

**分析：**

（1）这个矿工 0x558c6Bb5A0f440C686B78a864909E935fFd2C0E8 对应的收益地址为 0xbd50fc491fcc24247eca065dc9e867b3ebd41541

（2）这个页面不同于合约地址页面和外部地址页面，包括 Blocks Validated 的区块数量，以及其他一些信息。

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

#### transactions 【优先级-B】

**链接：**https://hecoinfo.com/address/0x558c6bb5a0f440c686b78a864909e935ffd2c0e8

**分析：**

（1）作为普通的外部账户地址，显示 HT 的来往记录，不包括内部交易。

这儿的记录应该是解析区块和交易时解析出来的。

**数据库设计:**

**问题:**

#### HRC20 Token Txns 【优先级-B】

**链接：**https://hecoinfo.com/address/0x558c6bb5a0f440c686b78a864909e935ffd2c0e8#tokentxns

**分析：**

该地址对应的 ERC20 TOKEN 的交易记录。

**数据库设计:**

**问题:**

#### Validated Blocks 【优先级-B】

**链接：**https://hecoinfo.com/address/0x558c6bb5a0f440c686b78a864909e935ffd2c0e8#mine

**分析：**

这个是指这个节点挖出的区块列表的信息，包括该区块的 Transaction 笔数，Gas Used, 交易奖励。

这个是指针对区块的统计一部分查询。

**数据库设计:**

**问题:**

#### Validators SetInfo【优先级-B】

**链接：**https://hecoinfo.com/address/0x558c6bb5a0f440c686b78a864909e935ffd2c0e8#validatorset

**分析：**

这个节点作为验证者节点，获取的 Block，Fee Address，Jailed，Incoming 等信息。可以从“验证节点设置信息”列表中筛选出来。

**数据库设计:**

**问题:**

#### Analytics 【优先级-C】

**链接：**https://hecoinfo.com/address/0x558c6bb5a0f440c686b78a864909e935ffd2c0e8#analytics

**分析：**

(1) 按照 HT Balance(HT Account Balance, Historic USD Val, Current USD Val, Txn Count)的时间维度进行分析;

(2) 实现参考“账户地址详情”的 Analytics 【优先级-C】信息。

**数据库设计:**

**问题:**

### HRC721 详情页

#### 概要【优先级-B】

**链接：**

(1) Super Three Kingdoms Hero https://hecoinfo.com/token/0x2d36c7c7c28b1442c0f2ebb2015e469147845144

(2) CryptoKitties https://cn.etherscan.com/token/0x06012c8cf97bead5deae237070f9587f8e7a266d

**分析：**

Social Profiles 和一些统计信息，包括 Max Total Supply 总供应量，Holders 持有地址数，Transfers 交易笔数。

Contract 地址，Official Site 官网地址，Social Profiles(facebook)等其他信息。

**数据库设计:**

**问题:**

#### Transfers【优先级-B】

**链接：**https://hecoinfo.com/token/0x2d36c7c7c28b1442c0f2ebb2015e469147845144

**分析：**

采用 Transfer EVENT LOG 提取出来的数据。

**数据库设计:**

**问题:**

#### Holders【优先级-B】

**链接：**https://hecoinfo.com/token/0x2d36c7c7c28b1442c0f2ebb2015e469147845144#balances

**分析：**

每个地址持有多少个 ERC721 的数量，比重。

**数据库设计:**

**问题:**

#### Inventory(库存)【优先级-B】

**链接：**

（1）https://hecoinfo.com/token/0x2d36c7c7c28b1442c0f2ebb2015e469147845144#inventory

（2）加密猫 ERC721：https://cn.etherscan.com/token/0x06012c8cf97bead5deae237070f9587f8e7a266d#inventory

（3）特定 ID 的详情页面：https://cn.etherscan.com/token/0x06012c8cf97bead5deae237070f9587f8e7a266d?a=757343

（4）CryptoKitties (CK)有加密猫源码：

https://etherscan.io/address/0x06012c8cf97bead5deae237070f9587f8e7a266d#code

**分析：**

(1)TOKEN 的对应清单，包含 Owner 的地址和对应的 TOKENID。

(2) 以太坊的还能显示对应的图像。加密猫，例如https://storage.googleapis.com/ck-kitty-image/0x06012c8cf97bead5deae237070f9587f8e7a266d/757343.png，对应的信息是由erc721Metadata设置的。HECO暂时没有对应的PNG地址，我们也先不给。

(3) 点击 TOKEN ID 能筛选该特定 ID 的详情页面。

https://cn.etherscan.com/token/0x06012c8cf97bead5deae237070f9587f8e7a266d?a=757343

owner:0x0000000000000000000000000000000000000001

TokenID:757343

**数据库设计:**

**问题:**

#### DEX Trades 【优先级-D】

**链接：**

https://cn.etherscan.com/token/0x06012c8cf97bead5deae237070f9587f8e7a266d#tokenTrade

**分析：**

**数据库设计:**

**问题:**

#### INFO 【优先级-D】

**链接：**https://hecoinfo.com/token/0x2d36c7c7c28b1442c0f2ebb2015e469147845144#tokenInfo

**分析：**

ICO 相关信息

**数据库设计:**

**问题:**

#### Read Contract 【优先级-A】-任艳多

**链接：**https://hecoinfo.com/token/0x2d36c7c7c28b1442c0f2ebb2015e469147845144#readContract

https://cn.etherscan.com/token/0x06012c8cf97bead5deae237070f9587f8e7a266d#readContract

**分析：**

（1）合约验证后，才可以解析读和写；

（2）以太坊的加密猫合约可以进行读写。

**数据库设计:**

**问题:**

#### Write Contract 【优先级-A】任艳多

**链接：**https://hecoinfo.com/token/0x2d36c7c7c28b1442c0f2ebb2015e469147845144#writeContract

**分析：**

合约验证后，才可以解析读和写；

**数据库设计:**

**问题:**

### HRC20 市值排行榜页【优先级-B】

**链接：**https://hecoinfo.com/tokens

**分析：**

Holders 是该 TOKEN 从数据库统计;Market Cap 是 CSupply\*Price； Price/Change (%) / Volume (24H) 从接口查询出来，按照**USDT,**BTC,\*\*HT 交易对的形式，查询 1 天的粒度。价格/交易量数据请后端使用火币接口查询更新出来的，可存库用于接口查询失败时使用。

**数据库设计:**

**问题:**

### HRC20 交易量排行榜页【优先级-B】

**链接：**https://hecoinfo.com/tokens-volume

**分析：**

Holders 是统计出来的;

其中的 Unique Senders, Unique Receivers

**数据库设计:**

**问题:**

（1）其中的 Unique Senders, Unique Receivers 怎么来的呢？有什么用处呢？

### HRC20 交易记录列表页【优先级-A】

**链接：**https://hecoinfo.com/tokentxns

**分析：**

按交易远近时间排序的，该时间取确认区块的时间。

**数据库设计:**

**问题:**

### HRC-721 排行榜页【优先级-B】

**链接：**https://hecoinfo.com/tokens-nft

**分析：**

根据 24 小时，7 天的交易量排序

**数据库设计:**

**问题:**

### HRC-721 交易列表页【优先级-B】

**链接：**https://hecoinfo.com/tokentxns-nft

**分析：**

按时间倒序排列，多出 TokenID

**数据库设计:**

**问题:**

### Non-Fungible Token Tracker 【优先级-C】

**链接：**

(2) 按照 NFT 名称搜索 https://hecoinfo.com/tokens-nft?q=NFT

(1) 按照 NFT 合约地址搜索 https://hecoinfo.com/tokens-nft?q=0x78995ad3abca6cdebb905541afc0aeaa8c9e7b9a 【调到 ERC721 页面】

**分析：**

这个页面是指 https://hecoinfo.com/tokens-nft 的搜索页面。

（1）按名称搜索，就是模糊搜索合约的 NAME 值：Name，呈现合约列表；

（2）按合约地址搜索，就是呈现以下内容信息。

Total Supply:1 Name:BeneNFT Symbol:BeneNFT Token Decimals:0 ERC-165 Interface:YES HRC-721 Support HRC-721 Support:YES HRC-721 Metadata Support HRC-721 Metadata Support:YES HRC-721 Enumerable Support HRC-721 Enumerable Support:YES

Implements HRC-721:NO

**结论：**

[1] 参考《1.火币生态链 Heco 入门.md》的（4）ERC721 的信息查询，直接用 eth_call 查出。Implements HRC-721 不知来源，默认为 NO。

[2] 暂不支持 ERC-TOKEN721 下根据地址查询 TOKEN 信息。目前开放的话，也只能显示 4 个变量。ERC-165 Interface 和 Implements HRC-721 并没有。

（3）如果合约地址输入 ERC20 TOKEN 的合约地址，会有提示信息"Sorry, we were unable to locate any valid token transfer events for contract [0x2bfbeea9fb5ab4d4fdc0375d286c36db564646af](https://hecoinfo.com/token/0x2bfbeea9fb5ab4d4fdc0375d286c36db564646af)." 内容呈现了 ERC20 TOKEN 的一些基础信息，Total Supply，Name，Symbol，Decimals，ERC-165 Interface(NO)，Implements HRC-721(NO)。

例如：https://hecoinfo.com/tokens-nft?q=0x2bfbeea9fb5ab4d4fdc0375d286c36db564646af

（4） 如果输入合约地址为普通的智能合约地址，则保持错误地址，Total Supply:0，Name:

**NOT AVAILABLE**，Symbol:**NOT AVAILABLE**，Decimals:8，ERC-165 Interface:

**NO**，Implements HRC-721:**NO**，查出错误的内容。

例如：https://hecoinfo.com/tokens-nft?q=0x7178966e1e80305c96cf7919e78d7264b9ad6988

（5） 如果输入普通外部账户地址，则除了错误提示，任何其他内容都不显示。

例如：https://hecoinfo.com/tokens-nft?q=0x7178966e1e80305c96cf7919e78d7264b9ad6988

**数据库设计:**

**问题:**

### 验证合约列表页【优先级-A】-任艳多

**链接：**https://hecoinfo.com/contractsVerified

**分析：**

（1）License 为开源授权类型，MIT，GNU GPLv2 授权等；

（2）Audited 一直为空，是不是留给以后审计公司使用；

Setting 有 Optimization Enabled 闪电标志，Constructor Arguments 扳手标识。

待 MOZIK 验证时核对。

（3）筛选开关有 Latest 500 Contracts Verified, Open Source License,Solidity Compiler,Vyper Compiler,Contract Security Audit 等选项。

**数据库设计:**

**问题:**

### 验证和发布合约源码页【优先级-A】-任艳多

**链接：**

(1) https://hecoinfo.com/verifyContract

(2) https://hecoinfo.com/verifyContract-solc

**分析：**

（1）输入合约地址，编译器类型(单文件形式)-Solidity 单文件，Solidity 多文件，标准 Standand-Json-Input，Vyper(Experimental), Compiler Version,Open Source License Type 后，进行合约验证。

（2）验证过程中的信息作为管理数据需要入口。验证通过后，需要跟链上的合约绑定关系。

（3）需要计算已验证合约的所有 EVENT 事件和函数选择器，入库到 tb_contract_function 表中。

**数据库设计:**

**问题:**

### 字节码到操作码反汇编【优先级-B】-任艳多

**链接：**https://hecoinfo.com/opcode-tool

**分析：**

就是把 Contract Creation Code 的 ABI 字节码反汇编成操作码。

**数据库设计:**

**问题:**

### 统计页面-Market Data【优先级-C】

**链接：**

(1) 统计页面入口：https://hecoinfo.com/charts

**分析：**

按照 Market Data，Blockchain Data，Network Data，Validators Data，Contracts Data 显示缩略图。

**数据库设计:**

**问题:**

### 统计页面-Daily Transactions【优先级-C】

**链接：**

(1) 统计页面入口：https://hecoinfo.com/charts

(2) HT 价格趋势：https://hecoinfo.com/chart/tx

(3)

**分析：**

（1）htprice 按日统计 ht 的价格趋势。该值可以通过交易所接口拿到，在快照表中要记录当日收盘时的交易价格。其他统计表中也会使用。

（2）Current HecoInfo price at $14.17 @ 0.000431144463234278 BTC/HT，查询显示当前的价格，对 BTC 的相对价格等信息，这部分信息单独表格维护管理。

**数据库设计:**

**问题:**

### **统计页面-Validators by Blocks**【优先级-C】

**链接：**

(1) 统计页面入口：https://hecoinfo.com/charts

(2) Top 25 Validators by Blocks：https://hecoinfo.com/stat/miner?range=7&blocktype=blocks

**分析：**

（1）统计 24 小时，7 天，14 天的验证者节点验证区块信息和币种列表。

（2）这个是统计历史所有的验证者节点信息。

**数据库设计:**

**问题:**

### **Verified Contracts Chart**【优先级-C】

**链接：**

(1) 统计页面入口：https://hecoinfo.com/charts

(2) Huobi Daily Verified Contracts Chart：https://hecoinfo.com/chart/verified-contracts

**分析：**

按日统计已验证的合约数量，对应的是 tb_contract 的 is_verified，需要增加合约验证时间字段。

**数据库设计:**

**问题:**

### Yield Farms【优先级-D】

**链接：**https://hecoinfo.com/yieldfarms

**分析：**

需求文档明确要求选取部分，待 V1.0 交付后需求方确定。

**数据库设计:**

**问题:**

### 网站偏好设置-中英文切换【优先级-C】

**链接：**https://hecoinfo.com/settings

**分析：**

包括

（1）中英文切换(中文/English，默认为 English)

（2）Advanced Mode

显示所有交易和区块细节。 对于程序编写员在单一视图中进行调试很有用

**数据库设计:**

**问题:**

(1) Advanced Mode 开关打开对程序有什么影响，没有分析出来。待需求分析。

### 主网/测试网切换【优先级-D】

**链接：**

https://testnet.hecoinfo.com/

https://hecoinfo.com/

**分析：**

对应不同的域名，切换到主网还是测试网络。

两套系统。目前对应的是 heco 主网数据。

**数据库设计:**

**问题:**

（1）对于 BIBOX 来说，还涉及新上线网络。2 套环境对应的环境资源准备。是否 OK？

### 用户注册/管理页面【优先级-C】

**链接：**

（1）用户登录页面 https://hecoinfo.com/login

（2）用户注册页面 https://hecoinfo.com/register

（3）忘记密码 https://hecoinfo.com/lostpassword

（4）账号概要（OverView） https://hecoinfo.com/myaccount

（5）账号概要（Account Setting&Profile） https://hecoinfo.com/myaccount

​ 修改密码/头像/个人主页等；

**分析：**

**数据库设计:**

**问题:**

### **API 秘钥列表**【优先级-C】

**链接：**

（1）链接 https://hecoinfo.com/myapikey

**分析：**

（1）API 接入秘钥列表，包括 Api-Key Token 和创建时间。例如 4DPN4CCIGUCCYRAWG4DBKJ6Z8QW2CIIKGNAppName: ARTARVA

用于接口调用。

（2）是否考虑使用 TOKEN+自动生成的时间戳做个 URL 编码，防止 KEY 泄漏导致的持续恶意接口调用？

​ 或者针对 API KEY 的做个月度总量限制，为超量收费做记录？-先不管。

**数据库设计:**

**问题:**

（1）针对外部接口，此处是否有商用规划，一般接口调用免费。在什么场景下收取费用呢？

### **API 接口-Accounts**【优先级-C】

**链接：**

(1) https://hecoinfo.com/apis#accounts

**分析：**

包含以下内容，

Get HT Balance for a single Address -单地址余额 Get HT Balance for multiple Addresses in a single call -多地址余额 Get a list of 'Normal' Transactions By Address -起始区块之间的交易列表 Get a list of 'Internal' Transactions by Address -起始区块之间，某个地址的内部交易列表 Get "Internal Transactions" by Transaction Hash - 单笔交易的内部交易列表 Get "Internal Transactions" by Block Range -起始区块之间的内部交易列表 Get a list of "HRC-20 - Token Transfer Events" by Address - -起始区块之间，某个地址的 HRC20 交易列表 Get list of Blocks Validated by Address - 由某个验证者节点作为 miner 的区块列表(不是 POS 的验证)

需要重新整理查询接口。

**数据库设计:**

**问题:**

### **API 接口-Contract APIs**【优先级-C】

**链接：**

（1） https://hecoinfo.com/apis#contracts

**分析：**

（1） Get Contract ABI for Verified Contract Source Codes - 获取已验证智能合约的 API 信息

（2）Get Contract Source Code for Verified Contract Source Codes - 获取已验证智能合约的源码

**数据库设计:**

**问题:**

### **API 接口-Tokens**【优先级-C】

**链接：**

（1） https://hecoinfo.com/apis#tokens

**分析：**

（1）Get HRC20-Token TotalSupply (aka MaxSupply) by ContractAddress - TOKEN 总供应量

（2）Get HRC20-Token Circulating Supply (Applicable for Huobi Cross Chain token Types) by ContractAddress - 查询流通量

（3）Get HRC20-Token Account Balance for TokenContractAddress - 查询余额

**数据库设计:**

**问题:**

（1）怎么计算一个 TOKEN 的流通量？

[1] 接口 https://api.hecoinfo.com/api?module=stats&action=tokenCsupply&contractaddress=0x66a79d23e58475d2738179ca52cd0b41d73f0bea&apikey=4DPN4CCIGUCCYRAWG4DBKJ6Z8QW2CIIKGN

[2] 页面 https://hecoinfo.com/token/0x66a79d23e58475d2738179ca52cd0b41d73f0bea

接口查询的流通量跟页面显示的流通量不一致。

### **API 接口-Stats **【优先级-C】

**链接：**

（1）https://hecoinfo.com/apis#stats

**分析：**

（1） Get Total Supply of HT on the Huobi Eco Chain - 获得当前的 HT 总量

（2）Get Validators list on the Huobi Eco Chain - 获取当前的验证者节点

**数据库设计:**

**问题:**

### **API 接口-公共 RPC 节点**【优先级-C】

**链接：**

https://hecoinfo.com/apis#rpc

**分析：**

（1）公布主网和测试网的 RPC 接口地址信息，

**数据库设计:**

**问题:**

### 人机交互验证【优先级-C】

**链接：**

目前人机交互验证分布位置

(1) 注册页面 https://hecoinfo.com/register

(2) 合约验证页面 https://hecoinfo.com/verifyContract-solc?a=0x6d0bf3091cfee5e608b5f34e29d68b6d16553309&c=v0.8.4%2bcommit.c7e474f2&lictype=1

（3）智能合约地址页面下需要给官方更新信息https://hecoinfo.com/contactus?id=5&a=0xc9121e476155ebf0b794b7b351808af3787e727d，例如Suggested Name Tag，Website，Category Label, Short Description,Additional Comment 等。

（4）跟浏览器官方联系更新信息 https://hecoinfo.com/contactus?id=5&a=0xc9121e476155ebf0b794b7b351808af3787e727d

（5）欺诈/钓鱼地址收集标识 https://docs.google.com/forms/d/e/1FAIpQLSfSN1LHnsYrXTqQBQtfGi9BFuzd08VRxVxyyBLWZtw2eYBmUw/viewform

**分析：**

（1）在中国采用图形验证码实现。

**数据库设计:**

**问题:**

### 地址监控列表 My Watch List【优先级-D】

**链接：**

（1）登录后 Watch List 栏目 https://hecoinfo.com/myaddress

**分析：**

（1）登录后 Watch List 显示配置

（2）弹窗支持 ADD，增加要监控的地址和通知选项

​ Please select your notification method below : ​ 1） No Notification ​ 2） Notify on Incoming & Outgoing Txns ​ 3） Notify on Incoming (Receive) Txns Only ​ 4） Notify on Outgoing (Sent) Txns Only ​ Other Options： ​ Also Track HRC-20 Token Transfers (click to Enable)

根据选择能够邮件通知或者网页列表显示。

**数据库设计:**

**问题:**

### 地址标识功能【优先级-D】

**链接：**

（1）智能合约地址https://hecoinfo.com/address/0xc9121e476155ebf0b794b7b351808af3787e727d

（2）外部账户地址 https://hecoinfo.com/address/0xc9121e476155ebf0b794b7b351808af3787e727d

（3）特定账户变化统计 https://hecoinfo.com/balancecheck-tool?a=0xc9121e476155ebf0b794b7b351808af3787e727d

（4）跟浏览器官方联系更新信息 https://hecoinfo.com/contactus?id=5&a=0xc9121e476155ebf0b794b7b351808af3787e727d

（5）欺诈/钓鱼地址收集标识 https://docs.google.com/forms/d/e/1FAIpQLSfSN1LHnsYrXTqQBQtfGi9BFuzd08VRxVxyyBLWZtw2eYBmUw/viewform

（6）Token Approvals https://cn.etherscan.com/tokenapprovalchecker?search=0x82f51197645af46b80650e86d500b67c1454798f

**分析：**

包括以下小菜单：

（1）My Watch List Flag

​ 在登录后的 My Watch List 配置，此处只有状态显示；

（2） Private Name Tag or Note

​ 弹窗能增加或者修改 1 个 TAG 和备注信息；

（3）Check Preview Balance

​ 针对该地址，可以按日期或者区块号查询该地址的信息，包括 SNAPSHOT DATE，BLOCK，HT TOKEN 数量和与当前时间相比的变化 HT 数量。

（4）Update Name Tag

​ 智能合约地址页面下提供 Name/Email Address /Company Name/Company Website/Is this an address owner or a user submission?，需要请官方更新信息，例如 Suggested Name Tag，Website，Category Label, Short Description,Additional Comment 等。

（5）Submit Label

​ 信息同上。是请官网更新默认的标识信息。

（6）Reprot/Flag Address

HecoInfo 网络钓鱼表格， 该表格的目的是收集网络钓鱼/欺诈尝试和导致用户损失资金的事件的报告。

以这种形式收集的信息将帮助我们在 HecoInfo 上标记或标记“网络钓鱼/欺诈”地址，以警告并告知用户该地址涉及不道德的活动（高风险/虚假）。 （7） Token Approvals

Token 批准？ 不知道干什么的呢？

**数据库设计:**

**问题:**

（1） Token Approvals https://hecoinfo.com/tokenapprovalchecker?search=0xc9121e476155ebf0b794b7b351808af3787e727d 这个页面干什么的不知道，未找到样例。

### **交易标识功能**【优先级-D】

**链接：**

（1）交易页面的右上角子菜单https://hecoinfo.com/tx/0x073cb2c22408a24bf3e13ecca212535a4382ecf08adc419dc43e457b7c3b447c

（2）Remix Debugger https://hecoinfo.com/remix?txhash=0x073cb2c22408a24bf3e13ecca212535a4382ecf08adc419dc43e457b7c3b447c

（3） Geth VM Trace Transaction https://hecoinfo.com/vmtrace?txhash=0x073cb2c22408a24bf3e13ecca212535a4382ecf08adc419dc43e457b7c3b447c

（4）Geth Debug Trace https://hecoinfo.com/visualizer?tx=0x073cb2c22408a24bf3e13ecca212535a4382ecf08adc419dc43e457b7c3b447c&type=txn

（5）Raw traces https://hecoinfo.com/vmtrace?txhash=0x073cb2c22408a24bf3e13ecca212535a4382ecf08adc419dc43e457b7c3b447c&type=gethtrace2#ContentPlaceHolder1_raw

（6）Token Transfer Visualizer

https://hecoinfo.com/visualizer?tx=0x073cb2c22408a24bf3e13ecca212535a4382ecf08adc419dc43e457b7c3b447c&type=tkn

分析：\*\*

（1）Remix Debugger

对应 REMIX 调试页面，可以重现合约交易过程，做单笔调试复现。Etherscan 的版本处于 Alpha 测试阶段。

（2）Geth Debug Trace

Geth VM Trace Transaction 页面，执行的 VM 操作码记录。

（3）Geth Debug Trace_2

该笔交易的输入/输出查询信息。例如：

```
{
  "type": "CALL",
  "from": "0xc9121e476155ebf0b794b7b351808af3787e727d",
  "to": "0x66a79d23e58475d2738179ca52cd0b41d73f0bea",
  "value": "0x0",
  "gas": "0x10b10",
  "gasUsed": "0x3d63",
  "input": "0xa9059cbb0000000000000000000000003cc18bd97b4947c8528154e56ac93aa65c6ae2f000000000000000000000000000000000000000000000000000246d7a0510ac00",
  "output": "0x0000000000000000000000000000000000000000000000000000000000000001",
  "time": "4.0036ms"
}
```

（4） Txns Visualizer

交易可视化。图形化显示该笔交易跟哪些地址，发送了多少 HT 的交易记录图形。

（5）HRC-20 Token Visualizer

该笔交易对应的 HRC20 TOKEN 的可视化图。速度慢，3 分钟也未输出结果。估计未商用。

**数据库设计:**

**问题:**

### 私有交易标识【优先级-D】

**链接：**

（1）私有交易标识 https://hecoinfo.com/mynotes_tx

**分析：**

（1）登录后可跳转到该页面。ADD 弹窗可添加交易地址和增加备注。增加备注后可以在交易详情页面的“Private Note:”看到备注信息。

**数据库设计:**

**问题:**

### **私有地址标识**【优先级-D】

**链接：**

（1）My Address Private Notes https://hecoinfo.com/mynotes_address

**分析：**

**数据库设计:**

（1）在地址页面，针对 Name Tag 做的增加/修改，在此处的汇总。

（2）此处也存在 ADD 按钮，可以针对特定 address，增加 Name Tag 和备注信息。

**问题:**

### **忽略 TOKEN 列表**【优先级-D】

**链接：**

（1） My Token Ignore List https://hecoinfo.com/mytokenignore

**分析：**

（1）登录后可弹窗 ADD TOKEN 智能合约地址信息。

不喜欢看到的 TOKEN？现在，您可以隐藏它，使其不显示在“地址令牌摘要”，“令牌持有”和“监视”列表页面上。

**数据库设计:**

**问题:**

### **自定义 ABI 列表**【优先级-D】

**链接：**

（1）My Custom ABIs https://hecoinfo.com/mycustomabi

**分析：**

（1）登录后点击该栏目，弹窗 ADD 可增加 Add a new custom ABI，信息包括 Name，Address，Custom ABI。

**数据库设计:**

**问题:**

（1）My Custom ABIs 信息用途不明。待定？

### **广播原始交易**【优先级-D】

**链接：**

（1）https://hecoinfo.com/pushTx

**分析：**

不需要调用 MetaMask 进行签名了。

（1）需要穿刺下怎么发生的。

**数据库设计:**

**问题:**

### **Vyper 合约编译**【优先级-C】

**链接：**

（1）https://hecoinfo.com/vyper

**分析：**

新语言 Vyper 的合约编译验证流程。

**数据库设计:**

**问题:**

### **TOKEN 验证**【优先级-D】

**链接：**

（1）https://hecoinfo.com/tokenapprovalchecker

**分析：**

该功能上面已经分析过了，目前不知其功能。

**数据库设计:**

**问题:**

### **待打包交易查询工具**【优先级-C】

**链接：**

（1）https://scan.hecochain.com/pending

**分析：**

实时查询某个特定的交易，确认其是否已被打包。

结果为"该交易已经进入区块链 "或者“该交易未进入区块链”

**数据库设计:**

**问题:**

### **Gas Price 实时查询**【优先级-C】

**链接：**

（1）https://scan.hecochain.com/gasprice

**分析：**

（1）根据 Heco 链上转账数据，每 3 秒刷新一次

显示快，适中，慢分别需要多少个 Gwei.

**数据库设计:**

**问题:**

(1) FAST /SLOW 的值怎么计算来的呢？算法呢？

查询的 gas price 作为中位数，+10%作为 fast,降低 10%作为 slow.

### **待定未知**【优先级-E】

**链接：**

**分析：**

**数据库设计:**

**问题:**

## 6.3 问题和解答

### （1）验证者节点相关信息如何获取

[1] https://hecoinfo.com/validators，从miner和区块状态查询中综合获取；

[2] https://hecoinfo.com/validatorset,

[3] https://hecoinfo.com/validatorset/snapshot/4496038目前跟事件或者函数选择器对不上，eth_getLogs中不包含REWARD分配的调用事件记录。

### （2）内部交易目前分析是通过 debug.traceTransaction 实现。【OK】

[1] debug.traceTransaction，过滤器类型为 call_Trace 可以把类型为 CALL 的筛选出来。该结果包含所有的一级及二级，三级等跟 ETH 相关的交易。

### （3）关于市场相关的价格信息是查询外部接口获取吗？接口信息呢？

heco 这里统计的市场价格和交易量，也都是 dex 发生的。

[1] BIBOX 交易所

接口文档：https://biboxcom.github.io/v3/spot/zh/#56803842de

样例：https://api.bibox666.com/v3/mdata/market?pair=BTC_USDT

[2] 火币

https://huobiapi.github.io/docs/spot/v1/cn/#5ea2e0cde2

[3] 非小号

接口文档：https://github.com/xiaohao2019/API-docs/blob/master/PublicApi_CN.md

[4]

### （4）合约部署失败【OK】

**问题描述：**部署 Validators 失败，提示为“Contract creation initialization returns data with length of more than 24576 bytes. The deployment will likely fails.”

**解决方法：**

编译时启动“Enable Optimization”。

对应链接：https://testnet.hecoinfo.com/tx/0x5aac9e2bf806206fcb1671ac4f76c718838b308d7002e1dd61517dc5abc3606e

### （5）如何区分 HRC20 和 HRC721 的 TOKEN 交易记录？【OK】

参考：https://hecoinfo.com/address/0x6d0bf3091cfee5e608b5f34e29d68b6d16553309#tokentxnsErc721

通过有无 top1,top2 来区分是 HRC20 交易还是 HRC721 交易。

### （6）Uniswap 协议是什么？

### （7）Pending 交易信息从哪儿获取呢？【OK】

当交易还没有分配区块的的时候，https://cn.etherscan.com/txsPending Pengding 交易列表的信息从哪儿获取呢？

【答复】当区块同步后，txpool_content 可以获得交易池中 pending 和 queque 的内容。

### （8）CSupply 是指什么？【OK】

链接：https://hecoinfo.com/token/0x66a79d23e58475d2738179ca52cd0b41d73f0bea

Total Supply：20,064.022 **HBTC**

CSupply: 20,064.021999，表示 circulating supply

目前是一样的。找到一个不一样的样例再分析，

加密货币的循环供应可能随时间增加或减少。例如，[比特币](https://academy.binance.com/en/glossary/bitcoin)的循环供应将逐渐增加，直到达到 2100 万枚硬币的最大供应量为止。这种逐渐增加与平均每 10 分钟产生新硬币的[采矿](https://academy.binance.com/en/glossary/mining)过程有关。另外，像[币安](https://academy.binance.com/en/articles/what-is-a-coin-burn)那样的[硬币烧毁](https://academy.binance.com/en/articles/what-is-a-coin-burn)事件会导致循环供应减少，从而永久性地将硬币从市场[上清](https://www.binance.com/en)除掉。

循环供应是指公众可以使用的硬币，不应与[总供应量](https://academy.binance.com/en/glossary/total-supply)或[最大供应量](https://academy.binance.com/en/glossary/maximum-supply)相混淆。总供应量用于量化现有硬币的数量，即已发行的硬币数量减去已燃烧的硬币数量。总供应量基本上是循环供应量和锁定在代管中的硬币的总和。另一方面，最大供应量将量化将存在的最大硬币数量，包括将来将要开采或提供的硬币。

此外，[加密货币](https://academy.binance.com/en/glossary/cryptocurrency)的循环供应可用于计算其[市值](https://academy.binance.com/en/glossary/market-capitalization)，该[市值](https://academy.binance.com/en/glossary/market-capitalization)是通过将当前市场价格乘以流通的硬币数量而产生的。因此，如果某种加密货币的流通量为 1,000,000 个硬币，每个硬币的交易价格为 5.00 美元，则市值将等于 5,000,000 美元。

### （9）验证节点的惩罚规则不合理？【OK】

目前情况下，当该节点计数达到 24 时，如果一个验证人从来没有提取过 withdrawProfits，一个验证人已经提取过 withdrawProfits 了。那他们的惩罚数量是不一样的。

是不是 heco 应该在提取激励时间到达时，就触发马上把收入打给验证者，用于激励验证者工作，防止异常时激励全清？

### （10）智能合约 ABI 怎么区分是 read 还是 write？【OK】

(1) [深入以太坊智能合约 ABI](https://my.oschina.net/u/2275217/blog/1800675) https://my.oschina.net/u/2275217/blog/1800675

(2) 深入以太坊智能合约 ABI https://blog.csdn.net/weixin_33918114/article/details/91486079

### （11）按市场容量排行的 TOKEN 是人工配置的吗？查询参数？

（1）https://hecoinfo.com/tokens

（2）所有交易对参数 usdt 改为\*husdt

Heco-Peg HBTC Token (HBTC)：btcusdt

Heco-Peg ETH Token (ETH): ethhusdt

Heco-Peg USDTHECO Token (USDTHECO): 本身，不查

Heco-Peg HDOT Token (HDOT):dotusdt

Heco-Peg USDCHECO Token (USDC-HECO):usdcusdt

Heco-Peg HBCH Token (HBCH):bchusdt

Heco-Peg HLTC Token (HLTC):ltcusdt

Heco-Peg UNI Token (UNI):uniusdt

Heco-Peg LINK Token (LINK):linkusdt

Heco-Peg WBTCHECO Token (WBTC):wbtcusdt

Heco-Peg HFIL Token (HFIL):filusdt

Heco-Peg DAIHECO Token (DAI-HECO):daiusdt

Heco-Peg AAVE Token (AAVE):aaveusdt

### （12） 交易详情中事件日志的名称怎么显示？数据库中没有对照【OK】

**【答复】**

​ 对于未验证的合约，这个函数名称是不能显示的；

​ 对于已验证的合约，从已验证合约函数表中根据 top0[KECCAK256]查询出对应的函数名称。

对应的就是 Event Logs 的函数名称https://hecoinfo.com/tx/0x1cd794b0ec72671191da3ad3e4d524b661413f7c8622ff3d3e53037641e9fea0#eventlog，

Input Data 的函数解析，https://hecoinfo.com/tx/0xc3f76a49b3e4b65cfeee45386882cf63c9a85ca7417b97f1501abff712c8c590，

合约下 Evernlog 的函数选择器名称https://hecoinfo.com/address/0x561d615b08171f5267055fa6997fbbd8bb3e31da#events，例如getReward()能显示出来。

### （13） HRC-721 信息的 Implements ERC-721:是指什么？

https://hecoinfo.com/tokens-nft?q=0xb57922c837b71cc7f0ada03d710fe143be094fdf

【答复】目前 heco 和 ETH 的 ERC721 查询发现该值一直为 0，不是指接口功能的。

### （14）怎么计算一个 TOKEN 的流通量？

[1] 接口 https://api.hecoinfo.com/api?module=stats&action=tokenCsupply&contractaddress=0x66a79d23e58475d2738179ca52cd0b41d73f0bea&apikey=4DPN4CCIGUCCYRAWG4DBKJ6Z8QW2CIIKGN

[2] 页面 https://hecoinfo.com/token/0x66a79d23e58475d2738179ca52cd0b41d73f0bea

接口查询的流通量跟页面显示的流通量不一致。

【答复】

### （15）GAS RPICE 的 FAST /SLOW 的值怎么计算来的呢？算法呢？

查询的 gas price 作为中位数，+10%作为 fast,降低 10%作为 slow.

### （16）accounts 页面的 Heco Genesis Lock 的锁是怎么来的？

https://hecoinfo.com/accounts/1 ，这个锁是为 Heco Genesis 定制的，我们先不实现。

### （17）address 页面的各个 TAB 的出现条件？

address 页面和 token 页面： https://hecoinfo.com/token/0x25d2e80cb6b86881fd7e07dd263fb79f4abe033c 这个页面下会有很多 tab，什么情况下应该显示哪些 tab？这个能给我整个列表吗？然后通过接口哪个字段控制？

针对 address 的 TAB 出现条件归纳如下：

**[1] Transactions**

说明：HT 交易记录列表。

参考：https://hecoinfo.com/address/0xdaf88b74fca1246c6144bc846aaa3441ed095191

出现条件：默认查询接口，地址类的都需要。

**[2] HRC-20 Token Txns**

说明：这个地址有关的 from/to 的 ERC20 交易列表；

参考：https://hecoinfo.com/address/0xdaf88b74fca1246c6144bc846aaa3441ed095191#tokentxns

出现条件：默认查询接口，地址类的都需要。

**[3] Internal Txns** 说明：合约内部 HT 交易列表

参考：https://hecoinfo.com/address/0x26db8742da87d2e74911bfa4a349d4f6f7fc6037#internaltx

https://hecoinfo.com/address/0x0000000000000000000000000000000000000000#internaltx

出现条件：任何地址都可能有该 TAB。建议当查询有内部交易(作为 from/to,非零)时，才显示该 Tab。需要修改交易详情接口。

**[4] Erc721 Token Txns**

说明：ERC721 TOKEN 交易的列表

参考：

https://hecoinfo.com/address/0x81a4f716ec05f05928b0053a413f6f6172d8da30#tokentxnsErc721

https://hecoinfo.com/address/0x582d3cc68c2af9a72eea64c894a077ca8f867f07#tokentxnsErc721

出现条件：任何地址都可能有该 TAB。建议当查询有 ERC721 交易(作为 from/to,非零)时，才显示该 Tab。建议修改交易详情接口。

**[6] Contract**

说明：合约函数信息或者未解析的源码。

参考：

https://hecoinfo.com/address/0x582d3cc68c2af9a72eea64c894a077ca8f867f07#code

https://hecoinfo.com/address/0x66a79d23e58475d2738179ca52cd0b41d73f0bea#code

https://cn.etherscan.com/address/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85#code

出现条件：该地址为合约地址时，需要显示该 TAB。

**[7] Event**

说明：合约中的 Event 记录列表

参考：https://hecoinfo.com/address/0x66a79d23e58475d2738179ca52cd0b41d73f0bea#events

出现条件：只有该地址为合约地址时，才需要显示该 TAB，同上。

**[8] Validated Blocks **

说明：该地址对应的节点验证的块列表。

参考：https://hecoinfo.com/address/0x558c6bb5a0f440c686b78a864909e935ffd2c0e8#mine

出现条件：该地址为验证者节点才会出现该 TAB。建议获取通证详情信息接口 address/tokenDetail 增加该地址是否是验证者节点 bValidator 的标识，用于前端判决是否需要实现这 2 个 TAB。

**[9] Validators Set Info **

说明：该地址对应的节点的奖励情况。

参考：https://hecoinfo.com/address/0x558c6bb5a0f440c686b78a864909e935ffd2c0e8#validatorset

出现条件：当该地址为验证者节点地址时，显示该 TAB。

修改建议：该地址为验证者节点才会出现该 TAB。建议获取通证详情信息接口 address/tokenDetail 增加该地址是否是验证者节点 bValidator 的标识，用于前端判决是否需要实现这 2 个 TAB。

**[10] Analytics**

说明：统计分析

参考：https://hecoinfo.com/address/0x558c6bb5a0f440c686b78a864909e935ffd2c0e8#analytics

出现条件：默认查询接口，地址类的都需要。

### （18）Token 页面的各个 TAB 的出现条件？

**[1] Transfers **

说明：对应的 ERC20 或者 ERC721 的交易列表，对应 2 个不同的接口。

参考：

https://hecoinfo.com/token/0x66a79d23e58475d2738179ca52cd0b41d73f0bea

https://hecoinfo.com/token/0x63d4dea2c18300b3f6e2812c350c1157e3470443

出现条件：ERC20 和 ERC721 TOKEN 页面都需要。

**[2] Holders **

说明：ERC20 或者 ERC721 的持有者列表和余额。

参考：

https://hecoinfo.com/token/0x66a79d23e58475d2738179ca52cd0b41d73f0bea#balances

https://hecoinfo.com/token/0x63d4dea2c18300b3f6e2812c350c1157e3470443#balances

出现条件：ERC20 和 ERC721 TOKEN 页面都需要。

**[3] Info**

说明：该信息为 ERC20 的 ICO 信息，目前都不显示。

参考：https://hecoinfo.com/token/0x66a79d23e58475d2738179ca52cd0b41d73f0bea#tokenInfo

出现条件：不做。

**[4] Exchange**

说明：该信息为 ERC20 的 ICO 信息，目前都不显示。

参考：https://hecoinfo.com/token/0x66a79d23e58475d2738179ca52cd0b41d73f0bea#tokenExchange

出现条件：不做。

**[5] Inventory**

说明：ERC721 的库存列表。

参考：https://hecoinfo.com/token/0x63d4dea2c18300b3f6e2812c350c1157e3470443#inventory

出现条件：只有该合约 TOKEN 为 ERC721 时才出现。

**[6] Read Contract**

说明：读取合约的函数列表

参考：

https://hecoinfo.com/token/0x66a79d23e58475d2738179ca52cd0b41d73f0bea#readContract

https://hecoinfo.com/token/0x63d4dea2c18300b3f6e2812c350c1157e3470443#readContract

出现条件：不管合约是否验证成功，该 TAB 均出现。但内容不同

**[7] Write Contract**

说明：写合约的函数列表

参考：

https://hecoinfo.com/token/0x66a79d23e58475d2738179ca52cd0b41d73f0bea#writeContract

https://hecoinfo.com/token/0x63d4dea2c18300b3f6e2812c350c1157e3470443#writeContract

出现条件：不管合约是否验证成功，该 TAB 均出现。但内容不同

**[2] Analytics**

说明：分析统计

参考：https://hecoinfo.com/token/0x66a79d23e58475d2738179ca52cd0b41d73f0bea#tokenAnalytics

出现条件：目前只针对 ERC20 才出现，ERC721 不存在。

**[2] **

说明：

参考：

出现条件：
