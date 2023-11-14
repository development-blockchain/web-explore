import {useState, useRef, useEffect, useContext} from 'react';
import {useRequest} from 'ahooks';
import {useTranslation} from 'react-i18next';
import Loading from '../../components/Loading';
import UserContext from '../../UserContext';

function HTBalanceChart({address}) {
  const userContext = useContext(UserContext);
  const priceInfo = userContext.priceInfo || {};
  const containerRef = useRef();
  const {t} = useTranslation(['address']);

  const body = {
    field: 'address',
    value: address,
  };
  console.log('priceInfo', priceInfo);
  const balanceChartRequest = useRequest(
    {
      url: '/blockBrowser/blockChain/contractInternalTrade/analysis/balanceChart',
      method: 'post',
      body: JSON.stringify(body),
    },
    {manual: true},
  );

  useEffect(() => {
    balanceChartRequest.run().then(res => {
      var currencySymbol = 'USD';
      var chartHeight = 500;
      function addCommas(nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
      }
      var plotData = res
        .map(r => {
          const [y, m, d] = r.date.split('-');
          // return [Date.UTC(2021, 6, 3), 21603.968460459818863628, 10.47, 226193.55, 230946.42, 0, '0 (Sent) + 0 (Recv)', 0.0, 0.0, 0.0, 0.0];
          return [
            Date.UTC(y, Number(m) - 1, d),
            Number(r.account_balance),
            Number(r.historical_price),
            Number(r.historical_value),
            Number(r.current_value),
            Number(r.trade_amount),
            `${r.sent_amount} (Sent) + ${r.recv_amount} (Recv)`,
            0.0,
            0.0,
            0.0,
            0.0,
          ];
        })
        .reverse();
      var lastData = plotData[plotData.length - 1];
      var plotData_datemax = lastData[0];
      var current_usd_eth_value = Number(priceInfo.ht_Info.ht_usd.open_price);
      function renderChart() {
        var seriesNameConverter = {
          Series_1: t('address.analytics.HTBalanceChart.HPBAccountBalance'),
          Series_2: t('address.analytics.HTBalanceChart.HistoricUSDVal'),
          Series_3: t('address.analytics.HTBalanceChart.CurrentUSDVal'),
          Series_4: t('address.analytics.HTBalanceChart.TxnCount'),
        };
        var chart;
        chart = new window.Highcharts.chart(
          {
            chart: {
              renderTo: containerRef.current,
              //marginRight: 10,
              zoomType: 'x',
              height: chartHeight,
              events: {
                selection: function (event) {},
              },
            },
            navigator: {
              enabled: true,
              //adaptToUpdatedData: false
            },
            rangeSelector: {
              buttons: [
                {
                  type: 'month',
                  count: 1,
                  text: '1m',
                },
                {
                  type: 'month',
                  count: 6,
                  text: '6m',
                },
                {
                  type: 'year',
                  count: 1,
                  text: '1y',
                },
                {
                  type: 'all',
                  text: 'All',
                },
              ],
              selected: 4,
              enabled: true,
            },
            title: {
              text: `${t('address.analytics.HPBBalancefor')} ${address}`,
            },
            subtitle: {
              text: 'Source: hpb.io',
            },
            xAxis: {
              gridLineWidth: 1,
              //startOnTick: true,
              //endOnTick:true,
              //top: 11,
              type: 'datetime',
              events: {
                afterSetExtremes: function (event) {},
              },
              crosshair: {
                width: 2,
              },
              max: plotData_datemax,
            },
            yAxis: [
              {
                gridLineWidth: 0,
                minorGridLineWidth: 1,
                min: 0,
                //offset: 5,
                tickWidth: 1,
                title: {
                  text: '',
                },
                resize: {
                  enabled: true,
                },
                opposite: false,
                showEmpty: false,
                yAxis: 0,
                events: {
                  afterSetExtremes: function () {},
                },
              },
              {
                gridLineWidth: 0,
                minorGridLineWidth: 1,
                title: {
                  text: t('address.analytics.HTBalanceChart.USDBalanceValue'),
                  style: {
                    color: window.Highcharts.getOptions().colors[0],
                  },
                },
                resize: {
                  enabled: true,
                },
                opposite: true,
                showEmpty: false,
                yAxis: 1,
                events: {
                  afterSetExtremes: function () {},
                },
                labels: {
                  formatter: function () {
                    if (this.value > 1000000) {
                      return '$' + this.value / 1000000 + 'M';
                    } else {
                      return '$' + this.value;
                    }
                  },
                },
              },
              {
                gridLineWidth: 0,
                minorGridLineWidth: 1,
                title: {
                  text: 'USD Balance Value (Current)',
                  style: {
                    color: window.Highcharts.getOptions().colors[0],
                  },
                },
                resize: {
                  enabled: true,
                },
                opposite: true,
                showEmpty: false,
                yAxis: 2,
                labels: {
                  formatter: function () {
                    if (this.value > 1000000) {
                      return '$' + this.value / 1000000 + 'M';
                    } else {
                      return '$' + this.value;
                    }
                  },
                },
              },
              {
                gridLineWidth: 0,
                minorGridLineWidth: 1,
                title: {
                  text: 'Txn Count',
                  style: {
                    color: window.Highcharts.getOptions().colors[0],
                  },
                },
                resize: {
                  enabled: true,
                },
                opposite: true,
                showEmpty: false,
                yAxis: 3,
              },
              {
                labels: {
                  enabled: false,
                },
                title: {
                  text: null,
                },
              },
            ],
            plotOptions: {
              spline: {
                marker: {
                  enabled: true,
                },
              },
              series: {
                animation: {
                  duration: 0,
                },
                turboThreshold: 10000,
                events: {
                  legendItemClick: function (e) {},
                },
              },
            },
            credits: {
              enabled: false,
            },
            legend: {
              useHTML: true,
              enabled: true,
              labelFormatter: function () {
                if (this.name == 'Series_2') {
                  return '<span data-toggle="tooltip" title="Calculcated using the historical ' + currencySymbol +
                   '/HPB value at the closing price of that day">'+t('address.analytics.HTBalanceChart.HistoricUSDVal')+'</span>';
                } else if (this.name == 'Series_3') {
                  return '<span data-toggle="tooltip" title="Calculcated using the current ' + currencySymbol +
                   '/HPB value of today">'+t('address.analytics.HTBalanceChart.CurrentUSDVal')+'</span>';
                } else if (this.name == 'Series_1') {
                  return t('address.analytics.HTBalanceChart.HPBAccountBalance');
                } else {
                  return seriesNameConverter[this.name];
                }
              },
              itemStyle: {
                color: '#000000',
                fontWeight: 'bold',
              },
            },
            tooltip: {
              useHTML: true,
              shadow: true,
              split: false,
              shared: true,
              borderColor: '#7F8C8D',
              borderRadius: 10,
              backgroundColor: 'white',
              formatter: function () {
                var s;
                var points = this.points;
                var pointsLength = points.length;
                s =
                  '<table class="tableformat" style="border: 0px;" width="100%"><tr><td colspan=2 style="padding-bottom:5px;"><span style="font-size: 10px;"> ' +
                  window.Highcharts.dateFormat('%a %e, %B %Y', new Date(points[0].key)) +
                  '</span><br></td></tr>';
                for (var index = 0; index < pointsLength; index += 1) {
                  var pointData;
                  pointData = plotData.find(row => row[0] === this.points[index].x);
                  s +=
                    '<tr><td style="padding-top:4px;padding-bottom:4px;border-top:1px solid #D5D8DC;" valign="top"><span style="color:' +
                    points[index].series.color +
                    ';font-size: 15px !important;">\u25A0</span> ' +
                    seriesNameConverter[points[index].series.name] +
                    '</td>' +
                    '<td align="right" valign="top" style="padding-top:5px;padding-bottom:4px;border-top:1px solid #D5D8DC;"><span style=""><b>' +
                    (points[index].series.name == 'Series_2' || points[index].series.name == 'Series_3'
                      ? currencySymbol +
                        ' ' +
                        window.Highcharts.numberFormat(points[index].y, 2, '.', ',') +
                        '</b></span><br><span style="font-size: 11px !important;color:#7F8C8D">@' +
                        currencySymbol +
                        ' ' +
                        window.Highcharts.numberFormat(points[index].series.name == 'Series_2' ? pointData[2] : current_usd_eth_value, 2, '.', ',') +
                        '/HPB</span>'
                      : addCommas(points[index].y)) +
                    '</b>' +
                    (points[index].series.name == 'Series_4' ? '<br><span style="font-size: 11px ! important">' + pointData[6] + '</span>' : '') +
                    '</td></tr>';
                }
                s += '</table>';
                return s;
              },
            },
            series: [
              {
                name: 'Series_1', //HPB Balance
                valueSuffix: ' HPB',
                keys: ['x', 'y', 'u_hist', 'a', 'b', 'txntotal', 'txout_in'],
                data: plotData,
                type: 'area',
              },
              {
                name: 'Series_2', //USD HPB Pricing Historical Value
                valueSuffix: ' ' + currencySymbol,
                yAxis: 1,
                keys: ['x', 'a', 'u_hist', 'y', 'b', 'txntotal', 'txout_in'],
                data: plotData,
                type: 'line',
                visible: true,
              },
              {
                name: 'Series_3', //USD HPB Pricing Current Value
                valueSuffix: ' ' + currencySymbol,
                yAxis: 1,
                keys: ['x', 'a', 'u_hist', 'b', 'y', 'txntotal', 'txout_in'],
                data: plotData,
                //color: '#FFC300',
                visible: false,
              },
              {
                name: 'Series_4', //USD HPB Pricing Current Value
                yAxis: 3,
                keys: ['x', 'a', 'u_hist', 'c', 'd', 'y', 'txout_in'],
                data: plotData,
                //color: '#FFC300',
                visible: false,
              },
            ],
          },
          function (chart) {
            // on complete
          },
        );
      }

      renderChart();
    });
  }, []);

  return <div className="content" ref={containerRef} style={{overflow: 'hidden'}} data-highcharts-chart="0"></div>;
}

