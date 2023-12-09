import { useContext, useEffect, useState } from 'react';

import { encode } from "@msgpack/msgpack";
import { useRequest } from 'ahooks';
import moment from 'moment';
import 'moment/locale/zh-cn';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';
import Toast, { T } from "react-toast-mobile";
import "react-toast-mobile/lib/react-toast-mobile.css";
import UserContext from '../../UserContext';
import { sign } from '../../commons/sm2';
import Copy from '../../components/Copy';
import Loading from '../../components/Loading';
 
function Detail({data = {}, loading, error,user,changeState}) {  
  // 设置中文
    const defaultLNG = window.localStorage.getItem('lng') || 'zh_CN';
    moment.locale(defaultLNG);

    const [errors, setErrors] = useState({});
    const [showDialog, setShowDialog] = useState(false);
    const [contractContent,setContractContent]=useState({
      TxID:'',
      Method:'',
      Params:''
    }); 

    const handleForm = field => e => {
      setContractContent({...contractContent, [field]: e.target.value});

      if (e.target.value) {
        setErrors({...errors, [field]: undefined});
      }  
    };  

    const handleBlur = key => () => {
      const _errors = {}; 
      Object.keys(contractContent) 
        .forEach(field => {
          _errors[field] = !contractContent[field];
        });
  
      if (Object.keys(_errors).some(e => !!_errors[e])) {
        if (_errors[key]) {
          setErrors(_errors);
        }
      }
    };
    const handleShowDialog=(e)=>{
      setShowDialog(true);
      setContractContent({...contractContent,  TxID:data.tx_hash, Method:'', Params:''})
    }
    // debounce已达到预期效果！ 防抖
    const debounce=(f,time = 500)=>{
        let timer = null
        return () => {
          if(timer) {
              clearTimeout(timer)
          }
          timer = setTimeout(f.bind(this),time)
        }
    }  
    //调用合约
    const handleInvoke =()=>{
      const _errors = {}; 
      Object.keys(contractContent)
        .filter(f => f !== 'Params')
        .forEach(field => {
          _errors[field] = !contractContent[field];
        });

      if (Object.keys(_errors).some(e => !!_errors[e])) {
          setErrors(_errors);
          return ;
      }
      T.loading("正在调用...");  
      const date=new Date(); 
      const curTimestamp = date.getTime();    
      const userId =user.user_id;
      //1 构造WriteInfo 
      const cContent  = {
          TxID:    contractContent.TxID, // 部署合约返回txid，也就是代表合约的contractId
          Method:  contractContent.Method,
          Params:   contractContent.Params===''?[]:contractContent.Params.split(''),
      } 
      const uid =  userId.toString();
      //2 将WriteInfo序列化后生成op 构造第二层WriteRequest
      const cReq   = { UserID: uid, CType: 2, CContents: cContent } 
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
      invokeContractRequest.run({...reqData}).then( 
          res => {   
              T.loaded(); 
              if (res.code === 0) { 
                  console.log('调用',res);
                  prompt.inform('调用成功!'); 
                 setShowDialog(false);
              }else{
                  prompt.error(res.cnMsg,false);
              }
          }, 
          err=>{
              console.log('调用失败,',err);
              T.loaded();
          }
      ) 
    }
    //冻结合约
    const handleRunContract=(funcName,type)=>{ 
      T.confirm({
        title: "提示!",
        message: `您确认要${funcName}此合约吗?`,
        option: [
            {
                text: "确定",
                fn: function fn() {
                  //3 冻结合约 4 解冻 5 注销
                  runContract(type);
                },
            },
            {
                text: "取消",
                fn: () => {
                    
                    return;
                },
            },
        ],
      });
    }

    //执行合约
    const runContract=(type)=>{
      const date=new Date(); 
      const curTimestamp = date.getTime();    
      const userId =user.user_id;
      //1 构造WriteInfo 
      const cContent  = {
          TxID: data.tx_hash, 
      }
      const uid =  userId.toString();
      //2 将WriteInfo序列化后生成op 构造第二层WriteRequest
      const cReq   = { UserID: uid, CType: type, CContents: cContent } 
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
      if(type ===3){ 
        frozenContractRequest.run({...reqData}).then( 
          res => {    
              if (res.code === 0) {   
                changeState('冻结');
                prompt.inform('冻结成功!');  
              }else{
                prompt.error(res.cnMsg,false);
              }
          }, 
          err=>{
              console.log('冻结失败,',err); 
          }
        ) 
      }else if(type ===4){
        unFrozenContractRequest.run({...reqData}).then( 
          res => {    
              if (res.code === 0) { 
                changeState('正常'); 
                prompt.inform('解冻成功!');  
              }else{
                  prompt.error(res.cnMsg,false);
              }
          }, 
          err=>{
              console.log('解冻失败,',err); 
          }
        ) 
       }else if(type ===5){ 
        withdrawContractRequest.run({...reqData}).then( 
          res => {    
              if (res.code === 0) { 
                changeState('注销'); 
                prompt.inform('注销成功!'); 
              }else{
                  prompt.error(res.cnMsg,false);
              }
          }, 
          err=>{
              console.log('调用失败,',err); 
          }
        ) 
      }
      
    }
 

    //调用合约请求
    const invokeContractRequest = useRequest(
      body => ({
        url: '/chainBrowser/user/usertx/invokeContract',
        method: 'post',
        headers: {
          'Authorization': user.token,
        },
        body: JSON.stringify(body),
      }),
      {manual: true, formatResult: r => r},
    ); 
    //冻结合约请求
    const frozenContractRequest = useRequest(
      body => ({
        url: '/chainBrowser/user/usertx/frozenContract',
        method: 'post',
        headers: {
          'Authorization': user.token,
        },
        body: JSON.stringify(body),
      }),
      {manual: true, formatResult: r => r},
    ); 
    //解冻合约请求
    const unFrozenContractRequest = useRequest(
      body => ({
        url: '/chainBrowser/user/usertx/unFrozenContract',
        method: 'post',
        headers: {
          'Authorization': user.token,
        },
        body: JSON.stringify(body),
      }),
      {manual: true, formatResult: r => r},
    ); 
    //注销合约请求
    const withdrawContractRequest = useRequest(
      body => ({
        url: '/chainBrowser/user/usertx/withdrawContract',
        method: 'post',
        headers: {
          'Authorization': user.token,
        },
        body: JSON.stringify(body),
      }),
      {manual: true, formatResult: r => r},
    );  
 
 

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error</div>;
    }


    const block_no = Number(data.block_Id);
    const block_hash = data.block_hash; 
    const chain_user_id = data.chain_user_id; 
    const method = data.method; 
    const version = data.version; 
    const state =  data.state; 
    const state_en = data.state_en; 
    const tx_hash = data.tx_hash;    
    const now = new Date().getTime(); 
    const time = moment(now - Number(data.interval_timestamp)*1000)
        .startOf('minute')
        .fromNow(); 


  return (
    <div className="tab-content">
      <div className="tab-pane fade show active" role="tabpanel" aria-labelledby="home-tab">
        <div className="card-body">
           {(state!=='注销')?
            <>
              <div className="row align-items-center justify-content-sm-end   mt--3">
                    {
                      (state==='正常')?
                      <>
                      <button type="button" class="btn btn-sm btn-primary mt-2 mr-2" onClick={e=>{handleShowDialog(e)}}>调用合约</button>
                      <button type="button" class="btn btn-sm btn-secondary mt-2 mr-2" onClick={e=>{handleRunContract('冻结',3)}}>冻结合约</button> 
                      <button type="button" class="btn btn-sm btn-danger mt-2 mr-2" onClick={e=>{handleRunContract('注销',5)}}>注销合约</button>
                      </>: 
                      <><button type="button" class="btn btn-sm btn-success mt-2 mr-2"  onClick={e=>{handleRunContract('解冻',4)}}>解冻合约</button>
                      <button type="button" class="btn btn-sm btn-danger mt-2 mr-2"  onClick={e=>{handleRunContract('注销',5)}}>注销合约</button>
                      </> 
                    }
                    
              </div>
              <hr className="hr-space mt-2" />
            </>:""
          }
          <div className="row align-items-center  mt-1">
            <div className="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0e">
              <i className="fal fa-info-circle text-secondary mr-1" ></i>
              区块高度:
            </div>
            <div className="col-md-9">
              <div className="d-flex">
                <span className="font-weight-sm-bold mr-2">{block_no}</span> 
              </div>
            </div>
          </div>
          <hr className="hr-space mt-2" />
          <div className="row align-items-center  mt-1">
            <div className="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0e">
              <i  className="fal fa-info-circle text-secondary mr-1"></i>
              区块哈希:
            </div>
            <div className="col-md-9">
              <div className="d-flex">
                <span className="font-weight-sm-bold mr-2">{block_hash}</span> 
                <Copy text={block_hash} title="Copy Txn Hash to clipboard" />
              </div>
            </div>
          </div>
          <hr className="hr-space mt-2" />
          <div className="row align-items-center  mt-1">
            <div className="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0e">
              <i  className="fal fa-info-circle text-secondary mr-1"></i>
              交易哈希:
            </div>
            <div className="col-md-9">
              <div className="d-flex">
                <span className="font-weight-sm-bold mr-2">{tx_hash}</span> 
                <Copy text={tx_hash} title="Copy Txn Hash to clipboard" />
              </div>
            </div>
          </div>  
          <hr className="hr-space mt-2" />
          <div className="row align-items-center  mt-1">
            <div className="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0e">
              <i  className="fal fa-info-circle text-secondary mr-1"></i>
              链上用户:
            </div>
            <div className="col-md-9">
              <div className="d-flex">
                <span className="font-weight-sm-bold mr-2">{chain_user_id}</span>  
              </div>
            </div>
          </div>
          <hr className="hr-space mt-2" />
          <div className="row align-items-center">
            <div className="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0e">
              <i className="fal fa-info-circle text-secondary mr-1" ></i>
              时间戳:
            </div>
            <div className="col-md-9">
              <i className="far fa-clock small mr-1"></i>
              {time}  ({moment(data.time_stamp).local().format('YYYY-MM-DD HH:mm:ss')})
            </div>
          </div> 
          <hr className="hr-space mt-2" />
          
           {/*   <div className="row align-items-center">
            <div className="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0e">
              <i className="fal fa-info-circle text-secondary mr-1"></i>
               方法
            </div>
            <div className="col-md-9">{method}</div>
          </div>  
          <hr className="hr-space mt-2" /> 
          */}
          <div className="row align-items-center">
            <div className="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0e">
              <i className="fal fa-info-circle text-secondary mr-1"></i>
               编码
            </div>
            <div className="col-md-9"> 
                <textarea defaultValue={data.code}  spellCheck="false" className="form-control   text-monospace p-3" readOnly={true} rows="10"></textarea>
            </div>
          </div>  
          <hr className="hr-space mt-2" />
          <div className="row align-items-center">
            <div className="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0e">
              <i className="fal fa-info-circle text-secondary mr-1"></i>
               ABI
            </div>
            <div className="col-md-9"> 
                <textarea defaultValue={data.abi}   spellCheck="false" className="form-control  text-monospace p-3" readOnly={true} rows="10"></textarea>
            </div>
          </div>  
          <hr className="hr-space mt-2" />
         {/*  <div className="row align-items-center">
            <div className="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0e">
              <i className="fal fa-info-circle text-secondary mr-1"></i>
               版本
            </div>
            <div className="col-md-9">{version}</div>
          </div> 
              <hr className="hr-space" />
        */}
      
          <div className="row align-items-center mn-3">
                <div className="col-auto col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0">
                    <i className="fal fa-question-circle text-secondary d-none d-sm-inline-block mr-1" ></i> 状态:
                </div>
                {data.state_en === 'Normal' ? (
                <div className="col col-md-9">
                <span className="u-label u-label--sm u-label--success rounded"  >
                    <i className="fa fa-check-circle mr-1"></i>正常
                </span>
                </div>
                ) : (data.state_en==='Withdrew'? (
                <div className="col col-md-9">
                <span  className="u-label u-label--sm u-label--warning rounded"   >
                    <i className="fa fa-check-circle mr-1"></i>注销 
                </span>
                </div>
                ): (
                <div className="col col-md-9">
                <span  className="u-label u-label--sm u-label--info rounded"   >
                    <i className="fa fa-check-circle mr-1"></i>冻结 
                </span>
                </div>
                ))}
          </div>

        </div>
      </div>

        {/* 编辑权限 begin */}
        <Modal show={showDialog} onHide={() => setShowDialog(false)} size="lg"   aria-labelledby="contained-modal-title-vcenter"      centered>
          <Modal.Header closeButton className="p-2">
              <Modal.Title id="contained-modal-title-vcenter">
                调用合约
              </Modal.Title> 
          </Modal.Header>
          <Modal.Body> 
            <div className={` form-group js-form-message form-group ${errors.Method ? 'u-has-error' : ''}`}>  
                <label htmlFor="privateKey">方法:</label>
                <input  className="form-control"  autoComplete="off"   autoFocus={true}   value={contractContent.Method}     onChange={handleForm('Method')}  onBlur={handleBlur('Method')}  />
                <div className="invalid-feedback" style={{display: errors.Method ? 'block' : 'none'}}> 
                  请输入方法
                </div>
            </div>    
            <div className={` form-group js-form-message form-group }`}>  
                <label htmlFor="privateKey">参数（多个参数用英文逗号分隔）:</label>
                <input  className="form-control"  autoComplete="off" value={contractContent.Params}   onChange={handleForm('Params')}  onBlur={handleBlur('Params')}  />
                {/* <div className="invalid-feedback" style={{display: errors.Params ? 'block' : 'none'}}> 
                  请输入参数
                </div> */}
            </div>    
          </Modal.Body>
          <Modal.Footer> 
            <button type="button" className="btn btn-sm btn-danger" onClick={e=>{e.preventDefault();setShowDialog(false);}}>关闭</button>
            <button type="button" className="btn btn-sm btn-primary"  onClick={debounce(handleInvoke)}  data-dismiss="modal">调用</button>
          </Modal.Footer>
        </Modal>
    
        {/* 编辑权限 end */} 
      <Toast/> 
    </div>
  );
}

