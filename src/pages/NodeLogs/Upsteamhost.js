import {useRequest} from 'ahooks'; 
import React,{ useEffect,useState} from 'react'; 
import Loading from '../../components/Loading';
import LinkWithTooltip from '../../components/LinkWithTooltip'; 
import Pager2 from '../../components/Pager2';

import {useTranslation} from 'react-i18next';


export default function Upsteamhost() {
  const {t} = useTranslation(['nodeLogs']);
  const nodeLogRequest = useRequest(
    body => ({
      url: '/nodelogapi/upstreamhost',
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

  const data = nodeLogRequest?.data?.upstream_hosts || []; 
  // const data = weeknetIncreaseRequest?.data || [];
  // const counts = weeknetIncreaseRequest.data?.length || 0; 
  // const totalPage = Math.ceil(Number(counts) / state.body.length);

/*   const data = 
  [
    {
    "host": "172.26.15.150:8545",
    "total_req": 44622,
    "valid_req": 44622,
    "failed_req": 0,
    "bandwidth": "6.38 MiB",
    "uniq_visitor": 23
    } 
    ] */

     

 
 
    return (
    <div className="tab-pane fade active show" role="tabpanel" aria-labelledby="events-tab">
      <div className="d-md-flex justify-content-between align-items-center mb-4"> 
        {/* <Pager2 current={state.body.start} total={totalPage} pageChange= {handleCurrentPage}  /> */}
 
      </div>
      <div className="table-responsive">
        <table className="table table-md-text-normal table-hover">
          <thead className="thead-light">
            <tr> 
              <th scope="col" width="100">
                {t('nodeLogs.table.rank')}                
              </th>             
              <th scope="col">{t('nodeLogs.table.domain.Name')}</th>
              <th scope="col">{t('nodeLogs.table.domain.TotalReq')}</th>
              <th scope="col">{t('nodeLogs.table.domain.ValidReq')}</th>
              <th scope="col">{t('nodeLogs.table.domain.FailedReq')}</th>  
              <th scope="col">{t('nodeLogs.table.domain.BandWidth')}</th>
              <th scope="col">{t('nodeLogs.table.domain.UniqueVisitor')}</th>

            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => { 
              return (
                <tr key={i}>
                  <td>
                    {i + 1} 
                  </td> 
                  <td>{item.host}</td>
                  <td>{item.total_req}</td>
                  <td>{item.valid_req}</td>  
                  <td>{item.failed_req}</td>  
                  <td>{item.bandwidth}</td>  
                  <td>{item.uniq_visitor}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
         
      </div>
      
    </div>
  );
}
