import {useState,useRef,useCallback, useEffect,useContext} from 'react';
import {useRequest} from 'ahooks';
import {useLocation} from 'react-router';
import qs from 'qs';
import VerifyCode from '../../components/VerifyCode';
import UserContext from '../../UserContext'; 
import {useTranslation} from 'react-i18next'; 
import {Link} from 'react-router-dom'; 
import{sm3hashStr} from '../../commons/tdh2';
import{recover,sign,verify} from '../../commons/sm2';
import { BrowserQRCodeReader } from '@zxing/browser'
import Modal from 'react-bootstrap/Modal';
import VerifyEmial from '../../components/VerifyEmail';


/**
 * 
 * @returns 账号登录
 */
function UserLogin(){

  const {t} = useTranslation(['login']);  

  const [hasKey,setHasKey]=useState(false)
  const [showVerify, setShowVerify] = useState(false);
  
  const [verifyForm, setVerifyForm] = useState({
     email:'',
     key:'' 
  });


  const [privateKey, setPrivateKey] = useState('');
  const [publicKey, setPublicKey] = useState('');  
  const [show, setShow] = useState(false);

  const [form, setForm] = useState({
    userName: '',
    password: '',
    verifyCode:'',
    captchaId: '',
    autologin: false,
  });

  const loginRequest = useRequest(
    body => ({ 
      url: 'chainBrowser/user/login/signin',
      method: 'post',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(body),
    }),
    {manual: true, formatResult: r => r},
  );

  const loginCheck = useRequest(

    body => ({
      url: 'chainBrowser/user/login/signincheck',
      method: 'post',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(body),
    }),
    {manual: true, formatResult: r => r},
  );

  const [errors, setErrors] = useState({});

  //清空密钥
 const clearPrivateKey=()=>{
    document.getElementById("privateKey").value = ""; 
 }
  //上传txt
  const uploadTxt=()=>{
    document.getElementById('txtFile').click();
  }
  const handleTxtChange=(e)=>{   
    if(e.target.files.length >0){
      const file =e.target.files[0];
      let reader = new FileReader(); 
      let text = ''; 
      reader.onload = function() { 
          text += this.result; 
      }
      reader.onerror = (e) => { 
        prompt.error('读取文件失败!' + e.target.error.name,false);
        console.log(e.target.error.name); 
      }
      reader.onloadend = (e) => {  
        document.getElementById("privateKey").value = text; 
      }; 
      reader.readAsText(file);  
    } 
  }
  //上传png
  const uploadPng=()=>{
    document.getElementById('pngFile').click();
  }
  
  const handlePngChange=(e)=>{
    if(e.target.files.length >0){ 
      const codeReader = new BrowserQRCodeReader()
      let image = URL.createObjectURL(e.target.files[0])
      const img = document.createElement('img')
      img.src = image;
      codeReader.decodeFromImageElement(img).then((result) => {
        // console.log('二维码图片内容', result.text)
        document.getElementById("privateKey").value = result.text; 
      }).catch((err) => {
          prompt.error('二维码图片解码失败',false);
          console.warn('二维码图片解码失败了', err)
      })
    }
  }
  
  //保存密钥
  const savePrivateKey=()=>{
    const key = document.getElementById("privateKey").value;
    if(key ===''){
      prompt.error('密钥不能为空',false);
      return  false;
    }   
    window.localStorage.setItem('key',key) 
    setHasKey(true);
    setPrivateKey(key);    
    setPublicKey(recover(key));  
    prompt.inform('保存成功!',false);
    setShow(false);
  }
  
  
  const handleUpdateVerifyCode = e => {
    setForm({...form, ...e});

    if (e.verify_code) {
      setErrors({...errors, verify_code: undefined});
    }
  };


  const handleForm = field => e => {
    setForm({...form, [field]: e.target.value});

    if (e.target.value) {
      setErrors({...errors, [field]: undefined});
    }
  }; 

  const handleBlur = key => () => {
    const _errors = {}; 
    Object.keys(form)
      .filter(f => f !== 'autologin')
      .forEach(field => {
        _errors[field] = !form[field];
      });

    if (Object.keys(_errors).some(e => !!_errors[e])) {
      if (_errors[key]) {
        setErrors(_errors);
      }
    }
  };

  const handleSubmit = () => { 
    if(!privateKey){
      prompt.error('请导入密钥',false);
      return ;
    } 
    const _errors = {}; 
    Object.keys(form)
      .filter(f => f !== 'autologin')
      .forEach(field => {
        _errors[field] = !form[field];
      });

    if (Object.keys(_errors).some(e => !!_errors[e])) {
      setErrors(_errors);
      return ;
    } else { 
      if(form.verifyCode !==form.captchaId){
        prompt.error('验证码不正确',false);
        return ;
      }
    
      if(publicKey ===''){
        prompt.error('私钥格式不正确',false);
        return ;
      }
      
      const signer =form.userName+sm3hashStr(form.password)+publicKey;
      const forCheck = {
        email: form.userName,
        password: sm3hashStr(form.password),
        public_key:publicKey,
        signature:sign(signer,privateKey)
      }  
      loginCheck.run({...forCheck, autologin: undefined}).then(
        res => {  
        if(res.code ===0){
          //timestamp+provider_usernam+provider_publick
          const key =res.data.key;
          const provider_pubkey =res.data.provider_pubkey;
          const provider_signature =res.data.provider_signature;
          const provider_username =res.data.provider_username;
          const timestamp =res.data.timestamp;
          const signMsg = timestamp + provider_username+provider_pubkey;

          const flag = verify(signMsg,provider_signature,provider_pubkey)
          if(!flag){
            prompt.error('登录失败,非法的后端签名');
            return ;
          }
      
          const date=new Date();
          const min=date.getMinutes();
          const curTimestamp = date.getTime();
          const expireTimestamp = date.setMinutes(min+30);

          const curMsg = curTimestamp + form.userName + publicKey   + provider_username + provider_pubkey + expireTimestamp;
          const auth_token = sign(curMsg, privateKey);



          const forLogin = {
            key:key,
            timestamp:curTimestamp + "",
            expired_timestamp:expireTimestamp+ "", 
            auth_token:auth_token

          }
          loginRequest.run({...forLogin}).then(resLogin => { 
              console.log('resLogin',resLogin);
              if(resLogin.code ===0){
                  window.localStorage.setItem('token', resLogin.data.token);  
                  const userInfo = {
                    email:form.userName,
                    publicKey:publicKey,
                    pubprovider_usernameicKey:provider_username,
                    provider_username:provider_username,
                    provider_pubkey:provider_pubkey, 
                    permission:resLogin.data.permission,
                  }
                  window.localStorage.setItem('chain_user',JSON.stringify(userInfo)); 

                  window.location.href = '/';
              }else{
                prompt.error('登录失败,'+resLogin.cnMsg);
              } 
          }) 

        }else{
          if(res.code ===10081){ 
            verifyForm.key=res.data.key;
            verifyForm.email=res.data.email;  
            setShowVerify(true);  
          }
          prompt.error('登录失败,'+res.cnMsg);
        } 
       
      },
      error=>{
        prompt.error('登录错误');
        console.log(error)
      }
      ); 
    }
  }; 
   
  useEffect(()=>{ 
    window.localStorage.removeItem('token'); 
    window.localStorage.removeItem('chain_user');    
    window.dispatchEvent(new Event("event_token"));


    const key = window.localStorage.getItem('key') 
    setPrivateKey(key);  
    if(key){
      setPublicKey(recover(key));
      setHasKey(true);
    } else{
      setHasKey(false);
    }

  },[])
  
  const showError = typeof loginRequest.data?.code !== 'undefined' && loginRequest.data?.code !== 200;


  return (
    <div className="wrapper"> 
      <section className="login-content"> 
          <div className="row align-items-center justify-content-center h-100" style={{display:!showVerify?'flex':'none'}} >
            <div className="col-sm-12 col-md-6 ">
                <div className="card">
                  <div className="card-body"> 
                      <h3 className="mb-3 font-weight-bold text-center">{t('login.tab.title1')}</h3>
                     
                        <div className="row">
                            <div className="col-lg-12">
                              <div className="form-group">
                                  <div className="d-flex justify-content-between align-items-center">
                                      <label className="text-secondary">{t('login.userlogin.Username')}</label> 
                                      <button type="button" className="btn btn-link text-primary  p-0   mr-2"   onClick={e=>{ e.preventDefault();     setShow(true);}} style={{fontSize:'0.875rem'}} >
                                        {t('login.userlogin.importkey')}
                                      </button>  
                                  </div>
                                  
                                  <input  id="txtUserName" type="text"   maxLength="50"
                                      tabIndex="1" className="form-control "   required=""    data-error-class="u-has-error"
                                      data-success-class="u-has-success"   placeholder={t('login.userlogin.Username')}  data-msg="Username is required."
                                      value={form.userName}  onChange={handleForm('userName')}  onBlur={handleBlur('userName')}        />
                                   
                                  {/* 文本导入 begin */}
                                  <Modal show={show} onHide={() => setShow(false)} size="lg"
                                            aria-labelledby="contained-modal-title-vcenter"      centered>
                                      <Modal.Header closeButton className="p-2">
                                          <Modal.Title id="contained-modal-title-vcenter">
                                            导入密钥
                                          </Modal.Title> 
                                      </Modal.Header>
                                      <Modal.Body>
                                          <div className="form-group">
                                              <label htmlFor="privateKey">请输入密钥:</label>
                                              <textarea className="form-control" id="privateKey" rows="3" defaultValue={privateKey}></textarea>
                                          </div> 
                                      </Modal.Body>
                                      <Modal.Footer>
                                          <input type="file" id="txtFile" accept=".pem" style={{display:'none'}}
                                                onClick={(event)=> { event.target.value = null }}  onChange={e=>{handleTxtChange(e)}} />
                                              <input type="file" id="pngFile" accept=".png"  style={{display:'none'}} 
                                              onClick={(event)=> { event.target.value = null }}  onChange={e=>{handlePngChange(e)}} />

                                          <button type="button" className="btn btn-sm btn-danger" onClick={e=>{e.preventDefault();setShow(false);}}>关闭</button>
                                          <button type="button" className="btn btn-sm btn-warning" onClick={e=>clearPrivateKey()}>清空密钥</button>
                                          <button type="button" className="btn btn-sm btn-primary" onClick={e=>uploadTxt()}>上传文件</button>
                                          <button type="button" className="btn btn-sm btn-primary" onClick={e=>uploadPng()}>上传二维码</button>
                                          <button type="button" className="btn btn-sm btn-primary" onClick={e=>savePrivateKey()}  data-dismiss="modal">保存</button>
                                      </Modal.Footer>
                                    </Modal>
                                  
                                  {/* 文本导入 end */} 
                              </div>
                            </div>
                            <div className={`col-lg-12 ${hasKey===true?'d-none':''}`}>
                              <div className="form-group">
                                <div className="d-flex justify-content-between align-items-center">
                                      <label className="text-danger font-weight-bold">密钥</label>  
                                  </div> 
                                  <input  type="password"  disabled={true} tabIndex="1" className="form-control "    value={privateKey}  />
                              </div>
                            </div>

                            <div className="col-lg-12 mt-2">
                              <div className="form-group">
                                  <div className="d-flex justify-content-between align-items-center">
                                      <label className="text-secondary">{t('login.userlogin.Password')}</label>
                                      <label>
                                        <Link to='/forgetpassword'  className="btn btn-link link-muted  p-0 text-primary"   style={{fontSize:'0.875rem'}} >{t('login.userlogin.frogetPassword')}</Link> 
                                      </label>
                                  </div>
                                  <input   type="password"  maxLength="75"  tabIndex="2" className="form-control"  ria-label="********"
                                    required="" data-error-class="u-has-error"  data-success-class="u-has-success"
                                    placeholder={t('login.userlogin.PasswordHolder')}   data-msg="Your password is invalid. Please try again."
                                    value={form.password} onChange={handleForm('password')}  onBlur={handleBlur('password')} />
                              </div>

                              <div className={`js-form-message form-group ${errors.captcha ? 'u-has-error' : ''}`}>
                                <label className="d-block" htmlFor="captcha">
                                  <span className="text-secondary d-flex justify-content-between align-items-center">
                                  {t('login.userlogin.Captcha')} 
                                  </span>
                                </label>
                                <VerifyCode value={form.verifyCode} onChange={handleUpdateVerifyCode} />
                              </div> 
                            </div> 
                        </div>
                        <button  type="button" onClick={handleSubmit} disabled={loginRequest.loading}    className="btn btn-primary btn-block mt-2">{t('login.userlogin.LOGIN')}</button>
                        <div className="col-md-12 mt-3">
                          
                          <p className="mb-0 text-center">{t('login.userlogin.tip1')} 
                              <Link to='/register'  className="text-nowrap" >{t('login.userlogin.tip2')}</Link>             
                          </p>
                          
                        </div> 
                  </div>
                </div>
            </div>
          </div>  
          <VerifyEmial verifyForm={verifyForm}  showVerify={showVerify}  />  
      </section>
     </div> 
  )
} 

export default function Login() { 
  const location = useLocation();  
  const userContext = useContext(UserContext);
  const user = userContext.user || {};

  const logOutRequest = useRequest(
    body => ({
      url: '/chainBrowser/user/login/logout',
      method: 'post',
      headers: { 
        'Content-Type': 'application/json',
      'Authorization': (user.token ||'')
      },
      body: JSON.stringify(body),
    }),
    {manual: true, formatResult: r => r},
  );
  
  useEffect(() => {
    const query = qs.parse(location.search, {ignoreQueryPrefix: true}); 
    if (query.cmd === 'logout') {
      logOutRequest.run().then(res => {  
        window.localStorage.removeItem('token'); 
        window.localStorage.removeItem('chain_user');   
        window.localStorage.removeItem('permission');  
        window.location.href = '/login';
      });  
    }

  }, []);


  return (
    <main id="content" role="main">
      <div className="container space-2">
        <form method="post" className="js-validate w-md-75 w-lg-50 mx-md-auto" noValidate="novalidate"> 
          <UserLogin />  
        </form>
      </div>
    </main>
  );
}