function HTBalance({address}) {
  const {t} = useTranslation(['address']);

  const body = {
    field: 'address',
    value: address,
  }; 
  const balanceRequest = useRequest({
    url: '/blockBrowser/blockChain/contractInternalTrade/analysis/balance',
    method: 'post',
    body: JSON.stringify(body),
  });

  const data = balanceRequest.data || {};

  if (balanceRequest.loading) {
    return <Loading />;
  }

  return (
    <div className="tab-pane fade active show" id="tab1" role="tabpanel" aria-labelledby="tab1-tab">
      <span id="tab1_default_content"></span>
      <div id="container_1">
        <div className="d-md-flex justify-content-between align-items-center mb-3">
          <h4 className="h6 mb-1 mb-md-0">
            {t('address.analytics.timeSeries')} <span id="chart_title_date_range"></span>
          </h4>
          <div className="text-secondary">
            {/* <span id="addressdisplay_1">Wed 2, Dec 2020 - Sat 3, Jul 2021</span> */}
          </div>
        </div>
        <hr className="my-0" />
        <div className="row mx-gutters-md-2">
          <div className="col-md-6 col-lg-3 pt-3">
            <h5 className="h6 font-weight-bold mb-1">
              <i id="subtitle_1_box" className="fa fa-circle text-primary font-size-1 mr-1" style={{color: 'rgb(124, 181, 236)'}}></i>
              <span id="subtitle_1">{t('address.analytics.hpbHBalance')}</span>
            </h5>
            <div className="text-secondary small mb-1">
              <span id="high_bal_eth_date">On {data.maximum_balance_date}</span>
            </div>
            <div className="font-weight-bold text-secondary">
              <span id="high_bal_eth_value">{data.maximum_balance} HPB</span>
            </div>
            <hr className="d-block d-lg-none mt-3 mb-0" />
          </div>
          <div className="col-md-6 col-lg-3 u-ver-divider u-ver-divider--left u-ver-divider--none-lg pt-3">
            <h5>
              <i id="subtitle_2_box" className="fa fa-circle text-primary font-size-1 mr-1" style={{color: 'rgb(124, 181, 236)'}}></i>
              <span className="h6 font-weight-bold mb-1" id="subtitle_2">
                 {t('address.analytics.hpbLBalance')}
              </span>
            </h5>
            <div className="text-secondary small mb-1">
              <span id="low_bal_eth_date">On {data.minimum_balance_date}</span>
            </div>
            <div className="font-weight-bold text-secondary">
              <span id="low_bal_eth_value">{data.minimum_balance} HPB</span>
            </div>
            <hr className="d-block d-lg-none mt-3 mb-0" />
          </div>
          <div className="col-md-6 col-lg-3 u-ver-divider u-ver-divider--left u-ver-divider--none-md pt-3">
            <h5 className="h6 font-weight-bold mb-1">
              <i id="subtitle_3_box" className="fa fa-square font-size-1 mr-1" style={{color: 'rgb(67, 67, 72)'}}></i>
              <span id="subtitle_3">{t('address.analytics.USDHValue')}</span>
            </h5>
            <div className="text-secondary small mb-1">
              <span id="high_bal_usd_date">On {data.highest_value_date}</span>
            </div>
            <div className="font-weight-bold text-secondary">
              <span id="high_bal_usd_value">USD {data.highest_value}</span>
            </div>
            <hr className="d-block d-md-none mt-3 mb-0" />
          </div>
          <div className="col-md-6 col-lg-3 u-ver-divider u-ver-divider--left u-ver-divider--none-md py-3">
            <h5 className="h6 font-weight-bold mb-1">
              <i id="subtitle_4_box" className="fa fa-square font-size-1 mr-1" style={{color: 'rgb(67, 67, 72)'}}></i>
              <span id="subtitle_4">{t('address.analytics.USDLValue')}</span>
            </h5>
            <div className="text-secondary small mb-1">
              <span id="low_bal_usd_date">On {data.minimum_value_date}</span>
            </div>
            <div className="font-weight-bold text-secondary">
              <span id="low_bal_usd_value">USD {data.minimum_value}</span>
            </div>
          </div>
        </div>
        <hr className="my-0" />
        <div className="mt-3">
          <HTBalanceChart address={address} />
        </div>
      </div>
    </div>
  );
}

