import React,{useState, useContext,useEffect} from 'react';
import UserContext from '../../UserContext';
import {useRequest} from 'ahooks';
import { Link} from 'react-router-dom'; 
import { sign,decrypt } from '../../commons/sm2';
import { verify_share,combine_Share,decrypt_SM4,sm3hash  } from '../../commons/tdh2';
import { encode } from "@msgpack/msgpack";   
import moment from 'moment';
import 'moment/locale/zh-cn'; 
import {useTranslation} from 'react-i18next';
import Pager4 from '../../components/Pager4';
import Loading from '../../components/Loading';
import TimeTD from '../../components/TimeTD';
import Modal from 'react-bootstrap/Modal';
import LinkWithTooltip from '../../components/LinkWithTooltip';
import Toast, { T } from "react-toast-mobile";
import "react-toast-mobile/lib/react-toast-mobile.css";   
import Select from 'react-select';
import { useId } from 'react';
 
export default function ContractList() {

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
    setState({...state, body: {...state.body,...params,"start":"1"}});

   
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

  const data = tradeListRequest.data?.tx_list || [];
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
              <th>方法</th>    
              <th>版本</th>   
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
                    <Link to={`/tx/${encodeURIComponent(item.tx_hash) }`} className="hash-tag text-truncate" style={{maxWidth:'200px'}}  title={item.tx_hash }>
                      {item.tx_hash }
                    </Link> 
                  </td> 
                  <td>{item.chain_user_id }</td> 
                  <td>{item.method }</td> 
                  <td>{item.version }</td>  
                  
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
