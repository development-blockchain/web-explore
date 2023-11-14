import {useRequest} from 'ahooks';
import {useLocation, useParams} from 'react-router-dom';
import {useEffect, useState, useRef} from 'react';

import Loading from '../../components/Loading';
 
 
import DashboardReq from './DashboardReq';
import Domain from './Domain';
import Upsteamhost from './Upsteamhost';
import Ethereumrpc from './Ethereumrpc';
import {useTranslation} from 'react-i18next';


export default function NodeLogs() { 
  const {t} = useTranslation(['nodeLogs']);
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState(location.hash.slice(1) || 'dashboard');  
 

  const NodeLogTabsConst = [
    {
      key: 'dashboard',
      title: t('nodeLogs.tab.dashboard') 
    },  {
      key: 'domain',
      title: t('nodeLogs.tab.domain') 
    }, 
    {
      key: 'upstreamhost',
      title: t('nodeLogs.tab.upstreamhost') 
    },  {
      key: 'ethereumrpc',
      title: t('nodeLogs.tab.ethereumrpc') 
    }
  ];


  return (
    <main role="main"> 
      <div className="container">
        <div className="d-md-flex justify-content-between align-items-center py-3">
          <div className="mb-1 mb-md-0">
            <h1 className="h4 font-weight-normal mb-0">
              {t('nodeLogs.title')}&nbsp;<span className="small text-secondary"></span>
            </h1>
          </div>
        </div>
      </div>

      <div className="container space-bottom-2">
     
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center p-0">
            <ul className="nav nav-custom nav-borderless nav_tabs1" role="tablist">
              {NodeLogTabsConst.filter(Boolean).map(tab => {
                return (
                  <li className="nav-item" key={tab.key}>
                    <a
                      className={`nav-link ${tab.key === currentTab ? 'active' : ''}`}
                      href={`#${tab.key}`}
                      data-toggle="tab"
                      onClick={() => {
                        setCurrentTab(tab.key);
                      }}
                    >
                      {tab.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="card-body">
            <div className="tab-content">
              {currentTab === 'dashboard' ? <DashboardReq /> : undefined}
              {currentTab === 'domain' ? <Domain/> : undefined}
              {currentTab === 'upstreamhost' ? <Upsteamhost /> : undefined}
              {currentTab === 'ethereumrpc' ? <Ethereumrpc /> : undefined}             
            </div>
          </div>
        </div>
      </div>
      
    </main>
  );
}
