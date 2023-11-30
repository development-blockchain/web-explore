import { useRequest } from 'ahooks';
import moment from 'moment';
import 'moment/locale/zh-cn';
import React, { useContext, useEffect, useState } from 'react'; 


import Chart   from "react-apexcharts";

import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import UserContext from '../../UserContext';
import Loading from '../../components/Loading';
import Pager4 from '../../components/Pager4';
import TimeTD from '../../components/TimeTD';

import LinkWithTooltip from '../../components/LinkWithTooltip';
import './nodelist.css'; 

 
function PieChart({chartData,darkMode}){ 
  if(!chartData?.cpu_info){
    return <></>
  } 
  const color = (darkMode==='true'?'#ffffff':'#324253')  ;
 const cpuInfo = { 
    series: [chartData.cpu_info.cpu_load.toFixed(2)],
    chart: { 
      id:'apex-cpu',
      type: 'radialBar' 
    },  
    options: {
      title:{
        text:'CPU使用情况',
        align:'center',
        style: {
          fontSize:  '14px',
          fontWeight:  'nromal',
          color:color
        },
      },
      plotOptions:{
        radialBar: {
          hollow: { 
            margin: 45,
            size: "55%"
          }, 
          dataLabels: {
            show: true,
            name: {
                show: true,
                fontSize: '14px',  
                color:color,
                offsetY: -10
              },
              value: {
                show: true,
                fontSize: '14px',  
                color:color,
                offsetY: 16,
                formatter: function (val) {
                  return val + '%'
                }
              }
          }
        }, 
      },
      labels: ['CPU使用率'],
      colors: [function({ value, seriesIndex, w }) {
        if (value < 60) {
            return '#00C851';
        } else if(value >=60 && value <80) {
          return '#FFBB32';
        }else {
          return '#FF4444';
        }
      }], 
    },   
  };  
   
  
  const memInfo = {
    series: [chartData.mem_info.mem_used_percent.toFixed(2)],
    chart: { 
      id:'apex-mem',
      type: 'radialBar' 
    },
   
    options: {
      title:{
        text:'内存使用情况',
        align:'center',
        style: {
          fontSize:  '14px',
          fontWeight:  'nromal', 
          color:color
        },
      },
      plotOptions:{
        radialBar: {
          hollow: {
            margin: 45,
            size: "55%"
          },
          dataLabels: {
            show: true,
            name: {
                show: true,
                fontSize: '14px',  
                color:color,
                offsetY: -10
              },
              value: {
                show: true,
                fontSize: '14px',  
                color:color,
                offsetY: 16,
                formatter: function (val) {
                  return val + '%'
                }
              }
          }
        },
      },
      labels: ['内存使用率'],
      colors: [function({ value, seriesIndex, w }) {
        if (value < 60) {
            return '#00C851';
        } else if(value >=60 && value <80) {
          return '#FFBB32';
        }else {
          return '#FF4444';
        }
      }]
    },
 
  };
  const restX = [];
  const restY = [];

  const restData = chartData.rest_info;
  for(let key in restData){
    restX.push(key);
    restY.push(restData[key]); 
  }   

  const restInfo = {
    chart: {
      id:'apex-rest',
      type: 'donut', 
    },
    options: {  
      labels:restX,
      title:{
        text:'Rest接口使用情况',
        align:'center',
        style: {
          fontSize:  '14px',
          fontWeight:  'nromal', 
          color:color
        },
      },
      xaxis: { categories: restX },
      plotOptions:{
        pie:{
          customScale: 0.8,
          donut:{
            size:'40%'
          }
        }
      }, 
      responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                show: false
            }
        }
      }],
      legend: {
        show:true,
        floating:true,
        showForSingleSeries:true,
          position: 'right',
          offsetY: 100 
      }
       
    }, 
    series: restY 
  };
 

  return <>
      
      <div className="card-body  p-2"> 
        <div className="row"> 
            <div className="col-sm-12 col-lg-4">
              {/* <div className="card-header d-flex justify-content-between  p-1">
                  <div className="header-title">
                    <h6 className="card-title font-weight-normal">CPU使用情况</h6>
                  </div>
              </div> */}
              <div className="card-body">
                  {/* <div id="apex-cpu"></div> */}
                  <Chart    options={cpuInfo.options}  series={cpuInfo.series}  type={cpuInfo.chart.type}  width="100%"    />
              </div>
            </div> 
            <div className="col-sm-12 col-lg-4">
              {/* <div className="card-header d-flex justify-content-between p-1">
                  <div className="header-title">
                    <h6 className="card-title font-weight-normal">内存使用情况</h6>
                  </div>
              </div> */}
              <div className="card-body">
                  <Chart   options={memInfo.options}  series={memInfo.series}  type={memInfo.chart.type}    width="100%"    />
              </div>
            </div> 
            <div className="col-sm-12 col-lg-4">
              {/* <div className="card-header d-flex justify-content-between  p-1">
                  <div className="header-title">
                    <h6 className="card-title font-weight-normal">Rest接口使用情况</h6>
                  </div>
              </div> */}
              <div className="card-body">
                <Chart   options={restInfo.options}  series={restInfo.series}  type={restInfo.chart.type}    width="90%"   />
              </div>
            </div>
          </div>  
      </div>
  </>
 
} 

