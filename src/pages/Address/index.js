import {useRequest} from 'ahooks';
import {useLocation, useParams} from 'react-router-dom';
import {useEffect, useState, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import Loading from '../../components/Loading';

import Events from './Events';
import Header from './Header';
import Overview from './Overview';
import Tokentxns from './Tokentxns';
import TokentxnsErc721 from './TokentxnsErc721';
import Transactions from './Transactions';
import Internaltx from './Internaltx';
import ValidatedBlocks from './ValidatedBlocks';
import ValidatorsSetInfo from './ValidatorsSetInfo';
import Contracts from './Contracts';
import Analytics from './Analytics';
import MoreInfo from './MoreInfo';

export default function Address() {
  const {address} = useParams();
  const location = useLocation();

  const {t} = useTranslation(['address']);
  

  const [currentTab, setCurrentTab] = useState(location.hash.slice(1) || 'transactions'); // transactions, tokentxns, contracts, events, uncle, analytics
  const addressRequest = useRequest({
    url: '/blockBrowser/blockChain/contractInternalTrade/contractDetail',
    method: 'post',
    body: JSON.stringify({
      field: 'address',
      value: address,
    }),
  });
  const holdingListRequest = useRequest({
    url: '/blockBrowser/blockChain/contractInternalTrade/holdingList',
    method: 'post',
    body: JSON.stringify({
      start: '1',
      length: '50',
      field: 'address',
      value: address,
    }),
  });



  if (addressRequest.loading) {
    return <Loading />;
  }
 
  
 
  const overview = addressRequest.data?.contract_overview || {};
  const holding_counts = holdingListRequest.data?.counts || 0;
  const holding_list = holdingListRequest.data?.holding_list || [];



  const contractTabsConst = [
    {
      key: 'transactions',
      title:  t('address.index.tab.title1'),
      account_type: 2,
    },
    overview.is_inside_trade
      ? {
          key: 'internaltx',
          title:  t('address.index.tab.title2'),
          account_type: 2,
        }
      : undefined,
    {
      key: 'tokentxns',
      title:  t('address.index.tab.title3'),
      account_type: 2,
    },
    // 合约类型：0-不是，1-erc20 2-erc721，3-其他类型
    overview.contract_type === 2
      ? {
          key: 'tokentxnsErc721',
          title:  t('address.index.tab.title4'),
          account_type: 2,
        }
      : undefined,
    overview.is_validator
      ? {
          key: 'mine',
          title: 'Validated Blocks',
          account_type: 2,
        }
      : undefined,
    overview.is_validator
      ? {
          key: 'validatorset',
          title: 'Validators Set Info',
          account_type: 2,
        }
      : undefined,
    // 账户类型:0-不是，1-account 2-contract （针对account外部账户，不要显示Contract TAB页面和EVENT页面）
    overview.account_type === 2
      ? {
          key: 'contracts',
          title: () => (
            <span>
               {t('address.index.tab.title7')}
              {overview.is_validator ? (
                <sup>
                  <i className="fa fa-check-circle text-success"></i>
                </sup>
              ) : undefined}
            </span>
          ),
          account_type: 2,
        }
      : undefined,
    // 账户类型:0-不是，1-account 2-contract （针对account外部账户，不要显示Contract TAB页面和EVENT页面）
    overview.account_type === 2
      ? {
          key: 'events',
          title: t('address.index.tab.title8'),
          account_type: 2,
        }
      : undefined,
    // {
    //   key: 'uncle',
    //   title: 'Validated Uncles',
    //   account_type: 2,
    // },
    {
      key: 'analytics',
      title: t('address.index.tab.title9'),
      account_type: 2,
    },
  ];


  return (
    <main role="main">
      <Header address={address} overview={overview} />
      <div className="container space-bottom-2">
        <div className="row mb-4">
          <div className="col-md-6 mb-3 mb-md-0">
            <Overview
              address={address}
              data={overview}
              holding_counts={holding_counts}
              holding_list={holding_list}
              loading={holdingListRequest.loading || addressRequest.loading || (typeof addressRequest.data === 'undefined' && typeof addressRequest.error === 'undefined')}
              error={addressRequest.error}
            />
          </div>
          <div className="col-md-6">
            <MoreInfo   
            address={address}  
            data={overview}  
            loading={holdingListRequest.loading || addressRequest.loading || (typeof addressRequest.data === 'undefined' && typeof addressRequest.error === 'undefined')} 
            error={addressRequest.error}/>
          </div>
        </div>
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
              {currentTab === 'transactions' ? <Transactions address={address} overview={overview} /> : undefined}
              {currentTab === 'internaltx' ? <Internaltx address={address} overview={overview} /> : undefined}
              {currentTab === 'tokentxns' ? <Tokentxns address={address} overview={overview} /> : undefined}
              {currentTab === 'tokentxnsErc721' ? <TokentxnsErc721 address={address} overview={overview} /> : undefined}
              {currentTab === 'mine' ? <ValidatedBlocks address={address} overview={overview} /> : undefined}
              {currentTab === 'validatorset' ? <ValidatorsSetInfo address={address} overview={overview} /> : undefined}
              {currentTab === 'contracts' ? <Contracts address={address} overview={overview} /> : undefined}
              {currentTab === 'events' ? <Events address={address} overview={overview} /> : undefined}
              {currentTab === 'analytics' ? <Analytics address={address} overview={overview} /> : undefined}
            </div>
          </div>
        </div>
      </div>
      
    </main>
  );
}