function Transactions({address}) {
  const {t} = useTranslation(['address']);
  const containerRef = useRef();
  const body = {
    field: 'address',
    value: address,
  };
  const tradeChartRequest = useRequest(
    {
      url: '/blockBrowser/blockChain/contractInternalTrade/analysis/tradeChart',
      method: 'post',
      body: JSON.stringify(body),
    },
    {manual: true},
  );

  useEffect(() => {
    tradeChartRequest.run().then(res => {
      console.log(res);
      //   var plotData3 = eval([[Date.UTC(2020, 11, 2), 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0]]);
      var plotData3 = res
        .map(r => {
          const [y, m, d] = r.date.split('-');
          return [Date.UTC(y, Number(m) - 1, d), Number(r.trade_amount), Number(r.unique_outgoing_address), Number(r.unique_incoming_Address), 0, 0, 0, 0, 0, 0, 0, 0];
        })
        .reverse();
      var lastData = plotData3[plotData3.length - 1];
      var plotData3_datemax = lastData[0];
      var chartHeight = 500;

      function renderChart() {
        var seriesNameConverter = {
          Series_1: t('address.analytics.HPBTransactions'),
          Series_2: t('address.analytics.UniqueOutgoingAddress'),
          Series_3: t('address.analytics.UniqueIncomingAddress'),
        };
        var chart;
        chart = new window.Highcharts.chart(
          {
            chart: {
              renderTo: containerRef.current,
              //marginRight: 10,
              height: chartHeight,
              zoomType: 'x',
              events: {
                selection: function (event) {},
              },
            },
            navigator: {
              enabled: true,
              //adaptToUpdatedData: false
            },
            rangeSelector: {
              buttons: [
                {
                  type: 'month',
                  count: 1,
                  text: '1m',
                },
                {
                  type: 'month',
                  count: 6,
                  text: '6m',
                },
                {
                  type: 'year',
                  count: 1,
                  text: '1y',
                },
                {
                  type: 'all',
                  text: 'All',
                },
              ],
              y: 10,
              selected: 4,
              enabled: true,
            },
            title: {
              text: `${t('address.analytics.HPBTransactionsfor')} ${address}`,
            },
            subtitle: {
              text: 'Source: hpb.io ',
            },
            xAxis: {
              gridLineWidth: 0,
              type: 'datetime',
              events: {
                afterSetExtremes: function (event) {},
              },
              crosshair: {
                width: 2,
              },
              max: plotData3_datemax,
            },
            yAxis: [
              {
                gridLineWidth: 1,
                minorGridLineWidth: 1,
                gridLineDashStyle: 'shortdash',
                min: 0,
                tickWidth: 1,
                resize: {
                  enabled: true,
                },
                opposite: false,
                showEmpty: false,
                events: {
                  afterSetExtremes: function () {},
                },
              },
              {
                gridLineWidth: 0,
                minorGridLineWidth: 1,
                resize: {
                  enabled: true,
                },
                opposite: false,
                showEmpty: false,
              },
              {
                gridLineWidth: 0,
                minorGridLineWidth: 1,
                resize: {
                  enabled: true,
                },
                opposite: false,
                showEmpty: false,
              },
            ],
            plotOptions: {
              spline: {
                marker: {
                  enabled: true,
                },
              },
              series: {
                animation: {
                  duration: 0,
                },
                turboThreshold: 10000,
                events: {
                  legendItemClick: function (e) {},
                },
              },
            },
            credits: {
              enabled: false,
            },
            legend: {
              useHTML: true,
              enabled: true,
              labelFormatter: function () {
                return seriesNameConverter[this.name];
              },
              itemStyle: {
                color: '#000000',
                fontWeight: 'bold',
              },
            },
            tooltip: {
              useHTML: true,
              shadow: true,
              split: false,
              shared: true,
              borderColor: '#7F8C8D',
              borderRadius: 10,
              backgroundColor: 'white',
              formatter: function () {
                var s;
                var points = this.points;
                var pointsLength = points.length;
                s =
                  '<table class="tableformat" style="border: 0px;" width="100%"><tr><td colspan=2 style="padding-bottom:5px;"><span style="font-size: 10px;"> ' +
                  window.Highcharts.dateFormat('%a %e, %B %Y', new Date(points[0].key)) +
                  '</span><br></td></tr>';
                for (var index = 0; index < pointsLength; index += 1) {
                  s +=
                    '<tr><td style="padding-top:4px;padding-bottom:4px;border-top:1px solid #D5D8DC;" valign="top"><span style="color:' +
                    points[index].series.color +
                    ';font-size: 15px !important;">\u25A0</span> ' +
                    seriesNameConverter[points[index].series.name] +
                    '</td>' +
                    '<td align="right" valign="top" style="padding-top:5px;padding-bottom:4px;border-top:1px solid #D5D8DC;"><span style=""><b>' +
                    points[index].y +
                    '</b>' +
                    '</td></tr>';
                }
                s += '</table>';
                return s;
              },
            },
            series: [
              {
                name: 'Series_1', //HPB Transactions
                keys: ['x', 'y', 'txin', 'txout'],
                data: plotData3,
                type: 'areaspline',
              },
              {
                name: 'Series_2', //Unique Address Incoming
                keys: ['x', 'a', 'b', 'c', 'y'],
                data: plotData3,
                type: 'area',
                visible: true,
              },
              {
                name: 'Series_3', //Unique Address Outgoing
                keys: ['x', 'a', 'b', 'c', 'd', 'y'],
                data: plotData3,
                type: 'area',
                visible: true,
              },
            ],
          },
          function (chart) {
            // on complete
          },
        );
      }
      renderChart();
    });
  }, []);

  return (
    <div className="tab-pane fade active show" id="tab3" role="tabpanel" aria-labelledby="tab3-tab">
      <span></span>
      <div>
        <div className="d-md-flex justify-content-between align-items-center mb-3">
          <h4 className="h6 mb-1 mb-md-0">{t('address.analytics.timeSeriesTr')}</h4>
          <div className="text-secondary">
            {/* <span id="addressdisplay_3">Wed 2, Dec 2020 - Sat 3, Jul 2021</span> */}
          </div>
        </div>
        <hr className="my-0" />
        <div className="mt-3">
          <div className="content" ref={containerRef} style={{overflow: 'hidden'}} data-highcharts-chart="2"></div>
        </div>
      </div>
    </div>
  );
}

