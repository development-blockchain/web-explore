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
 
export default function Transactions() {

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


  const [showDialog, setShowDialog] = useState(false);
  const [showMsgDlg, setShowMsgDlg] = useState(false);
  const [msg,setMsg] = useState('');
  const [changType,setChangeType]=useState('')
  const [txId,setTxId] = useState(false); 
  const [options,setOptions]=useState([]);
  const [selectState,setSelectState]=useState({
      inputValue:'',
      selectOption:[]
  })
 

  const {t} = useTranslation(['transactions']);
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

  //查看原文
  const lookMsg = (e,msgType,txId)=>{
    e.preventDefault();
    setMsg("");
    if(msgType==='Write_Cipher'){
      readCipher(txId);
    }else{
      readPlain(txId)
    }

  }
  //读明文
  const readPlain=(txId)=>{
    const date=new Date(); 
    const curTimestamp = date.getTime();   
    const userId = user.user_id;
    //1 构造
    const readInfo = {
        RType: "4",
        TS: curTimestamp,
        TxID: txId,
    }
    const readData = encode(readInfo)
    const clientReq = {
        Type: 8,
        ID: userId,
        OP: Buffer.from(readData),
        TS: curTimestamp,
    }
    //4 将ClientRequest序列化后生成msg msg签名得到sig进行传输 
    const clientReqData = encode(clientReq); 
    const signature = sign(Array.prototype.slice.call(clientReqData), user.key);

    const baseReqData = Buffer.from(clientReqData).toString('base64');
    const baseSignature = Buffer.from(signature,'HEX').toString('base64'); 
    const form = {
        "req_data": baseReqData, // 序列化 clientRequest 之后，msg的base64编码值
        "signature":baseSignature // 前端对msg签名之后，签名值的base64编码值
    } 
    readPlainRequest.run({...form}).then( 
        res => {    
            if (res.code === 0) {  
              setMsg(res.data.msg);
              setShowMsgDlg(true);
            }else{
                prompt.error('读取失败!' +res.cnMsg,false);
            }
        }, 
        err=>{
            console.log('读取失败,',err); 
        }
    )
  }

  //读密文
  const readCipher=(txId)=>{
      const date=new Date(); 
      const curTimestamp = date.getTime();   
      const tdh2pubkey =atob(user.tdh2_pubkey);
      const pub = JSON.parse(tdh2pubkey)
      const key = user.key;
      const pubkey = user.publicKey;
      const readInfo = {
          RType: "4",
          TS: curTimestamp,
          TxID: txId,
      } 

      const userId = user.user_id;
      const readData = encode(readInfo) 
      const clientReq = {
          Type: 8,
          ID: userId,
          OP: Buffer.from(readData),
          TS: curTimestamp,
      }
      const clientReqData = encode(clientReq)
      console.log(clientReqData.toString())
      const signature = sign(Array.prototype.slice.call(clientReqData), key)
      const baseReqData = Buffer.from(clientReqData).toString('base64')
      const baseSignature = Buffer.from(signature, 'HEX').toString('base64')
      
      const form = {
          "user_id": userId,
          "pubkey": pubkey,
          "req_data": baseReqData,
          "signature": baseSignature
      } 
      readCipherRequest.run({...form}).then( 
            res => {  
                if (res.code === 0) {   
                  try{ 
                      let data = res.data,
                      c = data.c,
                      c_little = data.c_little,
                      nodenum = data.nodenum,
                      entries = data.shares; 
                      console.log("c_little: " + c_little)
                      console.log("shares: " + entries)

                      let dr_list = new Array(nodenum).fill(null)
                      let dr_count = 0
                      entries.forEach(strentry => {
                          const entry = JSON.parse(strentry)
                          const index = entry.replica_id
                          const dr = decrypt(entry.share.substring(2), key, 1)
                          if (dr.length !== 0) {
                              dr_list[index] = JSON.parse(dr)
                              dr_count++
                          }
                      })
                      let ndr = new Array()
                      for (let i = 0; i < dr_list.length; i++) {
                      if (dr_list[i] != null) {
                      ndr.push(dr_list[i])
                      }
                      }
                      dr_list = ndr 
                      const cipher = JSON.parse(c_little)
                      for (let i = 0; i < dr_list.length; i++) {
                          verify_share(cipher, pub, dr_list[i])
                          // console.log("Verify share--", i, "------",  )
                      }
                      let key_TDH2 = combine_Share(pub, cipher, dr_list, parseInt(nodenum / 3) + 1)

                      let decmsg = decrypt_SM4(key_TDH2, cipher)
                      console.log("decmsg: " + decmsg) 
                      
                      setMsg(decmsg);
                      setShowMsgDlg(true);
                      prompt.inform('读取成功!');
                  }catch(err){
                      prompt.error('数据解密失败!',false);
                  } 
                }else{
                    prompt.error(res.cnMsg,false);
                }
            }, 
            err=>{
                console.log('读取失败,',err); 
            }
    ) 
  }
  //更改权限窗体
  const handleChangeRightDlg=(e,value,type)=>{
    e.preventDefault();
    setChangeType(type);
    setShowDialog(true);
    setTxId(value);
  }
  const handleChaneRight=()=>{
    if(changType==='add'){
      addAcl();
    }else{
      delAcl();
    }
  }
  //增加权限
  const addAcl =()=>{
    const date=new Date(); 
    const curTimestamp = date.getTime();    
    const key = user.key; 
    if(!selectState.selectOption||selectState.selectOption.length===0) {
      prompt.error('请选择用户!',false);
      return ;
    }

    T.loading("正在提交...");  
    const userId = user.user_id;
    const otherPublic = selectState.selectOption?.map(obj => obj.value); 
    const WriteInfo = {
      UserID: userId,
      Txid: txId,
      Acl: otherPublic
    }
    
    const winfoData = encode(WriteInfo) 
    
    const uid =  userId.toString() ;//sm3hash(txId).toString('hex')
    const wreq = { WType: 2, UID: uid, OP: Buffer.from(winfoData)  }
    const wreqData = encode(wreq) 
    
    const clientReq = {
        Type: 7,
        ID: userId,
        OP: wreqData,
        TS: curTimestamp,
    }
    const clientReqData = encode(clientReq)
    console.log(clientReqData.toString())
    const signature = sign(Array.prototype.slice.call(clientReqData), key)
    const baseReqData = Buffer.from(clientReqData).toString('base64')
    const baseSignature = Buffer.from(signature, 'HEX').toString('base64')
    
    const form = { 
        "req_data": baseReqData,
        "signature": baseSignature
    }
    addAclRequest.run({...form}).then( 
      res => {   
          T.loaded(); 
          setSelectState({...selectState,selectOption:[]})
          if (res.code === 0) {  
              prompt.inform('发送成功!');
              setShowDialog(false);
          }else{
              prompt.error('发送失败!' +res.cnMsg,false);
          }
      }, 
      err=>{
          console.log('发送失败,',err);
          T.loaded();
      }
    ) 
  }
  //减少权限 
  const delAcl=()=>{
    const date=new Date(); 
    const curTimestamp = date.getTime();    
    const key = user.key; 
    const pubkey = user.publicKey;
    if(!selectState.selectOption||selectState.selectOption.length===0) {
      prompt.error('请选择用户!',false);
      return ;
    }

    T.loading("正在提交...");  
    const userId = user.user_id;
    const otherPublic = selectState.selectOption?.map(obj => obj.value);
    const WriteInfo = {
      UserID: userId,
      Txid: txId,
      Acl: otherPublic
    }
  
    const winfoData = encode(WriteInfo)
    
    const uid = userId.toString() ;//sm3hash(txId).toString('hex')
    const wreq = { WType: 3, UID: uid, OP: Buffer.from(winfoData)  }
    const wreqData = encode(wreq)
    
    const clientReq = {
        Type: 7,
        ID: userId,
        OP: wreqData,
        TS: curTimestamp,
    }
    const clientReqData = encode(clientReq)
    console.log(clientReqData.toString())
    const signature = sign(Array.prototype.slice.call(clientReqData), key)
    const baseReqData = Buffer.from(clientReqData).toString('base64')
    const baseSignature = Buffer.from(signature, 'HEX').toString('base64')
    
    const form = {
        "user_id": useId,
        "pubkey": pubkey,
        "req_data": baseReqData,
        "signature": baseSignature
    }
    delAclRequest.run({...form}).then( 
      res => {   
          T.loaded(); 
          setSelectState({...selectState,selectOption:[]})
          if (res.code === 0) {  
              prompt.inform('发送成功!');
              setShowDialog(false);
          }else{
              prompt.error('发送失败!' +res.cnMsg,false);
          }
      }, 
      err=>{
          console.log('发送失败,',err);
          T.loaded();
      }
    ) 
  }
 

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
      url: '/chainBrowser/blockchain/getTxs',
      method: 'post',
      headers: {
        'Authorization': user.token,
      },
      body: JSON.stringify(body),
    }),
    {manual: true},
  );

  //查询用户
  const queryEmailRequest = useRequest(
    body => ({
      url: '/chainBrowser/user/info/getUserInfoByEmail',
      method: 'post',
      headers: {
        'Authorization': user.token,
      },
      body: JSON.stringify(body),
    }),
    {manual: true, formatResult: r => r},
  ); 

  //读明文
  const readPlainRequest = useRequest(
    body => ({
      url: '/chainBrowser/user/usertx/readPlain',
      method: 'post',
      headers: {
        'Authorization': user.token,
      },
      body: JSON.stringify(body),
    }),
    {manual: true, formatResult: r => r},
  ); 
  //读密文
  const readCipherRequest = useRequest(
    body => ({
      url: '/chainBrowser/user/usertx/readCipher',
      method: 'post',
      headers: {
        'Authorization': user.token,
      },
      body: JSON.stringify(body),
    }),
    {manual: true, formatResult: r => r},
  ); 

  //增加权限
  const addAclRequest = useRequest(
      body => ({
        url: '/chainBrowser/user/usertx/addACL',
        method: 'post',
        headers: {
          'Authorization': user.token,
        },
        body: JSON.stringify(body),
      }),
      {manual: true, formatResult: r => r},
  ); 

  //减少权限
  const delAclRequest = useRequest(
    body => ({
      url: '/chainBrowser/user/usertx/deleteACL',
      method: 'post',
      headers: {
        'Authorization': user.token,
      },
      body: JSON.stringify(body),
    }),
    {manual: true, formatResult: r => r},
  ); 

  const handleSelectChange =(selectOption)=>{
    setSelectState({...selectState, selectOption: selectOption});
  }
  const onInputChange = ( inputValue,{ action, prevInputValue }) => {
      if (action === 'input-change') {
          setSelectState({...selectState, inputValue: inputValue });
          return inputValue;
      }  
      return "";
  };

  useEffect(()=>{
    if(selectState.inputValue==='') {
        setOptions([]) ;
        return ;
    }
    queryEmailRequest.run({"email":selectState.inputValue}).then(res=>{  
        const userData = res.data;
        if(userData){
            const tempData= [];
            for (var obj of userData) {
                tempData.push({label:obj.email,value:obj.publicKey});
            }
            setOptions([...tempData]);
        }else{
            setOptions([]);
        }
       
    });  
  },[selectState.inputValue])

 
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
    <main id="content" role="main"> 
      <div className="container-fluid space-bottom-2 p-3">
        <div className="card">
          <div className="header-title">
              <h4 className="card-title p-2">{t('transactions.title')}&nbsp;</h4>
          </div>
          <div className="card-body">
            <div  className="row d-md-flex justify-content-between mb-1"> 
              <p className="ml-3 mb-2 mb-md-0"> 
                 共有{counts}条记录
              </p>
              <div className="mr-3">
                <div className="input-group input-group-shadow">
                  {/* <div className="input-group-prepend d-md-block mr-2" >
                    <select id="selectKey" className="form-control form-control-sm mb-3 "   onChange={e=>handleSelectField(e)} value={params.field}>
                          <option value="">全部搜索</option>
                          <option value="block_id">区块高度</option>
                          <option value="block_hash">区块哈希</option> 
                          <option value="tx_hash">交易哈希</option> 
                      </select> 
                  </div> */}
                  <input type="text" className="form-control form-control-sm mr-2" id="keywrokds" style={{minWidth:'280px'}}  placeholder="请输入区块高度/交易哈希/区块哈希" 
                   value={params.value} onChange={e=>handleChangeValue(e)}  /> 
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
                    <th> {t('transactions.table.TxHash')}</th> 
                    <th >{t('transactions.table.BlockHash')}</th>
                    <th >{t('transactions.table.BlockId')}</th> 
                    <th>{t('transactions.table.TxType')} </th>  
                    <th scope="col"> 
                        <div className="mr-2">
                        {
                          (type ==='showAge')?
                            <LinkWithTooltip placement="bottom" tooltip="点击切换日期格式">
                              <a href="#!" title="" onClick={e => {  e.preventDefault(); setType('showDate'); }}  >
                                {t('transactions.table.age')}
                              </a>
                            </LinkWithTooltip>
                          :
                            <LinkWithTooltip placement="bottom" tooltip="点击切换块龄格式"> 
                              <a href="#!" onClick={e => {  e.preventDefault(); setType('showAge'); }}  > 
                                {t('transactions.table.time')}
                              </a>
                            </LinkWithTooltip>
                        }
                        </div>
                    </th>

                    <th>{t('transactions.table.TxIndex')} </th>   
                    <th style={{width:'80px'}}>{t('transactions.table.operate')} </th>   
                  </tr>
                </thead>
                <tbody> 
                  { data.length >0? data.map(item => {  
                    return (
                      <tr key={item.tx_hash}> 
                        <td>
                          <Link to={`/tx/${encodeURIComponent(item.tx_hash) }`} className="hash-tag text-truncate" style={{maxWidth:'200px'}}  title={item.tx_hash }>
                            {item.tx_hash }
                          </Link> 
                        </td> 
                        <td> 
                          <Link to={`/block/${encodeURIComponent(item.block_hash) }`} className="hash-tag text-truncate" data-toggle="tooltip" style={{maxWidth:'200px'}} title={item.block_hash } >
                            {item.block_hash }
                          </Link>  
                        </td>  
                        <td> 
                          <Link to={`/block/${item.block_Id }`} className="hash-tag text-truncate" data-toggle="tooltip" style={{maxWidth:'200px'}} title={item.block_Id }   >
                            {item.block_Id }
                          </Link>  
                        </td>  
                        <td>
                          { 
                          item.tx_type ===12?
                            <span className="u-label u-label--sm u-label--success rounded">Admin交易</span>:
                            (item.tx_type===14?<span className="u-label u-label--sm u-label--warning rounded">合约交易</span> :
                            <span className="u-label u-label--sm u-label--info rounded">普通交易</span> )
                          }  
                        </td> 
                        <TimeTD time={item.timestamp} interval={item.interval_timestamp} type={type} />
                        <td>{item.tx_index }</td> 
                        <td>
                        {(item?.tx?.w_type_en==='Write_Cipher'||item?.tx?.w_type_en==='Write_Plain')? 
                          <><a href="#!" className="text-primary" id={`dropdownMenuButton-${item.block_Id}`} data-toggle="dropdown"  aria-expanded="false">
                          <svg className="svg-icon" width="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                          </svg>
                          </a>
                        <div className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${item.block_Id}`}> 
                            <a className="dropdown-item" href="#!" onClick={e=>lookMsg(e,item?.tx?.w_type_en,item.tx_hash)}>
                                <svg className="svg-icon text-primary" width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                查看原文
                            </a> 
                            {item?.tx?.w_type_en==='Write_Cipher'? 
                              <a className="dropdown-item" href="#!" onClick={(e)=>{ handleChangeRightDlg(e,item.tx_hash,'add' ) } }>
                                <svg className="svg-icon text-primary" width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                增加权限
                              </a>:""
                            }
                            {item?.tx?.w_type_en==='Write_Cipher'? 
                              <a className="dropdown-item" href="#!"  onClick={(e)=>{ handleChangeRightDlg(e,item.tx_hash,'del' ) } }>
                                <svg className="svg-icon text-primary" width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                减少权限
                              </a>:""
                            } 
                        </div>
                        </>
                          :""
                          }
                         {/*  <a className=""  href="#!" onClick={(e)=>{ handleChangeRight(e,item.tx_hash ) } } >
                              <svg xmlns="http://www.w3.org/2000/svg" className="text-secondary" width="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                          </a> */}
                        </td> 
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
                {/* 编辑权限 begin */}
               <Modal show={showDialog} onHide={() => setShowDialog(false)} size="lg"   aria-labelledby="contained-modal-title-vcenter"      centered>
                  <Modal.Header closeButton className="p-2">
                      <Modal.Title id="contained-modal-title-vcenter">
                        修改权限
                      </Modal.Title> 
                  </Modal.Header>
                  <Modal.Body>
                      <div className="form-group">
                          <label htmlFor="privateKey">交易哈希:</label>
                          <input  className="form-control"  autoComplete="off" value={txId} readOnly={true} />
                      </div>    
                      <div className="form-group">
                        <label htmlFor="msg">用户:</label> 
                        <Select  options={options} placeholder="请选择用户" value={selectState.selectOption}  onChange={handleSelectChange}  isMulti  onInputChange={onInputChange}  />
                      </div> 
                  </Modal.Body>
                  <Modal.Footer> 
                    <button type="button" className="btn btn-sm btn-danger" onClick={e=>{e.preventDefault();setShowDialog(false);}}>关闭</button>
                    <button type="button" className="btn btn-sm btn-primary"  onClick={e=>{handleChaneRight()}} data-dismiss="modal">确定</button>
                  </Modal.Footer>
                </Modal>
              
                {/* 编辑权限 end */} 
              

                {/* 读取明文或密文 begin */}
                <Modal show={showMsgDlg} onHide={() => setShowMsgDlg(false)} size="lg"   aria-labelledby="contained-modal-title-vcenter"      centered>
                  <Modal.Header closeButton className="p-2">
                      <Modal.Title id="contained-modal-title-vcenter">
                        查看原文
                      </Modal.Title> 
                  </Modal.Header>
                  <Modal.Body> 
                      <div className="form-group">
                        <label htmlFor="msg">消息内容:</label> 
                        <input id="msg" name="msg" type="text"  maxLength="75"  className="form-control"    value={msg}  readOnly={true}  /> 
                      </div> 
                  </Modal.Body>
                  <Modal.Footer> 
                    <button type="button" className="btn btn-sm btn-danger" onClick={e=>{e.preventDefault();setShowMsgDlg(false);}}>关闭</button>
                    <button type="button" className="btn btn-sm btn-primary"  data-dismiss="modal">确定</button>
                  </Modal.Footer>
                </Modal>
              
                {/* 读取明文或密文 end */} 
              
            <div id="ContentPlaceHolder1_pageRecords"> 
                <div className="d-md-flex justify-content-between my-3">
                  <div className="d-flex align-items-center text-secondary mb-2 mb-md-0">
                    <span style={{width:60}}> {t('transactions.tip5')}</span>
                    <select onChange={handleChangePageSize} className="custom-select custom-select-xs mx-2" value={state.body.length}>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                    <span style={{width:60}}> {t('transactions.tip6')}</span>
                  </div> 
                  <Pager4 path="/transactions" current={params.start} handleChangPageNum={handleChangPageNum} total={totalPage} />
                </div> 
            </div>
          </div>
        </div>
      </div>
      <Toast/> 
    </main>
  );
}
