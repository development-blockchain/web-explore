import React,{useState, useContext,useEffect} from 'react';
import UserContext from '../../UserContext';
import {useRequest} from 'ahooks';
import { Link} from 'react-router-dom';  
import Pager4 from '../../components/Pager4';
import Loading from '../../components/Loading';
import TimeTD from '../../components/TimeTD'; 
import LinkWithTooltip from '../../components/LinkWithTooltip';
import moment from 'moment';
import 'moment/locale/zh-cn'; 
import Toast, { T } from "react-toast-mobile";
import "react-toast-mobile/lib/react-toast-mobile.css"; 
import { sign,verify } from '../../commons/sm2'; 
import { encode,decode } from "@msgpack/msgpack"; 

/* import ContractList from './contractList';
import PublishContract from './publishContract';
 */

function ContractList() {
    const defaultLNG = window.localStorage.getItem('lng') || 'zh_CN';
    moment.locale(defaultLNG);

    const userContext = useContext(UserContext); 
    const [user, setUser] = useState({
    token: userContext.user.token || undefined,
    email:userContext.user.email || undefined,
    key: userContext.user.key || undefined,
    publicKey: userContext.user.publicKey || undefined,
    provider_username: userContext.user.provider_username || undefined,
    provider_pubkey: userContext.user.provider_pubkey || undefined,
    tdh2_pubkey: userContext.user.tdh2_pubkey || undefined,
    user_id: userContext.user.user_id || undefined,
    });   

    const [params,setParams]=useState({
    start: '1',
    length:  window.localStorage.getItem('pageLength') || '50',
    field:'',
    value:''
    })

    const [type, setType] = useState('showAge');   


    const [state, setState] = useState({
    body: {
        start: '1',
        length:  window.localStorage.getItem('pageLength') || '50',
        field:'',
        value:'' 
    },
    }); 


    const handleChangePageSize = e => {
    window.localStorage.setItem('pageLength', e.target.value);
    setState({...state, body: {...state.body, length: e.target.value}});
    };

    const handleSelectField = e => {  
    setParams({...params, "field": e.target.value});
    }; 
    
    const handleChangeValue = e => {  
        setParams({...params, "value": e.target.value});
    };
    const handleChangPageNum = curNum=>{ 
        setParams({...params, "start":curNum});
        setState({...state, body: {...state.body,"start":curNum}});
    }



    const queryData=e=>{ 
        if(params.value ===''){
            params.field ='';
        } 
        if(params.value !=='' && params.field ===''){

            if (String(Number(params.value)) === params.value) {
              //区块高度 
              setState({...state, body: {...state.body, ...params,"start":"1","field":'block_id'}});
            }
            else if (params.value.toUpperCase().startsWith('0X') || params.value.length===64) {
              //交易hash 
              setState({...state, body: {...state.body, ...params,"start":"1","field": 'tx_hash'}});
            }
            else if(params.value.length===44){
              //区块哈希 
              setState({...state, body: {...state.body, ...params,"start":"1","field": 'block_hash'}});
            }
          }else{
            setState({...state, body: {...state.body,...params,"start":"1"}});
          }
    }

    //查询交易
    const tradeListRequest = useRequest(
    body => ({
        url: '/chainBrowser/blockchain/getContracts',
        method: 'post',
        headers: {
        'Authorization': user.token,
        },
        body: JSON.stringify(body),
    }),
    {manual: true},
    );
    
    useEffect(() => {  
    if (!state.isLimitPages) { 
        tradeListRequest.run(state.body);
    }
    }, [state]);

    if (state.isLimitPages) {
    return window.location.replace('/error');
    } 
    if (tradeListRequest.loading) {
    return <Loading />;
    }

    if (!user.token) {
    return (window.location.href = '/login');
    } 

    const data = tradeListRequest.data?.contract_list || [];
    const counts = tradeListRequest.data?.counts || 0;
    const trade_counts = tradeListRequest.data?.counts || 0;
    const totalPage = Math.ceil(Number(trade_counts) / state.body.length);

    return ( 
    <div className="container-fluid space-bottom-2"> 
        <div  className="row d-md-flex justify-content-between mb-1"> 
        <p className="ml-3 mb-2 mb-md-0"> 
        共有{counts}条记录
        </p>
        <div className="mr-3">
            <div className="input-group input-group-shadow">
            {/* <div className="input-group-prepend d-md-block mr-2" >
                <select id="selectKey" className="form-control form-control-sm mb-3 "   onChange={e=>handleSelectField(e)} value={params.field}>
                    <option value="" >请选择关键字</option>
                    <option value="chain_user_id">链上</option>
                    <option value="block_id">区块高度</option>
                    <option value="block_hash">区块哈希</option> 
                    <option value="txhash">交易哈希</option> 
                </select> 
            </div>   */}
            <input type="text" className="form-control form-control-sm mr-2" id="keywrokds"  placeholder="请输入区块高度/区块哈希/交易哈希" 
            style={{width:'250px'}} value={params.value} onChange={e=>handleChangeValue(e)}  /> 
            <div className="">
                <button type="button" className="btn btn-primary btn-sm" onClick={e=>queryData(e)}>搜索</button>
            </div>
            </div> 
        </div> 
        </div>            
        <div className="table-responsive mb-2 mb-md-0">
        <table className="table data-table table-striped table-bordered">
            <thead>
            <tr>
                <th>区块高度</th> 
                <th>区块哈希</th>
                <th>交易哈希</th>
                <th>链上用户</th>   
              {/*   <th>方法</th>    
                <th>版本</th>    */}
                <th scope="col"> 
                    <div className="mr-2">
                    {
                        (type ==='showAge')?
                        <LinkWithTooltip placement="bottom" tooltip="点击切换日期格式">
                            <a href="#!" title="" onClick={e => {  e.preventDefault(); setType('showDate'); }} >
                            块龄
                            </a>
                        </LinkWithTooltip>
                        :
                        <LinkWithTooltip placement="bottom" tooltip="点击切换块龄格式"> 
                            <a href="#!" onClick={e => {  e.preventDefault(); setType('showAge'); }}    > 
                            日期时间(UTC)
                            </a>
                        </LinkWithTooltip>
                    }
                    </div>
                </th>  
                <th>状态</th>    
            </tr>
            </thead>
            <tbody> 
            { data.length >0? data.map(item => {  
                return (
                <tr key={item.block_Id}>  
                    <td> 
                    <Link to={`/block/${item.block_Id }`} className="hash-tag text-truncate" data-toggle="tooltip" style={{maxWidth:'200px'}} title={item.block_Id }   >
                        {item.block_Id }
                    </Link>  
                    </td>  
                    <td> 
                    <Link to={`/block/${encodeURIComponent(item.block_hash) }`} className="hash-tag text-truncate" data-toggle="tooltip" style={{maxWidth:'200px'}} title={item.block_hash } >
                        {item.block_hash }
                    </Link>  
                    </td>  
                    <td>
                    <Link to={`/contractdetail/${encodeURIComponent(item.tx_hash) }`} className="hash-tag text-truncate" style={{maxWidth:'200px'}}  title={item.tx_hash }>
                        {item.tx_hash }
                    </Link> 
                    </td> 
                    <td>{item.chain_user_id }</td> 
                    {/* <td>{item.method }</td> 
                    <td>{item.version }</td>   */}
                    
                    <TimeTD time={item.timestamp} interval={item.interval_timestamp} type={type} />
                    <td>{item.state }</td>  
                </tr>
                );
            }):
            <tr key={1}>
                <td colSpan={8} className="text-center">无数据</td>
            </tr>
            }
            </tbody>
        </table>
        </div>              
        <div id="ContentPlaceHolder1_pageRecords"> 
            <div className="d-md-flex justify-content-between my-3">
            <div className="d-flex align-items-center text-secondary mb-2 mb-md-0">
                <span style={{width:60}}>显示</span>
                <select onChange={handleChangePageSize} className="custom-select custom-select-xs mx-2" value={state.body.length}>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                </select>
                <span style={{width:60}}> 记录</span>
            </div> 
            <Pager4 path="/transactions" current={params.start} handleChangPageNum={handleChangPageNum} total={totalPage} />
            </div> 
        </div> 
        <Toast/>  
    </div> 
    );
}


