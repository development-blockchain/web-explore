import { useRequest } from 'ahooks';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../../UserContext';
import { sign } from '../../commons/sm2';
import { encrypt_sm4, sm3hashStr } from '../../commons/tdh2';
import MySideBar from '../../components/MySideBar'; 
import{keygen} from '../../commons/sm2';  
import QRCode from 'qrcode.react' //注入依赖模块

import Toast, { T } from "react-toast-mobile";
import "react-toast-mobile/lib/react-toast-mobile.css"; 

export default function ModifySecretKey() {
    const userContext = useContext(UserContext); 
  
    const [errors, setErrors] = useState({}); 
   
    const [user, setUser] = useState({
        token: userContext.user.token || undefined,
        email:userContext.user.email || undefined,
        key: userContext.user.key || undefined,
        publicKey: userContext.user.publicKey || undefined,
        provider_username: userContext.user.provider_username || undefined,
        provider_pubkey: userContext.user.provider_pubkey || undefined,
    }); 
  
    const [form, setForm] = useState({  
        password:'',
        publicKey: '',
        privateKey: '' 
    }); 

    //生成密钥
    const createKey =e =>{
        let key = keygen(); 
        form.publicKey = key.PK;
        setForm({...form,publicKey:key.PK,privateKey:key.SK}) 
        document.getElementById("publicKey").value=form.publicKey;
        document.getElementById("privateKey").value=form.privateKey;  

    }
   //生成txt文件
   const createKeyFile = ()=>{
        if(!form.privateKey){
          prompt.error('请生成密钥',false);
          return ;
        } 
        const element = document.createElement("a");
        const file = new Blob([form.privateKey], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "privateKey.pem";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    } 
   //生成二维码
    const createKeyQR = ()=>{ 
      debugger
        if(!form.privateKey){
            prompt.error('请生成密钥',false);
            return ;
        }

        // 获取canvas类型的二维码
        const canvasImg =document.getElementById('qrCode');
        // 将canvas对象转换为图片的data url
        const url = canvasImg && canvasImg.toDataURL('image/png'); 
        // 创建下载
        const a = document.createElement('a')
        // 挂载下载url地址
        a.download = "privateKey"
        a.href = url
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)  
  }

      
  //更换秘钥
  const modifySecretKeyRequest = useRequest(
    body => ({
      url: 'chainBrowser/user/info/modifySecretKey',
      method: 'post',
      headers: {
        'Authorization': user.token,
      },
      body: JSON.stringify(body),
    }),
    {manual: true, formatResult: r => r},
  );  
  
  //验证密码
  const checkPwdRequest = useRequest(
    body => ({
      url: '/chainBrowser/user/info/checkPassword',
      method: 'post',
      headers: {
        'Authorization': user.token,
      },
      body: JSON.stringify(body),
    }),
    {manual: true, formatResult: r => r},
  ); 



  const handleForm = field => e => {
    setForm({...form, [field]: e.target.value}); 
  }; 
  //提交密码
  const handleSubmit = () => {  
    if(!form.privateKey){
      prompt.error('请生成密钥',false);
      return ;
    }  
    if(form.password ===''){
      prompt.error('请输入密码',false);
      return ;
    } 

 
    const hashPwd = sm3hashStr(form.password);
    const date=new Date();
    const min=date.getMinutes();
    const curTimestamp = date.getTime();
    const expireTimestamp = date.setMinutes(min+30);
    const curMsg = curTimestamp +user.email + user.publicKey   + user.provider_username + user.provider_pubkey + expireTimestamp;
    const auth_token = sign(curMsg, user.key);
    const checkParam = { 
      timestamp:curTimestamp + "",
      expired_timestamp:expireTimestamp+ "", 
      auth_token:auth_token,
      password :hashPwd
    }  

    T.confirm({
      title: "提示!",
      message: "请您确定是否已经保存密钥，若已保存则继续完成变更，否则取消当前操作。",
      option: [
          {
              text: "确定",
              fn: function fn() { 
                T.loading("正在提交...");  
                checkPwdRequest.run({...checkParam}).then(
                  (res)=>{   
                    if(res.code===0){
                      let secret_sk = encrypt_sm4(form.privateKey,sm3hashStr(form.password));
                     const editParam =  {
                        "new_public_key":form.publicKey,
                        "new_secret_sk":secret_sk,
                        "timestamp":curTimestamp+ "",
                        "expired_timestamp":expireTimestamp + "",
                        "auth_token":auth_token
                      }
                      modifySecretKeyRequest.run({...editParam}).then(
                        (res)=>{
                          T.loaded();
                          //更新缓存密钥
                          window.localStorage.setItem('key',form.privateKey) 
                          const chain_user = window.localStorage.getItem('chain_user');
                          const chainUser = JSON.parse(chain_user) ; 
                          chainUser.publicKey = form.publicKey;
                          window.localStorage.setItem('chain_user',JSON.stringify(chainUser)); 
                          prompt.inform("更换密钥成功！")
                        },
                        (err)=>{
                          console.log('网络异常！',err);
                          prompt.error("网络异常！",false);
                          T.loaded();
                        }
                      )

                    }else{
                      //密码出错
                      T.loaded();
                      prompt.error(res.cnMsg,false);
                    } 
                  },
                  (err)=>{
                    console.log('网络异常！',err);
                    prompt.error("网络异常！",false);
                    T.loaded();
                  }
                ); 


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
 
    
  };
  
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
  if (!user.token) {
    return (window.location.href = '/login');
  } 

  return (
    <main id="content" role="main">
     <div className="container-fluid space-bottom-2 p-3">
       
        <div className="card">

          <div className="header-title">
              <h4 className="card-title p-2">账户信息</h4>
          </div>
          
          <div className="card-body"> 
            
            <div className="row">
              <MySideBar value="modifysecretkey" />
              <div className="col-md-9">
                <div className="card mb-4">

                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h3 className="h5 text-dark mb-0">更换密钥</h3>
                  </div>

                  <div className="card-body">

                    <p className="text-dark mb-4">请生成密钥</p> 

                    <div className="row align-items-baseline  mb-2">
                      <div className={`col-md-12 js-form-message form-group ${errors.publicKey ? 'u-has-error' : ''}`}>
                          <span className="d-flex justify-content-between align-items-center">
                            公钥：
                            <button type="button" className="btn btn-link  text-primary  p-0  " style={{fontSize:'0.875rem'}} onClick={e=>createKey()}>生成密钥</button>
                          </span> 
                          <textarea className="form-control mb-2" id="publicKey" readOnly={true} rows="2" value={form.publicKey}></textarea>  
                          
                        </div>    
                    </div>  
    
                    <div className="row align-items-baseline  mb-2">
                      <div className={`col-md-12 js-form-message form-group ${errors.privateKey ? 'u-has-error' : ''}`}>
                        <span className="d-flex justify-content-between align-items-center">
                            私钥：
                            <div>
                              <button type="button" className="btn btn-link text-primary p-0    mr-2 "   style={{fontSize:'0.875rem'}} onClick={e=>createKeyFile()}>密钥文件</button>

                              <button type="button" className="btn btn-link text-primary  p-0   mr-2"    data-toggle="modal" data-target="#qrCodeDialog"  style={{fontSize:'0.875rem'}} >密钥二维码</button> 
                            </div>
                          
                        </span>
                        <textarea className="form-control mb-2" id="privateKey"  readOnly={true} rows="2" value={form.privateKey}   ></textarea>   
                      </div>  
                    </div>   
                    {/* 二维码显示 begin */}
                    <div id="qrCodeDialog" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenteredScrollableTitle" aria-hidden="true">
                      <div className="modal-dialog   modal-dialog-centered" style={{width:300}} >
                          <div className="modal-content"> 
                              <div className="modal-header" style={{padding:'0.5rem'}}>
                                  <h5 className="modal-title" id="exampleModalCenteredScrollableTitle">二维码</h5>
                                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">×</span>
                                  </button>
                              </div>
                              <div className="modal-body text-center">
                                  <div id="myqrcode"> 
                                      <QRCode
                                          id="qrCode"
                                          value={form.privateKey} 
                                          size={100} // 二维码的大小
                                          fgColor="#000000" // 二维码的颜色
                                          style={{ margin: 'auto' }}
                                          imageSettings={{ // 二维码中间的logo图片
                                              src: 'assets/images/logo-dark.png',
                                              height: 10,
                                              width: 10,
                                              excavate: true, // 中间图片所在的位置是否镂空
                                          }}
                                      />    
                                  </div> 
                              </div>
                              <div className="modal-footer">
                                  <button type="button" className="btn btn-sm btn-danger" data-dismiss="modal">关闭</button>
                                  <button type="button" className="btn btn-sm btn-primary" onClick={e=>createKeyQR()}>下载二维码</button>
                              </div>
                          </div>
                      </div>
                    </div>
                    {/* 二维码显示 end */} 
                    <div className="row align-items-baseline  mb-2">
                      <div className={`col-md-12 js-form-message form-group ${errors.password ? 'u-has-error' : ''}`}>
                        <label className="" htmlFor="txtPassword">
                          密码
                        </label>
                        <input  type="password"  maxLength="75"    className="form-control"  autoComplete="off"  placeholder="******"   aria-label="********"     value={form.password}    onChange={handleForm('password')}  />
                      </div>
                    </div>

                    <div className="mb-2 text-center"> 
                        <button type="button"   className="btn btn-primary  mt-2" onClick={debounce(handleSubmit)} disabled={modifySecretKeyRequest.loading}>
                            确认修改
                        </button>
                    </div> 

                  </div>
                </div>   
              </div>
            </div>

          </div>
        </div>


      </div>
      <Toast/>
    </main>
  );
}
