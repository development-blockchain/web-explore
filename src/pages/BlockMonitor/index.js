import {useEffect, useState} from 'react';
import {useRequest} from 'ahooks';
import {useLocation} from 'react-router-dom';
import qs from 'qs'; 
import Loading from '../../components/Loading'; 
import {useTranslation} from 'react-i18next';

export default function BlockMonitor() {
  const {t} = useTranslation(['blockmonitor']);
  const location = useLocation();
  const query = qs.parse(location.search, {ignoreQueryPrefix: true});
  const [state, setState] = useState({
    body: {
      start: query.p || '1',
      length: window.localStorage.getItem('pageLength') || '50'    
    },
  });
  const [type, setType] = useState('showAge');   
  const handleChangePageSize = e => {
    window.localStorage.setItem('pageLength', e.target.value);
    setState({...state, body: {...state.body, length: e.target.value}});
  };

  const blockMonitorListRequest = useRequest(
    body => ({
      url: '/blockBrowser/blockChain/block/blockMonitorList',
      method: 'post',
      body: JSON.stringify(body),
    }),
    {manual: true},
  );

  useEffect(() => {
    blockMonitorListRequest.run(state.body);
  }, [state]);

  if (blockMonitorListRequest.loading) {
    return <Loading />;
  }

  const data = blockMonitorListRequest.data?.info_list || [];
  const counts = blockMonitorListRequest.data?.info_list.length || 0; 
 
  return (
    <main id="content" role="main">
      <div className="container py-3">
        <div className="d-sm-flex align-items-center">
          <div className="mb-2 mb-sm-0">
            <h1 className="h4 mb-0">
              <span>{t('blockmonitor.title')}</span> 

            </h1>
          </div>
        </div>
      </div>

      <span id="ContentPlaceHolder1_lblAdResult"></span>
      <div className="container space-bottom-2">
        <div className="card">
          <form method="post" action="./txsInternal?p=1" id="ctl00">
            <div className="card-body">
              <div className="d-md-flex justify-content-between mb-4">
                <p className="mb-1 mb-md-0">
                  <div class="mb-1 mb-md-0"><h2 class="card-header-title">{t('blockmonitor.tip7')}</h2></div> 

                  <i id="spinwheel" className="fa fa-spin fa-spinner fa-1x fa-pulse mr-1 mt-1" style={{display: 'none'}}></i>{t('blockmonitor.tip1')} {counts} {t('blockmonitor.tip2')}
                </p> 
 
              </div>
              <div className="table-responsive mb-2 mb-md-0">
                <table className="table table-hover">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">{t('blockmonitor.table.Round')}</th> 
                      <th scope="col">{t('blockmonitor.table.lostBlockNum')}</th>
                      <th scope="col">{t('blockmonitor.table.nodeName')}</th>
                      <th scope="col">{t('blockmonitor.table.nodeAddress')}</th> 
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, i) => {  
                      return ( 
                        item.lost_list.map((child,j)=>{
                           return (
                            <tr key={i*3+j}>  
                                <td className="bg-soft-secondary">
                                  
                                    {j=== 0 ? 
                                      <span className="text-danger" data-toggle="tooltip" title="" data-original-title="Error in Main Txn : execution reverted">
                                            <strong>
                                            <i className="fa fa-exclamation-circle"></i>
                                            </strong>
                                            {item.round}
                                        </span> 
                                    : ''}
                                </td>
                                <td>{child.lost_block_num}</td>  
                                <td>{child.node_name_en}</td>  
                                <td>{child.node_addr}</td>  
                             </tr>
                           );
                        }) 
                      );
                    })}
                  </tbody>
                </table>
              </div> 
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