function PublishContract({user}){  
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        code: '',
        abi: '' 
    }); 

    const handleForm = field => e => {
        setForm({...form, [field]: e.target.value});

        if (e.target.value) {
        setErrors({...errors, [field]: undefined});
        }  
    };  

    const handleBlur = key => () => {
        const _errors = {}; 
        Object.keys(form) 
        .forEach(field => {
            _errors[field] = !form[field];
        });
    
        if (Object.keys(_errors).some(e => !!_errors[e])) {
        if (_errors[key]) {
            setErrors(_errors);
        }
        }
    };
    const deployContract = ()=>{
        const _errors = {}; 
        Object.keys(form)
          .forEach(field => {
            _errors[field] = !form[field];
          });

        if (Object.keys(_errors).some(e => !!_errors[e])) {
            setErrors(_errors);
            return ;
        }
         
        if(!window.Web3.utils.isHex(form.code)){
            prompt.error('编码格式不正确!',false);
            return ;
        }
        const web3 = new window.Web3();
        if(web3){ 
            try {
               const contract =  new web3.eth.Contract(JSON.parse(form.abi));
        
            } catch (error) {
                prompt.error('合约格式不正确!',false);
                return ;
            }
        }

        T.loading("正在部署...");  
        const date=new Date(); 
        const curTimestamp = date.getTime();    
        const userId =user.user_id;
        //1 构造WriteInfo 
        const cContent  = {
            CodeString: form.code,
            ABI:        form.abi,
            State:      0 //Contract_Normal
        }
        const uid =  userId.toString();
        //2 将WriteInfo序列化后生成op 构造第二层WriteRequest
        const cReq   = { UserID: uid, CType: 1, CContents: cContent } 
        //3 WriteRequest序列化后组装为ClientRequest的OP
        const clientReq = {
            Type: 14, //合约交易
            ID: userId,
            OP: encode(cReq),
            TS: curTimestamp,
        }
        //4 将ClientRequest序列化后生成msg msg签名得到sig进行传输 
        const clientReqData = encode(clientReq); 
        const signature = sign(Array.prototype.slice.call(clientReqData), user.key);

        const baseReqData = Buffer.from(clientReqData).toString('base64');
        const baseSignature = Buffer.from(signature,'HEX').toString('base64'); 
        const reqData = {
            "req_data": baseReqData, // 序列化 clientRequest 之后，msg的base64编码值
            "signature":baseSignature // 前端对msg签名之后，签名值的base64编码值
        } 
        deployContractRequest.run({...reqData}).then( 
            res => {   
                T.loaded(); 
                if (res.code === 0) { 
                    console.log('交易id',res);
                    prompt.inform('部署成功!'); 
                    setForm({ code: '',abi: ''})
                }else{
                    prompt.error('部署失败!' +res.cnMsg,false);
                }
            }, 
            err=>{
                console.log('部署失败,',err);
                T.loaded();
            }
        ) 
    }

    const deployContractRequest = useRequest(
        body => ({
          url: '/chainBrowser/user/usertx/deployContract',
          method: 'post',
          headers: {
            'Authorization': user.token,
          },
          body: JSON.stringify(body),
        }),
        {manual: true, formatResult: r => r},
    ); 

    // debounce已达到预期效果！ 防抖
    const debounce=(f,time = 1000)=>{
        let timer = null
        return () => {
        if(timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(f.bind(this),time)
        }
    }  
    return ( 
    <div className="row"> 
        <div className="col-md-12"> 
            <div className={` form-group js-form-message form-group ${errors.code ? 'u-has-error' : ''}`}>  
                <label htmlFor="msg">编码:</label> 
                <textarea className="form-control" id="code" name="code" rows="8" 
                value={form.code}     onChange={handleForm('code')}  onBlur={handleBlur('code')}  ></textarea>
                <div className="invalid-feedback" style={{display: errors.code ? 'block' : 'none'}}> 
                    请输入编码
                </div>
            </div>  
            <div className={` form-group js-form-message form-group ${errors.abi ? 'u-has-error' : ''}`}>  
                <label htmlFor="msg">ABI:</label>
                <textarea className="form-control" id="abi" name="abi" rows="8" 
                value={form.abi}     onChange={handleForm('abi')}  onBlur={handleBlur('abi')}  ></textarea>
                <div className="invalid-feedback" style={{display: errors.abi ? 'block' : 'none'}}> 
                    请输入ABI
                </div>
            </div>  
            <button type="button"   className="btn btn-primary  mt-2" onClick={debounce(deployContract)} >
                部署合约
            </button>    
        </div>
        <Toast/> 
    </div> 
    )
}

 

