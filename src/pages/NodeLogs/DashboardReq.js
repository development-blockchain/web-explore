import {useRequest} from 'ahooks';
import moment from 'moment';
import Loading from '../../components/Loading';
import React,{ useEffect,useState,useRef} from 'react';  
import {useTranslation} from 'react-i18next';


function LineChart({data = []}) {
  const {t} = useTranslation(['nodeLogs']);
  const containerRef = useRef(); 
  const chartVisitor = useRef(); 
  const chartUpStream = useRef(); 
  useEffect(() => {
    const categories = [];
    const totalReq = [];
    const validReq = [];
    const failedReq = [];
    const visitors = []; 
    const upSteam = [];
    let startTime ='';
    let endTime =''; 
    data.request_list.forEach(function(item,index){   
      if(index === 0 ){
        startTime = item.hour;
      }
      if(index === data.request_list.length-1){
        endTime = item.hour;
      }
      categories.push(item.hour.substring(11,14))
      totalReq.push(item.total_req)
      validReq.push(item.valid_req)
      failedReq.push(item.failed_req)
      visitors.push(item.uniq_visitor)
    })

    data.upstream_hosts.forEach(function(item,index){    
      if(item.host.indexOf('node')>=0){
        const aa= [item.host,item.total_req]  
        upSteam.push(aa)
      }
      
    })

    const colors= ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',  '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'] 
    window.Highcharts.setOptions({
      lang: {
        numericSymbols: null,
      }, 
    });
    const subTitle = t('nodeLogs.dashboard.from') + startTime + t('nodeLogs.dashboard.to') + endTime ;
    const chartTitle = t('nodeLogs.dashboard.totalRequest') ;
    new window.Highcharts.chart({
      chart: {
        renderTo: containerRef.current, 
        zoomType: 'x',
        type: 'spline' 
      },
      title: { 
        text: chartTitle,//标题 标题 
      }, 
      subtitle: {
        text: subTitle
      },
      xAxis: {
        categories: categories
      }, 
      yAxis: {
        title: {
          text: t('nodeLogs.dashboard.requestCount')//纵坐标标题
        }, 
      }, 
      tooltip: {//数据提示框。当鼠标悬停在某点上时，以框的形式提示改点的数据，比如该点的值，数据单位等。数据提示框内提示的信息完全可以通过格式化函数动态指定。
        valueSuffix: 'Times' //当鼠标悬置数据点时的格式化提示 
      },
      credits:{//版权信息
        enable:false, 
      }, 
      plotOptions: {
        spline: {
          dataLabels: { 
            enabled: true// 开启数据标签       
          }, 
        }
      },
      series: [
          {
          //数据列。图表上一个或多个数据系列，比如曲线图中的一条曲线，柱状图中的一个柱形。
            color: colors[5],
            name: t('nodeLogs.dashboard.totalRequest'), //注释 图例名称
            marker: {
              symbol: 'square'
            }, 
            //line直线图  spline曲线图  area面积图  areaspline曲线面积图 arearange面积范围图 areasplinerange曲线面积范围图  									                         // column柱状图  柱状范围图columnrange   bar条形图  pie饼图  scatter散点图  boxplot箱线图  bubble气泡图   
            // funnel漏斗图   仪表图gauge  瀑布图waterfall    雷达图polar  errorbar误差线图
            data: totalReq 
          },
           { 
            color: colors[3],
            name: t('nodeLogs.dashboard.failedRequest'),  
            marker: {
              symbol: 'square'
            }, 
            //line直线图  spline曲线图  area面积图  areaspline曲线面积图 arearange面积范围图 areasplinerange曲线面积范围图  									                         // column柱状图  柱状范围图columnrange   bar条形图  pie饼图  scatter散点图  boxplot箱线图  bubble气泡图   
            // funnel漏斗图   仪表图gauge  瀑布图waterfall    雷达图polar  errorbar误差线图
            data: failedReq 
          },
      ]  
    }); 

    const chartTitle2 = t('nodeLogs.dashboard.uniquevisitors');
    new window.Highcharts.chart({
      chart: {
        renderTo: chartVisitor.current, 
        zoomType: 'x',
        type: 'column' 
      },
      title: { 
        text: chartTitle2,//标题 标题 
      }, 
      subtitle: {
        text: subTitle
      },
      xAxis: {
        categories: categories
      }, 
      yAxis: {
        title: {
          text: t('nodeLogs.dashboard.visitors')//纵坐标标题
        }, 
      }, 
      tooltip: {//数据提示框。当鼠标悬停在某点上时，以框的形式提示改点的数据，比如该点的值，数据单位等。数据提示框内提示的信息完全可以通过格式化函数动态指定。
        // valueSuffix: 'Times' //当鼠标悬置数据点时的格式化提示 
      },
      credits:{//版权信息
        enable:false, 
      }, 
      plotOptions: {
        column: {
          dataLabels: { 
            enabled: true// 开启数据标签       
          } 
        }
      },
      series: [
          {
          //数据列。图表上一个或多个数据系列，比如曲线图中的一条曲线，柱状图中的一个柱形。
            name: t('nodeLogs.dashboard.visitors'), //注释 图例名称
            color:colors[9],
            marker: {
              symbol: 'diamod'
            }, 
            //line直线图  spline曲线图  area面积图  areaspline曲线面积图 arearange面积范围图 areasplinerange曲线面积范围图  									                         // column柱状图  柱状范围图columnrange   bar条形图  pie饼图  scatter散点图  boxplot箱线图  bubble气泡图   
            // funnel漏斗图   仪表图gauge  瀑布图waterfall    雷达图polar  errorbar误差线图
            data: visitors 
          }  
      ]  
    }); 


    const chartTitle3 = t('nodeLogs.dashboard.upsteamhost');//'Upsteamhost per day';
    new window.Highcharts.chart({
      chart: {
        renderTo: chartUpStream.current,  
      },
      title: { 
        text: chartTitle3,//标题 标题 
      }, 
      subtitle: {
        text: subTitle
      },
      xAxis: {
        categories: categories
      }, 
      yAxis: {
        title: {
          text: 'Visitors'//纵坐标标题
        }, 
      }, 
      tooltip: { 
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      credits:{//版权信息
        enable:false, 
      }, 
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
             enabled: true,
             format: '<b>{point.name}  </b>: {point.percentage:.1f} %', 
          },
          showInLegend: true
       }
      },
      series: [
          {
            type: 'pie',
            name: t('nodeLogs.dashboard.pie-name'),
            data: upSteam
          }  
      ]  
    });  
     
  }, [data]);

  return (
    <div>
      <div className="content" ref={containerRef} style={{height: '280px', minWidth: '310px', overflow: 'hidden'}} data-highcharts-chart="0"></div>;
      
     
      <div className="content" ref={chartVisitor} style={{height: '280px', minWidth: '310px', overflow: 'hidden'}} data-highcharts-chart="0"></div>;
     
      <div className="content" ref={chartUpStream} style={{height: '380px', minWidth: '310px', overflow: 'hidden'}} data-highcharts-chart="0"></div>;
  
  </div>
  )
}

