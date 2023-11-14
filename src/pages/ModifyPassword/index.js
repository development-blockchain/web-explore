import { useRequest } from 'ahooks';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../../UserContext';
import { sign } from '../../commons/sm2';
import { encrypt_sm4, sm3hashStr } from '../../commons/tdh2';
import MySideBar from '../../components/MySideBar';

import Toast, { T } from "react-toast-mobile";
import "react-toast-mobile/lib/react-toast-mobile.css"; 

export default function ModifyPassword() {
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
            <MySideBar value="modifypassword" />
            <div className="col-md-9">
              <div className="card mb-4">

                <div className="card-header d-flex justify-content-between align-items-center">
                  <h3 className="h5 text-dark mb-0">修改密码</h3>
                </div>

                <div className="card-body">

                  <p className="text-dark mb-4">请输入以下信息进行密码修改</p> 

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
