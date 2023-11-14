import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
export default function MySideBar({value}) {
  const {t} = useTranslation(['mySideBar']);
  return (
    <div className="col-md-3">
      <div className="list-group list-group-lg mb-3">
       
        <Link to='/myaccount' className={`list-group-item list-group-item-action ${value === 'myaccount' ? 'active' : ''}`}>
            <i className="fa fa-user-md mr-1"></i> 账户信息
        </Link>
       
        <Link to='/modifypassword' className={`list-group-item list-group-item-action ${value === 'modifypassword' ? 'active' : ''}`}>
            <i className="fa fa-lock mr-1"></i> 修改密码
        </Link>

        <Link to='/modifysecretkey' className={`list-group-item list-group-item-action ${value === 'modifysecretkey' ? 'active' : ''}`}>
            <i className="fa fa-user-shield mr-1"></i> 更换密钥
        </Link>
  
      </div> 
    </div>
  );
}
