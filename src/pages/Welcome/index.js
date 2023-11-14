import { useRequest } from 'ahooks';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import useWebSocket from 'react-use-websocket';
import Loading from '../../components/Loading';
// 引入ECharts主模块 
//引入echarts 
import echarts from 'echarts';
//引入中国地图 
import 'echarts/map/js/china';

import moment from 'moment';
import 'moment/locale/zh-cn';
import { useTranslation } from 'react-i18next';
  
function LatestBlock ({ data = [] }) { 
  const {t} = useTranslation(['home']);
  return (
    <div className="mCustomScrollBox mCS-minimal-dark mCSB_vertical mCSB_outside" style={{ maxHeight: 'none', tabindex: '0' }}>
      <div className="mCSB_container" style={{ position: 'relative', top: 0, left: 0 }} dir="ltr">
        {data.map((item, index) => {
          
          const now = new Date().getTime(); 
          const time = moment(now - Number(item.interval_timestamp) * 1000)
            .startOf('minute')
            .fromNow(); 
          return (
            <div key={item.block_Id}>
              {index !== 0 ? <hr className="hr-space" /> : undefined}
              <div  className="row">
                <div className="col-sm-4">
                  <div className="media align-items-sm-center mr-4 mb-1 mb-sm-0">
                    <div className="d-none d-sm-flex mr-2">
                      <span className="btn btn-icon btn-soft-secondary">
                        <span className="btn-icon__inner text-dark">Bk</span>
                      </span>
                    </div>
                    <div className="media-body">
                      <span className="d-inline-block d-sm-none">Block</span>  
                      <Link to={`/block/${encodeURIComponent(item.block_Id) }`} className="hash-tag text-truncate" data-toggle="tooltip"   title={item.block_Id } >
                        {item.block_Id }
                      </Link> 

                      <span className="d-sm-block small text-secondary ml-1 ml-sm-0 text-nowrap" data-countdown="5000">
                        {time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="d-flex justify-content-between">
                    <div className="text-nowrap">
                      <span className="d-block mb-1 mb-sm-0">
                      {t("home.LatestTrade.BlockHash")}&nbsp; 
                        <Link to={`/block/${encodeURIComponent(item.block_hash) }`} className="hash-tag text-truncate" data-toggle="tooltip" style={{maxWidth:'200px'}} title={item.block_hash } >
                            {item.block_hash }
                        </Link> 

                      </span>
                      
                      {t('home.LatestTrade.TxCount')} &nbsp;
                      <span className="small text-secondary">{item.tx_counts} </span> 
                    </div>
                  </div>
                </div>


              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LatestTrade ({ data = [] }) {
  const {t} = useTranslation(['home']);
  return (
    <div className="" tabIndex="0" style={{ maxHeight: 'none' }}>
      <div className="" style={{ position: 'relative', top: 0, left: 0 }} dir="ltr">
        {data.map((item, index) => {
           
          const now = new Date().getTime();
          const time = moment(now - Number(item.interval_timestamp) * 1000)
            .startOf('minute')
            .fromNow();
          return (
            <div key={item.tx_hash}>
              <div className="row">
              <div className="col-sm-5">
                  <div className="media align-items-sm-center mr-4 mb-1 mb-sm-0">
                    <div className="d-none d-sm-flex mr-2">
                      <span className="btn btn-icon btn-soft-secondary rounded-circle">
                        <span className="btn-icon__inner text-dark">Tx</span>
                      </span>
                      &nbsp;
                    </div>
                    <div className="media-body">
                      <span className="d-inline-block d-sm-none mr-1">Tx#</span>
                      <Link to={`/tx/${encodeURIComponent(item.tx_hash)}`} className="hash-tag text-truncate" data-toggle="tooltip"   title={item.tx_hash } >
                        {item.tx_hash }
                      </Link>
                      <span className="d-none d-sm-block small text-secondary">
                        <div data-countdown="5000">{time}</div>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-7">
                  <div className="d-sm-flex justify-content-between">
                    <div className="text-nowrap mr-4 mb-1 mb-sm-0">
                      <span>
                        {t("home.LatestTrade.BlockId")}&nbsp;
                        <Link to={`/block/${encodeURIComponent(item.block_Id) }`} className="hash-tag text-truncate" data-toggle="tooltip" style={{maxWidth:'200px'}} title={item.block_Id } >
                            {item.block_Id }
                        </Link> 
                      </span>
                      <span className="d-sm-block">
                      {t("home.LatestTrade.BlockHash")}&nbsp;
                        <Link to={`/block/${encodeURIComponent(item.block_hash) }`} className="hash-tag text-truncate" data-toggle="tooltip" style={{maxWidth:'200px'}} title={item.block_hash } >
                            {item.block_hash }
                        </Link> 
                      </span>
                    </div>
                    < div>
                      {/* &nbsp;
                      <span className="u-label u-label--xs u-label--badge-in u-label--secondary text-center text-nowrap" title="Amount">
                        {item.trade_amount} HPB
                      </span> */}
                    </div>
                  </div>
                </div> 
              </div>
              <hr className="hr-space" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const compareDate = function (obj1, obj2) {
  var val1 = obj1.day;
  var val2 = obj2.day;
  if (val1 < val2) {
      return -1;
  } else if (val1 > val2) {
      return 1;
  } else {
      return 0;
  }            
} 

function LineChart({chartData=[]}){

  const [darkMode, setDarkMode] = useState(localStorage.getItem('dark') ||'false');
  const initalLineEcharts=(mode)=>{
    let dataTime =[], dataValue= [] ;
    const data =  chartData ||[];
    data.sort(compareDate);
    let len =data.length;
   
    for(let i=0; i <len;i++){   
      const formatTime=moment(Number(data[i].day)).format("YYYY-MM-DD"); //2022-03-25 14:59:13
      dataTime.push(formatTime);
      dataValue.push(data[i].count);
    }
    
     //echarts的渲染逻辑是这样的:
    //如果未实例化则进行实例化过程, 在此期间会在div容器生成一个_echarts_instance_属性, 该属性值其实就是当前
    //echarts的ID, 然后进行后边的渲染操作,
    //当我们刷新已经实例化的echarts图表时, echarts会先匹配改div容器上的_echarts_instance_属性值是否与实例对象的ID一
    // 样, 如果一样则会在原有的结构上进行渲染, 但是因为我破坏了原有的结构, 所以无法重新渲染出表格内容,
    // 所以我们可以执行如下代码 才能切换Theme

    const chartLine = document.getElementById('chart-line');
    if(!chartLine) return ;
    chartLine.setAttribute('_echarts_instance_', '');
    let lineChart = echarts.init(document.getElementById("chart-line"),mode); 
   

    let mapoption =  {
     //用于鼠标悬浮折线区域的数据提示 
      title : {
        text: '14天内交易历史', 
        padding: 10,
        textStyle: {
          fontSize: 26
        },
        x:'center'
      },
      tooltip: {
        show: true,
        trigger:'axis' 
      }, 
      xAxis: {
        type: 'category', 
        data: dataTime,
        textStyle: {   //坐标字体样式
          color: '#AEAEAE'
        },
        axisLine: {   //坐标线
            show: false
        },
        axisTick: {  //坐标刻度
            show: false
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        textStyle: {
            color: '#AEAEAE'
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        } 
      },
      grid: { 
        left: '0',
        right: '15%',
        bottom: '10%',
        top: '15%',
        containLabel: true  //坐标刻度标签，改为false 坐标都没有了
      },
      series: [
        {
          data: dataValue         ,
          type: 'line',
          smooth: true,
          symbol: 'emptyCircle', 
          symbolSize:6,
          itemStyle: {
              color: 'rgb(93, 179, 230)'
          },
          areaStyle: {   //面积图面积部分颜色
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgb(150, 218, 244,0.6)'   //上部颜色
              }, {
                  offset: 1,
                  color: 'rgb(93, 179, 230, 0.1)'   //下部颜色
              }])
          },
        }
      ]
    }; 
    lineChart.setOption(mapoption); 
  }

  initalLineEcharts();
  useEffect(() => { 
    let mode =  (darkMode==='true'?'dark':'light')
      initalLineEcharts(mode); 
  }, [darkMode,chartData]) 



  return(
    <div className="col-lg-6 col-md-12">
    <div className="card">
        <div className="card-body"> 
          <div id="chart-line" style = {{height: 400}} className="custom-chart"></div>
        </div>
    </div>   
   </div> 
  )
} 

function MapChart({chartData=[]}){
  const [darkMode, setDarkMode] = useState(localStorage.getItem('dark') ||'false');

  const initalMapECharts=(mode) =>{  
    const chartMap = document.getElementById('chart-map');
    if(!chartMap) return ;
    chartMap.setAttribute('_echarts_instance_', '');
    let mapChart = echarts.init(document.getElementById("chart-map"), mode); 
 
    let mapoption = { 
        title : {
          text: '节点分布图', 
          padding: 15,
          textStyle: {
            fontSize: 26
          },
          x:'center'
        },
        tooltip : {
            trigger: 'item'
        },
        grid: {
          top: '4%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true 
        },
       
        geo: {
          map: "china",
         // 开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
          roam: false, 
          zoom: 1.2,
          scaleLimit: 1,
          label: {
            show: true,
            color: '#FFFFFF',
            fontSize: 10
          }
        }, 
        
        legend: {
            show:false,
            data:['节点数']
        }, 
        dataRange: { 
            // x: '-1000 px', // 图例横轴位置
            // y: '-1000 px', // 图例纵轴位置
            left: 'left',
	          top: 'bottom', 
            min: 0,
            max: 1000, 
            text:['高','低'],           // 文本，默认为数值文本
            calculable : true,
            inRange: {
              color: ['#048BD5', '#004098']
            },
            show:false
        },     
        series: [{
          name:'节点数',
          type: 'map',
          mapType: 'china',            
         
          aspectScale: 0.75,
          layoutCenter: ["50%", "50%"], //地图位置
          layoutSize: '100%',
          roam: true,
          geoIndex: 0,         
          data:chartData
      }] 

    }; 
    mapChart.setOption(mapoption); 
  }

  initalMapECharts();
  
  useEffect(() => { 
    let mode =  (darkMode==='true'?'dark':'light')
    initalMapECharts(mode); 
  }, [darkMode,chartData]) 

  return(
    <div className="col-lg-6 col-md-12">
    <div className="card">
        <div className="card-body"> 
          <div id="chart-map" style = {{height: 400}} className="custom-chart"></div>
        </div>
    </div>   
   </div> 
  )
}

export default function Welcome () { 

 
  const {t} = useTranslation(['home']); 

  const [darkMode, setDarkMode] = useState(localStorage.getItem('dark') ||'false');
 
  // 设置中文
  const defaultLNG = window.localStorage.getItem('lng') || 'zh_CN';
  moment.locale(defaultLNG); 

  const [blockChainData, setBlockChainData] = useState();
  const [dashboard, setDashboard] = useState();  

  const [latestBlock, setLatestBlock] = useState();
  const [latestTrade, setLatestTrade] = useState(); 

  const messageHistory = useRef([]); 
  const { lastMessage, readyState } = useWebSocket('ws://47.104.157.94:8080/chainBrowser/blockchain/ws/getLatestBlocksAndTxs');

  messageHistory.current = useMemo(() => lastMessage); 
 
  const blockChainRequest = useRequest(
    {
    url: '/chainBrowser/blockchain/index ',
    method: 'post'
    },
    {manual: true, formatResult: r => r},
  ); 
  const getStorage = () => {
    const item =localStorage.getItem('dark') ?? 'true'; 
    setDarkMode(item);
  };
  useEffect(() => { 
    async function fetch () { 
      blockChainRequest.run().then(res => { 
        console.log('blockChainRequest',res); 
        setBlockChainData(res.data)
        setLatestBlock(res.data.blocks);
      }); 
    }
    fetch();

    window.addEventListener('storage', getStorage); 
    return () => {
      window.removeEventListener('storage', getStorage);
    };

  },[]); 

  useEffect(() => {
    try {
      const data = JSON.parse(lastMessage.data);
      console.log('websocket--->',data)
      if (Array.isArray(data.blocks) && data.blocks.length) { 
        const latest = data.blocks[0];

        if (Array.isArray(latestBlock) && latestBlock.every(block => block.block_Id !== latest.block_Id)) {
          let blocks = [...latestBlock];
          blocks.unshift(latest);
          blocks.pop();
          setLatestBlock(blocks);
        } 
      }
      if (data.txs) {
        setLatestTrade(data.txs);
      }
    } catch (error) { }
  }, [lastMessage]);

  let block = latestBlock; 
  let trade = latestTrade;
  if (blockChainRequest.loading) {
    return <Loading />;
  }
 

  return (

    <div className="container-fluid">
      <div className="row">

        <div className="col-md-12 mb-4 mt-1">
          <div className="d-flex flex-wrap justify-content-between align-items-center">
              <h4 className="font-weight-bold">概况</h4> 
          </div>
        </div>
        <div className="col-md-12">
          <div className="row"> 

              <div className="col-md-3">
                <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                          <div className="">
                              <p className="mb-2 text-secondary">{t('home.Blocks')}</p>
                              <div className="d-flex flex-wrap justify-content-start align-items-center">
                                <h5 className="mb-0 font-weight-bold">{blockChainData?.chain.block_count}</h5>
                                {/* <p className="mb-0 ml-3 text-success font-weight-bold">{blockChainData?.chain.block_percent}%</p> */}
                              </div>                            
                          </div>
                      </div>
                    </div>
                </div>   
              </div> 

              <div className="col-md-3">
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                            <div className="">
                                <p className="mb-2 text-secondary">{t('home.Transactions')}</p>
                                <div className="d-flex flex-wrap justify-content-start align-items-center">
                                  <h5 className="mb-0 font-weight-bold">{blockChainData?.chain.tx_count}</h5>
                                  {/* <p className="mb-0 ml-3 text-success font-weight-bold">{blockChainData?.chain.tx_percent}%</p> */}
                                </div>                            
                            </div>
                        </div>
                    </div>
                </div>   
              </div>

              <div className="col-md-3">
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                            <div className="">
                              <p className="mb-2 text-secondary">{t('home.Nodes')}</p>
                              <div className="d-flex flex-wrap justify-content-start align-items-center">
                                  <h5 className="mb-0 font-weight-bold">{blockChainData?.chain.node_count}</h5>
                                  {/* <p className="mb-0 ml-3 text-danger font-weight-bold">{blockChainData?.chain.node_percent}%</p> */}
                              </div>                            
                            </div>
                        </div>
                    </div>
                </div>   
              </div>

              <div className="col-md-3">
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                            <div className="">
                              <p className="mb-2 text-secondary">{t('home.ChainCodes')}</p>
                              <div className="d-flex flex-wrap justify-content-start align-items-center">
                                  <h5 className="mb-0 font-weight-bold">{blockChainData?.chain.account_count}</h5>
                                  {/* <p className="mb-0 ml-3 text-danger font-weight-bold">{blockChainData?.chain.account_percent}%</p> */}
                              </div>                            
                            </div>
                        </div>
                    </div>
                </div>   
              </div>  
              <MapChart chartData={blockChainData?.nodes || []} />
              <LineChart chartData={blockChainData?.chart || []} />
          </div> 
        </div>

        <div className="col-md-12 mb-5">
          <div className="row">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <div className="card h-100">
                  <div className="card-header  d-flex justify-content-between">
                    <h2 className="card-header-title">{t('home.lasteblock.title')}</h2> 
                    <Link to='/blocks' className="btn  btn-sm btn-primary">更多</Link> 
                  </div>
                  <div className="card-body" style={{ height: '400px', position: 'relative', overflowY: 'scroll' }}>
                    <LatestBlock  data={block || []} />
                    <div className="" style={{ display: 'block' }}>
                      <div className="">
                        <div className="" style={{ position: 'absolute', minHeight: '50px', display: 'block', height: '224px', maxHeight: '366px', top: '0px' }}>
                          <div className="" style={{ lineHeight: '50px' }}></div>
                        </div>
                        <div className=""></div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="card-footer">
                    <a className="btn btn-xs btn-block btn-soft-primary" href="!#">
                    {t('home.lasteblock.viewBlocks')}
                    </a>
                  </div> */}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card h-100">
                  
                  <div className="card-header  d-flex justify-content-between">
                      <h2 className="card-header-title">{t('home.lasteTransactions.title')}</h2>
                      <Link to='/transactions' className="btn  btn-sm btn-primary">更多</Link>  
                  </div>

                  <div className="card-body" style={{ height: '400px', position: 'relative', overflowY: 'scroll' }}>
                    <LatestTrade data={trade} />
                    <div className="" style={{ display: 'block' }}>
                      <div className="">
                        <div className="" style={{ position: 'absolute', minHeight: '50px', display: 'block', height: '224px', maxHeight: '366px', top: 0 }}>
                          <div className="" style={{ lineHeight: '50px' }}></div>
                        </div>
                        <div className=""></div>
                      </div>
                    </div>
                  </div> 
                </div>
              </div>
          </div> 
        </div> 

      </div> 

    </div> 

  );
}