function TxnFees({address}) {
  const containerRef = useRef();
  const {t} = useTranslation(['address']);
  const [body, setBody] = useState({
    field: 'address',
    value: address,
    start_date: undefined,
    end_date: undefined,
  });
  const [sender, setSender] = useState({});
  const [recipient, setRecipient] = useState({});

  const tradeFeeChartRequest = useRequest(
    body => ({
      url: '/blockBrowser/blockChain/contractInternalTrade/analysis/tradeFeeChart',
      method: 'post',
      body: JSON.stringify(body),
    }),
    {manual: true},
  );

  useEffect(() => {
    tradeFeeChartRequest.run(body).then(res => {
      setSender(res.sender);
      setRecipient(res.recipient);
      // res.fee_charts
      var plotData = res.fee_charts
        .map(r => {
          const [y, m, d] = r.date.split('-');
          // return [Date.UTC(2021, 6, 3), 21603.968460459818863628, 10.47, 226193.55, 230946.42, 0, '0 (Sent) + 0 (Recv)', 0.0, 0.0, 0.0, 0.0];
          return [Date.UTC(y, Number(m) - 1, d), 0, 0, 0, 0, 0, 0, Number(r.fees_spent), Number(r.usd_fees_spent), Number(r.fees_used), Number(r.usd_fees_used)];
        })
        .reverse();
      var lastData = plotData[plotData.length - 1];
      var plotData_datemax = lastData[0];
      var chartHeight = 500;

      function renderChart() {
        var seriesNameConverter = {
          Series_1: t('address.analytics.TxnFees.HPBFeesSpent'),
          Series_2: t('address.analytics.TxnFees.USDFeesSpent'),
          Series_3: t('address.analytics.TxnFees.HPBFeesUsed'),
          Series_4: t('address.analytics.TxnFees.USDFeesUsed'),
        };
        var chart = new window.Highcharts.chart(
          {
            chart: {
              renderTo: containerRef.current,
              //marginRight: 10,
              height: chartHeight,
              zoomType: 'x',
              events: {
                selection: function (event) {},
              },
            },
            navigator: {
              enabled: true,
              //adaptToUpdatedData: false
            },
            rangeSelector: {
              buttons: [
                {
                  type: 'month',
                  count: 1,
                  text: '1m',
                },
                {
                  type: 'month',
                  count: 6,
                  text: '6m',
                },
                {
                  type: 'year',
                  count: 1,
                  text: '1y',
                },
                {
                  type: 'all',
                  text: 'All',
                },
              ],
              y: 10,
              selected: 4,
              enabled: true,
            },
            title: {
              text: `${t('address.analytics.TxnFees.HPBTransactionFeesfor')} ${address}`,
            },
            subtitle: {
              text: 'Source: hpb.io ',
            },
            xAxis: {
              gridLineWidth: 0,
              type: 'datetime',
              events: {
                afterSetExtremes: function (event) {},
              },
              crosshair: {
                width: 2,
              },
              max: plotData_datemax,
            },
            yAxis: [
              {
                gridLineWidth: 1,
                minorGridLineWidth: 1,
                gridLineDashStyle: 'shortdash',
                min: 0,
                tickWidth: 1,
                resize: {
                  enabled: true,
                },
                opposite: false,
                showEmpty: false,
              },
              {
                gridLineWidth: 0,
                minorGridLineWidth: 1,
                resize: {
                  enabled: true,
                },
                opposite: false,
                showEmpty: false,
              },
              {
                gridLineWidth: 0,
                minorGridLineWidth: 1,
                resize: {
                  enabled: true,
                },
                opposite: false,
                showEmpty: false,
              },
              {
                gridLineWidth: 0,
                minorGridLineWidth: 1,
                resize: {
                  enabled: true,
                },
                opposite: false,
                showEmpty: false,
              },
            ],
            plotOptions: {
              spline: {
                marker: {
                  enabled: true,
                },
              },
              series: {
                animation: {
                  duration: 0,
                },
                turboThreshold: 10000,
              },
            },
            credits: {
              enabled: false,
            },
            legend: {
              useHTML: true,
              enabled: true,
              labelFormatter: function () {
                return seriesNameConverter[this.name];
              },
              itemStyle: {
                color: '#000000',
                fontWeight: 'bold',
              },
            },
            tooltip: {
              useHTML: true,
              shadow: true,
              split: false,
              shared: true,
              borderColor: '#7F8C8D',
              borderRadius: 10,
              backgroundColor: 'white',
              formatter: function () {
                var s;
                var points = this.points;
                var pointsLength = points.length;
                s =
                  '<table class="tableformat" style="border: 0px;" width="100%"><tr><td colspan=2 style="padding-bottom:5px;"><span style="font-size: 10px;"> ' +
                  window.Highcharts.dateFormat('%a %e, %B %Y', new Date(points[0].key)) +
                  '</span><br></td></tr>';
                for (var index = 0; index < pointsLength; index += 1) {
                  s +=
                    '<tr><td style="padding-top:4px;padding-bottom:4px;border-top:1px solid #D5D8DC;" valign="top"><span style="color:' +
                    points[index].series.color +
                    ';font-size: 15px !important;">\u25A0</span> ' +
                    seriesNameConverter[points[index].series.name] +
                    '</td>' +
                    '<td align="right" valign="top" style="padding-top:5px;padding-bottom:4px;border-top:1px solid #D5D8DC;"><span style=""><b>' +
                    points[index].y +
                    '</b><br>' +
                    '</td></tr>';
                }
                s += '</table>';
                return s;
              },
            },
            series: [
              {
                name: 'Series_1', //TxFees Spent in Ether
                keys: ['x', 'a', 'b', 'c', 'd', 'e', 'f', 'y'],
                data: plotData,
                visible: true,
                type: 'column',
              },
              {
                name: 'Series_2', //TxFees Spent in USD
                keys: ['x', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'y'],
                data: plotData,
                type: 'column',
                visible: false,
              },
              {
                name: 'Series_3', //TxFees Used in Ether
                keys: ['x', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'y'],
                data: plotData,
                type: 'column',
                visible: true,
              },
              {
                name: 'Series_4', //TxFees Used in USD
                keys: ['x', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'y'],
                data: plotData,
                type: 'column',
                visible: false,
              },
            ],
          },
          function (chart) {
            // on complete
          },
        );
      }
      renderChart();
    });
  }, []);

  return (
    <div className="tab-pane fade active show" id="txfees" role="tabpanel" aria-labelledby="txfees-tab">
      <span id="tab7_default_content"></span>
      <div id="container_7">
        <div className="d-md-flex justify-content-between align-items-center mb-3">
          <h4 className="h6 mb-1 mb-md-0">
            {t('address.analytics.TxnFees.TimeSeries')}  
          </h4>
          {/* <div className="text-secondary">
            <span id="addressdisplay_7">Wed 2, Dec 2020 - Sat 3, Jul 2021</span>
          </div> */}
        </div>
        <hr className="my-0" />
        <div className="row mx-gutters-md-2">
          <div className="col-md-6 pt-3">
            <h5 className="h6 font-weight-bold mb-1">
              <i id="subtitle_1_box_a" className="fa fa-circle text-primary font-size-1 mr-1"></i>
              <span id="subtitle_1_a">
                {t('address.analytics.TxnFees.TotalFeesSpent')} 
              </span>
            </h5>
            <div className="text-secondary mb-1">{sender.total_fees_spent || '0'} HPB</div>
            <div className="text-secondary mb-2">
              <b>USD {sender.adjusted}</b> <span title="Adjusted to historical HPB Price">(Adjusted)</span> | <b>USD {sender.current}</b> <span title="Using the latest HPB Price">(Current)</span>
            </div>
            <hr className="d-block d-lg-none mt-3 mb-0" />
          </div>
          <div className="col-md-6 u-ver-divider u-ver-divider--left u-ver-divider--none-lg pt-3">
            <h5>
              <i id="subtitle_2_box_b" className="fa fa-circle text-primary font-size-1 mr-1"></i>
              <span className="h6 font-weight-bold mb-1" id="subtitle_2_b">
               {t('address.analytics.TxnFees.TotalFeesUsed')}
              </span>
            </h5>
            <div className="text-secondary mb-1">{recipient.total_fees_used} HPB</div>
            <div className="text-secondary mb-2">
              <b>USD {recipient.adjusted}</b> <span title="Adjusted to historical HPB Price">(Adjusted)</span> | <b>USD {recipient.current}</b> <span title="Using the latest HPB Price">(Current)</span>
            </div>
            <hr className="d-block d-lg-none mt-3 mb-0" />
          </div>
        </div>
        <hr className="my-0" />
        <div className="mt-3">
          <div className="content" ref={containerRef} style={{overflow: 'hidden'}} data-highcharts-chart="4"></div>
        </div>
      </div>
    </div>
  );
}

