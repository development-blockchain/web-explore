import {useRequest} from 'ahooks';
import moment from 'moment';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import Loading from '../../components/Loading';
import {useTranslation} from 'react-i18next';
export default function Events({address, overview}) {
  
  const defaultLNG = window.localStorage.getItem('lng') || 'en_US';
  moment.locale(defaultLNG);

  const {t} = useTranslation(['address']);
  const contractEventsListRequest = useRequest({
    url: '/blockBrowser/blockChain/contractInternalTrade/contractEventsList',
    method: 'post',
    body: JSON.stringify({
      start: '0',
      length: '25',
      field: 'address',
      value: address,
    }),
  });

  if (contractEventsListRequest.loading) {
    return <Loading />;
  }

  const data = contractEventsListRequest.data?.contract_events_list || [];
  const counts = contractEventsListRequest.data?.counts || 0;

  return (
    <div className="tab-pane fade active show" role="tabpanel" aria-labelledby="events-tab">
      <div className="d-md-flex justify-content-between mb-4">
        <p className="mb-2 mb-md-0">
          <i id="spinwheel" className="fa fa-spin fa-spinner fa-1x fa-pulse mr-1" style={{display: 'none'}}></i>
          <i className="fas fa-sort-amount-down" rel="tooltip" data-placement="bottom" data-toggle="tooltip" title="" data-original-title="Oldest First"></i>
          &nbsp;{t('address.Events.tip1')} {counts} {t('address.Events.tip2')}
          <span className="d-block small text-secondary">
          {t('address.Events.tip3')}:{' '}
            <a href="https://solidity.readthedocs.io/en/latest/contracts.html#events" target="_blank" rel="noopener noreferrer">
            {t('address.Events.tip4')}
            </a>{' '}
            {t('address.Events.tip5')}
          </span>
        </p>
        <div className="mb-2 mb-md-0">
          <div className="position-relative mr-3">
            <a
              id="searchFilterInvoker"
              className="btn btn-sm btn-icon btn-primary"
              href="#"
              role="button"
              aria-controls="searchFilter"
              aria-haspopup="true"
              aria-expanded="false"
              data-unfold-target="#searchFilter"
              data-unfold-type="css-animation"
              data-unfold-duration="300"
              data-unfold-delay="300"
              data-unfold-hide-on-scroll="false"
              data-unfold-animation-in="slideInUp"
              data-unfold-animation-out="fadeOut"
            >
              <i className="fa fa-search btn-icon__inner"></i>
            </a>
            <div
              id="searchFilter"
              className="dropdown-menu dropdown-unfold dropdown-menu-right p-2 u-unfold--css-animation u-unfold--hidden"
              aria-labelledby="searchFilterInvoker"
              style={{animationDirection: '300ms'}}
            >
              <form
                method="post"
                action="./address-events?m=normal&a=0xeceab8fad5fd9b61b473007c749957cbb1a14d04&v=0xeceab8fad5fd9b61b473007c749957cbb1a14d04"
                id="ctl00"
                className="js-focus-state input-group input-group-sm"
                style={{width: '265px'}}
              >
                <input
                  name="txtSearch"
                  id="txtSearch"
                  title="Search and filter Event Logs for this Address by BlockNo or Topic0 Hash"
                  className="form-control"
                  type="search"
                  placeholder="Filtered by BlockNo Or Topic0"
                />
                <div className="input-group-append">
                  <input type="submit" name="btnFind" value="Find" id="btnFind" className="btn btn-primary" title="" data-toggle="tooltip" data-original-title="Find" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <table className="table table-md-text-normal table-hover">
        <thead className="thead-light">
          <tr>
            <th scope="col" witdh="1">
            {t('address.Events.table.txnHash')}
            </th>
            <th scope="col" witdh="1">
              {' '}
              {t('address.Events.table.Method')}
            </th>
            <th scope="col">
              <i className="fa fa-indent mr-1"></i>{t('address.Events.table.Logs')}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => {
            const now = new Date().getTime();
            const intervalTime = moment(now - Number(item.block_time_interval) * 1000)
              .startOf('minute')
              .fromNow();
            return (
              <tr>
                <td>
                  <span className="hash-tag text-truncate" data-toggle="tooltip" title="" data-original-title="Txn Hash">
                    <a href={`/tx/${item.trade_hash}`} target="_parent">
                      {item.trade_hash}
                    </a>
                  </span>
                  <br />#{' '}
                  <a href={`/block/${item.block_no}`} target="_parent" data-toggle="tooltip" title="" data-original-title="BlockNo">
                    {item.block_no}
                  </a>{' '}
                  <a href={`/address-events?m=normal&a=${address}&v=${address}&q=${item.block_no}`}>
                    <i className="fa fa-filter small text-secondary" data-toggle="tooltip" title="" data-original-title={`Apply filter by BlockNo=${item.block_no}`}></i>
                  </a>
                  <br />
                  <span className="small text-secondary">
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>{item.block_time}</Tooltip>}>
                      <span className="u-label u-label--xs u-label--secondary rounded mt-1">{intervalTime}</span>
                    </OverlayTrigger>
                  </span>
                </td>
                <td>
                  <span className="u-label u-label--value u-label--secondary text-dark mt-1 text-dark" data-toggle="tooltip" title="" data-original-title="MethodID">
                    {item.method_id}
                  </span>
                  <br />
                  <span className="text-monospace">
                    {item.method_function_name}
                    <br />
                    <span style={{wordBreak: 'break-all'}}>({item.method_function_args})</span>
                  </span>
                </td>
                <td>
                  <a className="accordion-toggle text-monospace"  data-toggle="collapse" data-target="#demo1" style={{cursor: 'pointer'}}>
                    <span style={{color: '#3498db'}} data-toggle="tooltip" title="" data-original-title="Click to View ABI Decoded View">
                      <i className="fa fa-chevron-right small text-secondary servicedrop1"></i> Upgraded
                    </span>
                  </a>
                  <span className="d-inline-block text-monospace mb-1">
                    (index_topic_1 <span className="text-success">address</span> <span className="text-danger">implementation</span>)
                  </span>
                  <br />
                  <div id="demo1" className="collapse text-monospace">
                    &nbsp;&nbsp;&nbsp;
                    <i>
                      <span className="text-secondary">address</span>
                    </i>
                    implementation
                    <br />
                    <span style={{display: 'inline-block', height: '25px'}}>
                      <a href="/address/0x3d1c38b4e9682e49ce42cb0c7556018372f0bb2d" target="_parent">
                        0x3d1c38b4e9682e49ce42cb0c7556018372f0bb2d
                      </a>
                    </span>
                    <br />
                  </div>
                  <span style={{fontFamily: 'Monospace'}}>
                    <span className="text-secondary">{item.topics1 ? '[topic0] ' + item.topics1 : undefined}</span>
                    <a
                      href="/address-events?m=normal&a=0xeceab8fad5fd9b61b473007c749957cbb1a14d04&v=0xeceab8fad5fd9b61b473007c749957cbb1a14d04&q=0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b"
                    >
                      <i className="fa fa-filter small  text-secondary  ml-1" data-toggle="tooltip" title="" data-original-title="Apply filter by topic0"></i>
                    </a>
                    <br />
                    {item.topics2 ? '[topic1] ' + item.topics1 : undefined}
                    {item.topics3 ? <br /> : undefined}
                    {item.topics3 ? '[topic2] ' + item.topics2 : undefined}
                    {item.topics4 ? <br /> : undefined}
                    {item.topics4 ? '[topic3] ' + item.topics3 : undefined}
                    {item.topics5 ? <br /> : undefined}
                    {item.topics5 ? '[topic4] ' + item.topics4 : undefined}
                    {item.topics6 ? <br /> : undefined}
                    {item.topics6 ? '[topic5] ' + item.topics5 : undefined}
                    <table className="table-borderless mt-2"></table>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
