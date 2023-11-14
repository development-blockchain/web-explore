import {useState, useContext,useEffect} from 'react';
import {useRequest} from 'ahooks';
import MySideBar from '../../components/MySideBar';
import UserContext from '../../UserContext';
import { encrypt } from '../../commons/utils';

export default function MyAccount() {
    const userContext = useContext(UserContext);

    const user = userContext.user || {};
 
  
    const [fields, setFields] = useState({
      email: '',
      user_name:''
    });

    const [passwordForm,setPasswordForm]=useState({
      oldPassword:'',
      password:'',
      password2:'',
      ismatch:'true'
    })

    const [errors, setErrors] = useState({});

    const [errors2, setErrors2] = useState({});

    //显示消息
    // const [showMsg, setShowMsg] = useState(false);
    // //是否成功消息
    // const [isSuccess, setIsSuccess] = useState(false);
    // const [msg, SetMsg] = useState('');
  
    const handleForm = field => e => {
      const target = e.target;  
      const value = target.type === 'checkbox' ? target.checked : target.value;  
      setFields({...fields, [field]: value}); 
      if (e.target.value ) {
        setErrors({...errors, [field]: undefined});
      }
    };  
    const handleBlur = key => () => {
      const _errors = {};
      Object.keys(fields).filter(f => f !== 'autologin')
       .forEach(field => {
          _errors[field] = !fields[field];
        });
      if (Object.keys(_errors).some(e => !!_errors[e])) {
        if (_errors[key]) {
          setErrors(_errors);
        }
      }  
    }; 

    
    const handlePassword = field=>e=>{
      
      setPasswordForm({...passwordForm, [field]: e.target.value});

      if (e.target.value) {
        setErrors2({...errors2,[field]: undefined});
      }else{
        setErrors2({...errors2,[field]: true});
      }


    }
     

    const handlePasswordSubmit = () => {
      const _errors = {}; 
      Object.keys(passwordForm) 
        .forEach(field => {
          _errors[field] = !passwordForm[field];
        });
  
      if (Object.keys(_errors).some(e => !!_errors[e])) {
        setErrors2(_errors);
      } else { 

        if(passwordForm.password && passwordForm.password2 &&passwordForm.password !==passwordForm.password2){ 
          setErrors2({ismatch: true});
          return ;
        }else{
          setErrors2({ismatch: undefined});
        }


        const formEncrpty = {
          oldPassword: encrypt(passwordForm.oldPassword),
          password: encrypt(passwordForm.password),
          password2: encrypt(passwordForm.password2) 
        }
        editPasswordRequest.run({...formEncrpty, autologin: undefined}).then(res => {  
          if (res.code !== 200) {
            // setIsSuccess(false)
            // setShowMsg(true)
            // SetMsg(res.message) 
            prompt.error(res.message); 
          } else { 
            setPasswordForm({oldPassword:'',password:'',password2:''});
            // setIsSuccess(true)
            // setShowMsg(true)
            // SetMsg(res.message) 
            prompt.inform(res.message); 
          } 
        });
      }
    };


    const editEmailRequest = useRequest(
      body => ({
        url: '/loginapi/sys/user/editEmail',
        method: 'post',
        headers: { 
          'Content-Type': 'application/json',
          'X-Access-Token': (user.token ||'')
        },
        body: JSON.stringify(body),
      }),
      {manual: true},
    );

    const editPasswordRequest = useRequest(
      body => ({
        url: '/loginapi/sys/user/editPassword',
        method: 'post',
        headers: { 
          'Content-Type': 'application/json',
          'X-Access-Token': (user.token ||'')
        },
        body: JSON.stringify(body),
      }),
      {manual: true},
    );


    const onEmailSave = () => {
      const _errors = {}; 
      Object.keys(fields) 
        .forEach(field => {
          _errors[field] = !fields[field];
        });
  
      if (Object.keys(_errors).some(e => !!_errors[e])) {
        setErrors(_errors);
      } else { 
        const formEncrpty = { 
          email: encrypt(fields.email), 
        }
        editEmailRequest.run({...formEncrpty, autologin: undefined}).then(res => {   
          if (res.code !== 200) {
            prompt.error(res.message); 
            // setIsSuccess(false)
            // setShowMsg(true)
            // SetMsg(res.message) 
          } else { 
            prompt.inform(res.message); 
            // setIsSuccess(true)
            // setShowMsg(true)
            // SetMsg(res.message) 
          }
        },
        err=>{
          console.log(err);
        }); 
 
      }
    };


    useEffect(() => {
      setFields({...fields,email: user.email||'', user_name:user.user_name||'' })
    }, [user]);

    if (!user.token) {
      return (window.location.href = '/login');
    }    
    
 
    return (
      <main role="main">
        <div className="container space-1">
          <div className="row">
            <MySideBar value="mysettings" />
            <div className="col-md-9">

              <div className="card mb-4">

                {/* <div className={`alert ${isSuccess === true ? 'alert-success' : 'alert alert-danger'} `} style={{display: showMsg ? 'block' : 'none'}}>
                  <div className="mr-3">
                    <strong>Status:</strong>{msg}
                  </div>
                </div> */}

                <div className="card-header d-flex justify-content-between align-items-center">
                  <h3 className="h5 text-dark mb-0">User Settings</h3>
                </div>

                <div className="card-body">
                  <p className="text-dark mb-4">Below are the username, email and overview information for your account.</p>
                  <div className="row align-items-baseline">
                    <div className="col-md-4 mb-1 mb-md-0">
                      <i className="fal fa-user-circle fa-fw text-secondary mr-2"></i>Your username:
                    </div>
                    <div className="col-md-8">
                      <strong>{user.user_name}</strong>
                    </div>
                  </div>
                  <hr/>
                  <div className="row align-items-baseline">
                    <div className="col-md-4 mb-1 mb-md-0">
                      <i className="fal fa-envelope fa-fw text-secondary mr-2"></i>Your email address:
                    </div>
                    <div className="col-md-8">
                      <input name="txtEmail" value={fields.email} id="txtEmail" placeholder="Email address"  
                      className="form-control" type="email"  onChange={handleForm('email')}  onBlur={handleBlur('email')}   />

                      <div id="divEmail_Error" className="invalid-feedback"  style={{display: errors.email ? 'block' : 'none'}} >
                        Please enter your valid email address
                      </div>

                    </div>
                  </div>

                </div>

                <div className="card-footer d-flex justify-content-end">
                  <a className="btn btn-sm btn-white font-size-base mr-2" href="/mysettings">Cancel</a> 
                  <input type="button" className="btn btn-sm btn-primary font-size-base" value="Save Changes" onClick={onEmailSave}  />
                </div> 

              </div>

              <div className="card mb-4">

                <div className="card-header d-flex justify-content-between align-items-center">
                  <h3 className="h5 text-dark mb-0">Password</h3>
                </div>

                <div className="card-body">
                  <p className="text-dark mb-4">Edit the fields below to update your password.</p>
                  <div className="row align-items-baseline">
                    <div className="col-md-4 mb-1 mb-md-0">
                      <i className="fal fa-lock-alt fa-fw text-secondary mr-2"></i>Enter OLD password
                    </div>
                    <div className="col-md-8">
                      <input name="txtOldPassword" id="txtOldPassword" type="password" placeholder="Password" value={passwordForm.oldPassword} className="form-control" 
                        onChange={handlePassword('oldPassword')}    />
                      <div id="divOldPass_Error" className="invalid-feedback" style={{display: errors2.oldPassword ? 'block' : 'none'}}>
                        Please enter your old password
                      </div>
                    </div>
                  </div> 
                  <hr/>

                  <div className="row align-items-baseline">
                    <div className="col-md-4 mb-1 mb-md-0">
                      <i className="fal fa-lock-alt fa-fw text-secondary mr-2"></i>Enter NEW password
                    </div>
                    <div className="col-md-8">
                      <input name="txtPassword" id="txtPassword" type="password" placeholder="Password" value={passwordForm.password}  className="form-control" 
                        onChange={handlePassword('password')}    />
                      <div id="divNewPass_Error" className="invalid-feedback" style={{display: errors2.password ? 'block' : 'none'}}>
                        Please enter your new password
                      </div>
                    </div>
                  </div> 
                  <hr/>

                  <div className="row align-items-baseline">
                    <div className="col-md-4 mb-1 mb-md-0">
                      <i className="fal fa-lock-alt fa-fw text-secondary mr-2"></i>Re-Confirm password
                    </div>
                    <div className="col-md-8">
                      <input name="txtPassword2" id="txtPassword2" type="password" value={passwordForm.password2}  placeholder="Confirm password"
                      className="form-control"  onChange={handlePassword('password2')}  />

                      <div id="divReTypeNewPass_Error" className="invalid-feedback" style={{display: errors2.password2 ? 'block' : 'none'}}>
                        Please re-enter your new password
                      </div>

                      <div id="divCompareNewPass_Error" className="invalid-feedback" style={{display: errors2.ismatch ? 'block' : 'none'}}>
                        Passwords do not match
                      </div>

                    </div>
                  </div>

                  <div className="card-footer d-flex justify-content-end">
                    <a className="btn btn-sm btn-white font-size-base mr-2" href="/mysettings">Cancel</a>                  
                    <input type="button" className="btn btn-sm btn-primary font-size-base" value="Save Changes"  onClick={handlePasswordSubmit} />
                  </div>

                </div>


              </div>

            </div>
          </div>
        </div>
      </main>
    );
  }
  