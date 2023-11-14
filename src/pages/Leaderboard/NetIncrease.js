import {useRequest} from 'ahooks';
import moment from 'moment';
import React,{ useEffect,useState} from 'react'; 
import Loading from '../../components/Loading';
import LinkWithTooltip from '../../components/LinkWithTooltip'; 
import Pager2 from '../../components/Pager2';
import {useTranslation} from 'react-i18next';


export default function NetIncrease({address, overview}) {
  const {t} = useTranslation(['leaderboard']);
  const [state, setState] = useState({
    body: {
      start: '1',
      length: '25'
    },
  });
  const url = '/blockBrowser/leaderboard/weeknetincrease'
  const weeknetIncreaseRequest = useRequest(
    body => ({
      url: url, 
      method: 'post',
      body: JSON.stringify(body),
    }),
    {manual: true},
  );

  
  const handleCurrentPage = (page) =>{     
    setState({...state, body: {...state.body, start:page + ''}}); 
  }

  useEffect(() => {
    weeknetIncreaseRequest.run(state.body);
  }, [state]);

  if (weeknetIncreaseRequest.loading) {
    return <Loading />;
  }

  const data = weeknetIncreaseRequest?.data || [];
  const counts = weeknetIncreaseRequest.data?.length || 0; 
  const totalPage = Math.ceil(Number(counts) / state.body.length);



  return (
    <div className="tab-pane fade active show" role="tabpanel" aria-labelledby="events-tab">
      <div className="d-md-flex justify-content-between align-items-center mb-4">
        <p className="mb-2 mb-lg-0" style={{fontSize:'15px',fontWeight:'600'}}>
          <i className="fa fa-spin fa-spinner fa-1x fa-pulse" style={{display: 'none', marginTop: '4px', marginRight: '4px'}}>
            &nbsp;
          </i>
          <i className="fas fa-sort-amount-down" data-toggle="tooltip" data-placement="bottom" title="Oldest First"></i>&nbsp;
             {t('leaderboard.tip1')}
             <img className="ml-5 mr-2" alt="reward" src="/images/award/first.png?v=0.0.1" width="13" /> 100HPB
             <img className="ml-4  mr-2" alt="reward" src="/images/award/second.png?v=0.0.1" width="13" />50HPB
             <img className="ml-4  mr-2" alt="reward" src="/images/award/third.png?v=0.0.1" width="13" />25HPB
        </p>
        <Pager2 current={state.body.start} total={totalPage} pageChange= {handleCurrentPage}  />
      </div>
      <div className="table-responsive">
        <table className="table table-md-text-normal table-hover">
          <thead className="thead-light">
            <tr>
              <th scope="col" width="60">
                {t('leaderboard.table.rank')}                
              </th>             
              <th scope="col">{t('leaderboard.table.address')}</th>
              <th scope="col">{t('leaderboard.table.balance')}</th>
              <th scope="col">{t('leaderboard.table.netIncrease')}</th>
              <th scope="col" >{t('leaderboard.table.transaction')}</th>  
              <th scope="col">% {t('leaderboard.table.increase')}</th>
              <th scope="col">{t('leaderboard.table.totalVolume')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => {
                    // const WeekTime = moment(item.Weektime).format('YYYY-MM-DD HH:mm:ss');
                    // const Update_time = moment(item.Update_time).format('YYYY-MM-DD HH:mm:ss');       
                    var imgUrl = '';
                    if(i === 0){
                      imgUrl = "/images/award/first.png?v=0.0.1";
                    }else if(i === 1){
                      imgUrl = "/images/award/second.png?v=0.0.1";
                    }else if(i === 2){
                      imgUrl = "/images/award/third.png?v=0.0.1";
                    }
              return (
                <tr key={i}>
                  <td>
                    {i + 1 + Number(state.body.length) * (state.body.start - 1)}
                    {imgUrl===''?'': <img className="ml-2" alt="reward" src={imgUrl} width="13" />}
                  </td>
                 <td>
                    <span className="hash-tag text-truncate" style={{maxWidth:'200px'}}>
                    <LinkWithTooltip placement="bottom" tooltip={item.Address}>
                      <a className="hash-tag text-truncate"  href={`/address/${item.Address}`}
                        target="_parent"  data-boundary="viewport"  data-html="true"  data-toggle="tooltip"  data-placement="bottom" title=""      >
                        {item.Address}
                      </a>
                    </LinkWithTooltip>
                  
                    </span>
                  </td> 
                  <td>{item.Last_balance} HPB</td>
                  <td>{item.Net_increase} HPB</td>
                  <td>{item.Trans_count}</td>  
                  <td>{item.Per_increase}%</td>
                  <td>{item.Total_value} HPB</td> 
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="d-flex justify-content-md-end align-items-center text-secondary mb-2 mb-md-0 my-3">
          <div className="d-inline-block">
          <Pager2 current={state.body.start} total={totalPage} pageChange= {handleCurrentPage}  />
          </div>
        </div>
      </div>
      
    </div>
  );
}
