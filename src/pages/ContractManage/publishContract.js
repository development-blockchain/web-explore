import { useRequest } from 'ahooks';
import { useContext, useEffect, useState } from 'react';
import { sign,verify,decrypt } from '../../commons/sm2';
import { verify_share,combine_Share,decrypt_SM4 } from '../../commons/tdh2';
import { encode,decode } from "@msgpack/msgpack";   
 
import Toast, { T } from "react-toast-mobile";
import "react-toast-mobile/lib/react-toast-mobile.css";  
 
export default function PublishContract({user}){  
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
                T.loaded(); 
                if (res.code === 0) {   
                    prompt.inform('读取成功!');
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
                    // console.log("decmsg: " + decmsg)
                    
                    setMsg(decmsg);
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
                <h3 className="h5  mb-0">读密文交易</h3>
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
                        读密文交易
                    </button>  
                </div>
            </div>   
        </div>
        <Toast/> 
    </div> 
    )
}