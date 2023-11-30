import { useRequest } from 'ahooks';
import { useContext, useEffect, useState } from 'react';
import { sign,verify } from '../../commons/sm2';
import { sm3hashStr } from '../../commons/tdh2';
import { encode,decode } from "@msgpack/msgpack";   
 
import Toast, { T } from "react-toast-mobile";
import "react-toast-mobile/lib/react-toast-mobile.css";  
 
export default function ReadPlain({user}){  
    const [error, setError] = useState(false);

    const [txId, setTxId] = useState('');  
    const [msg, setMsg] = useState('');  

    const handleForm =  e => {
        setTxId(e.target.value);        
    };  

    const handleBlur = key => () => {      
        if(txId==='')  {
            setError(true);
            return 
        }else{
            setError(false); 
        }
    };

      
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

    //读明文交易
    const readPlain=(e)=>{ 
          
        if(txId ===''){
            setError(true);
            return ;
        }
        
        T.loading("正在提交...");  

        setError(false);
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
        console.log(form)
        readPlainRequest.run({...form}).then( 
            res => {   
                T.loaded(); 
                if (res.code === 0) {  
                    prompt.inform('读取成功!');
                    setMsg(res.data.msg);
                }else{
                    prompt.error('读取失败!' +res.cnMsg,false);
                }
            }, 
            err=>{
                console.log('读取失败,',err);
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
            <div className="card mb-4"> 
                <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="h5  mb-0">读明文交易</h3>
                </div> 
                <div className="card-body">  
                    <div className={` form-group js-form-message form-group ${error ? 'u-has-error' : ''}`}>  
                        <label htmlFor="msg">交易哈希:</label>
                        <input id="txId" name="msg" type="text"  maxLength="75"  className="form-control"    onBlur={handleBlur('msg')}  
                         value={txId}    onChange={e=>handleForm(e)}    />
                        <div className="invalid-feedback" style={{display: error ? 'block' : 'none'}}> 
                            请输入交易哈希
                        </div>
                    </div>  
                    <div className={` form-group js-form-message form-group`}>  
                        <label htmlFor="msg">消息内容:</label>
                        <input id="msg" name="msg" type="text"  maxLength="75"  className="form-control"    value={msg}  readOnly={true}  /> 
                    </div>  

                    <button type="button"   className="btn btn-primary  mt-2" onClick={debounce(readPlain)} >
                        读明文交易
                    </button>  
                </div>
            </div>   
        </div>
        <Toast/> 
    </div> 
    )
}