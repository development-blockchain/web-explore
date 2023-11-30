import { useRequest } from 'ahooks';
import moment from 'moment';
import 'moment/locale/zh-cn';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import UserContext from '../../UserContext'; 
import Copy from '../../components/Copy';
import Loading from '../../components/Loading';
function TradeHash({data}) {
  const [copied, setCopied] = useState(false);
  const {t} = useTranslation(['tx']);
  return (
    <div className="row align-items-center mt-1">
      <div className="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0">
        <i
          className="fal fa-question-circle text-secondary d-none d-sm-inline-block mr-1"
          data-container="body"
          data-toggle="popover"
          data-placement="top"
          data-original-title=""
          title=""
          data-content="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed."
        ></i>
        {t('tx.Overview.TransactionHash')}:
      </div>
      <div className="col-md-9">
        <span className="mr-1">{data.tx_hash}</span>
        <Copy text={data.tx_hash} title="Copy Txn Hash to clipboard" />
      </div>
    </div>
  );
}

function BlockHash({data}) {
  const [copied, setCopied] = useState(false);
  const {t} = useTranslation(['tx']);
  return (
    <div className="row align-items-center mt-1">
      <div className="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0">
        <i
          className="fal fa-question-circle text-secondary d-none d-sm-inline-block mr-1"
          data-container="body"
          data-toggle="popover"
          data-placement="top"
          data-original-title=""
          title="" 
        ></i>
        {t('tx.Overview.BlockHash')}:
      </div>
      <div className="col-md-9">
        <span className="mr-1">{data.block_hash}</span>
        <Copy text={data.block_hash} title="Copy Txn Hash to clipboard" />
      </div>
    </div>
  );
}

function TxType({data}) {
  const {t} = useTranslation(['tx']);
  return (
    <div className="row align-items-center mn-3">
      <div className="col-auto col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0">
        <i
          className="fal fa-question-circle text-secondary d-none d-sm-inline-block mr-1"
          data-container="body"
          data-toggle="popover"
          data-placement="top"
          data-original-title=""
          title=""
          data-content="The status of the transaction."
        ></i>
        {t('tx.Overview.TxType')}:
      </div>
      {data.tx_type === 12 ? (
        <div className="col col-md-9">
          <span className="u-label u-label--sm u-label--success rounded"  >
            <i className="fa fa-check-circle mr-1"></i>Admin交易
          </span>
        </div>
      ) : (data.tx_type===14? (
        <div className="col col-md-9">
          <span  className="u-label u-label--sm u-label--warning rounded"   >
            <i className="fa fa-check-circle mr-1"></i>合约交易 
          </span>
        </div>
      ): (
        <div className="col col-md-9">
          <span  className="u-label u-label--sm u-label--info rounded"   >
            <i className="fa fa-check-circle mr-1"></i>普通交易 
          </span>
        </div>
      ))}
    </div>
  );
}

function TxWType({data}) {
  const {t} = useTranslation(['tx']);
  return (
    <div className="row align-items-center mn-3">
      <div className="col-auto col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0">
        <i
          className="fal fa-question-circle text-secondary d-none d-sm-inline-block mr-1"
          data-container="body"
          data-toggle="popover"
          data-placement="top"
          data-original-title=""
          title=""
          data-content="The status of the transaction."
        ></i>
         上链模式:
      </div>
     
      <div className="col col-md-9">
        <span className="u-label u-label--sm u-label--success rounded"  >
          <i className="fa fa-check-circle mr-1"></i>{data.tx?.w_type}
        </span>
      </div>
     
    </div>
  );
}
 

function BlockNo({data}) {
  const {t} = useTranslation(['tx']);
  return (
    <div className="row align-items-center">
      <div className="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0">
        <i
          className="fal fa-question-circle text-secondary d-none d-sm-inline-block mr-1"
          data-container="body"
          data-toggle="popover"
          data-placement="top"
          data-original-title=""
          title=""
          data-content="The number of the block in which the transaction was recorded. Block confirmation indicate how many blocks since the transaction is validated."
        ></i>
         {t('tx.Overview.Block')}:
      </div>
      <div className="col-md-9">
      <Link to={`/block/${encodeURIComponent(data.block_Id) }`} className="hash-tag text-truncate" data-toggle="tooltip"   title={data.block_Id } >
        {data.block_Id }
      </Link>  
      </div>
    </div>
  );
}

