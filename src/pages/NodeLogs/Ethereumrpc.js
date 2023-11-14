import {useRequest} from 'ahooks';
import moment from 'moment';
import React,{ useEffect,useState} from 'react'; 
import Loading from '../../components/Loading';
import LinkWithTooltip from '../../components/LinkWithTooltip'; 
import Pager2 from '../../components/Pager2';
import {useTranslation} from 'react-i18next';



export default function Ethereumrpc() {
  const {t} = useTranslation(['nodeLogs']);
  const nodeLogRequest = useRequest(
    body => ({
      url: '/nodelogapi/ethereumrpc',
      method: 'post',
      body: JSON.stringify(body),
    }),
    {manual: true},
  );

  useEffect(() => {
    nodeLogRequest.run();
  }, []); 

  if (nodeLogRequest.loading) {
    return <Loading />;
  }

  const data = nodeLogRequest?.data?.ethrpc_reqs || []; 
  // const data = weeknetIncreaseRequest?.data || [];
  // const counts = weeknetIncreaseRequest.data?.length || 0; 
  // const totalPage = Math.ceil(Number(counts) / state.body.length);
/*   const data = 
   [
    {
      "method": "eth_blockNumber",
      "percent": "0.30",
      "total_req": 27619,
      "hits": 27619,
      "failed_req": 0,
      "visitors": 13,
      "bandwidth": "1.00 MiB",
      "avg_time": "0.0013",
      "max_time": "0.1280",
      "min_time": "0.0000"
      },
      {
      "method": "eth_getBlockByNumber",
      "percent": "0.28",
      "total_req": 25901,
      "hits": 25901,
      "failed_req": 0,
      "visitors": 25,
      "bandwidth": "349.76 MiB",
      "avg_time": "0.0018",
      "max_time": "12.0080",
      "min_time": "0.0000"
      },
      {
      "method": "eth_call",
      "percent": "0.27",
      "total_req": 24855,
      "hits": 24855,
      "failed_req": 0,
      "visitors": 13,
      "bandwidth": "1.00 MiB",
      "avg_time": "0.0101",
      "max_time": "0.5800",
      "min_time": "0.0000"
      },
      {
      "method": "eth_getTransactionReceipt",
      "percent": "0.05",
      "total_req": 4929,
      "hits": 4929,
      "failed_req": 0,
      "visitors": 4,
      "bandwidth": "13.47 MiB",
      "avg_time": "0.0023",
      "max_time": "0.1120",
      "min_time": "0.0000"
      },
      {
      "method": "eth_getTransactionCount",
      "percent": "0.02",
      "total_req": 2010,
      "hits": 2010,
      "failed_req": 0,
      "visitors": 5,
      "bandwidth": "173.62 KiB",
      "avg_time": "0.0034",
      "max_time": "0.1560",
      "min_time": "0.0000"
      },
      {
      "method": "hpb_sendRawTransaction",
      "percent": "0.02",
      "total_req": 1860,
      "hits": 1860,
      "failed_req": 0,
      "visitors": 2,
      "bandwidth": "259.37 KiB",
      "avg_time": "0.0032",
      "max_time": "0.1920",
      "min_time": "0.0000"
      },
      {
      "method": "web3_clientVersion",
      "percent": "0.01",
      "total_req": 1288,
      "hits": 1288,
      "failed_req": 0,
      "visitors": 1,
      "bandwidth": "103.07 KiB",
      "avg_time": "0.0013",
      "max_time": "0.0160",
      "min_time": "0.0000"
      },
      {
      "method": "eth_getLogs",
      "percent": "0.01",
      "total_req": 1180,
      "hits": 1180,
      "failed_req": 0,
      "visitors": 6,
      "bandwidth": "170.02 KiB",
      "avg_time": "0.0042",
      "max_time": "0.1240",
      "min_time": "0.0000"
      },
      {
      "method": "eth_getBlockByHash",
      "percent": "0.01",
      "total_req": 698,
      "hits": 698,
      "failed_req": 0,
      "visitors": 1,
      "bandwidth": "1.48 MiB",
      "avg_time": "0.0016",
      "max_time": "0.0200",
      "min_time": "0.0000"
      },
      {
      "method": "eth_getTransactionByHash",
      "percent": "0.01",
      "total_req": 572,
      "hits": 572,
      "failed_req": 0,
      "visitors": 2,
      "bandwidth": "458.51 KiB",
      "avg_time": "0.0056",
      "max_time": "0.1000",
      "min_time": "0.0000"
      },
      {
      "method": "eth_sendRawTransaction",
      "percent": "0.00",
      "total_req": 450,
      "hits": 450,
      "failed_req": 0,
      "visitors": 3,
      "bandwidth": "52.37 KiB",
      "avg_time": "0.0027",
      "max_time": "0.1440",
      "min_time": "0.0000"
      },
      {
      "method": "eth_gasPrice",
      "percent": "0.00",
      "total_req": 124,
      "hits": 124,
      "failed_req": 0,
      "visitors": 6,
      "bandwidth": "6.24 KiB",
      "avg_time": "0.0010",
      "max_time": "0.0120",
      "min_time": "0.0000"
      },
      {
      "method": "net_version",
      "percent": "0.00",
      "total_req": 124,
      "hits": 124,
      "failed_req": 0,
      "visitors": 2,
      "bandwidth": "8.70 KiB",
      "avg_time": "0.0008",
      "max_time": "0.0040",
      "min_time": "0.0000"
      },
      {
      "method": "eth_getBalance",
      "percent": "0.00",
      "total_req": 120,
      "hits": 120,
      "failed_req": 0,
      "visitors": 13,
      "bandwidth": "9.86 KiB",
      "avg_time": "0.0035",
      "max_time": "0.0440",
      "min_time": "0.0000"
      },
      {
      "method": "eth_chainId",
      "percent": "0.00",
      "total_req": 43,
      "hits": 43,
      "failed_req": 0,
      "visitors": 15,
      "bandwidth": "2.09 KiB",
      "avg_time": "0.0012",
      "max_time": "0.0040",
      "min_time": "0.0000"
      },
      {
      "method": "prometheus_getHpbNodes",
      "percent": "0.00",
      "total_req": 40,
      "hits": 40,
      "failed_req": 0,
      "visitors": 4,
      "bandwidth": "18.40 KiB",
      "avg_time": "0.0084",
      "max_time": "0.0760",
      "min_time": "0.0000"
      },
      {
      "method": "prometheus_getCandidateNodes",
      "percent": "0.00",
      "total_req": 40,
      "hits": 40,
      "failed_req": 0,
      "visitors": 4,
      "bandwidth": "25.79 KiB",
      "avg_time": "0.0134",
      "max_time": "0.1760",
      "min_time": "0.0000"
      },
      {
      "method": "hpb_blockNumber",
      "percent": "0.00",
      "total_req": 5,
      "hits": 5,
      "failed_req": 0,
      "visitors": 1,
      "bandwidth": "345.00 B",
      "avg_time": "0.0000",
      "max_time": "0.0000",
      "min_time": "0.0000"
      },
      {
      "method": "eth_syncing",
      "percent": "0.00",
      "total_req": 2,
      "hits": 2,
      "failed_req": 0,
      "visitors": 1,
      "bandwidth": "82.00 B",
      "avg_time": "0.0000",
      "max_time": "0.0000",
      "min_time": "0.0000"
      },
      {
      "method": "eth_estimateGas",
      "percent": "0.00",
      "total_req": 1,
      "hits": 1,
      "failed_req": 0,
      "visitors": 1,
      "bandwidth": "67.00 B",
      "avg_time": "0",
      "max_time": "0.0000",
      "min_time": "0.0000"
      }
  ]
  */



  return (
    <div className="tab-pane fade active show" role="tabpanel" aria-labelledby="events-tab">
      <div className="d-md-flex justify-content-between align-items-center mb-4"> 
        {/* <Pager2 current={state.body.start} total={totalPage} pageChange= {handleCurrentPage}  /> */}
 
      </div>
      <div className="table-responsive">
        <table className="table table-md-text-normal table-hover">
          <thead className="thead-light">
            <tr>
              <th scope="col" width="60">
              {t('nodeLogs.table.rank')}                    
              </th>             
              <th scope="col">{t('nodeLogs.table.eth.Method')}</th>
              <th scope="col">{t('nodeLogs.table.eth.Percent')}</th>
              <th scope="col">{t('nodeLogs.table.eth.Hits')}</th>
              <th scope="col">{t('nodeLogs.table.eth.Vistors')}</th>
              <th scope="col">{t('nodeLogs.table.eth.BandWidth')}</th>
              <th scope="col">{t('nodeLogs.table.eth.AvgTime')}</th> 
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => {
                   
              return (
                <tr key={i}>
                  <td>
                    {i + 1} 
                  </td>
                  
                  <td>{item.method}</td>
                  <td>{item.percent} %</td>
                  <td>{item.hits}</td>  
                  <td>{item.visitors}</td>
                  <td>{item.bandwidth}</td>
                  <td>{item.avg_time}</td> 
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="d-flex justify-content-md-end align-items-center text-secondary mb-2 mb-md-0 my-3">
          <div className="d-inline-block">
 
          {/* <Pager2 current={state.body.start} total={totalPage} pageChange= {handleCurrentPage}  /> */}
          </div>
        </div>
      </div>
      
    </div>
  );
}
