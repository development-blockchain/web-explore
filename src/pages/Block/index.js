import {useEffect, useState} from 'react';
import {useRequest} from 'ahooks';
import {useParams,Link} from 'react-router-dom';
import moment from 'moment'; 
import 'moment/locale/zh-cn';  
import Copy from '../../components/Copy';
import Loading from '../../components/Loading';
import LinkWithTooltip from '../../components/LinkWithTooltip';

import {useTranslation} from 'react-i18next';

window.moment = moment;
function Detail({data = {}, block, loading, error}) {

  const {t} = useTranslation(['block']);
  // 设置中文
  const defaultLNG = window.localStorage.getItem('lng') || 'zh_CN';
  moment.locale(defaultLNG);

 
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error</div>;
  }

  const block_no = Number(data.block_Id);
  const block_hash = data.block_hash; 
  const tx_counts = Number(data.tx_counts);   
    const now = new Date().getTime(); 
    const time = moment(now - Number(data.interval_timestamp)*1000)
      .startOf('minute')
      .fromNow(); 


  return (
    <div className="tab-content">
      <div className="tab-pane fade show active" role="tabpanel" aria-labelledby="home-tab">
        <div className="card-body">
          <div className="row align-items-center  mt-1">
            <div className="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0e">
              <i
                className="fal fa-question-circle text-secondary mr-1"
                data-container="body"
                data-toggle="popover"
                data-placement="top"
                data-original-title=""
                title=""
                data-content="Also known as Block Number. The block height, which indicates the length of the blockchain, increases after the addition of the new block."
              ></i>
              {t('block.BlockHeight')}:
            </div>
            <div className="col-md-9">
              <div className="d-flex">
                <span className="font-weight-sm-bold mr-2">{block_no}</span> 
              </div>
            </div>
          </div>
          <hr className="hr-space" />
          <div className="row align-items-center  mt-1">
            <div className="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0e">
              <i  className="fal fa-question-circle text-secondary mr-1"
                data-container="body"
                data-toggle="popover"
                data-placement="top"
                data-original-title=""
                title=""
                data-content="Also known as Block Number. The block height, which indicates the length of the blockchain, increases after the addition of the new block."
              ></i>
              {t('block.BlockHash')}:
            </div>
            <div className="col-md-9">
              <div className="d-flex">
                <span className="font-weight-sm-bold mr-2">{block_hash}</span> 
                <Copy text={block_hash} title="Copy Txn Hash to clipboard" />
              </div>
            </div>
          </div>
          <hr className="hr-space" />
          <div className="row align-items-center">
            <div className="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0e">
              <i className="fal fa-question-circle text-secondary mr-1" ></i>
               {t('block.Timestamp')}:
            </div>
            <div className="col-md-9">
              <i className="far fa-clock small mr-1"></i>
              {time}  ({moment(data.time_stamp).local().format('YYYY-MM-DD HH:mm:ss')})
            </div>
          </div> 
          <hr className="hr-space mt-2" />
          
          <div className="row align-items-center">
            <div className="col-md-3 font-weight-bold font-weight-sm-normal mb-1 mb-md-0e">
              <i
                className="fal fa-question-circle text-secondary mr-1"
                data-container="body"
                data-toggle="popover"
                data-placement="top"
                data-original-title=""
                title=""
                data-content="For each block, the miner is rewarded with a finite amount of HPB on top of the fees paid for all transactions in the block."
              ></i>
              {t('block.TxCount')}:
            </div>
            <div className="col-md-9">{tx_counts}</div>
          </div> 
        </div>
      </div>
    </div>
  );
}

export default function Block() {
  let {block} = useParams();
  
  block = decodeURIComponent(block);

  const {t} = useTranslation(['block']); 
  const [state, setState] = useState({
    body: {
      "block_id":(!isNaN(parseFloat(block)) && isFinite(block)) ? Number(block):0,
      "block_hash":(!isNaN(parseFloat(block)) && isFinite(block)) ?"" :block
    },
  });

  const blockRequest = useRequest(
    body => ({
      url: '/chainBrowser/blockchain/getBlockByHashOrId',
      method: 'post',
      body: JSON.stringify(body),
    }),
    {manual: true},
  ); 

  useEffect(() => {
    blockRequest.run(state.body);
  }, []);
 

  return (
    <main id="content" role="main">  
      <div className="container-fluid space-bottom-2 p-3">
        <div className="card">
            <div className="card-header sticky-card-header d-flex justify-content-between p-0">
              <div className="header-title">
                  <h4 className="card-title p-2">{t('block.title')}&nbsp;</h4>
              </div>
            </div>
            <Detail  block={block}  data={blockRequest.data || {}}
              loading={blockRequest.loading || (typeof blockRequest.data === 'undefined' && typeof blockRequest.error === 'undefined')}
              error={blockRequest.error}
            />
        </div> 
      </div> 
    </main>
  );
}
