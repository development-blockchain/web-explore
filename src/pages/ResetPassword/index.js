import {useEffect, useState} from 'react';
import {useRequest} from 'ahooks';
import {useLocation} from 'react-router-dom';
import qs from 'qs';  
import Loading from '../../components/Loading';
import {Link} from 'react-router-dom'; 
import VerifyCode from '../../components/VerifyCode'; 
import{sm3hashStr,encrypt_sm4 } from '../../commons/tdh2';
export default function ResetPassword() {

    const location = useLocation();
    const query = qs.parse(location.search, {ignoreQueryPrefix: true});
 
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        password:'',
        confirmPassword:'', 
        captchaId: '',
        verifyCode: '',
    });

  
    
    const handleForm = field => e => {
      setForm({...form, [field]: e.target.value});

      if (e.target.value) {
        setErrors({...errors, [field]: undefined});
      }
    };

    const handleUpdateVerifyCode = e => { 
      setForm({...form, ...e});

      if (e.verifyCode) {
        setErrors({...errors, verifyCode: undefined});
      }
    };

    const handleBlur = key => e => {
       
      const _errors = {};

      Object.keys(form).forEach(field => {
        _errors[field] = !form[field];
      });

      if (form.password && form.password.length < 5 && key === 'password') {
        _errors.password = true;
      }
  
      if (form.password && form.confirmPassword && form.password !== form.confirmPassword && key === 'confirmPassword') {
        _errors.confirmPassword = 'equalto';
      }

      if (Object.keys(_errors).some(e => !!_errors[e])) {
        if (_errors[key]) {
          setErrors(_errors);
        }
      }
    }; 

    const resetPasswordRequest = useRequest(
        body => ({
        url: '/chainBrowser/user/login/resetPassword',
        method: 'post',    
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(body),
        }),
        {manual: true, formatResult: r => r},
    ); 

    
  const handleSubmit = () => {
     
    const _errors = {};
     
    Object.keys(form).forEach(field => {
      _errors[field] = !form[field];
    });

    if (form.password && form.password.length < 5) {
        _errors.password = true;
      }
  
      if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
        _errors.confirmPassword = 'equalto';
      }

    if(form.verifyCode !== form.captchaId){
      _errors.verifyCode = true;
    }else{
      _errors.verifyCode = false;
    }
    if(!query.token){
        prompt.error("非法请求");
        return ;
    }

    const privateKey = window.localStorage.getItem('key') 
     if(!privateKey){
        prompt.error("请在登录页面导入密钥");
        return ;
     }

    if (Object.keys(_errors).some(e => !!_errors[e])) {
      setErrors(_errors);
    } else {
        let secret_sk = encrypt_sm4(privateKey,sm3hashStr(form.password)); 
        const formEncrpty = {
            token: query.token,
            new_password:sm3hashStr(form.password),
            confirm_password:sm3hashStr(form.confirmPassword),
            secret_sk:secret_sk
          } 
          resetPasswordRequest.run({...formEncrpty}).then(
            res => { 
              if (res.code === 0) {
                prompt.inform("重置成功，请登录系统"); 
                setTimeout(()=>{
                    window.location.href = '/login'
                },1000)
              } 
            },
            err=>{
              console.log('网络错误,',err);
              prompt.error("网络错误！");
            }
          );
    }
  };  
     
 const showError =  typeof resetPasswordRequest.data?.code!== 'undefined' && resetPasswordRequest.data?.code !== 0;
 
  return (
    <div className="wrapper"> 
        <section className="login-content">
          <div className="container-fluid">   
          <div className="row align-items-center justify-content-center h-100"   >
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body"> 
                            <form method="post" className="js-validate w-md-50 mx-md-auto" noValidate="novalidate">
                                <div className="mb-2">
                                    <h3 className="mb-3 font-weight-bold text-center">
                                        重置密码
                                    </h3> 
                                </div>
                                    
                                <div className="alert alert-danger" style={{display: showError ? 'block' : 'none'}}>
                                    {resetPasswordRequest.data?.cnMsg}
                                </div>
                                <div className="row">  
                                    <div className="col-sm-6">
                                        <div className={`js-form-message form-group ${errors.password ? 'u-has-error' : ''}`}>
                                            <label className="" htmlFor="txtPassword">
                                                密码
                                            </label>
                                            <input  type="password"  maxLength="75"    className="form-control"  autoComplete="off"
                                            placeholder="******"   aria-label="********"   data-rule-minlength="5" 
                                            value={form.password}    onChange={handleForm('password')}   onBlur={handleBlur('password')}
                                            />
                                            <div className="invalid-feedback" style={{display: errors.password ? 'block' : 'none'}}> 
                                                密码长度不能小于5位
                                            </div>
                                        </div>
                                    </div> 

                                    <div className="col-sm-6">
                                    <div className={`js-form-message form-group ${errors.confirmPassword ? 'u-has-error' : ''}`}>                               
                                        <label className="" htmlFor="txtPassword2">
                                            确认密码
                                        </label>
                                        <input  type="password"  maxLength="75"   className="form-control" placeholder="******"   autoComplete="off"
                                         data-rule-minlength="5"  value={form.confirmPassword} onChange={handleForm('confirmPassword')}   onBlur={handleBlur('confirmPassword')}   />
                                        <div className="invalid-feedback" style={{display: errors.confirmPassword ? 'block' : 'none'}}>
                                            {errors.confirmPassword === 'equalto' ?   "密码与确认密码不一致"  :"密码长度不能小于5位"}
                                        </div>
                                    </div> 
                                    </div>
                                </div>
                                <div className={`js-form-message form-group ${errors.verify_code ? 'u-has-error' : ''}`}>
                                    <label className="d-block" htmlFor="txtCaptcha">
                                        验证码
                                    </label>
                                    <VerifyCode value={form.verify_code} onChange={handleUpdateVerifyCode} />
                                    <div className="invalid-feedback" style={{display: errors.verifyCode ? 'block' : 'none'}}>
                                        验证码无效
                                    </div>
                                </div>

                                <div id="ContentPlaceHolder1_div4" className="d-flex justify-content-center align-items-center my-4"></div>
                                <div id="ContentPlaceHolder1_div3" className="row align-items-center">
                                    <div className="col-4 col-sm-6">
                                        <Link to='/forgetpassword'  className="btn btn-link link-muted  p-0 text-primary" >重新申请</Link> 
                                      
                                    </div>
                                    <div className="col-8 col-sm-6 text-right">
                                        <input type="button" onClick={handleSubmit} disabled={resetPasswordRequest.loading} value="确认重置" className="btn btn-primary" />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>  

          </div>
        </section>
    </div>
     
  );
}