export default function Dashboard() {
  const {t} = useTranslation(['nodeLogs']);
  const nodeLogRequest = useRequest(
    body => ({
      url: '/nodelogapi/dashboard',
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

  const data = nodeLogRequest?.data || {
    "total_req": 0,
    "valid_req": 0,
    "failed_req": 0, 
    "uniq_visitor": 0,
    "request_list":[],
    "upstream_hosts":[]
  }; 
  console.log(data);

   return (
    <div className=" mt-2 mb-2">
     
      <div className="card-header d-md-flex justify-content-between align-items-center py-3">
        <h1 className="h4 font-weight-normal mb-0">
          {t('nodeLogs.dashboard')}&nbsp;<span className="small text-secondary"></span>
        </h1>
      </div>
      <div className="card-body">
        <div className="col-12 mb-2">
          <div className="row">  
            <div className="col-lg-3 col-md-6  mt-1">
              <div className="card black-border">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="">
                          <h4 className="mb-2">
                            <i className="fa fa-chart-line mr-1"></i>
                            {t('nodeLogs.dashboard.totalRequest')}
                          </h4>
                          <div className="d-flex flex-wrap justify-content-start align-items-center">
                              <h4 className="mb-0 font-weight-bold"> {data.total_req} </h4> 
                          </div>                            
                      </div>
                    </div>
                </div>
              </div>   
            </div>

            <div className="col-lg-3 col-md-6  mt-1">
              <div className="card green-border">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="">
                          <h4 className="mb-2">
                            <i className="fa fa-chart-line mr-1"></i>
                            {t('nodeLogs.dashboard.validRequest')}
                          </h4>
                          <div className="d-flex flex-wrap justify-content-start align-items-center">
                              <h4 className="mb-0 font-weight-bold">{data.valid_req} </h4> 
                          </div>                            
                      </div>
                    </div>
                </div>
              </div>   
            </div>

            <div className="col-lg-3 col-md-6  mt-1">
              <div className="card red-border">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="">
                          <h4 className="mb-2">
                            <i className="fa fa-chart-line mr-1"></i>
                            {t('nodeLogs.dashboard.failedRequest')} 
                          </h4>
                          <div className="d-flex flex-wrap justify-content-start align-items-center">
                              <h4 className="mb-0 font-weight-bold"> {data.failed_req}  </h4> 
                          </div>                            
                      </div>
                    </div>
                </div>
              </div>   
            </div>

            <div className="col-lg-3 col-md-6 mt-1">
              <div className="card blue-border">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="">
                          <h4 className="mb-2">
                            <i className="fa fa-chart-line mr-1"></i>
                            {t('nodeLogs.dashboard.visitors')}  
                          </h4>
                          <div className="d-flex flex-wrap justify-content-start align-items-center">
                              <h4 className="mb-0 font-weight-bold"> {data.uniq_visitor} </h4> 
                          </div>                            
                      </div>
                    </div>
                </div>
              </div>   
            </div>

          </div>
        </div> 
      </div> 

      <div className="card-header d-md-flex justify-content-between align-items-center py-3">
        <h1 className="h4 font-weight-normal mb-0">
          {t('nodeLogs.dashboard.RequestLog')}
        </h1>
      </div>
      <div className="card-body">
        <LineChart data={data} />
      </div>
     

    </div>

 
  );
}
