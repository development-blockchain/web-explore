import { useRequest } from 'ahooks';
import { useContext, useEffect, useState } from 'react';
import { sign,verify } from '../../commons/sm2';
import { sm3hashStr,encrypt,sm3Fun } from '../../commons/tdh2';
import { encode,decode } from "@msgpack/msgpack";    

import Toast, { T } from "react-toast-mobile";
import "react-toast-mobile/lib/react-toast-mobile.css";   
import Select from 'react-select';

export default function WriteCipher({user}){  
    const [error, setError] = useState(false);

    const [options,setOptions]=useState( []);
    const [state,setState]=useState({
        inputValue:'',
        selectOption:[]
    })
   
      const [msg, setMsg] = useState('');  
 

   
    const handleForm =  e => {
        setMsg(e.target.value);        
    };  

    const handleBlur = key => () => {      
        if(msg==='')  {
            setError(true);
            return 
        }else{
            setError(false); 
        }
    };

      
    const writePlainRequest = useRequest(
        body => ({
          url: '/chainBrowser/user/usertx/writeCipher',
          method: 'post',
          headers: {
            'Authorization': user.token,
          },
          body: JSON.stringify(body),
        }),
        {manual: true, formatResult: r => r},
    ); 
      
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

    //写密文交易
    const writePlain=(e)=>{ 
          
        if(msg ===''){
            setError(true);
            return ;
        }
        
        T.loading("正在提交...");  

        setError(false); 
        const date=new Date(); 
        const curTimestamp = date.getTime();   
        const tdh2pubkey =atob(user.tdh2_pubkey);
        const pub = JSON.parse(tdh2pubkey)
        const key = user.key;
        const pubkey = user.publicKey;

 
        const userId = user.user_id;
        const result = encrypt(pub, msg) 
        const hash_C = sm3Fun(result.ctxt)
        const hash_C_str = hash_C.toString('base64')
        const otherPublic = state.selectOption?.map(obj => obj.value)|| [];
        const WriteInfo = {
            UserID: userId,
            Info: result.jsonString,
            Hash: hash_C_str,
            Acl: [pubkey,...otherPublic]
        }

        const winfoData = encode(WriteInfo)
        const uid =  userId.toString();

        const wreq = { WType: 1, UID: uid, OP: Buffer.from(winfoData) }

        const wreqData = encode(wreq)

        const clientReq = {
            Type: 7,
            ID: userId,
            OP: Buffer.from(wreqData),
            TS: curTimestamp,
        }
        const clientReqData = encode(clientReq)
        const signature = sign(Array.prototype.slice.call(clientReqData), key)
        const baseReqData = Buffer.from(clientReqData).toString('base64')
        const baseSignature = Buffer.from(signature, 'HEX').toString('base64')

        const form = {
            "user_id": userId,
            "pubkey": pubkey,
            "req_data": baseReqData, // 序列化 clientRequest 之后，msg的base64编码值
            "signature": baseSignature, // 前端对msg签名之后，签名值的base64编码值
            "acl": WriteInfo.Acl, // 可访问密文的公钥列表
            "clittle": result.jsonString, // 计算过程中生成的小c
            "cipher": Buffer.from(result.ctxt, 'hex').toString('base64'), // 计算过程中生成的大C
            "hash_cipher": hash_C_str, // cipher 的sm3哈希值
        }


        writePlainRequest.run({...form}).then( 
            res => {   
                T.loaded(); 
                setState({...state,selectOption:[]})
                if (res.code === 0) { 
                    console.log('交易id',res);
                    prompt.inform('发送成功!');
                    setMsg('');
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
    const handleChange =(selectOption)=>{
        setState({...state, selectOption: selectOption});
    }
    const onInputChange = ( inputValue,{ action, prevInputValue }) => {
        if (action === 'input-change') {
            setState({...state, inputValue: inputValue });
            return inputValue;
        }  
        return "";
    };
    
      useEffect(()=>{ 
        if(state.inputValue==='') {
            setOptions([]) ;
            return ;
        }
        queryEmailRequest.run({"email":state.inputValue}).then(res=>{ 
            console.log('res--->',res)
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
      },[state.inputValue])
  
  
  return ( 
    <div className="row"> 
        <div className="col-md-12">
            <div className="card mb-4"> 
                <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="h5  mb-0">写密文交易</h3>
                </div> 
                <div className="card-body">  
                    <div className={` form-group js-form-message form-group ${error ? 'u-has-error' : ''}`}>  
                        <label htmlFor="msg">消息内容:</label>
                        <input id="msg" name="msg" type="text"  maxLength="75"  className="form-control"    onBlur={handleBlur('msg')}       value={msg}    onChange={e=>handleForm(e)}    />
                        <div className="invalid-feedback" style={{display: error ? 'block' : 'none'}}> 
                            请输入消息内容
                        </div>
                    </div>  
                    <div className={` form-group js-form-message form-group ${error ? 'u-has-error' : ''}`}>  
                        <label htmlFor="msg">用户:</label> 
                        <Select  options={options} placeholder="请选择用户" value={state.selectOption}  onChange={handleChange}  isMulti  onInputChange={onInputChange}  />
                    </div>  

                    <button type="button"   className="btn btn-primary  mt-2" onClick={debounce(writePlain)} >
                        发送消息
                    </button>  
                </div>
            </div>   
        </div>
        <Toast/> 
    </div> 
    )
}