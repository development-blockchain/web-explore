import {useEffect,useState} from 'react';
import {useRequest} from 'ahooks'; 
import VerifyCode from '../../components/VerifyCode';  
import {useTranslation} from 'react-i18next'; 
import {Link} from 'react-router-dom'; 
import{keygen} from '../../commons/sm2';
 
import{sm3hashStr,encrypt_sm4,decrypt_sm4_2 } from '../../commons/tdh2';
import QRCode from 'qrcode.react' //注入依赖模块
import VerifyEmial from '../../components/VerifyEmail';  

import Toast, { T } from "react-toast-mobile";
import "react-toast-mobile/lib/react-toast-mobile.css"; 

export default function Register() {
  const {t} = useTranslation(['register']);  

  const resendEmailRequest = useRequest(
    body => ({
      url: '/chainBrowser/user/login/resendActiveMail',
      method: 'post',
       headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(body),
    }),
    {manual: true, formatResult: r => r},
  );

  const registerRequest = useRequest(
    body => ({
      url: '/chainBrowser/user/login/signup',
      method: 'post',    
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(body),
    }),
    {manual: true, formatResult: r => r},
  );

 

  const [verifyForm, setVerifyForm] = useState({
    email:'',
    key:'' 
  });
  const [form, setForm] = useState({ 
    email: '',
    password: '',
    confirmPassword: '',
    captchaId: '',
    verifyCode: '',
    publickKey:'',
    privateKey:'' ,
    newsletter:''
  }); 

  const [errors, setErrors] = useState({});

  const [showVerify, setShowVerify] = useState(false);

  
  //按钮状态
  const [isLoading, setLoading] = useState(false)

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

  //生成密钥
  const createKey =e =>{
    let key = keygen(); 
    form.publickKey = key.PK;
    form.privateKey = key.SK; 

    document.getElementById("publicKey").value=form.publickKey;
    document.getElementById("privateKey").value=form.privateKey;


    const _errors = {}; 
    Object.keys(form)
    .filter(f => f !== 'newsletter')
    .forEach(field => {
      _errors[field] = !form[field];
    }); 
    _errors.publickKey = true;
    setErrors(_errors);
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
  // throttle已达到预期效果！ 节流
  const throttle = (f,time = 1000) =>{
    let timer = null
    return () => {
      if(timer) return
      timer = setTimeout(() => {
        f.apply(this)
        timer = null
      },time)
    }
  }  

   //生成txt文件
  const createKeyFile = ()=>{
    if(!form.privateKey){
      prompt.error('请生成密钥',false);
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

  const handleSubmit = () => { 
    const emailREG = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    const _errors = {}; 
    Object.keys(form)
      .filter(f => f !== 'newsletter')
      .forEach(field => {
        _errors[field] = !form[field];
      });

    if (form.password && form.password.length < 5) {
      _errors.password = true;
    }

    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      _errors.confirmPassword = 'equalto';
    }

    if (!emailREG.test(form.email)) {
      _errors.email = true;
    }
    if(form.verifyCode !== form.captchaId){
      _errors.verifyCode = true;
    }
    if(form.publickKey ===''){
      _errors.publicKey = true;
    } 

    if (Object.keys(_errors).some(e => !!_errors[e])) {
      setErrors(_errors);
    } else {  
      T.confirm({
        title: "提示!",
        message: "请您确定是否已经保存密钥，若已保存则继续完成注册，否取消当前操作。",
        option: [
            {
                text: "确定",
                fn: function fn() {
                   //私钥进行2次hash
                  let secret_sk = encrypt_sm4(form.privateKey,sm3hashStr(sm3hashStr(form.password))); 
                  const formEncrpty = {    
                    email:  form.email,
                    password: sm3hashStr(form.password),
                    confirm_password: sm3hashStr(form.confirmPassword),
                    public_key:form.publickKey,
                    secret_sk:secret_sk 
                  } 
                  registerRequest.run({...formEncrpty}).then(res => {  
                    console.log('res----------->',res)
                      if (res.code === 0) { 
                        prompt.inform('注册成功，请尽快登录邮箱激活您的账户!')
                        verifyForm.email = form.email;
                        verifyForm.key = res.data.key; 
                        verifyForm.showVerify = true; 
                        setShowVerify(true); 
                      } 
        
                  });
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
  };

  const handleVerifyBlur = ()=>{
    let key ='verifyCode';
    const _errors = {...errors};
    _errors[key] = !form[key];

    
    if (Object.keys(_errors).some(e => !!_errors[e])) {
      if (_errors[key]) {
        setErrors(_errors);
      }
    }

  }
  const handleBlur = key => () => {
     
    const emailREG = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    const _errors = {...errors};

    Object.keys(form)
      .filter(f => f !== 'newsletter')
      .forEach(field => {
        if (field === key) {
          _errors[field] = !form[field];
        }
      });

    if (form.password && form.password.length < 5 && key === 'password') {
      _errors.password = true;
    }

    if (form.password && form.confirmPassword && form.password !== form.confirmPassword && key === 'confirmPassword') {
      _errors.confirmPassword = 'equalto';
    }

    if (!emailREG.test(form.email) && key === 'email') {
      _errors.email = true;
    }


    if (Object.keys(_errors).some(e => !!_errors[e])) {
      if (_errors[key]) {
        setErrors(_errors);
      }
    }
  };
  useEffect(() => {  
    // let key = keygen();  
    // form.publickKey = key.PK;
    // form.privateKey = key.SK; 
    // document.getElementById("publicKey").value=key.PK;
    // document.getElementById("privateKey").value=key.SK;
  }, []); 

  const showError = typeof registerRequest.data?.code !== 'undefined' && registerRequest.data?.code !== 0;

  return (
    <div className="wrapper"> 
        <section className="login-content">
          <div className="container-fluid"> 
            <div className="row align-items-center justify-content-center h-100" style={{display:showVerify?'none':'flex'}} >
                <div className="col-sm-12 col-md-6">
                  <div className="card">
                    <div className="card-body"> 
                      <form className="js-validate w-md-75 w-lg-50 mx-md-auto" noValidate="novalidate">
                        <div className="mb-2">
                          <h3 className="mb-3 font-weight-bold text-center">
                            {t('register.title1')}
                          </h3> 
                        </div>
                        <div className="alert alert-danger" style={{display: showError ? 'block' : 'none'}}>
                          {registerRequest.data?.cnMsg}
                        </div>
                        <div>       
                          <div className={`js-form-message form-group ${errors.email ? 'u-has-error' : ''}`}>
                              <span className="d-flex justify-content-between align-items-center">
                                  {t('register.Email')}  
                              </span>
                              <input id="txtEmail" maxLength="100"   className="form-control "  type="email"  autoComplete="off"
                                placeholder={t('register.EmailPlaceholder')}    data-msg="Please enter a valid email address."
                                  value={form.email} onChange={handleForm('email')}  onBlur={handleBlur('email')} />
                              <div className="invalid-feedback" style={{display: errors.email ? 'block' : 'none'}}> 
                                {t('register.EnterEmail')}
                              </div>
                          </div>
                          <div className="row"> 
                            <div className="col-sm-6">
                              <div className={`js-form-message form-group ${errors.password ? 'u-has-error' : ''}`}>
                                <label className="" htmlFor="txtPassword">
                                  {t('register.Password')}
                                </label>
                                <input  type="password"  maxLength="75"    className="form-control"  autoComplete="off"
                                  placeholder="******"   aria-label="********"   data-rule-minlength="5" 
                                  value={form.password}    onChange={handleForm('password')}   onBlur={handleBlur('password')}
                                />
                                <div className="invalid-feedback" style={{display: errors.password ? 'block' : 'none'}}> 
                                  {t('register.PasswordLen')}
                                </div>
                              </div>
                            </div> 

                            <div className="col-sm-6">
                              <div className={`js-form-message form-group ${errors.confirmPassword ? 'u-has-error' : ''}`}>                               
                                <label className="" htmlFor="txtPassword2">
                                  {t('register.ConfirmPassword')}
                                </label>
                                <input  type="password"  maxLength="75"   className="form-control" placeholder="******"   autoComplete="off"
                                  data-rule-minlength="5"  value={form.confirmPassword} onChange={handleForm('confirmPassword')}   onBlur={handleBlur('confirmPassword')}   />
                                <div className="invalid-feedback" style={{display: errors.confirmPassword ? 'block' : 'none'}}>
                                  {errors.confirmPassword === 'equalto' ?   t('register.PasswordCheck')  : t('register.PasswordLen')}
                                </div>
                              </div>

                            </div>
                          </div>
                          <div className={`js-form-message form-group ${errors.verifyCode ? 'u-has-error' : ''}`}>
                            <label className="" htmlFor="txtEmail">
                              {t('register.Captcha')}
                            </label>
                            <VerifyCode value={form.verifyCode} onChange={handleUpdateVerifyCode} handleBlur={handleVerifyBlur}  />
                            <div className="invalid-feedback" style={{display: errors.verifyCode ? 'block' : 'none'}}>
                              {t('register.Captchainvalid')}
                            </div>
                          </div>      
  

                          <div className={`js-form-message form-group ${errors.publicKey ? 'u-has-error' : ''}`}>
                            <span className="d-flex justify-content-between align-items-center">
                              公钥
                              <button type="button" className="btn btn-link  text-primary  p-0  " style={{fontSize:'0.875rem'}} onClick={e=>createKey()}>生成密钥</button>
                            </span> 
                            <textarea className="form-control mb-2" id="publicKey" readOnly={true} rows="2" value={form.publickKey}></textarea>  
                            <div className="invalid-feedback" style={{display: errors.publicKey ? 'block' : 'none'}}>
                                  请点击生成密钥
                            </div>
                          </div>     

                          <div className={`js-form-message form-group ${errors.privateKey ? 'u-has-error' : ''}`}>
                            <span className="d-flex justify-content-between align-items-center">
                               私钥
                                <div>
                                  <button type="button" className="btn btn-link text-primary p-0    mr-2 "   style={{fontSize:'0.875rem'}} onClick={e=>createKeyFile()}>密钥文件</button>

                                  <button type="button" className="btn btn-link text-primary  p-0   mr-2"    data-toggle="modal" data-target="#qrCodeDialog"  style={{fontSize:'0.875rem'}} >密钥二维码</button> 
                                </div>
                              
                            </span>
                            <textarea className="form-control mb-2" id="privateKey"  readOnly={true} rows="2" value={form.privateKey}   ></textarea>   
                            
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

                          <div className="row align-items-center mt-5">
                            <div className="col-5 col-sm-6"> 
                            </div> 
                          </div>


                          <button type="button"   className="btn btn-primary btn-block mt-2" onClick={debounce(handleSubmit)} disabled={registerRequest.loading}>
                            {t('register.tip3')}
                          </button>
 
                          <div className="col-lg-12 mt-3">
                              <p className="mb-0 text-center"> 
                              <span className="text-muted">{t('register.tip1')}  </span>
                                <Link to='/login'  className="text-nowrap" >
                                  {t('register.tip2')}
                                </Link> 
                              </p> 
                          </div>   
                        </div>
                      </form>
                    </div>
                  </div>
                </div> 
            </div>  
            <VerifyEmial verifyForm={verifyForm} showVerify={showVerify}  />   
          </div>
        </section>  
        <Toast/>
    </div>

    
  );
}
