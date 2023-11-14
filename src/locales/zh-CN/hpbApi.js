const hpbApi = {
    'hpbApi.title': 'HPB链开发人员API',
    'hpbApi.tip1': '访问区块链数据',
    'hpbApi.tip2': '构建DAPPs',
    'hpbApi.tip3': '验证合约',
    'hpbApi.tip4': '社区驱动',
    'hpbApi.Introduction': '介绍',

    'hpbApi.Introduction.tip1':'HPB Chain Developer API是作为社区服务提供的，没有保修，因此请使用您需要的，不再使用。我们支持GET/POST请求，速率限制为每秒/IP 5个呼叫。',
    'hpbApi.Introduction.tip2':'注意：除个人/私人使用外，需要通过链接返回源属性或提及您的应用程序“由hpb.io API提供支持”。',

    'hpbApi.Accounts': '账户',

    'hpbApi.Accounts.tip1': '获取单个地址的HPB余额',
    'hpbApi.Accounts.tip2': '在一次调用中获取多个地址的HPB余额',
    'hpbApi.Accounts.tip3': '用逗号分隔地址，单个批次最多可有20个帐户',
    'hpbApi.Accounts.tip4': '获取代币合约地址的的HRC20令牌帐户余额',
    'hpbApi.Accounts.tip5': `按地址获取“正常”交易的列表`,
    'hpbApi.Accounts.tip6': `【可选参数】开始区块：开始区块号检索结果，结束区块：结束b区块号检索结果`,
    'hpbApi.Accounts.tip7': `最多只返回最近10000个交易`,
    'hpbApi.Accounts.tip8': `或`,
    'hpbApi.Accounts.tip9': `获取分页结果 分页=<页码> 和 偏移=<最大记录数>`,
    'hpbApi.Accounts.tip10': `按地址获取“内部”交易的列表`, 
    'hpbApi.Accounts.tip11': `通过交易哈希获取“内部交易”`, 
    'hpbApi.Accounts.tip12': `通过块区间获取“内部交易”`, 
    'hpbApi.Accounts.tip13': `按地址获取“HRC-20-令牌转移事件”列表`, 
    'hpbApi.Accounts.tip14': `要获取特定令牌合约的传输事件，请包含contractaddress参数`, 
    'hpbApi.Accounts.tip15': `按地址获取“HRC-721-令牌转移事件”列表`, 
    'hpbApi.Accounts.tip16': `通过地址获取验证的块列表`, 



    'hpbApi.Contracts': '合约',
    
    'hpbApi.Contracts.tip1': '获取已验证合同源代码的合同ABI',
    'hpbApi.Contracts.tip2': '获取已验证合同源代码的合同源代码',

    'hpbApi.Transaction': '交易',
    'hpbApi.Transaction.tip1': '检查交易凭证状态',
    'hpbApi.Transaction.tip2': '注：状态：0=失败，1=通过。',
    

    'hpbApi.Block': '区块',
    'hpbApi.Block.tip1': '通过块号获得区块奖励',
    'hpbApi.Block.tip2': '通过块号获取估计的区块倒计时时间',
    'hpbApi.Block.tip3': '按时间戳获取块号',
    'hpbApi.Block.tip4': `[参数]时间戳格式：Unix时间戳（支持以秒为单位的Unix时间戳），最接近的值：“之前”或“之后”`,


    'hpbApi.Log': '日志',
    'hpbApi.Log.tip1': '事件日志API旨在提供本机eth_getLogs的替代方案。这是一个POST请求。',
    'hpbApi.Log.tip2': '下面是如何使用此api的一些示例：',
    'hpbApi.Log.tip3': `获取从块号13920200到块号13920300的事件日志，其中日志地址为0x715aA09E6950ffDBda55Cea77f72dd7F52Ae1A62，主题为“0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef”`,
    'hpbApi.Log.tip4': `获取从块号13920200到块号13920300的事件日志，其中日志地址为0x715aA09E6950ffDBda55Cea77f72dd7F52Ae1A62和主题，主题为“否”，主题为“0x00000000000000000075ECD1AB06C4E34763A47E1033E80DE614D09FA4”`,
    'hpbApi.Log.tip5':'提示：“开始块”和“结束块”之间的最大范围为10000。',
    

    'hpbApi.Proxy': '代理',
    'hpbApi.Proxy.tip1': '以下是通过HScan提供的HPB受支持代理API的有限列表。',
    'hpbApi.Proxy.tip2': '返回最近块的编号',
    'hpbApi.Proxy.tip3': '按块编号返回有关块的信息',
    'hpbApi.Proxy.tip4': '从与给定块号匹配的块返回块中的交易数',
    'hpbApi.Proxy.tip5': '返回有关交易哈希请求的交易的信息',
    'hpbApi.Proxy.tip6': '按块号和交易索引位置返回有关交易的信息',
    'hpbApi.Proxy.tip7': '返回从地址发送的交易数',
    'hpbApi.Proxy.tip8': '为已签名的交易创建新的消息调用交易或合约创建',
    'hpbApi.Proxy.tip9': '将十六进制值替换为要发送的原始十六进制编码交易。',
    'hpbApi.Proxy.tip10': '按交易哈希返回交易的收据',
    'hpbApi.Proxy.tip11': '立即执行新消息调用，而不在块链上创建交易',
    'hpbApi.Proxy.tip12': 'eth_call的gas参数为10000000',
    'hpbApi.Proxy.tip13': '返回给定地址的代码',
    'hpbApi.Proxy.tip14': '从给定地址的存储位置返回值',
    'hpbApi.Proxy.tip15': '返回每种燃气的当前价格（单位：wei）',
    'hpbApi.Proxy.tip16': `进行调用或交易，该调用或交易不会添加到区块链中，并返回使用过的气体，可用于估计使用过的燃气`,
    'hpbApi.Proxy.tip17': `eth_estimateGas的气体参数为10000000`,

    'hpbApi.Tokens': '代币',
    'hpbApi.Tokens.tip1': '通过合约地址取HRC20代币总供应量',
    'hpbApi.Tokens.tip2': '通过合约地址取HRC20代币总流通量',
    'hpbApi.Tokens.tip3': '通过合约地址取HRC20代币账户余额',


    'hpbApi.Stats': '统计',
    'hpbApi.Stats.tip1': '获取HPB链上的HPB总供应量',
    'hpbApi.Stats.tip2': '以Wei返回的结果，要获得HPB中的值，请除以返回结果/10000000000000000',
    'hpbApi.Stats.tip3': '获取HPB链上HPB的市值',
    'hpbApi.Stats.tip4': '获取HPB最新价格',
    'hpbApi.Stats.tip5': '获取HPB流通量',
    'hpbApi.Stats.tip6': '按地址获取代币价格',

    'hpbApi.RPC': '公共RPC节点',
    'hpbApi.RPC.tip1': '公共HPB RPC节点',
    'hpbApi.RPC.tip2': '主网HPB RPC节点',
    'hpbApi.RPC.tip3': '主网HPB RPC终点 (链ID 269)',
    'hpbApi.RPC.tip4': '使用说明',
    'hpbApi.RPC.tip5': '开始',
    'hpbApi.RPC.tip6': '您可以使用--RPC标志启动HTTP JSON-RPC',
    'hpbApi.RPC.tip7': 'geth attach  https://hpbnode.com ',
    'hpbApi.RPC.tip8': 'JSON-RPC 方法',
    'hpbApi.RPC.tip9': '请参考此维基页面或使用Postman',

    'hpbApi.RandomNumber': '随机数',

    'hpbApi.RandomNumber.tip1': '获取HPB链上的随机数',
    'hpbApi.RandomNumber.tip2': '通过HPB链上的时间戳获取随机数',
    'hpbApi.RandomNumber.tip3': `根据时间戳获得随机数。timestamp参数表示时间戳精度（以秒为单位）。  
    Format表示返回的格式。如果未写入，则默认值为16进制字符串，dec表示10进制。 
    小数表示10进制返回中保留的位数。`,
    'hpbApi.RandomNumber.tip4':'在HPB链上按块获取随机数',
    'hpbApi.RandomNumber.tip5':` 根据块高度获得随机数，blockno参数表示块高度。 
        Format表示返回的随机数格式。 
        如果未写入，则默认值为16进制字符串，dec表示10进制。小数表示10进制返回中保留的位数`,
     
    
  };
  
  export default hpbApi;
  