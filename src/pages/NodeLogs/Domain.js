import {useRequest} from 'ahooks'; 
import React,{ useEffect,useState} from 'react'; 
import Loading from '../../components/Loading'; 
import {useTranslation} from 'react-i18next';



export default function Domain() {
  const {t} = useTranslation(['nodeLogs']);
  const nodeLogRequest = useRequest(
    body => ({
      url: '/nodelogapi/domain',
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
 
  const data = nodeLogRequest?.data?.domains || [];  
 

   return (
    <div className="tab-pane fade active show" role="tabpanel" aria-labelledby="events-tab">
     
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
                  <td>{item.name}</td>
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
        <div className="d-flex justify-content-md-end align-items-center text-secondary mb-2 mb-md-0 my-3">
          <div className="d-inline-block"> 
            {/* <Pager2 current={state.body.start} total={totalPage} pageChange= {handleCurrentPage}  /> */}
          </div>
        </div>
      </div>
      
    </div>
  );
}
