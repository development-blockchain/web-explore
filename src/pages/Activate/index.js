import {useEffect, useState} from 'react';
import {useRequest} from 'ahooks';
import {useLocation} from 'react-router-dom';
import qs from 'qs';  
import Loading from '../../components/Loading';
import {Link} from 'react-router-dom';
import VerifyCode from '../../components/VerifyCode';
import ConfirmEmail from '../../components/confirmEmail';
import VerifyEmial from '../../components/VerifyEmail';

export default function Activate() {

    const location = useLocation();
    const query = qs.parse(location.search, {ignoreQueryPrefix: true});
 
    const [errors, setErrors] = useState({});
    const [showVerify, setShowVerify] = useState(false);
    const [form, setForm] = useState({
      email: '',
      key:'',
      captchaId: '',
      verifyCode: '',
    });

    const [state, setState] = useState({
      body: {
        token: query.token
      },
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
      const emailREG = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/gi;
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

    const reSendEmail = () => {
      const formEncrpty = {
        email: form.email,
        key: form.key
      }

      resendEmailRequest.run({...formEncrpty}).then(res => {
        if (res.code === 0) {
            prompt.inform(res.cnMsg) 
            setShowVerify(true);
        }else{
          prompt.error(res.cnMsg);
        }
      });
    };


    const resendEmailRequest = useRequest(
      body => ({
        url: '/chainBrowser/user/login/resendActiveMail',
        method: 'post',
         headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      }),
      {manual: true, formatResult: r => r},
    );


    const activedRequest = useRequest(
        body => ({
        url: '/chainBrowser/user/login/activeAccount',
        method: 'post',    
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(body),
        }),
        {manual: true, formatResult: r => r},
    ); 
    useEffect(() => {
        activedRequest.run(state.body).then(res => {
          if (res.code === 0) {
              prompt.inform("激活成功!");
          }else{
              prompt.error(res.cnMsg);
          }
        });
    }, [state]);

    if (activedRequest.loading) { 
        return <Loading />;
    } 

    const activedRequestData = activedRequest.data || {};

    if(!activedRequest.loading){ 
      form.email = activedRequestData?.data?.email ||'';
      form.key = activedRequestData?.data?.key||'';
    }
 
     
    const showError =  typeof activedRequestData?.code !== 'undefined' && activedRequestData?.code !== 0;
 
  return (
    <div className="wrapper"> 
        <section className="login-content">
          <div className="container-fluid">  
             {/*  <div className="row align-items-center justify-content-center h-100">
                <div className="col-sm-12 col-md-6">
                    <div className="card">
                      <div className="card-body">
                          <div className="mb-2" style={{display: showError ? 'block' : 'none'}}>
                              <h3 className="mb-3 font-weight-bold text-center">
                                 激活账户
                              </h3> 
                          </div>
                          <div className="alert alert-danger" style={{display: showError ? 'block' : 'none'}}>
                            {activedRequest.data?.cnMsg}
                          </div>
                          <div style={{display: showError ? 'block' : 'none'}}>
                            <div className={`js-form-message form-group ${errors.email ? 'u-has-error' : ''}`}>
                              <label className="d-block" htmlFor="email">
                                 邮箱
                              </label>
                              <input  name="email"  id="email"  className="form-control "
                                type="email"  required=""   data-error-class="u-has-error"    data-success-class="u-has-success"
                                placeholder="请输入邮箱地址"   data-msg="Please enter your valid email address"
                                value={form.email} onChange={handleForm('email')}   onBlur={handleBlur('email')}   />
                              <div className="invalid-feedback" style={{display: errors.email ? 'block' : 'none'}}> 
                                请输入有效的邮箱地址
                              </div>
                            </div>
                            <div className={`js-form-message form-group ${errors.verify_code ? 'u-has-error' : ''}`}>
                              <label className="d-block" htmlFor="txtEmail">
                                验证码
                              </label>
                              <VerifyCode value={form.verify_code} onChange={handleUpdateVerifyCode} />
                              <div className="invalid-feedback" style={{display: errors.verify_code ? 'block' : 'none'}}>
                                 验证码无效
                              </div>
                            </div>
                            <div>
                              <button type="button" onClick={handleSubmit} disabled={resendEmailRequest.loading}
                               className="btn btn-block btn-primary">重发邮件</button>
                            </div>
                          </div> 
                          

                      </div>
                    </div>
                </div>
                 <ConfirmEmail showVerify= {activedRequestData?.code===0?true:false}/>
                 <VerifyEmial verifyForm={form} showVerify= {activedRequestData?.code===0?true:false}/>
              </div>   
              */}

            <div className="row align-items-center justify-content-center h-100" style={{display:showVerify?'none':'flex'}} >
                <div className="col-sm-12 col-md-6">
                    <div className="card">
                      <div className="card-body">
                          <div className="row align-items-center">
                              <div className="col-lg-12 text-center"> 
                                  <svg  className="icon" viewBox="0 0 1365 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4932" width="64" height="64"><path d="M1112.00000029 62a150.00000029 150.00000029 0 0 1 149.99999942 150.00000029v599.99999942a150.00000029 150.00000029 0 0 1-149.99999942 150.00000029H212.00000029a150.00000029 150.00000029 0 0 1-150.00000029-150.00000029V212.00000029a150.00000029 150.00000029 0 0 1 150.00000029-150.00000029h900z m0 74.99999971H212.00000029a74.99999971 74.99999971 0 0 0-75.00000058 75.00000058v599.99999942a74.99999971 74.99999971 0 0 0 75.00000058 75.00000058h900a74.99999971 74.99999971 0 0 0 74.99999971-75.00000058V212.00000029a74.99999971 74.99999971 0 0 0-74.99999971-75.00000058z m-98.1 171.60000029a29.025 29.025 0 0 1 40.5 7.425 28.95000029 28.95000029 0 0 1-7.2 40.34999971l-374.25000058 259.65a28.72500029 28.72500029 0 0 1-33.22499942 0L276.27499971 364.10000029a29.025 29.025 0 1 1 33.00000029-47.77500058l347.02499971 240.37500058z" fill="#1296db" p-id="4933"></path></svg>
                                  <h4 className="mt-3 mb-0">邮箱确认</h4>
                                  <div style={{display: !showError ? 'block' : 'none',lineHeight:'2',textIndent:'1.5rem'}}>
                                    <div className="alert alert-warning mt-3 justify-content-center p-2 " style={{lineHeight:'1.5'}}>
                                        帐户验证成功。您的帐户已经过验证。
                                    </div> 
                                    <p className="mb-2 text-center" style={{lineHeight:'2',textIndent:'1.5rem'}}>
                                        您可以使用您的邮箱和密码继续登录。  
                                        <Link to='/login'   className="text-nowrap" >
                                            去登录
                                        </Link>  
                                    </p>   
                                  </div> 
                                  <div style={{display: showError ? 'block' : 'none'}}>
                                    <div className="alert alert-danger" style={{display: showError ? 'block' : 'none'}}>
                                      {activedRequestData?.cnMsg}
                                    </div>
                                    <div className="d-inline-block w-100">
                                        <button type="button"  className="btn btn-block btn-primary" onClick={e=>reSendEmail()}>重发邮件</button>
                                    </div>

                                  </div>
                                
                              </div>
                          </div>
                      </div>
                    </div>
                </div>
            </div>

            <VerifyEmial verifyForm={form} showVerify={showVerify}  /> 


          </div>
        </section>
    </div>
     
  );
}
