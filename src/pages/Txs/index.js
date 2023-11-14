import { useRequest } from 'ahooks';
import moment from 'moment';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// import 'moment/locale/zh-cn'; 
import { useTranslation } from 'react-i18next';
import Loading from '../../components/Loading';
import Pager from '../../components/Pager';
import TimeTD from '../../components/TimeTD';

import LinkWithTooltip from '../../components/LinkWithTooltip';
import ShowAdditionalInfo from '../../components/ShowAdditionalInfo';

export default function Txs() {
  const location = useLocation();
  const {t} = useTranslation(['txs']);
  
  const defaultLNG = window.localStorage.getItem('lng') || 'en_US';
  moment.locale(defaultLNG);


  const query = qs.parse(location.search, {ignoreQueryPrefix: true});
  const [state, setState] = useState({
    isLimitPages: Number(query.p) > 10000,
    body: {
      start: query.p || '1',
      length: window.localStorage.getItem('pageLength') || '50',
      field: query.block ? 'block_no' : (query.a ? 'account' : undefined),
      value: query.block ? query.block :  (query.a ? query.a : undefined),
    },
  });

  const [type, setType] = useState('showAge');   

  const handleChangePageSize = e => {
    window.localStorage.setItem('pageLength', e.target.value);
    setState({...state, body: {...state.body, length: e.target.value}});
  };

  const tradeListRequest = useRequest(
    body => ({
      url: '/blockBrowser/blockChain/trade/tradeList',
      method: 'post',
      body: JSON.stringify(body),
    }),
    {manual: true},
  );
 
  useEffect(() => {
    if (!state.isLimitPages) {
      tradeListRequest.run(state.body);
    }
  }, [state]);

  if (state.isLimitPages) {
    return window.location.replace('/error');
  }

  if (tradeListRequest.loading) {
    return <Loading />;
  }

  const data = tradeListRequest.data?.trade_list || [];
  const counts = tradeListRequest.data?.counts || 0;
  const trade_counts = tradeListRequest.data?.trade_counts || 0;
  const totalPage = Math.ceil(Number(trade_counts) / state.body.length);

  return (
    <main role="main">
      <input type="hidden" name="hdnAgeText" value="Age" />
      <input type="hidden" name="hdnDateTimeText" value="Date Time (UTC)" />
      <input type="hidden" name="hdnAgeTitle" value="Click to show Age Format" />
      <input type="hidden" name="hdnDateTimeTitle" value="Click to show Datetime Format" />
      <div className="container">
        <div className="d-md-flex justify-content-between align-items-center py-3">
          <div className="mb-1 mb-md-0">
            <h1 className="h4 mb-0">
            {t('txs.title')}&nbsp;<span className="small text-secondary"></span>
              {query.block ? (
                <p className="mb-0 text-break small">
                  <span className="small text-secondary">
                    <span>For Block </span>
                    <a href={`/block/${query.block}`}>
                      <span className="text-primary text-break">{query.block}</span>
                    </a>
                  </span>
                </p>
              ) : undefined}
               {query.a ? (
                <p className="mb-0 text-break small">
                  <span className="small text-secondary">
                    <span>For  </span>
                    <a href={`/address/${query.a}`}>
                      <span className="text-primary text-break">{query.a}</span>
                    </a>
                  </span>
                </p>
              ) : undefined}

            </h1>
          </div>
        </div>
      </div>
      <div className="container space-bottom-2">
        <span></span>
        <div className="card">
          <div className="card-body">
            <div className="d-flex flex-wrap flex-xl-nowrap text-nowrap align-items-center ml-auto"></div>
            <div className="d-md-flex justify-content-between mb-4">
              {(query.block  || query.a )? (
                <p className="mb-2 mb-md-0">
                  <span className="d-flex align-items-center">
                    <i className="fa fa-spin fa-spinner fa-1x fa-pulse mr-1" style={{display: 'none'}}></i>{t('txs.tip7')} {counts} {t('txs.tip2')}
                  </span>
                </p>
              ) : (
                <p className="mb-2 mb-md-0">
                  <span className="d-flex align-items-center">{t('txs.tip1')} &gt; {counts} {t('txs.tip2')}</span>
                  <span className="d-block small">({t('txs.tip3')} {trade_counts} {t('txs.tip4')})</span>
                </p>
              )}
              <Pager current={state.body.start} total={totalPage} path="/txs" />
            </div>
            <div className="table-responsive mb-2 mb-md-0">
              <table className="table table-hover">
                <thead className="thead-light">
                  <tr>
                    <th scope="col" width="20"></th>
                    <th scope="col" width="1">
                    {t('txs.table.txnhash')} 
                    </th>
                    <th scope="col" width="1" className="d-none d-sm-table-cell">
                      <div className="d-flex align-items-center">
                        <div className="mr-2">{t('txs.table.block')} </div>
                      </div>
                    </th>
                    <th scope="col">
                      <div className="d-flex align-items-center">
                        <div className="mr-2">
                        {
                          (type ==='showAge')?
                          <LinkWithTooltip placement="bottom" tooltip="Click to show Datetime Format">
                            <a href="#!" title="" onClick={e => {  e.preventDefault(); setType('showDate'); }} >
                            {t('txs.table.age')}
                            </a>
                          </LinkWithTooltip>
                          :
                          <LinkWithTooltip placement="bottom" tooltip="Click to show Age Format"> 
                            <a href="#!" onClick={e => {  e.preventDefault(); setType('showAge'); }}  > 
                              {t('txs.table.time')}
                            </a>
                          </LinkWithTooltip>
                        }
                        </div>
                      </div>
                    </th>
                    <th scope="col">
                      <div className="d-flex align-items-center">
                        <div className="mr-2">{t('txs.table.from')}</div>
                      </div>
                    </th>
                    <th scope="col" width="30"></th>
                    <th scope="col">
                      <div className="d-flex align-items-center">
                        <div className="mr-2">{t('txs.table.to')}</div>
                      </div>
                    </th>
                    <th scope="col">{t('txs.table.value')}</th>
                    <th scope="col">
                      <span className="text-secondary" title="" data-toggle="tooltip" data-original-title="(Gas Price * Gas Used by Txn) in HPB">
                      {t('txs.table.fee')}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {React.Children.toArray(
                    data.map(item => {
                      const time = moment(item.create_time).startOf('minute').fromNow(); 
                      const aa = []
                      return (
                        <tr>
                          <td>
                            <ShowAdditionalInfo txHash={item.trade_hash} popOverTitle={aa}  placement="right" >                             
                              <a role="button" tabIndex="0" type="button"  className="js-txnAdditional-1 btn btn-xs btn-icon btn-soft-secondary">
                                <i className="far fa-eye btn-icon__inner"></i>
                              </a>
                            </ShowAdditionalInfo>
                          </td>
                          <td>
                            {item.trade_status === 0 ? (
                              <span className="text-danger" data-toggle="tooltip" title="" data-original-title="Error in Main Txn : execution reverted">
                                <strong>
                                  <i className="fa fa-exclamation-circle"></i>
                                </strong>
                              </span>
                            ) : undefined}
                            <span className="hash-tag text-truncate">
                              <a href={`/tx/${item.trade_hash}`} className="myFnExpandBox_searchVal">
                                {item.trade_hash}
                              </a>
                            </span>
                          </td>
                          <td className="d-none d-sm-table-cell">
                            <a href={`/block/${item.block_no}`}>{item.block_no}</a>
                          </td>
                          <TimeTD time={item.trade_time} interval={item.trade_interval_time} type={type} />
                          <td>
                            <span className="hash-tag text-truncate" data-toggle="tooltip" title="" data-original-title={item.trade_from}>
                              <a href={`/address/${item.trade_from}`}>{item.trade_from}</a>
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="btn btn-xs btn-icon btn-soft-success rounded-circle">
                              <i className="fas fa-long-arrow-alt-right btn-icon__inner"></i>
                            </span>
                            {/* <span className={`u-label u-label--xs u-label--${item.trade_from_type === 2 ? 'warning' : 'success'} color-strong text-uppercase text-center w-100 rounded text-nowrap`}>
                              &nbsp;{item.trade_from_type === 2 ? 'OUT' : 'IN'}&nbsp;
                            </span> */}
                          </td>
                          <td>
                            <span style={{whiteSpace: 'nowrap'}}>
                              {item.trade_to_contract? <i className="far fa-file-alt text-secondary" data-toggle="tooltip" title="" data-original-title="Contract"></i>:''} {' '}
                              <span className="hash-tag text-truncate" data-toggle="tooltip" title="" data-original-title={item.trade_to}>
                               <a href={`/address/${item.trade_to}`}>{item.trade_to}</a> 
                              </span>
                            </span>
                          </td>
                          <td>{item.trade_amount} HPB</td>
                          <td>
                            <span className="small text-secondary">{item.trade_fee}</span>
                          </td>
                        </tr>
                      );
                    }),
                  )}
                </tbody>
              </table>
            </div>

            <div>
              <div className="d-md-flex justify-content-between my-3">
                <div className="d-flex align-items-center text-secondary mb-2 mb-md-0">
                {t('txs.tip5')}
                  <select className="custom-select custom-select-xs mx-2" onChange={handleChangePageSize} value={state.body.length}>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  {t('txs.tip6')}
                </div>
                <Pager current={state.body.start} total={totalPage} path="/txs" />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
              <div className="d-flex align-items-center text-secondary"></div>
              <div className="small text-muted"></div>
            </div>
          </div>
        </div>
      </div>  

    </main> 
  );
}