export default function ContractManage() {  
    const userContext = useContext(UserContext); 
    const [user, setUser] = useState({
      token: userContext.user.token || undefined,
      email:userContext.user.email || undefined,
      key: userContext.user.key || undefined,
      publicKey: userContext.user.publicKey || undefined,
      provider_username: userContext.user.provider_username || undefined,
      provider_pubkey: userContext.user.provider_pubkey || undefined,
      tdh2_pubkey: userContext.user.tdh2_pubkey || undefined,
      user_id: userContext.user.user_id || undefined,
    });   

 
    const [currentTab, setCurrentTab] = useState('contractList');  
  
    const contractTabsConst = [
      {
          key: 'contractList',
          title: "合约列表"
      },  
      {
          key: 'publishContract',
          title: "发布合约"
      }
    ];


    return (
        <main id="content" role="main"> 
            <div className="container-fluid space-bottom-2 p-3">
                <div className="card"> 
                    <div className="header-title"> 
                        <h4 className="card-title p-2">合约管理&nbsp;</h4> 
                    </div> 
                    <div className="card p-1"> 
                        <div className="d-flex justify-content-between align-items-center p-0">
                            <ul className="nav nav-tabs" role="tablist"> 
                                {contractTabsConst.filter(Boolean).map(tab => {
                                    return (
                                    <li className="nav-item" key={tab.key}>
                                        <a className={`nav-link ${tab.key === currentTab ? 'active' : ''}`}  href={`#${tab.key}`}  data-toggle="tab"  onClick={() => {  setCurrentTab(tab.key); }} >
                                            {tab.title}
                                        </a>
                                    </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className="card-body">
                            <div className="tab-content">
                            {currentTab === 'contractList' ? <ContractList user={user}   /> : undefined}
                            {currentTab === 'publishContract' ? <PublishContract user={user}  /> : undefined} 
                            </div>
                        </div>
                    </div> 
                </div>
            </div> 
        </main> 
    );
}
