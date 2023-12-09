import { useState } from 'react';
 
import Toast from "react-toast-mobile";
import "react-toast-mobile/lib/react-toast-mobile.css";
 
export default function PublishContract({user}){  
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        code: '',
        abi: '' 
      }); 
  
    const handleForm = field => e => {
        setForm({...form, [field]: e.target.value});

        if (e.target.value) {
          setErrors({...errors, [field]: undefined});
        }  
    };  

    const handleBlur = key => () => {
        const _errors = {}; 
        Object.keys(form) 
          .forEach(field => {
            _errors[field] = !form[field];
          });
    
        if (Object.keys(_errors).some(e => !!_errors[e])) {
          if (_errors[key]) {
            setErrors(_errors);
          }
        }
    };
    const deployContract = ()=>{

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
    return ( 
    <div className="row"> 
        <div className="col-md-12"> 
            <div className={` form-group js-form-message form-group ${errors.code ? 'u-has-error' : ''}`}>  
                <label htmlFor="msg">编码:</label>
                <input id="code" name="code" type="text"  maxLength="75"  className="form-control"  
                    value={form.code}     onChange={handleForm('code')}  onBlur={handleBlur('code')}        />
                <div className="invalid-feedback" style={{display: errors.code ? 'block' : 'none'}}> 
                    请输入编码
                </div>
            </div>  
            <div className={` form-group js-form-message form-group ${errors.abi ? 'u-has-error' : ''}`}>  
                <label htmlFor="msg">ABI:</label>
                <textarea class="form-control" id="abi" name="abi" rows="8" 
                value={form.abi}     onChange={handleForm('abi')}  onBlur={handleBlur('abi')}  ></textarea>
                <div className="invalid-feedback" style={{display: errors.abi ? 'block' : 'none'}}> 
                    请输入ABI
                </div>
            </div>  
            <button type="button"   className="btn btn-primary  mt-2" onClick={debounce(deployContract)} >
                部署合约
            </button>    
        </div>
        <Toast/> 
    </div> 
    )
}