function Node({data,darkMode}){ 
  if(!data.cpu_info){
      return <></>
  } 
   
  const {cpu_info,mem_info,sync_info,disk_info} = data;
  const updateTime =  moment(data.update_time).local().format('YYYY-MM-DD HH:mm:ss');
  return (<div>
      <div className="card-header d-md-flex justify-content-between align-items-center  p-1">
        <h1 className="h6 mb-0">
          节点概况
        </h1>
        <Link to={`/nodelog/${data?.node_name}`} className="btn  btn-sm btn-outline-primary ">节点日志</Link> 
      </div>
 
      <div className="col-12 mb-2">
        <div className="row">  
          <div className="col-lg-3 col-md-6 mt-1 col-lg-3-temp1" >
            <div className="card mb-1 border-warning">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="">
                      <p className="mb-2 text-secondary">最后更新时间</p>
                      <div className="d-flex flex-wrap justify-content-start align-items-center">
                        <h5 className="mb-0 font-weight-bold">{updateTime}</h5> 
                      </div>                            
                  </div>
                </div>
              </div>
            </div>   
          </div> 

          <div className="col-lg-3 col-md-6  mt-1 col-lg-3-temp2">
            <div className="card mb-1 border-danger ">
              <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="">
                        <p className="mb-2 text-secondary">节点名称</p>
                        <div className="d-flex flex-wrap justify-content-start align-items-center">
                          <h5 className="mb-0 font-weight-bold">{data?.node_name}</h5> 
                        </div>                            
                    </div>
                  </div>
              </div>
            </div>   
          </div>

          <div className="col-lg-3 col-md-6  mt-1 col-lg-3-temp2">
            <div className="card border-primary  mb-1">
              <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="">
                        <p className="mb-2 text-secondary">节点高度</p>
                        <div className="d-flex flex-wrap justify-content-start align-items-center">
                          <h5 className="mb-0 font-weight-bold">{data?.height}</h5> 
                        </div>                            
                    </div>
                  </div>
              </div>
            </div>   
          </div>

          <div className="col-lg-3 col-md-6  mt-1 col-lg-3-temp2">
            <div className="card border-info mb-1">
              <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="">
                        <p className="mb-2 text-secondary">节点peer数量</p>
                        <div className="d-flex flex-wrap justify-content-start align-items-center">
                          <h5 className="mb-0 font-weight-bold">{data?.peer_count}</h5> 
                        </div>                            
                    </div>
                  </div>
              </div>
            </div>   
          </div>

        

     
        </div>
      </div> 
 
      <PieChart chartData={data} darkMode={darkMode}/>     
      <div className="card-header d-md-flex justify-content-between align-items-center  p-1">  
        <h1 className="h6 mb-0">
          节点详情
        </h1>
       
      </div>
      <div className="card-body  p-1">
        <div className="row">
          <div className="col-lg-4  col-md-6">
            <div className="card">
                <ul className="list-group list-group-flush">
                    <li className="list-group-item p-1">
                        <h6 className="font-weight-bold pb-1  pt-1 text-center">CPU 使用情况</h6>
                        <div className="table-responsive">
                            <table className="table table-borderless mb-0">
                                <tbody>
                                    <tr className="white-space-no-wrap">
                                        <td className="text-muted pl-0">
                                          CPU 数量
                                        </td>
                                        <td>
                                            {cpu_info?.cpu_count}
                                        </td>
                                    </tr>
                                    <tr className="white-space-no-wrap">
                                        <td className="text-muted pl-0">
                                            CPU使用百分比
                                        </td>
                                        <td>
                                        {cpu_info?.cpu_load.toFixed(2)}%
                                        </td>
                                    </tr>
                                    <tr className="white-space-no-wrap">
                                        <td className="text-muted pl-0">
                                            CPU 进程数
                                        </td>
                                        <td>
                                            {cpu_info?.cpu_process_count}
                                        </td>
                                    </tr> 
                                    <tr className="white-space-no-wrap"> 
                                      <td className="text-muted pl-0">&nbsp;</td>
                                      <td>&nbsp;</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </li> 
                </ul>
            </div>
          </div>   
          <div className="col-lg-4  col-md-6">
            <div className="card">
                <ul className="list-group list-group-flush">
                    <li className="list-group-item p-1">
                        <h6 className="font-weight-bold pb-1 pt-1  text-center">内存使用情况</h6>
                        <div className="table-responsive">
                            <table className="table table-borderless mb-0">
                                <tbody>
                                    <tr className="white-space-no-wrap">
                                        <td className="text-muted pl-0">
                                            总内存
                                        </td>
                                        <td>
                                        {mem_info?.mem_total}
                                        </td>
                                    </tr>
                                    <tr className="white-space-no-wrap">
                                        <td className="text-muted pl-0">
                                            空闲内存
                                        </td>
                                        <td>
                                        {mem_info?.mem_free}
                                        </td>
                                    </tr>
                                    <tr className="white-space-no-wrap">
                                        <td className="text-muted pl-0">
                                            已使用内存
                                        </td>
                                        <td>
                                        {mem_info?.mem_used}
                                        </td>
                                    </tr>
                                    <tr className="white-space-no-wrap">
                                        <td className="text-muted pl-0">
                                            使用百分比
                                        </td>
                                        <td >
                                        {mem_info?.mem_used_percent.toFixed(2)}%
                                        </td>
                                    </tr>
                                    
                                </tbody>
                            </table>
                        </div>
                    </li> 
                </ul>
            </div>
          </div>  
          <div className="col-lg-4  col-md-6">
            <div className="card">
                <ul className="list-group list-group-flush">
                    <li className="list-group-item p-1">
                        <h6 className="font-weight-bold pb-1  pt-1  text-center">同步情况</h6>
                        <div className="table-responsive">
                            <table className="table table-borderless mb-0">
                                <tbody>
                                    <tr className="white-space-no-wrap">
                                        <td className="text-muted pl-0">
                                            是否开始同步
                                        </td>
                                        <td>
                                            {sync_info?.syncing?"是":"否"}
                                        </td>
                                    </tr>
                                    <tr className="white-space-no-wrap">
                                        <td className="text-muted pl-0">
                                            开始区块
                                        </td>
                                        <td>
                                          {sync_info?.start_block}
                                        </td>
                                    </tr>
                                    <tr className="white-space-no-wrap">
                                        <td className="text-muted pl-0">
                                            结束区块
                                        </td>
                                        <td>
                                          {sync_info?.end_block}
                                        </td>
                                    </tr>
                                    <tr className="white-space-no-wrap">
                                        <td className="text-muted pl-0">
                                            当前区块
                                        </td>
                                        <td className="text-primary">
                                          {sync_info?.cur_block}
                                        </td>
                                    </tr> 
                                </tbody>
                            </table>
                        </div>
                    </li> 
                </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="d-md-flex justify-content-between align-items-center  p-1">
        <h1 className="h6 mb-0">
          磁盘详情
        </h1>
      </div>
      <div className="card-body  p-1">
        <div className="row">
          <div className="col-lg-12"> 
            <ul className="list-group list-group-flush"> 
                <li className="list-group-item p-0">
                  <div className="table-responsive">
                        <table className="table mb-0">
                            <thead>
                                <tr className="text-muted">
                                  <th scope="col">盘符</th>
                                  <th scope="col" className="text-left">总空间</th>
                                  <th scope="col" className="text-left">空闲空间</th>
                                  <th scope="col" className="text-left">使用空间</th>
                                  <th scope="col" className="text-left">使用百分比（%）</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                             disk_info && Object.keys(disk_info).map(key => {
                                  const value = disk_info[key];
                                  return (
                                    <tr key={key}>
                                        <td>{value.disk_mount}</td>
                                        <td>{value.disk_space_total}</td>
                                        <td>{value.disk_space_free}</td>
                                        <td>{value.disk_space_used}</td> 
                                        <td>{value.disk_space_used_percent.toFixed(2)}%</td>
                                    </tr>
                                  )
                                }) 
                            }
                            </tbody>
                        </table>
                    </div> 
                </li> 
            </ul> 
          </div> 
        </div>
      </div>
   
      
  </div>)
}
 
