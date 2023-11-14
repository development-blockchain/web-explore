import {useState} from 'react';
import {useRequest} from 'ahooks';
import { encrypt } from '../../commons/utils';
import VerifyCode from '../../components/VerifyCode';

export default function LostPassword() {
  const resendEmailRequest = useRequest(
    body => ({
      url: '/loginapi/sys/user/resendEmail',
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

  const handleSubmit = () => {
    const emailREG = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/gi;
    const _errors = {};

    Object.keys(form).forEach(field => {
      _errors[field] = !form[field];
    });

    if (!_errors.email && !emailREG.test(form.email)) {
      _errors.email = true;
    }

    if (Object.keys(_errors).some(e => !!_errors[e])) {
      setErrors(_errors);
    } else {
        const formEncrpty = {
            email: encrypt(form.email),
            captchaId: encrypt(form.captchaId),
            verifyCode: encrypt(form.verifyCode),
          }

          resendEmailRequest.run({...formEncrpty}).then(res => {
        if (res.code === 200) {
            prompt.inform('Resend success, please login email and actived the account')
        }
      });
    }
  };

  const showSuccess = typeof resendEmailRequest.data?.code !== 'undefined' && resendEmailRequest.data?.code === 200;
  const showError = typeof resendEmailRequest.data?.code !== 'undefined' && resendEmailRequest.data?.code !== 200;

  return (
    <main id="content" className="bg-light content-height" role="main">
      <div className="container space-2">
        <form method="post" className="js-validate w-md-50 mx-md-auto" noValidate="novalidate">
          <div className="mb-4">
            <h1 className="h3 text-primary font-weight-normal mb-0">Resend your email</h1>
            <p id="ContentPlaceHolder1_pEnterEmailAddress">Enter your email address below and we'll resend email.</p>
          </div>
          <div className="alert alert-success" style={{display: showSuccess ? 'block' : 'none'}}>
            <h4 className="alert-heading h5">Your request was successful.
             Please check your email inbox now. Activate your account by clicking the button in the email from Hscan.</h4>  
          </div>
          <div className="alert alert-danger" style={{display: showError ? 'block' : 'none'}}>
            {resendEmailRequest.data?.message}
          </div>
          <div className={`js-form-message form-group ${errors.email ? 'u-has-error' : ''}`}>
            <label className="d-block" htmlFor="TextBox1">
              Email Address
            </label>
            <input
              name="ctl00$ContentPlaceHolder1$TextBox1"
              id="ContentPlaceHolder1_TextBox1"
              className="form-control form-control-sm"
              type="email"
              required=""
              data-error-class="u-has-error"
              data-success-class="u-has-success"
              placeholder="Email Address"
              data-msg="Please enter your valid email address"
              value={form.email}
              onChange={handleForm('email')}
              onBlur={handleBlur('email')}
            />
            <div className="invalid-feedback" style={{display: errors.email ? 'block' : 'none'}}>
              Please enter your valid email address
            </div>
          </div>
          <div className={`js-form-message form-group ${errors.verify_code ? 'u-has-error' : ''}`}>
            <label className="d-block" htmlFor="txtEmail">
              Captcha
            </label>
            <VerifyCode value={form.verify_code} onChange={handleUpdateVerifyCode} />
            <div className="invalid-feedback" style={{display: errors.verify_code ? 'block' : 'none'}}>
              Captcha is invalid.
            </div>
          </div>

          <div id="ContentPlaceHolder1_div4" className="d-flex justify-content-center align-items-center my-4"></div>
          <div id="ContentPlaceHolder1_div3" className="row align-items-center">
            <div className="col-4 col-sm-6">
              <a className="link-muted" href="login">
                Back to Login
              </a>
            </div>
            <div className="col-8 col-sm-6 text-right">
              <input type="button" onClick={handleSubmit} disabled={resendEmailRequest.loading} value="Resend Email" className="btn btn-sm btn-primary" />
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
