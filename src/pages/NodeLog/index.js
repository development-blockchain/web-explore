import {useState, useContext,useEffect} from 'react';
import UserContext from '../../UserContext';
import {useRequest} from 'ahooks';
import {useParams, Link} from 'react-router-dom';  
import Pager4 from '../../components/Pager4';
import Loading from '../../components/Loading';
import TimeTD from '../../components/TimeTD'; 
import LinkWithTooltip from '../../components/LinkWithTooltip';

import moment from 'moment';

export default function NodeLog() {

  let {nodename} = useParams(); 
  nodename = decodeURIComponent(nodename);

     
  const userContext = useContext(UserContext); 
  const [user, setUser] = useState({
    token: userContext.user.token || undefined,
    email:userContext.user.email || undefined,
    key: userContext.user.key || undefined,
    publicKey: userContext.user.publicKey || undefined,
    provider_username: userContext.user.provider_username || undefined,
    provider_pubkey: userContext.user.provider_pubkey || undefined,
  });  
  const defaultLNG = window.localStorage.getItem('lng') || 'zh_CN';
  moment.locale(defaultLNG);

 
  const [params,setParams]=useState({ 
    lines:500,
    level:"info",
    node_name:nodename 
  })
 

  const [state, setState] = useState({
    body: { 
      lines:500,
      level:"info",
      node_name:nodename 
    },
  });
  
  const downloadRequest = useRequest(
    body => ({
      url: '/chainBrowser/user/monitor/downloadLog',
      method: 'post',
      headers: {
        'Authorization': user.token,
      },
      body: JSON.stringify(body),
      responseType: "blob", // 代表内存之中的一段为二进制
    }),
    {manual: true},
  );


  const download=(e,second)=>{ 
    e.preventDefault();
    const form  = {
      "node_name":nodename,
      "duration":second
    }
    downloadRequest.run({...form}).then((data)=>{ 
      const file = new Blob([data.logs], {type: 'text/plain'}); 
      const fileName = nodename + new Date().getTime() + ".log";
        // 可通过XMLHttpRequest对象,获取响应头 
        // 浏览器兼容 参数Blob类型
        const downloadURL =URL.createObjectURL(file);
        // 创建a标签
        var a = document.createElement('a');
        // 下载后文件的名字
        a.download = fileName;
        a.href = downloadURL;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            // 移除内存中的临时文件路径和为下载而创建的a标签
            URL.revokeObjectURL(downloadURL);
            a.remove();
        }, 10000) 
    });
     
  }

  const handleSelectField = e => {   
    if(e.target.value ===''){
      setParams({...params, "level": ""});
      return ;
    }
    setParams({...params, "level": e.target.value});
  }; 


  const handleSelectField2 = e => {   
    if(e.target.value ===''){
      setParams({...params, "lines": "10"});
      return ;
    }
    setParams({...params, "lines": Number(e.target.value)});
  }; 
 
  const queryData=e=>{  
    setState({...state, body: {...state.body,...params}});
   
  }

  const nodeLogRequest = useRequest(
    body => ({
      url: '/chainBrowser/user/monitor/nodeLog',
      method: 'post',
      headers: {
        'Authorization': user.token,
      },
      body: JSON.stringify(body),
    }),
    {manual: true},
  );

  useEffect(() => {
    nodeLogRequest.run(state.body);
  }, [state]);

  if (nodeLogRequest.loading) {
    return <Loading />;
  }
  if (!user.token) {
    return (window.location.href = '/login');
  }  
  const data = nodeLogRequest.data?.logs||[]; 
    
  return (
    <main id="content" role="main"> 
      <div className="container-fluid space-bottom-2 p-3">
        <div className="card">
          <div className="header-title"> 
 
            <div className="d-flex justify-content-between align-items-center p-3">
                <h5 className="font-weight-bold">{nodename}节点日志</h5> 
                <div className="btn-group" role="group">
                    <button id="btnGroupDrop1" type="button" className="btn btn-info btn-sm dropdown-toggle" data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-1" width="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      下载日志
                    </button>
                    <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                      <a className="dropdown-item" href="#!" onClick={e=>download(e,3600)}>1小时</a>
                      <a className="dropdown-item" href="#!" onClick={e=>download(e,43200)}>12小时</a>
                      <a className="dropdown-item" href="#!"onClick={e=>download(e,86400)} >24小时</a>
                      <a className="dropdown-item" href="#!"onClick={e=>download(e,172800)} >48小时</a>
                    </div>
                </div>
            </div>
          </div>
          <div className="card-body p-3">
        
            <div  className="row d-md-flex justify-content-between mb-1"> 
              <p className="ml-3 mb-2 mb-md-0"> 
                 共有{data.length}条记录
              </p>
              <div className="mr-3">
                <div className="input-group input-group-shadow">
                  <div className="input-group-prepend d-md-block mr-2" >
                    <select id="level" className="form-control form-control-sm mb-3 "   onChange={e=>handleSelectField(e)} value={params.level}>
                      <option value="">请选择日志级别</option>
                      <option value="error">error</option> 
                      <option value="info">info</option>
                      <option value="debug">debug</option> 
                    </select> 
                  </div>
                  <div className="input-group-prepend d-md-block mr-2" >
                    <select id="lines" className="form-control form-control-sm mb-3 "   onChange={e=>handleSelectField2(e)} value={params.lines}> 
                          <option value="500">500</option>
                          <option value="1000">1000</option> 
                          <option value="2000">2000</option>  
                      </select> 
                  </div> 
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
                   
                    <th>日志级别</th> 
                    <th >日志</th>  
                  </tr>
                </thead>
                <tbody>
                  
                  { data.length >0? data.map((item,index) => { 
                    const obj = JSON.parse(item);;
                    return (
                      <tr key={index}> 
                        <td>
                          { 
                          obj.level ==='error'?
                            <span className="u-label u-label--sm u-label--danger rounded">Error</span>:
                            (obj.level==='debug'?
                            <span className="u-label u-label--sm u-label--warning rounded">Debug</span> 
                            :
                            <span className="u-label u-label--sm u-label--info rounded">Info</span> 
                            )
                          }  
                        </td>   
                        <td>{item}</td> 
                      </tr>
                    );
                  }):
                  <tr key={1}>
                    <td colSpan={2} className="text-center">无数据</td>
                  </tr>
                }
                </tbody>
              </table>
            </div>
            
          </div>
        </div>
      </div>
    </main>
  );
}
