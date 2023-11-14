import {useRequest} from 'ahooks';
import moment from 'moment';
import React,{ useState} from 'react';

import Loading from '../../components/Loading';
import TimeTD from '../../components/TimeTD';
import LinkWithTooltip from '../../components/LinkWithTooltip'
import {useTranslation} from 'react-i18next';
export default function ValidatorsSetInfo({address, overview}) {
  const {t} = useTranslation(['address']);
  const verifierListRequest = useRequest({
    url: '/blockBrowser/blockChain/contractInternalTrade/verifierList',
    method: 'post',
    body: JSON.stringify({
      start: '0',
      length: '25',
      field: 'address',
      value: address,
    }),
  });
  const [type, setType] = useState('showAge');   

  if (verifierListRequest.loading) {
    return <Loading />;
  }

  const data = verifierListRequest.data?.verifier_list || [];
  const verifier_count = verifierListRequest.data?.verifier_count || 0;
  const counts = verifierListRequest.data?.counts || 0;

  return (
    <div className="tab-pane fade active show" id="validatorset">
      <div className="d-md-flex justify-content-between align-items-center mb-4">
        <p className="mb-2 mb-lg-0">
          <i className="fas fa-sort-amount-down text-secondary" data-toggle="tooltip" title="" data-original-title="Oldest First"></i>
          <span> Latest {counts} Validator Set (From a total of</span>
          <a href={`/validatorset/snapshot/${address}`} data-toggle="tooltip" title="" data-original-title="View all validator set">
            {verifier_count}
          </a>
          <span> validator set)</span>
        </p>

        <nav className="mb-0 mb-md-0" aria-label="page navigation">
          <a
            id="ContentPlaceHolder1_linkShowAllValidatorSet"
            title=""
            className="btn btn-xss btn-primary"
            data-toggle="tooltip"
            href={`/validatorset/snapshot/${address}`}
            data-original-title={`View All ${verifier_count} Blocks Validated`}
          >
            View All
          </a>
        </nav>
      </div>

      <div className="table-responsive mb-2 mb-md-0">
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th scope="col"> 
                  {
                        (type ==='showAge')?
                        <LinkWithTooltip placement="bottom" tooltip="Click to show Datetime Format">
                          <a href="#!" title="" onClick={e => {  e.preventDefault(); setType('showDate'); }} >
                            Age
                          </a>
                        </LinkWithTooltip>
                        :
                        <LinkWithTooltip placement="bottom" tooltip="Click to show Age Format"> 
                          <a href="#!" onClick={e => {  e.preventDefault(); setType('showAge'); }}  >
                            Date Time (UTC)
                          </a>
                        </LinkWithTooltip>
                  }
              </th>
              <th scope="col">Block</th>
              <th scope="col">Fee Address</th>
              <th scope="col">Jailed</th>
              <th scope="col">Incoming</th>
            </tr>
          </thead>
          <tbody>
            {React.Children.toArray(
              data.map(item => {
                const now = new Date().getTime();
                const time = moment(now - Number(item.block_interval_time) * 1000)
                  .startOf('minute')
                  .fromNow();

                return (
                  <tr>
                    <TimeTD time={item.block_time} interval={item.block_time_interval} type={type} />
                    <td>
                      <a href={`/block/${item.block_no}`}>{item.block_no}</a>
                    </td>
                    <td>
                      <a href={`/address/${item.fee_address}`} className="hash-tag text-truncate" data-toggle="tooltip" title="" data-original-title={item.fee_address}>
                        {item.fee_address}
                      </a>
                    </td>
                    <td>{item.jailed === 1 ? 'Yes' : 'No'}</td>
                    <td>{item.incoming} HPB</td>
                  </tr>
                );
              }),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
