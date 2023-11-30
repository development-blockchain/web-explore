import { useContext, useState } from 'react';
import UserContext from '../../UserContext';

import MonitorKafa from './MonitorKafa';
import MonitorNode from './MonitorNode'; 
import moment from 'moment';

export default function Monitor() { 
     
  const userContext = useContext(UserContext); 
  const [user, setUser] = useState({
    token: userContext.user.token || undefined,
    email:userContext.user.email || undefined,
    key: userContext.user.key || undefined,
    publicKey: userContext.user.publicKey || undefined,
    provider_username: userContext.user.provider_username || undefined,
    provider_pubkey: userContext.user.provider_pubkey || undefined,
  });  
  const defaultLNG = window.localStorage.getItem('lng') || 'zh_CN';
  moment.locale(defaultLNG); 
    
  const [currentTab, setCurrentTab] = useState('monitorNode');  
 
  const contractTabsConst = [
    {
        key: 'monitorNode',
        title: "监控节点"
    },  
    {
        key: 'monitorKafa',
        title: "监控Kafka"
    }
  ];

 
  if (!user.token) {
    return (window.location.href = '/login');
  }   
  return (
    <main id="content" role="main"> 
      <div className="container-fluid space-bottom-2 p-3">
        <div className="card">
          <div className="header-title"> 
            <h4 className="card-title p-2">监控管理&nbsp;</h4> 
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
                  {currentTab === 'monitorNode' ? <MonitorNode   /> : undefined}
                  {currentTab === 'monitorKafa' ? <MonitorKafa   /> : undefined} 
                </div>
              </div>
          </div>
        </div> 
      </div> 
    </main>
  );
}
