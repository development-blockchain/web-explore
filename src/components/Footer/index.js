import {useContext} from 'react';

import UserContext from '../../UserContext';
export default function Footer() {
  // const {t} = useTranslation(['common']);

  const userContext = useContext(UserContext);
  const user = userContext.user || {};

  return (
    
    <footer className={`iq-footer ${user.token?'':'ml-0'}`}>
        <div className="container-fluid"> 
                <div className="text-center d-flex justify-content-center"> 
                    <span className="ml-1">
                        Copyright 2023 © By&nbsp;
                        <a href="/">Lian Meng Chain</a>&nbsp;
                         All Rights Reserved.
                    </span>
                </div> 
        </div>
    </footer> 
  );
}
