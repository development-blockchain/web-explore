import {useRequest} from 'ahooks';
import moment from 'moment';
import React from 'react';
import {useEffect, useState} from 'react';
import Loading from '../../components/Loading';
import TimeTD from '../../components/TimeTD';
import LinkWithTooltip from '../../components/LinkWithTooltip';
import Pager2 from '../../components/Pager2';
import {useTranslation} from 'react-i18next';

export default function Internaltx({address, overview}) {

  const defaultLNG = window.localStorage.getItem('lng') || 'en_US';
  moment.locale(defaultLNG);
  const {t} = useTranslation(['address']);

  const [state, setState] = useState({
    body: {
      start: '1',
      length: '25',
      field: 'address',
      value: address,
    },
  }); 
  const internalTradeListRequest = useRequest(
    body => ({
      url: '/blockBrowser/blockChain/contractInternalTrade/contractInternalTradeList',
      method: 'post',
      body: JSON.stringify(body),
    }),
    {manual: true},
    
    {throwOnError: true},
  );

  const [type, setType] = useState('showAge');   

  const handleCurrentPage = (page) =>{     
    setState({...state, body: {...state.body, start:page + ''}}); 
  }


  useEffect(() => {
    internalTradeListRequest.run(state.body);
  }, [state]);

  
  if (internalTradeListRequest.loading) {
    return <Loading />;
  }
 
  const data = internalTradeListRequest.data?.contract_internal_trade_list || [];
  const counts = internalTradeListRequest.data?.counts || 0;
  let internal_trade_count = internalTradeListRequest.data?.contract_internal_trade_count || 0;
  let totalPage = Math.ceil(Number(counts) / state.body.length);

  return (
    <div className="tab-pane fade active show" id="internaltx" role="tabpanel" aria-labelledby="internaltx-tab">
      <div className="d-md-flex justify-content-between mb-4">
        <div className="mb-2 mb-lg-0 mt-1">
          <div className="d-flex">
            <i className="fas fa-sort-amount-down text-secondary mr-1 mt-1"></i>
            <span>{t('address.Internaltx.tip1')} {counts} {t('address.Internaltx.tip2')}</span>
            <div
              className="ml-2"
              id="divswitch"
              data-container="body"
              data-toggle="popover"
              data-placement="top"
              data-original-title=""
              title=""
              data-content="Toggle between Simplified and Advanced view. The 'Advanced' view also shows zero value HPB transfers, while the 'Simple' view only shows HPB transfers with value. Name tags integration is not available in advanced view"
              style={{display: 'none'}}
            >
              <label className="checkbox-switch mb-0" id="labelswitch" data-toggle="tooltip" data-placement="top" data-original-title="" title="">
                <input type="checkbox" className="checkbox-switch__input" />
                <span className="checkbox-switch__slider"></span>
              </label>
            </div>
         
          </div>
        </div>

        <Pager2 current={state.body.start} total={totalPage}  pageChange= {handleCurrentPage}   />
        {/* <nav aria-label="page navigation"></nav> */}
      </div>

      <div id="ContentPlaceHolder1_divinternaltxtable" className="table-responsive mb-2 mb-md-0">
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th scope="col" width="1">
              {t('address.Internaltx.table.txnHash')}  
              </th>
              <th scope="col" width="1">
              {t('address.Internaltx.table.Block')}  
              </th>
              <th scope="col">
                <span>
                  {
                    (type ==='showAge')?
                    <LinkWithTooltip placement="bottom" tooltip="Click to show Datetime Format">
                      <a href="#!" title="" onClick={e => {  e.preventDefault(); setType('showDate'); }} >
                      {t('address.Internaltx.table.age')}  
                      </a>
                    </LinkWithTooltip>
                    :
                    <LinkWithTooltip placement="bottom" tooltip="Click to show Age Format"> 
                      <a href="#!" onClick={e => {  e.preventDefault(); setType('showAge'); }}  >
                      {t('address.Internaltx.table.time')}   (UTC)
                      </a>
                    </LinkWithTooltip>
                  }
                </span>
              </th>
              <th scope="col">{t('address.Internaltx.table.From')}  </th>
              <th scope="col" width="30"></th>
              <th scope="col">{t('address.Internaltx.table.To')}  </th>
              <th scope="col">{t('address.Internaltx.table.Value')}  </th>
              <th scope="col" width="1"></th>
            </tr>
          </thead>
          <tbody>
            {React.Children.toArray(
              data.map(item => {
                const time = moment(item.create_time).startOf('minute').fromNow();
                return (
                  <tr>
                    <td>
                      <a className="hash-tag text-truncate" href={`/tx/${item.parent_trade_hash}`}>
                        {item.parent_trade_hash}
                      </a>
                    </td>
                    <td>
                      <a className="hash-tag text-truncate" href={`/block/${item.block_no}`}>
                        {item.block_no}
                      </a>
                    </td>
                    <TimeTD time={item.trade_time} interval={item.trade_time_interval} type={type} />
                    <td>
                      {
                        item.type === 1 ? (
                          <i className="far fa-file-alt text-secondary"  data-boundary="viewport"  data-html="true"  
                          data-toggle="tooltip"  data-placement="bottom"  title=""  data-original-title="Contract"></i> 
                          ) : undefined
                      }
                       <LinkWithTooltip placement="bottom" tooltip={item.trade_from}> 
                        { item.trade_from_type === 2 ?   <span  className="hash-tag text-truncate"  >{item.trade_from}</span>:
                          <a  className="hash-tag text-truncate"  href={`/address/${item.trade_from}`} 
                          data-original-title={item.trade_from}
                        >
                        {item.trade_from}
                        </a>  
                        }
                      </LinkWithTooltip>
                     
                    </td>
                    <td>
                      <span className="btn btn-xs btn-icon btn-soft-success rounded-circle">
                        <i className="fas fa-long-arrow-alt-right btn-icon__inner"></i>
                      </span>
                    </td>
                    <td>
                      <i className="far fa-newspaper text-secondary" style={{marginRight: '4px'}}></i>
                      <LinkWithTooltip placement="bottom" tooltip={item.trade_to_name ? item.trade_to_name : item.trade_to}> 
                      { item.trade_from_type === 1 ?   <span className="hash-tag text-truncate">{item.trade_to_name ? item.trade_to_name : item.trade_to}</span>:
                        <a  className="hash-tag text-truncate"  href={`/address/${item.trade_from}`}  >
                          <span>{item.trade_to_name ? item.trade_to_name : item.trade_to}</span>
                        </a>  
                      }
                      </LinkWithTooltip>
 
                    </td>
                    <td>{item.value} HPB</td>
                  </tr>
                );
              }),
            )}
          </tbody>
        </table>
        <div className="d-flex justify-content-md-end align-items-center text-secondary mb-2 mb-md-0 my-3">
          <div className="d-inline-block">
          <Pager2 current={state.body.start} total={totalPage} pageChange= {handleCurrentPage}  />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
        <div className="d-flex align-items-center text-secondary"></div>
        <div className="small text-muted">
          <span className="text-sm-right" style={{marginTop: '20px'}} data-toggle="tooltip" title="" data-original-title="Export records in CSV format">
            [ Download{' '}
            <a href="/exportData?type=internaltxns&amp;a=0x9ec8a0cff9156694dd4c4b6104aaf425adea8d5a" target="_blank">
              <b>CSV Export</b>
            </a>
            &nbsp;<span className="fas fa-download text-secondary"></span> ]&nbsp;
          </span>
        </div>
      </div>
    </div>
  );
}