export default function ContractDetail() {
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
  let {txHash} = useParams(); 
  txHash = decodeURIComponent(txHash); 
  const [state, setState] = useState({
    body: { 
      "tx_hash":txHash
    },
  });
  const [contractState,setContractState]=useState('')

  const contractDetailRequest = useRequest(
    body => ({
      url: '/chainBrowser/blockchain/getContractByHash',
      method: 'post',
      headers: {
        'Authorization': user.token,
      },
      body: JSON.stringify(body),
    }),
    {manual: true},
  ); 

  useEffect(() => { 
    contractDetailRequest.run(state.body);
  }, [contractState]);
 

  return (
    <main id="content" role="main">  
      <div className="container-fluid space-bottom-2 p-3">
        <div className="card">
            <div className="card-header sticky-card-header d-flex justify-content-between p-0">
              <div className="header-title">
                  <h4 className="card-title p-2">合约详情&nbsp;</h4>
              </div>
            </div>
            <Detail   data={contractDetailRequest.data || {}}
              loading={contractDetailRequest.loading || (typeof contractDetailRequest.data === 'undefined' && typeof contractDetailRequest.error === 'undefined')}
              error={contractDetailRequest.error} user={user} changeState={setContractState}
            />
        </div> 
      </div> 
    </main>
  );
}