export default function NodeList() {
  const defaultLNG = window.localStorage.getItem('lng') || 'zh_CN';
  moment.locale(defaultLNG);

  const userContext = useContext(UserContext); 
  const [user, setUser] = useState({
    token: userContext.user.token || undefined,
    email:userContext.user.email || undefined,
    key: userContext.user.key || undefined,
    publicKey: userContext.user.publicKey || undefined,
    provider_username: userContext.user.provider_username || undefined,
    provider_pubkey: userContext.user.provider_pubkey || undefined,
    permission: userContext.user.permission || undefined,
  });  
  const [darkMode, setDarkMode] = useState(localStorage.getItem('dark') ||'false');
  const [nodeList,setNodeList]=useState([])

  const [nodeData,setNodeData] =useState({});

  const [currentTab, setCurrentTab] = useState('');  
 

  const refreshData =(e)=>{
    e.preventDefault();
    nodeListRequest.run().then(res=>{ 
      setNodeList(res.data);
      if(res.data.length>0){
        // setCurrentTab(res.data[0].node_name);
        setNodeData(res.data[0]);
      }
    }); 
  }
  const nodeListRequest = useRequest(
    body => ({
      url: '/chainBrowser/user/monitor/allNodeInfo',
      method: 'post',
      headers: {
        'Authorization': user.token,
      } 
    }),
    {manual: true, formatResult: r => r},
  );
  const getStorage = () => {
    const item =localStorage.getItem('dark') ?? 'true'; 
    setDarkMode(item);
  };
  useEffect(() => { 
      nodeListRequest.run().then(res=>{ 
        setNodeList(res.data);
        if(res.data.length>0){
          setCurrentTab(res.data[0].node_name);
          setNodeData(res.data[0]);
        }
      }); 

      
    window.addEventListener('storage', getStorage); 
    return () => {
      window.removeEventListener('storage', getStorage);
    };

  }, []);
 
 
  if (nodeListRequest.loading) {
    return <Loading />;
  }

  if (!user.token) {
    return (window.location.href = '/login');
  }  

  return (
    <main id="content" role="main"> 
      <div className="container-fluid space-bottom-2  p-3" style={{overflow:'hidden'}}>
        <div className="card">
          <div className="header-title"> 
            <div className="d-flex justify-content-between align-items-center">
                <h4 className="card-title p-2">节点详情&nbsp;</h4> 
                <button className="btn btn-primary btn-sm mr-2"  onClick={e=>refreshData(e)}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="20"  fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg> 
                  刷新
                </button>
            </div>  
          </div> 

          <div className="p-1">
            <div className="row">  
              <div className="col-sm-2">
                 <div className="list-group list-group-lg mb-3">
                   {nodeList.filter(Boolean).map(node => {
                      return ( 
                        <a  className={`list-group-item list-group-item-action ${node.node_name === currentTab ? 'active' : ''}`} id={node.node_name} key={node.node_name} data-toggle="pill" href={`#${node.node_name}`} role="tab"
                            onClick={() => {  setCurrentTab(node.node_name);  setNodeData(node);  }} > {node.node_name}</a> 
                      );
                    })}    
                  </div>  
              </div>
              <div className="col-sm-10">
                <div className="tab-content mt-0" id="v-pills-tabContent">
                  <div className="tab-pane fade show active"  role="tabpanel" aria-labelledby="v-pills-home-tab">
                    <Node data={nodeData} darkMode={darkMode} />     
                  </div>
                </div>
              </div> 
            </div>
          </div>  
        </div> 
      </div>
    </main>
  );
}