function TimeStamp({data}) {
  const {t} = useTranslation(['tx']);
    // 设置中文
 
  const now = new Date().getTime();
  const timeInterval = moment(now - Number(data.interval_timestamp) * 1000)
    .startOf('minute')
    .fromNow();
  return (
    <div className="row align-items-center">
      <div className="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0">
        <i
          className="fal fa-question-circle text-secondary d-none d-sm-inline-block mr-1"
          data-container="body"
          data-toggle="popover"
          data-placement="top"
          data-original-title=""
          title=""
          data-content="The date and time at which a transaction is validated."
        ></i>
        {t('tx.Overview.Timestamp')}:
      </div>
      <div className="col-md-9">
        <span></span>
        <i className="far fa-clock small mr-1"></i>
        <span>{timeInterval}</span>
        <span>({moment(data.timestamp).local().format('YYYY-MM-DD HH:mm:ss')})</span>
      </div>
    </div>
  );
}
function TxReq({data}) {
  const {t} = useTranslation(['tx']);
   if(data.tx){
      return (
         <div className="row align-items-center mn-3">
          <div className="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0">
            <i className="fal fa-question-circle text-secondary d-none d-sm-inline-block mr-1"></i>
            请求类型:
          </div>
          <div className="col-md-9">
            <span>
              <span data-toggle="tooltip" title="" data-original-title="The amount of HPB to be transferred to the recipient with the transaction">
                <span className="u-label u-label--value u-label--secondary text-dark rounded mr-1">{data.tx.admin_req_type}</span> 
              </span>
            </span>
          </div>
        </div>
    )
   }else{
      return ""
   }
} 
 
function TradeDetail({data}) {
  const {t} = useTranslation(['tx']); 
  return (
    <div className="tab-pane fade show active">
      <div className="card-body">
        <TradeHash data={data} />
        <hr className="hr-space" />
        <BlockHash data={data} />
        <hr className="hr-space" />
        
        <BlockNo data={data} />
        <hr className="hr-space" />
        <TimeStamp data={data} />
        <hr className="hr-space" /> 
        <TxType data={data} />
        <hr className="hr-space" /> 
        {data.tx?.admin_req_type? 
         <><TxReq data={data} /><hr className="hr-space" /></>:""} 

        {data.tx?.w_type? 
         <><TxWType data={data} /><hr className="hr-space" /></>:""} 
 
      </div>
    </div>
  );
} 

function Empty({tx}) {
  const {t} = useTranslation(['tx']);
  return (
    <div className="card-body">
      <div className="space-2 text-center">
        <img className="mb-5-alt darkmode" width="150" src="/assets/svg/empty-states/empty-search-state-dark.svg" alt="Search Not Found" />
        {/* <img className="mb-5-alt normalMode" width="150" src="/assets/svg/empty-states/empty-search-state.svg" alt="Search Not Found" /> */}
        <p className="lead mb-0">
          {t('tx.empty.tip1')} 
          <br />
          {/* <i>{tx}</i> */}
        </p>
      </div>
    </div>
  );
}

export default function Tx() {

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


  const {t} = useTranslation(['tx']);
  let {tx} = useParams();
  tx = decodeURIComponent(tx);
  const location = useLocation();

  const [currentTab, setCurrentTab] = useState(location.hash.slice(1) || 'home'); // home, internal, eventlog

  const [state, setState] = useState({
    tradeDetailBody: {field: 'trade_hash', value: tx}
  });
  const [tradeDetail, setTradeDetail] = useState({});  
  const tradeDetailRequest = useRequest(
    body => ({
      url: '/chainBrowser/blockchain/getTxByHash',
      method: 'post',
      headers: {
        'Authorization': user.token,
      },
      body: JSON.stringify({"tx_hash":tx}),
    }),
    {manual: true},
  );

  useEffect(() => {
    tradeDetailRequest.run(state.tradeDetailBody).then(res => { 
      if (res) {
        // if(res.code ===10097){
        //   prompt.error('无权限查看当前交易',false);
        // }
        setTradeDetail(res);
      }
    });
  }, []);

  if (!user.token) {
    return (window.location.href = '/login');
  } 

  if (tradeDetailRequest.loading) {
    return <Loading />;
  }

  return ( 
    <main id="content" role="main">  
      <div className="container-fluid space-bottom-2 p-3">
        <div className="card">
          <div className="card-header sticky-card-header d-flex justify-content-between p-0">
            <div className="header-title">
                <h4 className="card-title p-2">{t('tx.title')}&nbsp;</h4>
            </div>
          </div>
          {tradeDetailRequest.data ? (
            <div className="tab-content">
              {currentTab === 'home' ? <TradeDetail data={tradeDetail} /> : undefined} 
            </div>
          ) : (
            <Empty tx={tx} />
          )}
        </div>
      </div>
    </main>
  );
}
