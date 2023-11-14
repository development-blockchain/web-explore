import {useState} from 'react';
import {useRequest} from 'ahooks'; 
import VerifyCode from '../../components/VerifyCode'; 
import {Link} from 'react-router-dom'; 
import VerifyEmail2 from '../../components/VerifyEmail2'; 

export default function ForgetPassword() { 
  
  const [verifyForm, setVerifyForm] = useState({email:'' }); 
  const [showVerify, setShowVerify] = useState(false); 

  const resetPwdRequest = useRequest(
    body => ({
      url: '/chainBrowser/user/login/requestResetPassword',
      method: 'post',
       headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(body),
    }),
    {manual: true, formatResult: r => r},
  );

  const [form, setForm] = useState({
    email: '',
    captchaId: '',
    verifyCode: '',
  });


  const [errors, setErrors] = useState({});

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
    const emailREG = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    const _errors = {};

    Object.keys(form).forEach(field => {
      _errors[field] = !form[field];
    });

    if (!_errors.email && !emailREG.test(form.email)) {
      _errors.email = true;
    }

    if (Object.keys(_errors).some(e => !!_errors[e])) {
      if (_errors[key]) {
        setErrors(_errors);
      }
    }
  };

  const handleSubmit = () => {
    const emailREG = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/gi;
    const _errors = {};

    Object.keys(form).forEach(field => {
      _errors[field] = !form[field];
    });

    if (!_errors.email && !emailREG.test(form.email)) {
      _errors.email = true;
    }else{
      _errors.email = false;
    }

    if(form.verifyCode !== form.captchaId){
      _errors.verify_code = true;
    }else{
      _errors.verify_code = false;
    }

    if (Object.keys(_errors).some(e => !!_errors[e])) {
      setErrors(_errors);
    } else {
        const formEncrpty = {
            email: form.email 
          } 
          resetPwdRequest.run({...formEncrpty}).then(
            res => { 
              if (res.code === 0) {
                  prompt.inform(res.cnMsg);
                  setShowVerify(true);
              } 
            },
            err=>{
              console.log('网络错误,',err);
              prompt.error("网络错误！");
            }
          );
    }
  };

  const showSuccess = typeof resetPwdRequest.data?.code !== 'undefined' && resetPwdRequest.data?.code === 0;
  const showError = typeof resetPwdRequest.data?.code !== 'undefined' && resetPwdRequest.data?.code !== 0;

  return (
    <div className="wrapper"> 
        <section className="login-content">
            <div className="container-fluid">
                <div className="row align-items-center justify-content-center h-100"  style={{display:showVerify?'none':'flex'}} >
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body"> 
                                <form method="post" className="js-validate w-md-50 mx-md-auto" noValidate="novalidate">
                                    <div className="mb-2">
                                      <h3 className="mb-3 font-weight-bold text-center">
                                        忘记密码
                                      </h3> 
                                    </div>
                                     
                                    <div className="alert alert-danger" style={{display: showError ? 'block' : 'none'}}>
                                        {resetPwdRequest.data?.cnMsg}
                                    </div>
                                    <div className={`js-form-message form-group ${errors.email ? 'u-has-error' : ''}`}>
                                        <label className="d-block" htmlFor="txtEmail">
                                        邮箱
                                        </label>
                                        <input  name="txtEmail"  id="txtEmail"  className="form-control"
                                        type="email"   tableindex ={1}
                                        placeholder="请输入邮箱"  data-msg="请输入有效的邮箱地址"
                                        value={form.email} onChange={handleForm('email')}  onBlur={handleBlur('email')}
                                        />
                                        <div className="invalid-feedback" style={{display: errors.email ? 'block' : 'none'}}> 
                                          请输入有效的邮箱地址
                                        </div>
                                    </div>
                                    <div className={`js-form-message form-group ${errors.verify_code ? 'u-has-error' : ''}`}>
                                        <label className="d-block" htmlFor="txtCaptcha">
                                          验证码
                                        </label>
                                        <VerifyCode value={form.verify_code} onChange={handleUpdateVerifyCode} />
                                        <div className="invalid-feedback" style={{display: errors.verify_code ? 'block' : 'none'}}>
                                          验证码无效
                                        </div>
                                    </div>

                                    <div id="ContentPlaceHolder1_div4" className="d-flex justify-content-center align-items-center my-4"></div>
                                    <div id="ContentPlaceHolder1_div3" className="row align-items-center">
                                        <div className="col-4 col-sm-6">
                                            <Link to='/login'  className="text-nowrap" >
                                              去登录
                                            </Link>  
                                        </div>
                                        <div className="col-8 col-sm-6 text-right">
                                            <input type="button" onClick={handleSubmit} disabled={resetPwdRequest.loading} value="发送邮件" className="btn btn-primary" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <VerifyEmail2 verifyForm={verifyForm} showVerify={showVerify}  />   
          </div>
        </section>
    </div> 
  );
}
