import UserContext from '../../UserContext'; 
import { useContext, useEffect, useState } from 'react';

import ReadPlain from './readPlain';
import ReadCipher from './readCipher';


export default function ReadTx() {  
    const userContext = useContext(UserContext); 
    const [user, setUser] = useState({
      token: userContext.user.token || undefined,
      email:userContext.user.email || undefined,
      key: userContext.user.key || undefined,
      publicKey: userContext.user.publicKey || undefined,
      provider_username: userContext.user.provider_username || undefined,
      provider_pubkey: userContext.user.provider_pubkey || undefined,
      tdh2_pubkey: userContext.user.tdh2_pubkey || undefined,
      user_id: userContext.user.user_id || undefined,
    });   

    const [currentTab, setCurrentTab] = useState('readPlain');  
 
    const contractTabsConst = [
      {
          key: 'readPlain',
          title: "读明文交易"
      },  
      {
          key: 'readCipher',
          title: "读密文交易"
      }
    ];

    if (!user.token){
        return (window.location.href = '/login');
    }  

    return (
        <main id="content" role="main"> 
            <div className="container-fluid space-bottom-2 p-3">
                <div className="card">
                <div className="header-title"> 
                    <h4 className="card-title p-2">读交易&nbsp;</h4> 
                </div> 
                <div className="card p-1"> 
                    <div className="card-header d-flex justify-content-between align-items-center p-0">
                        <ul className="nav nav-tabs" role="tablist"> 
                            {contractTabsConst.filter(Boolean).map(tab => {
                                return (
                                <li className="nav-item" key={tab.key}>
                                    <a className={`nav-link ${tab.key === currentTab ? 'active' : ''}`}  href={`#${tab.key}`}  data-toggle="tab"  onClick={() => {  setCurrentTab(tab.key); }} >
                                        {tab.title}
                                    </a>
                                </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="card-body">
                        <div className="tab-content">
                        {currentTab === 'readPlain' ? <ReadPlain user={user}   /> : undefined}
                        {currentTab === 'readCipher' ? <ReadCipher user={user}  /> : undefined} 
                        </div>
                    </div>
                </div>
                </div> 
            </div> 
        </main> 
    );
}
