import {useState} from 'react';
import {useRequest} from 'ahooks';

import VerifyCode from '../../components/VerifyCode';

export default function LostPassword() {
  const lostPasswordRequest = useRequest(
    body => ({
      url: '/blockBrowser/user/login/lostPassword',
      method: 'post',
      body: JSON.stringify(body),
    }),
    {manual: true, formatResult: r => r},
  );
  const [form, setForm] = useState({
    email: '',

    captcha_id: '',
    verify_code: '',
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

    if (e.verify_code) {
      setErrors({...errors, verify_code: undefined});
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
      lostPasswordRequest.run({...form}).then(res => {
        if (res.code === 0) {
        }
      });
    }
  };

  const showSuccess = typeof lostPasswordRequest.data?.code !== 'undefined' && lostPasswordRequest.data?.code === 0;
  const showError = typeof lostPasswordRequest.data?.code !== 'undefined' && lostPasswordRequest.data?.code !== 0;

  return (
    <main id="content" className="bg-light content-height" role="main">
      <div className="container space-2">
        <form method="post" className="js-validate w-md-50 mx-md-auto" noValidate="novalidate">
          <div className="mb-4">
            <h1 className="h3 text-primary font-weight-normal mb-0">Forgot your password?</h1>
            <p id="ContentPlaceHolder1_pEnterEmailAddress">Enter your email address below and we'll get you back on track.</p>
          </div>
          <div className="alert alert-success" style={{display: showSuccess ? 'block' : 'none'}}>
            <h4 className="alert-heading h5">You've successfully requested a forgot password.</h4>
            <p className="alert-text mb-2">If the email address belongs to a known account, a recovery password will be sent to you within the next few minutes.</p>
            <ul className="mb-0">
              <li className="mb-2">If you have yet to receive the "Password Recovery" email, please check your spam/junk email folders</li>
              <li>Or you may request for a new password reset after 15 minutes.</li>
            </ul>
          </div>
          <div className="alert alert-danger" style={{display: showError ? 'block' : 'none'}}>
            {lostPasswordRequest.data?.cnMsg}
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
                Back to sign in
              </a>
            </div>
            <div className="col-8 col-sm-6 text-right">
              <input type="button" onClick={handleSubmit} disabled={lostPasswordRequest.loading} value="Reset Password" className="btn btn-sm btn-primary" />
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