function HTTransfers({address}) {
  const containerRef = useRef();
  const {t} = useTranslation(['address']);
  const [body, setBody] = useState({
    field: 'address',
    value: address,
    start_date: undefined,
    end_date: undefined,
  });

  const tradeFeeChartRequest = useRequest(
    body => ({
      url: '/blockBrowser/blockChain/contractInternalTrade/analysis/tradeVolumeChart',
      method: 'post',
      body: JSON.stringify(body),
    }),
    {manual: true},
  );

  useEffect(() => {
    tradeFeeChartRequest.run(body).then(res => {
      // res.fee_charts
      var plotData6 = res
        .map(r => {
          const [y, m, d] = r.date.split('-');
          // return [Date.UTC(2021, 6, 3), 0.0, 0.0, 28.651288295526593321];
          // return [Date.UTC(2021, 6, 3), 21603.968460459818863628, 10.47, 226193.55, 230946.42, 0, '0 (Sent) + 0 (Recv)', 0.0, 0.0, 0.0, 0.0];
          return [Date.UTC(y, Number(m) - 1, d), Number(r.unique_incoming_Address), Number(r.receive_amount), Number(r.validator_reward)];
        })
        .reverse();
      var lastData = plotData6[plotData6.length - 1];
      var plotData6_datemax = lastData[0];
      var chartHeight = 500;
      function renderChart(params) {
        var seriesNameConverter = {
          Series_1: t('address.analytics.HTTransfers.Sent'),
          Series_2: t('address.analytics.HTTransfers.Receive'),
          Series_3: t('address.analytics.HTTransfers.ValidatorReward'),
        };
        var chart = new window.Highcharts.chart(
          {
            chart: {
              renderTo: containerRef.current,
              //marginRight: 10,
              height: chartHeight,
              zoomType: 'x',
              events: {
                selection: function (event) {},
              },
            },
            navigator: {
              enabled: true,
              //adaptToUpdatedData: false
            },
            rangeSelector: {
              buttons: [
                {
                  type: 'month',
                  count: 1,
                  text: '1m',
                },
                {
                  type: 'month',
                  count: 6,
                  text: '6m',
                },
                {
                  type: 'year',
                  count: 1,
                  text: '1y',
                },
                {
                  type: 'all',
                  text: 'All',
                },
              ],
              y: 10,
              selected: 4,
              enabled: true,
            },
            title: {
              text: `${t('address.analytics.HTTransfers.HPBTransactionFeesfor')} ${address}`,
            },
            subtitle: {
              text: 'Source: hpb.io ',
            },
            xAxis: {
              gridLineWidth: 0,
              type: 'datetime',
              events: {
                afterSetExtremes: function (event) {},
              },
              crosshair: {
                width: 2,
              },
              max: plotData6_datemax,
            },
            yAxis: [
              {
                title: {
                  text: t('address.analytics.HTTransfers.TransferAmounts'),
                },
                gridLineWidth: 1,
                minorGridLineWidth: 1,
                gridLineDashStyle: 'shortdash',
                min: 0,
                tickWidth: 1,
                resize: {
                  enabled: true,
                },
                opposite: false,
                showEmpty: false,
                events: {
                  afterSetExtremes: function () {},
                },
              },
              {
                gridLineWidth: 0,
                minorGridLineWidth: 1,
                resize: {
                  enabled: true,
                },
                opposite: false,
                showEmpty: false,
              },
              {
                gridLineWidth: 0,
                minorGridLineWidth: 1,
                resize: {
                  enabled: true,
                },
                opposite: false,
                showEmpty: false,
              },
            ],
            plotOptions: {
              spline: {
                marker: {
                  enabled: true,
                },
              },
              series: {
                animation: {
                  duration: 0,
                },
                turboThreshold: 10000,
                events: {},
              },
            },
            credits: {
              enabled: false,
            },
            legend: {
              useHTML: true,
              enabled: true,
              labelFormatter: function () {
                return seriesNameConverter[this.name];
              },
              itemStyle: {
                color: '#000000',
                fontWeight: 'bold',
              },
            },
            tooltip: {
              useHTML: true,
              shadow: true,
              split: false,
              shared: true,
              borderColor: '#7F8C8D',
              borderRadius: 10,
              backgroundColor: 'white',
              formatter: function () {
                var s;
                var points = this.points;
                var pointsLength = points.length;
                s =
                  '<table class="tableformat" style="border: 0px;" width="100%"><tr><td colspan=2 style="padding-bottom:5px;"><span style="font-size: 10px;"> ' +
                  window.Highcharts.dateFormat('%a %e, %B %Y', new Date(points[0].key)) +
                  '</span><br></td></tr>';
                for (var index = 0; index < pointsLength; index += 1) {
                  s +=
                    '<tr><td style="padding-top:4px;padding-bottom:4px;border-top:1px solid #D5D8DC;" valign="top"><span style="color:' +
                    points[index].series.color +
                    ';font-size: 15px !important;">\u25A0</span> ' +
                    seriesNameConverter[points[index].series.name] +
                    '</td>' +
                    '<td align="right" valign="top" style="padding-top:5px;padding-bottom:4px;border-top:1px solid #D5D8DC;"><span style=""><b>' +
                    points[index].y +
                    '</b> HPB' +
                    '</td></tr>';
                }
                s += '</table>';
                return s;
              },
            },
            series: [
              {
                name: 'Series_1', //Sent HPB
                keys: ['x', 'y'],
                data: plotData6,
                type: 'column',
                visible: true,
              },
              {
                name: 'Series_2', //Receive HPB
                keys: ['x', 'a', 'y'],
                data: plotData6,
                type: 'column',
                visible: true,
              },
              {
                name: 'Series_3', //Mining Rewards
                keys: ['x', 'a', 'b', 'y'],
                data: plotData6,
                type: 'column',
                visible: false,
              },
            ],
          },
          function (chart) {
            // on complete
          },
        );
      }
      renderChart();
    });
  }, []);
  return (
    <div className="tab-pane fade active show" id="tab6" role="tabpanel" aria-labelledby="tab6-tab">
      <span id="tab6_default_content"></span>
      <div id="container_6">
        <div className="d-md-flex justify-content-between align-items-center mb-3">
          <h4 className="h6 mb-1 mb-md-0">{t('address.analytics.HTTransfers.TimeSeries')}</h4>
          {/* <div>
            <span id="addressdisplay_6">Wed 2, Dec 2020 - Sat 3, Jul 2021</span>
          </div> */}
        </div>
        <hr className="my-0" />
        <div className="mt-3">
          <div className="content" ref={containerRef} style={{overflow: 'hidden'}} data-highcharts-chart="3"></div>
        </div>
      </div>
    </div>
  );
}

