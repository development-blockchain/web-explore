import {useRequest} from 'ahooks';
import moment from 'moment';
import { useState} from 'react';
import Loading from '../../components/Loading';
import TimeTD from '../../components/TimeTD';
import LinkWithTooltip from '../../components/LinkWithTooltip';
import {HexToDec} from '../../commons/utils';
import {useTranslation} from 'react-i18next';
export default function TokentxnsErc721({address, overview}) {
  const defaultLNG = window.localStorage.getItem('lng') || 'en_US';
  moment.locale(defaultLNG);
  const {t} = useTranslation(['address']);
  const internalTradeListRequest = useRequest({
    url: '/blockBrowser/blockChain/contractInternalTrade/contractTrade721List',
    method: 'post',
    body: JSON.stringify({
      start: '0',
      length: '25',
      field: 'address',
      value: address,
    }),
  });
  const [type, setType] = useState('showAge'); 

  if (internalTradeListRequest.loading) {
    return <Loading />;
  }

  const data = internalTradeListRequest.data?.contract_trade_721_list || [];
  const contract_trade_721_count = internalTradeListRequest.data?.contract_trade_721_count || 0;

  return (
    <div className="tab-pane fade active show" role="tabpanel" aria-labelledby="events-tab">
      <div className="d-md-flex justify-content-between align-items-center mb-4">
        <p className="mb-2 mb-lg-0">
          <i className="fa fa-spin fa-spinner fa-1x fa-pulse" style={{display: 'none', marginTop: '4px', marginRight: '4px'}}>
            &nbsp;
          </i>
          <i className="fas fa-sort-amount-down" data-toggle="tooltip" data-placement="bottom" title="Oldest First"></i>
          &nbsp;{t('address.TokentxnsErc721.tip1')} {contract_trade_721_count} HRC-20 {t('address.TokentxnsErc721.tip2')}
        </p>
        <nav className="mb-4 mb-md-0" aria-label="page navigation"></nav>
      </div>
      <div className="table-responsive">
        <table className="table table-md-text-normal table-hover">
          <thead className="thead-light">
            <tr>
              <th scope="col" width="1">
              {t('address.TokentxnsErc721.table.txnHash')}
              </th>
              <th scope="col">
                  {
                        (type ==='showAge')?
                        <LinkWithTooltip placement="bottom" tooltip={t('address.age.tip1')}>
                          <a href="#!" title="" onClick={e => {  e.preventDefault(); setType('showDate'); }} >
                          {t('address.TokentxnsErc721.table.age')}
                          </a>
                        </LinkWithTooltip>
                        :
                        <LinkWithTooltip placement="bottom" tooltip={t('address.age.tip2')}> 
                          <a href="#!" onClick={e => {  e.preventDefault(); setType('showAge'); }}  >
                          {t('address.TokentxnsErc721.table.time')} (UTC)
                          </a>
                        </LinkWithTooltip>
                  }
              </th>
              <th scope="col"> {t('address.TokentxnsErc721.table.From')}</th>
              <th scope="col" width="30"></th>
              <th scope="col"> {t('address.TokentxnsErc721.table.To')}</th>
              <th scope="col"> {t('address.TokentxnsErc721.table.TokenId')}</th>
              <th scope="col">{t('address.TokentxnsErc721.table.Token')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => {
              const time = moment(item.create_time).startOf('minute').fromNow();
              return (
                <tr>
                  <td>
                    <span className="hash-tag text-truncate">
                      <a href={`/tx/${item.trade_hash}`} target="_parent">
                        {item.trade_hash}
                      </a>
                    </span>
                  </td>
                  <TimeTD time={item.trade_time} interval={item.trade_time_interval} type={type} />
                  <td style={{whiteSpace: 'nowrap'}}>
                    <a
                      className="hash-tag text-truncate"
                      href={`/address/${item.trade_from}#tokentxns`}
                      target="_parent"
                      data-boundary="viewport"
                      data-html="true"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title=""
                      data-original-title={item.trade_from}
                    >
                      {item.trade_from}
                    </a>
                  </td>
                  <td>
                    <span className={`u-label u-label--xs u-label--${item.trade_from_type === 2 ? 'warning' : 'success'} color-strong text-uppercase text-center w-100 rounded text-nowrap`}>
                      &nbsp;{item.trade_from_type === 2 ? 'OUT' : 'IN'}&nbsp;
                    </span>
                  </td>
                  <td style={{whiteSpace: 'nowrap'}}>
                    <span className="hash-tag text-truncate" data-boundary="viewport" data-html="true" data-toggle="tooltip" data-placement="bottom" title="" data-original-title={item.trade_to}>
                      {item.trade_to}
                    </span>
                  </td>
                  <td style={{whiteSpace: 'nowrap'}}>
                    <span className="hash-tag text-truncate" data-boundary="viewport" data-html="true" data-toggle="tooltip" data-placement="bottom" title="" data-original-title={item.token_id}>
                      {HexToDec(item.token_id)}
                    </span>
                  </td>
                  <td>
                    <a href={`/token/0x34005a5fab20cefb34515a02a74054da11912398?a=${address}`} target="_parent">
                      <img src={item.token_image ? item.token_image : '/images/main/empty-token.png'} width="13px" style={{marginRight: '4px'}} />
                      {item.token_name}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center text-secondary"></div>
        <div className="small text-muted">
          <span className="float-right" data-toggle="tooltip" title="Export records in CSV format">
            <font size="1">
              [ Download
              <a href={`/exportData?type=addresstokentxns&a=${address}`} className="mx-1" target="_blank">
                <b> CSV Export</b>
              </a>
              <span className="fas fa-download text-secondary"></span> ]
            </font>
          </span>
        </div>
      </div>
    </div>
  );
}
