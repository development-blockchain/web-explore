import { useRequest } from 'ahooks';
import { useContext, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import UserContext from '../../UserContext';
import { sign } from '../../commons/sm2'; 
import { encrypt_sm4,decrypt_sm4_2, sm3hashStr } from '../../commons/tdh2';  
import Loading from '../../components/Loading';  
import Toast, { T } from "react-toast-mobile";
import "react-toast-mobile/lib/react-toast-mobile.css";  
 

import{keygen} from '../../commons/sm2';  
import QRCode from 'qrcode.react' //注入依赖模块

function ModifySecretKey({user}){
  const [errors, setErrors] = useState({}); 
  
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
                      
                    let secret_sk = encrypt_sm4(form.privateKey,sm3hashStr(hashPwd));
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
    <div className="col-md-12">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="h5   mb-0">更换密钥</h3>
        </div> 
        <div className="card-body">

          <p className="mb-4">请生成密钥</p> 

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
      <Toast/>  
    </div> 
  );
}
function ModifyPassword({user}){
  const [errors, setErrors] = useState({}); 
  const [form, setForm] = useState({ 
    old_password: '',
    new_password: '',
    confirm_password: '' 
  });  

  const editPasswordRequest = useRequest(
    body => ({
      url: 'chainBrowser/user/info/modifyPassword',
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

    if (e.target.value) {
      setErrors({...errors, [field]: undefined});
    }
  };
  const handleBlur = key => () => {      
    const _errors = {...errors};
    Object.keys(form)
      .forEach(field => {
        if (field === key) {
          _errors[field] = !form[field];
        }
      });

    if (form.new_password && form.new_password.length < 5 && key === 'new_password') {
      _errors.new_password = true;
    }

    if (form.new_password && form.confirm_password && form.new_password !== form.confirm_password && key === 'confirm_password') {
      _errors.confirm_password = 'equalto';
    } 

    if (Object.keys(_errors).some(e => !!_errors[e])) {
      if (_errors[key]) {
        setErrors(_errors);
      }
    }
  };

  //提交密码
  const handleSubmit = () => {  
   
    const _errors = {}; 
    Object.keys(form) 
      .forEach(field => {
        _errors[field] = !form[field];
      });

    if (form.old_password && form.old_password.length < 5) {
      _errors.pasold_passwordsword = true;
    }

    if (form.new_password && form.confirm_password && form.new_password !== form.confirm_password) {
      _errors.new_password = 'equalto';
    }  

    if(form.publickKey ===''){
      _errors.publicKey = true;
    } 

    if (Object.keys(_errors).some(e => !!_errors[e])) {
      setErrors(_errors);
    } else {   
        T.loading("正在提交...");  
        let secret_sk = encrypt_sm4(user.key,sm3hashStr(form.new_password)); 
        const date=new Date();
        const min=date.getMinutes();
        const curTimestamp = date.getTime();
        const expireTimestamp = date.setMinutes(min+30);
        const curMsg = curTimestamp +user.email + user.publicKey   + user.provider_username + user.provider_pubkey + expireTimestamp;
        const auth_token = sign(curMsg, user.key);
        
        const checkParam = { 
            old_password:sm3hashStr(form.old_password),
            new_password:sm3hashStr(form.new_password),
            confirm_password:sm3hashStr(form.confirm_password),
            secret_sk:secret_sk,
            timestamp:curTimestamp + "",
            expired_timestamp:expireTimestamp+ "", 
            auth_token:auth_token 
        };
        editPasswordRequest.run({...checkParam}).then(
            res => {  
                T.loaded(); 
                if (res.code === 0) { 
                    prompt.inform('修改成功!');
                    setForm({old_password:'',new_password:'',confirm_password:''}) 
                }else{
                    prompt.error('修改失败!' +res.cnMsg,false);
                }
            }, 
            err=>{
                console.log('修改密码失败,',err);
                T.loaded();
            }
        );
 
    } 
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
 

  return (


      <div className="col-md-12">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 className="h5  mb-0">修改密码</h3>
          </div> 
          <div className="card-body">

            <p className="mb-4">请输入以下信息进行密码修改</p> 

            <div className="row align-items-baseline  mb-2">
                <div className="col-md-3 mb-1 mb-md-0">
                    <label className="" htmlFor="txtPassword">
                        <i className="fal fa-lock fa-fw text-secondary mr-1"></i> 原密码:
                    </label>
                </div> 
                <div className={`col-md-9 js-form-message form-group ${errors.old_password ? 'u-has-error' : ''}`}> 
                    <input  type="password"  maxLength="75"    className="form-control"  autoComplete="off"  placeholder="******"   aria-label="********"   data-rule-minlength="5" 
                        value={form.old_password}    onChange={handleForm('old_password')}   onBlur={handleBlur('old_password')}   />
                    <div className="invalid-feedback" style={{display: errors.old_password ? 'block' : 'none'}}> 
                      请输入密码
                    </div>
                </div>  
            </div>  

            <div className="row align-items-baseline  mb-2">
                <div className="col-md-3 mb-1 mb-md-0">
                    <label className="" htmlFor="txtPassword">
                        <i className="fal fa-lock fa-fw text-secondary mr-1"></i> 新密码:
                    </label>
                </div> 
                <div className={`col-md-9 js-form-message form-group ${errors.new_password ? 'u-has-error' : ''}`}> 
                    <input  type="password"  maxLength="75"    className="form-control"  autoComplete="off"  placeholder="******"   aria-label="********"   data-rule-minlength="5" 
                        value={form.new_password}    onChange={handleForm('new_password')}   onBlur={handleBlur('new_password')}   />
                    <div className="invalid-feedback" style={{display: errors.new_password ? 'block' : 'none'}}> 
                      密码长度不能小于5位
                    </div>
                </div>  
            </div>  

            <div className="row align-items-baseline  mb-2">
                <div className="col-md-3 mb-1 mb-md-0">
                    <label className="" htmlFor="txtPassword">
                        <i className="fal fa-lock fa-fw text-secondary mr-1"></i> 确认密码:
                    </label>
                </div> 
                <div className={`col-md-9 js-form-message form-group ${errors.confirm_password ? 'u-has-error' : ''}`}> 
                    <input  type="password"  maxLength="75"    className="form-control"  autoComplete="off"  placeholder="******"   aria-label="********"   data-rule-minlength="5" 
                        value={form.confirm_password}    onChange={handleForm('confirm_password')}   onBlur={handleBlur('confirm_password')}   />
                    <div className="invalid-feedback" style={{display: errors.confirm_password ? 'block' : 'none'}}> 
                      新密码与确认密码不一致
                    </div>
                </div>  
            </div>  

            <div className="mb-2 text-center"> 
                <button type="button"   className="btn btn-primary  mt-2" onClick={debounce(handleSubmit)} disabled={editPasswordRequest.loading}>
                    确认修改
                </button>
            </div> 
          </div>
          <Toast/> 
      </div>
   
  );

}

function Account({user}){

  const userInfoRequest = useRequest(
    body => ({
      url: 'chainBrowser/user/info/getUserInfo',
      method: 'post',
      headers: {
        'Authorization': user.token,
      },
      body: JSON.stringify(body),
    }),
    {manual: true, formatResult: r => r},
  );   

  const [curUser,setCurUser]=useState({});
  const [privateKey,setPrivateKey]=useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [showKey,setShowKey]=useState(false);
  const [password,setPassword]=useState("");


  useEffect(() => {
    if (user.token) {
      const date=new Date();
      const min=date.getMinutes();
      const curTimestamp = date.getTime();
      const expireTimestamp = date.setMinutes(min+30);
      const curMsg = curTimestamp +user.email + user.publicKey   + user.provider_username + user.provider_pubkey + expireTimestamp;
      const auth_token = sign(curMsg, user.key);
      const checkParam = { 
        timestamp:curTimestamp + "",
        expired_timestamp:expireTimestamp+ "", 
        auth_token:auth_token 
      }
      userInfoRequest.run({...checkParam}).then((res)=>{  
        if(res.code ===0){ 
          setCurUser({...res.data}) 
        }
      }); 

    }  
  }, []); 

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
    setPassword(e.target.value) 
  };

 

  const handleLookKey=(e)=>{ 
    e.preventDefault();      
    if(password ===''){
      prompt.error('请输入密码',false);
      return ;
    }  
    const hashPwd = sm3hashStr(password);
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
    T.loading("正在提交...");  
    checkPwdRequest.run({...checkParam}).then(
      (res)=>{   
      T.loaded(); 
      if(res.code===0){   
        //私钥进行2次hash
        let key= decrypt_sm4_2(curUser.secretSK,sm3hashStr(hashPwd))
        setShowKey(true);
        setPrivateKey(key);
        setShowDialog(false); 
        setPassword('');
      }else{
        prompt.error('查看失败!' + res.cnMsg,false);
        return ; 
      }
    },
    (err)=>{
      prompt.error('网络异常!',false); 
      T.loaded(); 
    }
    ); 




  }
  


  if (userInfoRequest.loading) {
    return <Loading />;
  } 



  return ( 
      <div className="col-md-12">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="h5   mb-0">账户信息</h3>
        </div> 
        <div className="card-body"> 
          {/* <p className=" mb-4">以下是您的邮箱信息以及其他信息.</p>   */}
          <div className="row align-items-baseline">
              <div className="col-md-4 mb-1 mb-md-0">
                <i className="fal fa-envelope fa-fw text-secondary mr-1"></i> 您的邮箱:
              </div>
              <div className="col-md-8">
                  <div className="d-flex justify-content-between align-items-center my-n1">
                      <strong>{curUser?.email}</strong> 
                  </div>
              </div>
          </div>  
          <hr /> 
          <div className="row align-items-baseline">
              <div className="col-md-4 mb-1 mb-md-0">
                <i className="fal fa-envelope fa-fw text-secondary mr-1"></i> 用户类型:
              </div>
              <div className="col-md-8">
                  <div className="d-flex justify-content-between align-items-center my-n1">
                      <strong>{curUser?.permintion}</strong> 
                  </div>
              </div>
          </div>  
        </div> 
        <div className="card">

          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 className="h5  mb-0">密钥信息</h3>  
            <a href="!#" className="ml-3"     data-toggle="modal"  onClick={e=>{ e.preventDefault();     setShowDialog(true);}}  >查看私钥明文</a>   
          </div>

          <div className="card-body">
            {/* <p className=" mb-4">以下是您的密钥信息</p> */}

            <div className="row align-items-center">
              <div className="col-md-4 mb-1 mb-md-0">
                <i className="fal fa-sticky-note fa-fw text-secondary mr-1"></i> 公钥:
              </div>

              <div className="col-md-8">
                  <p className="bg-soft-secondary text-secondary">
                    {curUser?.publicKey}
                  </p>
              </div>

            </div> 

            <hr/> 

            <div className="row align-items-center">
              <div className="col-md-4 mb-1 mb-md-0">
                <i className="fal fa-heart fa-fw text-secondary mr-1"></i> 加密私钥                   
              </div>
              <div className="col-md-8"> 
                <p className="bg-soft-secondary text-secondary">
                  {curUser?.secretSK}
                </p> 
              </div>  
              {/* 文本导入 begin */}
              <Modal show={showDialog} onHide={() => setShowDialog(false)}  width={400}  aria-labelledby="contained-modal-title-vcenter"      centered>
                <Modal.Header closeButton className="p-2">
                    <Modal.Title id="contained-modal-title-vcenter">
                    验证密码
                    </Modal.Title> 
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label htmlFor="privateKey">请输入密码:</label>
                        <input   type="password"  maxLength="75"  tabIndex="2" className="form-control"  ria-label="********"   value={password} onChange={handleForm('password')}  />
                    </div> 
                </Modal.Body>
                <Modal.Footer>
                  <button type="button" className="btn btn-sm btn-danger" onClick={e=>{e.preventDefault();setShowDialog(false);}}>关闭</button>
                  <button type="button" className="btn btn-sm btn-primary" onClick={e=>handleLookKey(e)} >确定</button>
                </Modal.Footer>
              </Modal>
            
              {/* 文本导入 end */} 
            </div>

            <hr/> 
            <div className={`row align-items-center ${showKey?'':'d-none'}`}>
                <div className="col-md-4 mb-1 mb-md-0">
                  <i className="fal fa-book-alt fa-fw text-secondary mr-1"></i> 私钥:
                </div>
                <div className="col-md-8">
                    <p className="bg-soft-secondary text-secondary">
                      {privateKey}
                    </p>
                </div>  
            </div> 

          </div> 

        </div>
        <Toast/>
      </div>
  )
}
 
export default function MyAccount() {
  const userContext = useContext(UserContext);   
  const [user, setUser] = useState({
    token: userContext.user.token || undefined,
    email:userContext.user.email || undefined,
    key: userContext.user.key || undefined,
    publicKey: userContext.user.publicKey || undefined,
    provider_username: userContext.user.provider_username || undefined,
    provider_pubkey: userContext.user.provider_pubkey || undefined,
  }); 


  
  const [currentTab, setCurrentTab] = useState('myaccount');  

  
  
  if (!user.token) {
    return (window.location.href = '/login');
  } 

  return (
    <main id="content" role="main">
      <div className="container-fluid space-bottom-2  p-2">
        <div className="card">
          <div className="header-title"> 
            <div className="d-flex justify-content-between align-items-center p-3">
                <h5 className="font-weight-bold">用户信息</h5>  
            </div>  
          </div> 
          <div className="d-flex justify-content-between align-items-center p-0">
            <ul className="nav nav-tabs w-100" role="tablist"> 
                <li className="nav-item">
                  <a className={`nav-link ${'myaccount' === currentTab ? 'active' : ''}`}   href={`#myaccount`}  data-toggle="tab"  onClick={() => {  setCurrentTab('myaccount');    }}  >
                    用户详情
                  </a>
                </li> 
                <li  className="nav-item"> 
                  <a className={`nav-link ${'modifypassword' === currentTab ? 'active' : ''}`}   href={`#modifypassword`}  data-toggle="tab"  onClick={() => {  setCurrentTab('modifypassword');    }}  >
                    修改密码
                  </a>
                </li>
                <li  className="nav-item"> 
                  <a className={`nav-link ${'modifysecretkey' === currentTab ? 'active' : ''}`}   href={`#modifysecretkey`}  data-toggle="tab"  onClick={() => {  setCurrentTab('modifysecretkey');    }}  >
                    更换密钥
                  </a>
                </li>
            </ul>
          </div>
          <div className="card-body">
            <div className="tab-content"> 
              {currentTab === 'myaccount' ? <Account user={user} /> : undefined}
              {currentTab === 'modifypassword' ? <ModifyPassword user={user}/> : undefined}
              {currentTab === 'modifysecretkey' ? <ModifySecretKey  user={user} /> : undefined}
            </div>
          </div>
        </div> 
      </div> 

    </main>
  );
}
