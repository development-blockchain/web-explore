import { encode } from "@msgpack/msgpack";
import { useRequest } from 'ahooks';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../../UserContext';
import { sign } from '../../commons/sm2';
import { encrypt, sm3Fun } from '../../commons/tdh2';

import Select from 'react-select';
import Toast, { T } from "react-toast-mobile";
import "react-toast-mobile/lib/react-toast-mobile.css";


function ManageTx({user}){  
 

    const typeOptions = [{
        "label":"冻结用户","value":1       
        },{
            "label":"解冻账户","value":2
        },
        {
            "label":"注销账户","value":3
        }
    ]
    const [options,setOptions]=useState([]);
    const [params,setParams]=useState({ 
        selectType:'',
        selectUserId:'',
        inputValue:''
    })
   
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
    
    const handleSelectType =(selectOption)=>{
        setParams({...params, selectType: selectOption});
      }

    const handleSelectChange =(selectOption)=>{
        setParams({...params, selectUserId: selectOption});
    }
    const onInputChange = ( inputValue,{ action, prevInputValue }) => {
          if (action === 'input-change') {
            setParams({...params, inputValue: inputValue });
              return inputValue;
          }  
          return "";
    };
    
    useEffect(()=>{
        if(params.inputValue==='') {
            setOptions([]) ;
            return ;
        }
        queryEmailRequest.run({"email":params.inputValue}).then(res=>{  
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
    },[params.inputValue])

      
    const writeAdminTxRequest = useRequest(
        body => ({
          url: '/chainBrowser/user/usertx/adminTx',
          method: 'post',
          headers: {
            'Authorization': user.token,
          },
          body: JSON.stringify(body),
        }),
        {manual: true, formatResult: r => r},
    ); 
       

    //写密文交易
    const writeAdminTx=(e)=>{  
        if(params.selectType ===''){
            prompt.error('请选择操作类型',false);
            return ;
        }
        if(params.selectUserId ===''){
            prompt.error('请选择用户',false);
            return ;
        }
        const date=new Date(); 
        const curTimestamp = date.getTime();   
        const adminUserId = user.user_id;
        const adminPrivateKey = user.key;  
        const AdminRequest = {
            UserID: params.selectUserId,
            Type: params.selectType, // 1: 冻结用户 2: 解冻账户 3: 注销账户  
        }
        
        const reqData = encode(AdminRequest)
        
        const clientReq = {
            Type: 12,
            ID: adminUserId,
            OP: reqData,
            TS: curTimestamp,
        }
        
        const clientReqData = encode(clientReq)
        const signature = sign(Array.prototype.slice.call(clientReqData), adminPrivateKey)
        const baseReqData = Buffer.from(clientReqData).toString('base64')
        const baseSignature = Buffer.from(signature, 'HEX').toString('base64')
        
        const form = { 
            "req_data": baseReqData,
            "signature": baseSignature
        }
        writeAdminTxRequest.run({...form}).then( 
            res => {   
                T.loaded(); 
                setParams({...params,selectType:'',selectUserId:''})
                if (res.code === 0) {  
                    prompt.inform('提交成功!'); 
                }else{
                    prompt.error('提交失败!' +res.cnMsg,false);
                }
            }, 
            err=>{
                console.log('发送失败,',err);
                T.loaded();
            }
          ) 

    }
 
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
            <div className="card mb-1">  
                <div className="card-body">   
                    <div class="form-group row">
                        <label class="control-label col-sm-2 align-self-center" for="email">操作类型:</label>
                        <div class="col-sm-6">
                            <Select  options={typeOptions} placeholder="请选择操作类型" value={params.selectType}  onChange={handleSelectType}  isMulti={false}  />

                         
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-sm-2 align-self-center" for="email">用户:</label>
                        <div class="col-sm-6">
                        <Select  options={options} placeholder="请选择用户" value={params.selectUserId}  onChange={handleSelectChange}  isMulti={false}  onInputChange={onInputChange}  />
                        </div>
                    </div> 
                    <div class="form-group">
                        <button type="button"   className="btn btn-primary  mt-2"  onClick={(e)=> writeAdminTx(e) } >
                            提交
                        </button>  
                    </div>
                   
                </div>
            </div>   
        </div>
        <Toast/> 
    </div> 
    )
}

export default function AccountManage() {  
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
 

    return (
        <main id="content" role="main"> 
            <div className="container-fluid space-bottom-2 p-3">
                <div className="card">
                    <div className="header-title"> 
                        <h4 className="card-title p-2">账户管理&nbsp;</h4> 
                    </div> 
                    <ManageTx user={user}   />  
                </div> 
            </div> 
        </main> 
    );
}