function TokenTransfers({address}) {
  const {t} = useTranslation(['address']);
  const containerRef = useRef();
  const [body, setBody] = useState({
    field: 'address',
    value: address,
    start_date: undefined,
    end_date: undefined,
  });

  const tradeFeeChartRequest = useRequest(
    body => ({
      url: '/blockBrowser/blockChain/contractInternalTrade/analysis/tokensChart',
      method: 'post',
      body: JSON.stringify(body),
    }),
    {manual: true},
  );

  useEffect(() => {
    tradeFeeChartRequest.run(body).then(res => {
      // res.fee_charts
      var plotData2 = res
        .map(r => {
          const [y, m, d] = r.date.split('-');
          // return [Date.UTC(2021, 6, 3), 0.0, 0.0, 28.651288295526593321];
          // return [Date.UTC(2021, 6, 3), 21603.968460459818863628, 10.47, 226193.55, 230946.42, 0, '0 (Sent) + 0 (Recv)', 0.0, 0.0, 0.0, 0.0];
          return [
            Date.UTC(y, Number(m) - 1, d),
            Number(r.token_transfers),
            Number(r.token_contracts_count),
            Number(r.outbound_transfers),
            Number(r.inbound_transfers),
            Number(r.unique_address_sent),
            Number(r.unique_address_received),
          ];
        })
        .reverse();
      var lastData = plotData2[plotData2.length - 1];
      var plotData2_datemax = lastData[0];
      var chartHeight = 500;
      function renderChart(params) {
        var seriesNameConverter = {
          Series_1: t('address.analytics.TokenTransfers.TokenTransfers'),
          Series_2: t('address.analytics.TokenTransfers.TokenContractsCount'),
          Series_3: t('address.analytics.TokenTransfers.OutboundTransfers'),
          Series_4: t('address.analytics.TokenTransfers.InboundTransfers'),
          Series_5: t('address.analytics.TokenTransfers.UniqueAddressSent'),
          Series_6: t('address.analytics.TokenTransfers.UniqueAddressReceived'),
        };
        var chart = new window.Highcharts.chart(
          {
            chart: {
              renderTo: containerRef.current,
              zoomType: 'x',
              height: chartHeight,
            },
            navigator: {
              enabled: true,
            },
            rangeSelector: {
              buttons: [
                {
                  type: 'month',
                  count: 1,
                  text: '1m',
                },
                {
                  type: 'month',
                  count: 6,
                  text: '6m',
                },
                {
                  type: 'year',
                  count: 1,
                  text: '1y',
                },
                {
                  type: 'all',
                  text: 'All',
                },
              ],
              selected: 4,
              enabled: true,
            },
            title: {
              text: `${t('address.analytics.TokenTransfers.HPBTransactionFeesfor')} ${address}`,
            },
            subtitle: {
              text: 'Source: hpb.io ',
            },
            //subtitle: {
            //    useHTML: true,
            //    style: {
            //        fontSize: '9px'
            //    },
            //    text: document.ontouchstart === undefined ?
            //        '<center>Tip: Click on the data points for the more info</center>' : 'Pinch the chart to zoom in',
            //},
            xAxis: {
              //gridLineWidth: 1,
              //top: 11,
              type: 'datetime',
              crosshair: {
                width: 2,
              },
              max: plotData2_datemax,
            },
            yAxis: [
              {
                //-Total Transfers
                title: {
                  text: ' ',
                },
                resize: {
                  enabled: true,
                },
                opposite: false,
                showEmpty: false,
              },
              {
                //-token contract count
                resize: {
                  enabled: true,
                },
                title: {
                  text: t('address.analytics.TokenTransfers.TokenContractsCount'),
                },
                min: 0,
                minTickInterval: 1,
                showEmpty: false,
                opposite: true,
              },
              {
                //-Outbound Transfers
                visible: false,
                linkedTo: 0,
                opposite: false,
              },
              {
                //-Inbound Transfers
                visible: false,
                linkedTo: 0,
                resize: {
                  enabled: true,
                },
                showEmpty: false,
              },
              {
                //-Unqiue Addr Sent
                resize: {
                  enabled: true,
                },
                opposite: true,
                showEmpty: false,
              },
              {
                //-Unqiue Addr Received
                resize: {
                  enabled: true,
                },
                showEmpty: false,
              },
            ],
            plotOptions: {
              series: {
                animation: {
                  duration: 0,
                },
                turboThreshold: 10000,
                cursor: 'pointer',
                point: {
                  events: {
                    click: function (e) {},
                  },
                },
                marker: {
                  lineWidth: 1,
                },
              },
            },
            credits: {
              enabled: false,
            },
            legend: {
              enabled: true,
              labelFormatter: function () {
                return seriesNameConverter[this.name];
              },
              //itemStyle: {
              //    color: '#000000',
              //    fontWeight: 'bold'
              //}
            },
            tooltip: {
              hideDelay: 0,
              crosshairs: true,
              //split: false,
              useHTML: true,
              shared: true,
              shadow: true,
              split: false,
              backgroundColor: 'white',
              formatter: function () {
                var s;
                var points = this.points;
                var pointsLength = points.length;
                s =
                  '<table class="tableformat" style="border: 0px;" width="100%"><tr><td colspan=2 style="padding-bottom:5px;"><span style="font-size: 10px;"> ' +
                  window.Highcharts.dateFormat('%a %e, %B %Y', new Date(points[0].key)) +
                  '</span><br></td></tr>';
                for (var index = 0; index < pointsLength; index += 1) {
                  var pointData;
                  pointData = plotData2.find(row => row[0] === this.points[index].x);
                  s +=
                    '<tr><td style="padding-top:4px;padding-bottom:4px;border-top:1px solid #D5D8DC;" valign="top"><span style="color:' +
                    points[index].series.color +
                    ';font-size: 15px !important;">\u25A0</span> ' +
                    seriesNameConverter[points[index].series.name] +
                    '</td>' +
                    '<td align="right" valign="top" style="padding-top:5px;padding-bottom:4px;border-top:1px solid #D5D8DC;"><span style=""><b>' +
                    points[index].y +
                    '</b>' +
                    '</td></tr>' +
                    (points[index].series.name == 'Series_2'
                      ? '<tr><td colspan="2"  style="padding-bottom:6px;"><span style="font-size:9px"><b>Tip: Click on the chart data points to view more</b></span></td></tr>'
                      : '');
                }
                s += '</table>';
                return s;
              },
            },
            series: [
              {
                name: 'Series_1', //Total token Transfers
                type: 'column',
                keys: ['x', 'y', 'a', 'b', 'c', 'd', 'e'],
                data: plotData2,
                pointWidth: 5,
                tooltip: {
                  pointFormatter: function () {
                    var text;
                    var point = this;
                    text = '<br><span style="color:' + point.series.color + '">&#11044</span> ' + point.series.name + ': <b>' + this.y + '</b><br>';
                    return text;
                  },
                },
              },
              {
                name: 'Series_2', //Token Contract Counts
                type: 'line',
                yAxis: 1,
                keys: ['x', 'a', 'b', 'c', 'd', 'e', 'y'],
                data: plotData2,
              },
              {
                name: 'Series_3', //Outbound Transfers
                type: 'line',
                keys: ['x', 'a', 'y', 'b', 'c', 'e', 'd'],
                visible: false,
                data: plotData2,
              },
              {
                name: 'Series_4', //Inbound Transfers
                type: 'line',
                keys: ['x', 'a', 'b', 'y', 'c', 'd', 'e'],
                visible: false,
                data: plotData2,
              },
              {
                name: 'Series_5', //Unique Address SentTo
                type: 'line',
                keys: ['x', 'a', 'b', 'c', 'y', 'd', 'e'],
                visible: false,
                data: plotData2,
              },
              {
                name: 'Series_6', //Unique Address Received From
                type: 'line',
                keys: ['x', 'a', 'b', 'c', 'd', 'y', 'e'],
                visible: false,
                data: plotData2,
              },
            ],
          },
          function (chart) {
            // on complete
          },
        );
      }
      renderChart();
    });
  }, []);
  return (
    <div className="tab-pane fade active show" id="tab2" role="tabpanel" aria-labelledby="tab2-tab">
      <span id="tab2_default_content"></span>
      <div id="container_2">
        <div className="d-md-flex justify-content-between align-items-center mb-3">
          <h4 className="h6 mb-1 mb-md-0">{t('address.analytics.TokenTransfers.TimeSeries')}</h4>
          {/* <div>
            <span id="addressdisplay_2">Thu 15, Apr 2021 - Sun 27, Jun 2021</span>
          </div> */}
        </div>
        <hr className="my-0" />
        <div className="mt-3">
          <div className="content" ref={containerRef} style={{overflow: 'hidden'}} data-highcharts-chart="3"></div>
        </div>
        <span className="d-block text-center mb-4">{t('address.analytics.TokenTransfers.ProTip')}</span>
      </div>
    </div>
  );
}

