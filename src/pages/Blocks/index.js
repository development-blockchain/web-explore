import {useState, useContext,useEffect} from 'react';
import UserContext from '../../UserContext';
import {useRequest} from 'ahooks';
import {useLocation, Link} from 'react-router-dom'; 
import {useTranslation} from 'react-i18next';
import Pager4 from '../../components/Pager4';
import Loading from '../../components/Loading';
import TimeTD from '../../components/TimeTD'; 
import LinkWithTooltip from '../../components/LinkWithTooltip';

import moment from 'moment';

export default function Blocks() {

  const userContext = useContext(UserContext); 
  const [user, setUser] = useState({
    token: userContext.user.token || undefined,
    email:userContext.user.email || undefined,
    key: userContext.user.key || undefined,
    publicKey: userContext.user.publicKey || undefined,
    provider_username: userContext.user.provider_username || undefined,
    provider_pubkey: userContext.user.provider_pubkey || undefined,
  }); 
 
  const {t} = useTranslation(['blocks']);

  const [type, setType] = useState('showAge');   
  const defaultLNG = window.localStorage.getItem('lng') || 'zh_CN';
  moment.locale(defaultLNG);

 
  const [params,setParams]=useState({
    start: '1',
    length:  window.localStorage.getItem('pageLength') || '50',
    field:'',
    value:''
  })
 

  const [state, setState] = useState({
    body: {
      start: '1',
      length:  window.localStorage.getItem('pageLength') || '50',
      field:'',
      value:'' 
    },
  });

 

  const handleChangePageSize = e => {
    window.localStorage.setItem('pageLength', e.target.value);
    setState({...state, body: {...state.body, length: e.target.value}});
  };

  const handleSelectField = e => {   
    if(e.target.value ===''){
      setParams({...params, "field": "", "value":""});
      return ;
    }
    setParams({...params, "field": e.target.value});
  }; 
  
  const handleChangeValue = e => {  
    setParams({...params, "value": e.target.value});
  };
  const handleChangPageNum = curNum=>{
    setParams({...params, "start":curNum});
    setState({...state, body: {...state.body,"start":curNum}});
  }
  const queryData=e=>{ 
    if(params.value ===''){
      params.field ='';
    }
    setState({...state, body: {...state.body,...params,"start":"1"}});
   
  }
  const blocksRequest = useRequest(
    body => ({
      url: '/chainBrowser/blockchain/getBlocks',
      method: 'post',
      headers: {
        'Authorization': user.token,
      },
      body: JSON.stringify(body),
    }),
    {manual: true},
  );

  useEffect(() => {
    blocksRequest.run(state.body);
  }, [state]);

  if (blocksRequest.loading) {
    return <Loading />;
  }
  if (!user.token) {
    return (window.location.href = '/login');
  } 
  
  const data = blocksRequest.data?.block_list || [];
  const counts = blocksRequest.data?.counts || 0;
  const firstBlock = data[0] || {};
  const lastBlock = data[data.length - 1] || {};
  const totalPage = Math.ceil(Number(counts) / state.body.length);
   
  return (
    <main id="content" role="main"> 
      <div className="container-fluid space-bottom-2 p-3">
        <div className="card">
          <div className="header-title">
              <h4 className="card-title p-2">{t('blocks.title')}&nbsp;</h4>
          </div>
          <div className="card-body">
            <div  className="row d-md-flex justify-content-between mb-1"> 
              <p className="ml-3 mb-2 mb-md-0"> 
                {/* {t('blocks.tip1')} #{firstBlock.block_no} {t('blocks.tip2')} #{lastBlock.block_no} ({t('blocks.tip3')} {counts} {t('blocks.tip4')}) */}
              </p>
              <div className="mr-3">
                <div className="input-group input-group-shadow">
                  <div className="input-group-prepend d-md-block mr-2" >
                  <select id="selectKey" className="form-control form-control-sm mb-3 "   onChange={e=>handleSelectField(e)} value={params.field}>
                          <option value="" >请选择关键字</option>
                          <option value="block_id">区块高度</option>
                          <option value="block_hash">区块哈希</option> 
                      </select> 
                  </div>
                  <input type="text" className="form-control form-control-sm mr-2" id="keywrokds"  placeholder="请输入关键字" 
                   value={params.value} onChange={e=>handleChangeValue(e)}  /> 
                  <div className="">
                    <button type="button" className="btn btn-primary btn-sm" onClick={e=>queryData(e)}>搜索</button>
                  </div>
                </div> 
              </div> 

            </div>
            <div className="table-responsive mb-2 mb-md-0">
              <table className="table data-table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>{t('blocks.table.Id')}</th> 
                    <th>{t('blocks.table.BlockHash')}</th> 
                    <th scope="col"> 
                        <div className="mr-2">
                        {
                          (type ==='showAge')?
                            <LinkWithTooltip placement="bottom" tooltip="点击切换日期格式">
                              <a href="#!" title="" onClick={e => {  e.preventDefault(); setType('showDate'); }} >
                                {t('blocks.table.age')}
                              </a>
                            </LinkWithTooltip>
                          :
                            <LinkWithTooltip placement="bottom" tooltip="点击切换块龄格式"> 
                              <a href="#!" onClick={e => {  e.preventDefault(); setType('showAge'); }}    > 
                                {t('blocks.table.time')}
                              </a>
                            </LinkWithTooltip>
                        }
                        </div>
                    </th> 
                    <th> {t('blocks.table.TxNum')}</th>
                  </tr>
                </thead>
                <tbody>
                  
                  { data.length >0? data.map(item => {  
                    const formatTime=moment(item.timestamp).format("YYYY-MM-DD HH:mm:ss"); //2022-03-25 14:59:13

                    return (
                      <tr key={item.block_Id}>
                        <td className='td_normal'>
                          <Link to={`/block/${encodeURIComponent(item.block_Id) }`} className="hash-tag text-truncate" data-toggle="tooltip" style={{maxWidth:'200px'}} title={item.block_Id } >
                            {item.block_Id }
                          </Link> 
                        </td> 
                        <td className='td_hash'>
                          <Link to={`/block/${encodeURIComponent(item.block_hash) }`} className="hash-tag text-truncate" data-toggle="tooltip" style={{maxWidth:'300px'}} title={item.block_hash } >
                            {item.block_hash }
                          </Link> 
                        </td>  
                        
                        <TimeTD time={item.timestamp} interval={item.interval_timestamp} type={type} />

                        <td className='td_normal'>{item.tx_counts }</td>
                      </tr>
                    );
                  }):
                  <tr>
                    <td colSpan={8} className="text-center">无数据</td>
                  </tr>
                }
                </tbody>
              </table>
            </div>
            <div id="ContentPlaceHolder1_pageRecords"> 
                <div className="d-md-flex justify-content-between my-3">
                  <div className="d-flex align-items-center text-secondary mb-2 mb-md-0">
                    <span style={{width:60}}> {t('blocks.tip5')}</span>
                    <select  className="custom-select custom-select-xs mx-2" onChange={handleChangePageSize} value={state.body.length}>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                    <span style={{width:60}}> {t('blocks.tip6')}</span>
                  </div>
                  <Pager4  current={params.start} handleChangPageNum={handleChangPageNum} total={totalPage} />
                </div>
 
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
