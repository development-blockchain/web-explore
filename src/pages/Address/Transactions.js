import {useRequest} from 'ahooks';
import moment from 'moment';
import React,{ useState} from 'react';
import {useLocation} from 'react-router-dom';
import qs from 'qs';
import Loading from '../../components/Loading';
import TimeTD from '../../components/TimeTD';
import LinkWithTooltip from '../../components/LinkWithTooltip';
import CustomDropDown from '../../components/CustomDropDown';
import ShowAdditionalInfo from '../../components/ShowAdditionalInfo'; 
import {useTranslation} from 'react-i18next';

export default function Transactions({address, overview}) {
  const url = (overview.account_type ===2) ?
                '/blockBrowser/blockChain/contractInternalTrade/contractTradeList':
                '/blockBrowser/blockChain/trade/tradeList'
  
  // 设置中文
  const defaultLNG = window.localStorage.getItem('lng') || 'en_US';
  moment.locale(defaultLNG);

  const {t} = useTranslation(['address']);
  const [type, setType] = useState('showAge');   
  const [fromAddress, setFromAddress] = useState('');   
  const [toAddress, setToAddress] = useState('');    
  const location = useLocation(); 
  const query = qs.parse(location.search, {ignoreQueryPrefix: true});   
  const goFromAddress =()=>{  
      const url = `/address/${address}${qs.stringify({...query, trade_from:fromAddress}, {addQueryPrefix: true})}`; 
      window.location.href = url 
  }
  const goToAddress =()=>{ 
    const url = `/address/${address}${qs.stringify({...query, trade_to:toAddress}, {addQueryPrefix: true})}`; 
    window.location.href = url
  }

  //post请求的  field 设置为 "filter_from_to", value 设置为  当前账户地址，过滤的from地址，过滤的to地址 用 : query.trade_from
  //拼接. {"start":"0","length":"25","field":"filter_from_to","value":"0xf065f10555be71628b79e1e4a0cc60ceaa9bd8fc:0xd63239e9d25caafdebadc880895f38362ce61eb8"}
  const contractAddress =(overview.account_type ===2) ? 'address': 'filter_from_to'       

  let addressValue = address

  if(overview.account_type ===1){
    addressValue = `${address}:${query.trade_from||''}:${query.trade_to||''}` 
  }
  const contractTradeListRequest = useRequest({
    url: url,
    method: 'post',
    body: JSON.stringify({
      start: '0',
      length: '25',
      field: contractAddress,
      value: addressValue,
    }),
  });
 
  if (contractTradeListRequest.loading) {
    return <Loading />;
  } 
  const data =  (overview.account_type ===2) ?(contractTradeListRequest.data?.contract_trade_list || []) : (contractTradeListRequest.data?.trade_list || []) ;
  const counts = contractTradeListRequest.data?.counts || 0;
  const contract_trade_count = (overview.account_type ===2)? (contractTradeListRequest.data?.contract_trade_count || 0) :(contractTradeListRequest.data?.trade_counts || 0);

  return (
    <div className="tab-pane fade active show" role="tabpanel" aria-labelledby="transactions-tab">
      <div className="d-md-flex align-items-center mb-3">
        <p className="mr-2 mb-2">
          <i className="fas fa-sort-amount-down text-secondary" data-toggle="tooltip" title="" data-original-title="Oldest First"></i>
          &nbsp;{t('address.transactions.tip1')} {contract_trade_count} {t('address.transactions.tip2')}&nbsp;
          <a href={`/txs?a=${address}`} data-toggle="tooltip" className="mr-1" data-original-title="Click to view full list">
            {counts}
          </a>
          {t('address.transactions.tip3')}
        </p>
        <div className="d-flex flex-wrap flex-xl-nowrap text-nowrap align-items-center ml-auto"></div>
        {/* <CustomDropDown  address={address} />  */}
      </div>
      <div className="table-responsive mb-2 mb-md-0">
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th scope="col" width="20"></th>
              <th scope="col" width="1">
                {t('address.transactions.table.TxnHash')}
              </th>
              <th scope="col" className="d-none d-sm-table-cell">
                <div className="d-flex align-items-center">
                  <div className="mr-2">{t('address.transactions.table.Block')}</div>
                  <div className="dropdown" style={{display: 'none'}}>
                    <button className="btn btn-xs btn-soft-secondary btn-icon" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i className="fa fa-filter btn-icon__inner"></i>
                    </button>
                    <div className="dropdown-menu" style={{minWidth: '220px'}}>
                      <div className="py-0 px-3">
                        <label className="mb-1" htmlFor="fromblock">
                          From
                        </label>
                        <input type="text" name="fromblock" className="form-control form-control-xs mb-2 js-form-message" placeholder="Block Number" />
                        <label className="mb-1" htmlFor="toblock">
                          To
                        </label>
                        <input type="text" name="toblock" className="form-control form-control-xs mb-2 js-form-message" placeholder="Block Number" />
                        <div className="d-flex">
                          <button type="" className="btn btn-xs btn-block btn-primary mr-2 mt-0">
                            <i className="far fa-filter mr-1"></i> Filter
                          </button>
                          <button type="" className="btn btn-xs btn-block btn-soft-secondary mt-0">
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
              <th scope="col">
                <div className="d-flex align-items-center">
                  <div className="mr-2">
                    {
                    (type ==='showAge')?
                    <LinkWithTooltip placement="bottom" tooltip="Click to show Datetime Format">
                      <a href="#!" title="" onClick={e => {  e.preventDefault(); setType('showDate'); }} >
                      {t('address.transactions.table.age')}
                      </a>
                    </LinkWithTooltip>
                    :
                    <LinkWithTooltip placement="bottom" tooltip="Click to show Age Format"> 
                      <a href="#!" onClick={e => {  e.preventDefault(); setType('showAge'); }}  >
                      {t('address.transactions.table.time')}
                      </a>
                    </LinkWithTooltip>
                    }

                  </div>
                  <div className="dropdown" style={{display: 'none'}}>
                    <button className="btn btn-xs btn-soft-secondary btn-icon" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i className="fa fa-filter btn-icon__inner"></i>
                    </button>
                    <div className="dropdown-menu" style={{minWidth: '220px'}}>
                      <div className="py-0 px-3">
                        <label className="mb-1" htmlFor="fromage">
                          From
                        </label>
                        <input type="date" name="fromage" className="form-control form-control-xs mb-2" />
                        <label className="mb-1" htmlFor="toage">
                          To
                        </label>
                        <input type="date" name="toage" className="form-control form-control-xs mb-2" />
                        <div className="d-flex">
                          <button type="" className="btn btn-xs btn-block btn-primary mr-2 mt-0">
                            <i className="far fa-filter mr-1"></i> Filter
                          </button>
                          <button type="" className="btn btn-xs btn-block btn-soft-secondary mt-0">
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
              <th scope="col">
                <div className="d-flex align-items-center">
                  <div className="mr-2">{t('address.transactions.table.From')}</div>
                  <div className="dropdown">
                    <button className="btn btn-xs btn-soft-secondary btn-icon" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i className="fa fa-filter btn-icon__inner"></i>
                    </button>
                    <div className="dropdown-menu" style={{minWidth: '220px'}}>
                      <div className="py-0 px-3">
                        <input type="text" className="form-control form-control-xs mb-2" placeholder="Search by address e.g. 0x.." onChange={ (e)=> setFromAddress(e.target.value) } name="fromaddress" />
                        <div className="d-flex">
                          <button type="" className="btn btn-xs btn-block btn-primary mr-2 mt-0" onClick={goFromAddress}>
                            <i className="far fa-filter mr-1"></i> Filter
                          </button>
                          <button type="" className="btn btn-xs btn-block btn-soft-secondary mt-0">
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
              <th scope="col" width="30"></th>
              <th scope="col">
                <div className="d-flex align-items-center">
                  <div className="mr-2">{t('address.transactions.table.To')}</div>
                  <div className="dropdown">
                    <button className="btn btn-xs btn-soft-secondary btn-icon" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i className="fa fa-filter btn-icon__inner"></i>
                    </button>
                    <div className="dropdown-menu" style={{minWidth: '220px'}}>
                      <div className="py-0 px-3">
                        <input type="text" className="form-control form-control-xs mb-2" placeholder="Search by address e.g. 0x.." onChange={ (e)=> setToAddress(e.target.value) }  name="toaddress" />
                        <div className="d-flex">
                          <button type="" className="btn btn-xs btn-block btn-primary mr-2 mt-0" onClick={goToAddress}>
                            <i className="far fa-filter mr-1"></i> Filter
                          </button>
                          <button type="" className="btn btn-xs btn-block btn-soft-secondary mt-0">
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
              <th scope="col">{t('address.transactions.table.value')}</th>
              <th scope="col">
                <span data-toggle="tooltip" title="" data-toggle-second="tooltip" data-original-title="(Gas Price * Gas Used by Txns) in HPB">
                  <span className="text-secondary">{t('address.transactions.table.txnfee')}</span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => { 
               const aa = []
              const now = new Date().getTime();
              const time = moment(item.create_time)
                .startOf('minute')
                .fromNow();
              return (
                <tr key={item.trade_hash}>
                  <td>
                    {/* <a role="button" tabIndex="0" type="button" className="js-txnAdditional-1 btn btn-xs btn-icon btn-soft-secondary myFnExpandBox">
                      <i className="far fa-eye btn-icon__inner"></i>
                    </a> */}
                    <ShowAdditionalInfo txHash={item.trade_hash} popOverTitle={aa}  placement="right" >                             
                        <a role="button" tabIndex="0" type="button"  className="js-txnAdditional-1 btn btn-xs btn-icon btn-soft-secondary">
                          <i className="far fa-eye btn-icon__inner"></i>
                        </a>
                    </ShowAdditionalInfo>

                  </td>
                  <td>
                    {item.trade_status ===0  ?   <i className="far fa-exclamation-circle mr-1"  style={{color: '#ff0000'}}  data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Contract"></i> :''}

                    <a className="hash-tag text-truncate myFnExpandBox_searchVal" href={`/tx/${item.trade_hash}`}>
                      {item.trade_hash}
                    </a>
                  </td>
                  <td className="d-none d-sm-table-cell">
                    <a href={`/block/${item.block_no}`}>{item.block_no}</a>
                  </td>
                  <TimeTD time={item.trade_time} interval={ (overview.account_type ===2)? item.trade_time_interval :item.trade_interval_time}  type={type} />
                  <td>
                  {item.trade_from_type === 2 ?  
                    <span className="hash-tag text-truncate" data-boundary="viewport"   data-html="true"  data-toggle="tooltip"
                      data-placement="bottom"  title=""
                      data-original-title={`Mdex: Heco Pool (${item.trade_from})`}   >
                      {item.trade_from}
                    </span>
                     :
                     <a className="hash-tag text-truncate" href={`/address/${item.trade_from}`} data-toggle="tooltip" data-placement="bottom" title="" data-original-title={item.trade_from}>
                      {item.trade_from}
                    </a> 
                    }
                  </td>
                  <td>
                    <span className={`u-label u-label--xs u-label--${item.trade_from_type === 2 ? 'warning' : 'success'} color-strong text-uppercase text-center w-100 rounded text-nowrap`}>
                      &nbsp;{item.trade_from_type === 2 ? 'OUT' : 'IN'}&nbsp;
                    </span>
                  </td>
                  <td>
                    {item.trade_to_contract ?   <i className="far fa-file-alt text-secondary mr-1" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Contract"></i> :''}
                   
                    {item.trade_from_type === 2 ?  
                     <a className="hash-tag text-truncate" href={`/address/${item.trade_to}`} data-toggle="tooltip" data-placement="bottom" title="" data-original-title={item.trade_to}>
                      {item.trade_to}
                    </a> 
                    :   
                    <span  className="hash-tag text-truncate"   data-boundary="viewport"   data-html="true"  data-toggle="tooltip"      data-placement="bottom"  title=""
                        data-original-title={`Mdex: Heco Pool (${item.trade_to})`}   >
                    {item.trade_to}
                    </span> 
                  }
                  
                 
                  </td>
                  <td>{item.trade_amount} HPB</td>
                  <td>
                    <span className="small text-secondary">{item.trade_fee}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
        <div className="d-flex align-items-center text-secondary"></div>
        <div className="small text-muted">
          <span className="text-sm-right" style={{marginTop: '20px'}} data-toggle="tooltip" title="" data-original-title="Export records in CSV format">
            [ Download{' '}
            <a href={`/exportData?type=address&a=${address}`} target="_blank">
              <b>CSV Export</b>
            </a>
            &nbsp;<span className="fas fa-download text-secondary"></span> ]&nbsp;
          </span>
        </div>
      </div> */}

    </div>
  );
}