export default function Analytics({address, overview}) {
  const {t} = useTranslation(['address']);
  const tabs = [
    {
      key: 'htbalance',
      title: t('address.analytics.htbalance'),
    },
    {
      key: 'transactions',
      title:  t('address.analytics.transactions'),
    },
    {
      key: 'txnfees',
      title:  t('address.analytics.txnfees'),
    },
    {
      key: 'httransfers',
      title: t('address.analytics.httransfers'),
    },
    {
      key: 'tokentransfers',
      title:  t('address.analytics.tokentransfers'),
    },
  ];
  const [currentTab, setCurrentTab] = useState('htbalance');

  return (
    <div>
      <ul className="nav nav-pills nav-pills-secondary mb-2" id="nav_tabs" role="tablist">
        {tabs.map(t => {
          return (
            <li id="li_tab1" key={t.key} className="nav-item">
              <a
                className={`nav-link ${currentTab === t.key ? 'show active' : ''}`}
                href="#"
                data-title={t.title}
                data-toggle="tab"
                onClick={e => {
                  e.preventDefault();
                  setCurrentTab(t.key);
                }}
              >
                {t.title}
              </a>
            </li>
          );
        })}
      </ul>
      <div className="tab-content card border p-3 mb-4">
        {currentTab === 'htbalance' ? <HTBalance address={address} overview={overview} /> : undefined}
        {currentTab === 'transactions' ? <Transactions address={address} overview={overview} /> : undefined}
        {currentTab === 'txnfees' ? <TxnFees address={address} overview={overview} /> : undefined}
        {currentTab === 'httransfers' ? <HTTransfers address={address} overview={overview} /> : undefined}
        {currentTab === 'tokentransfers' ? <TokenTransfers address={address} overview={overview} /> : undefined}
      </div>
    </div>
  );
}
