import {useRequest} from 'ahooks';
import {useLocation, useParams} from 'react-router-dom';
import {useEffect, useState, useRef} from 'react';

import Loading from '../../components/Loading';
 
 
import NetIncrease from './NetIncrease';
import PercentIncrease from './PercentIncrease';
import TotalVolume from './TotalVolume';
import Transactions from './Transactions';
import {useTranslation} from 'react-i18next';

export default function Leaderboard() {
  const {t} = useTranslation(['leaderboard']);
  const {address} = useParams();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState(location.hash.slice(1) || 'netIncrease');  
  const addressRequest = useRequest({
    url: '/blockBrowser/blockChain/contractInternalTrade/contractDetail',
    method: 'post',
    body: JSON.stringify({
      field: 'address',
      value: address,
    }),
  });
 
  if (addressRequest.loading) {
    return <Loading />;
  } 
 
  const overview = addressRequest.data?.contract_overview || {}; 


  const contractTabsConst = [
    {
      key: 'netIncrease',
      title: t('leaderboard.tab.title1'),
      account_type: 2,
    },  {
      key: 'transactions',
      title: t('leaderboard.tab.title2'),
      account_type: 2,
    }, 
    {
      key: 'percentageIncrease',
      title: t('leaderboard.tab.title3'),
      account_type: 2,
    },  {
      key: 'totalVolume',
      title: t('leaderboard.tab.title4'),
      account_type: 2,
    }
  ];


  return (
    <main role="main">
  
      <div className="container">
        <div className="d-md-flex justify-content-between align-items-center py-3">
          <div className="mb-1 mb-md-0">
            <h1 className="h4 font-weight-normal mb-0">
              {t('leaderboard.title')}&nbsp;<span className="small text-secondary"></span>
            </h1>
          </div>
        </div>
      </div>

      <div className="container space-bottom-2">
     
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center p-0">
            <ul className="nav nav-custom nav-borderless nav_tabs1" role="tablist">
              {contractTabsConst.filter(Boolean).map(tab => {
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
                      {typeof tab.title === 'function' ? tab.title(address, overview) : tab.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="card-body">
            <div className="tab-content">
              {currentTab === 'netIncrease' ? <NetIncrease address={address} overview={overview} /> : undefined}
              {currentTab === 'transactions' ? <Transactions address={address} overview={overview} /> : undefined}
              {currentTab === 'percentageIncrease' ? <PercentIncrease address={address} overview={overview} /> : undefined}
              {currentTab === 'totalVolume' ? <TotalVolume address={address} overview={overview} /> : undefined}             
            </div>
          </div>
        </div>
      </div>
      
    </main>
  );
}
