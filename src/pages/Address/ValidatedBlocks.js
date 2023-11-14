import {useRequest} from 'ahooks';
import moment from 'moment';
import React,{ useState}  from 'react'; 
import Loading from '../../components/Loading';
import TimeTD from '../../components/TimeTD';
import LinkWithTooltip from '../../components/LinkWithTooltip';
import {useTranslation} from 'react-i18next';
export default function ValidatedBlocks({address, overview}) {
  const {t} = useTranslation(['address']);
  const validatedBlockListRequest = useRequest({
    url: '/blockBrowser/blockChain/contractInternalTrade/validatedBlockList',
    method: 'post',
    body: JSON.stringify({
      start: '0',
      length: '25',
      field: 'address',
      value: address,
    }),
  });

  const [type, setType] = useState('showAge');  
  if (validatedBlockListRequest.loading) {
    return <Loading />;
  }

  const data = validatedBlockListRequest.data?.validated_block_list || [];
  const validated_block_count = validatedBlockListRequest.data?.validated_block_count || 0;
  const validated_block_ht = validatedBlockListRequest.data?.validated_block_ht || 0;
  const counts = validatedBlockListRequest.data?.counts || 0;

  return (
    <div className="tab-pane fade active show" id="mine">
      <div className="d-md-flex justify-content-between align-items-center mb-4">
        <p className="mb-2 mb-lg-0">
          <i className="fas fa-sort-amount-down text-secondary" data-toggle="tooltip" title="" data-original-title="Oldest First"></i>
          <span>Latest {counts} blocks (From a total of</span>
          <a href={`/blocks?m=${address}`} data-toggle="tooltip" title="" data-original-title="View all blocks validated">
            {validated_block_count} blocks
          </a>
          <span>with {validated_block_ht} HPB in fees)</span>
        </p>

        <nav className="mb-0 mb-md-0" aria-label="page navigation">
          <a
            id="ContentPlaceHolder1_linkShowAllBlocksMined"
            title=""
            className="btn btn-xss btn-primary"
            data-toggle="tooltip"
            href={`/blocks?m=${address}`}
            data-original-title={`View All ${validated_block_count} Blocks Validated`}
          >
            View All
          </a>
        </nav>
      </div>

      <div className="table-responsive mb-2 mb-md-0">
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th scope="col">Block</th>
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
              <th scope="col">Transaction</th>
              <th scope="col">Gas Used</th>
              <th scope="col">Reward</th>
            </tr>
          </thead>
          <tbody>
            {React.Children.toArray(
              data.map(item => {
                const now = new Date().getTime();
                const time = moment(now - Number(item.block_interval_time) * 1000)
                  .startOf('minute')
                  .fromNow();
                const percent = (item.gas_used / item.gas_limit) * 100;
                return (
                  <tr>
                    <td>
                      <span className="hash-tag text-truncate">
                        <a href={`/block/${item.block_no}`}>{item.block_no}</a>
                      </span>
                    </td>
                    <TimeTD time={item.block_time} interval={item.block_time_interval} type={type} />
                    <td>{item.block_trade_amount}</td>
                    <td>
                      <span>{item.gas_used}</span>
                      <span className="small text-secondary"> ({percent.toFixed(2)}%)</span>
                      <div className="progress mt-1" style={{height: '2px'}}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{width: `${percent.toFixed(2)}%`}}
                          aria-valuenow={percent.toFixed(2)}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </td>
                    <td>{item.block_reward} HPB</td>
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
