import {useState,useCallback} from 'react'; 
import {useTranslation} from 'react-i18next';
import Captcha from 'react-captcha-code';

export default function VerifyCode({value, onChange,handleBlur}) {
  const {t} = useTranslation(['login']);  
  const [captcha, setCaptcha] = useState(''); 
  const handleChange = useCallback((captcha) => {
    console.log('captcha:', captcha);
    setCaptcha(captcha);
  }, []);  
  return (
    <div style={{display:'flex'}}>
      <input maxLength="100"  className="form-control"  autoComplete="off"
        type="text"  placeholder={t('login.userlogin.CaptchaHoler')}   tabIndex="6"  value={value}
        onChange={e => {
          onChange({
            captchaId: captcha,
            verifyCode: e.target.value,
          });
        }}
        onBlur= {handleBlur}
      />
      <Captcha  charNum={4} onChange={handleChange} height={30} />  
    </div>
  );
}
