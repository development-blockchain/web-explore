import {useEffect, useState} from 'react';
import {useRequest} from 'ahooks';
import {useLocation} from 'react-router-dom';
import qs from 'qs';
import {useTranslation} from 'react-i18next';
import Pager from '../../components/Pager';
import Loading from '../../components/Loading';

export default function Accounts() {

  const {t} = useTranslation(['account']);

  const location = useLocation(); 
  const query = qs.parse(location.search, {ignoreQueryPrefix: true}); 
  const [state, setState] = useState({
    isLimitPages: Number(query.p || 1) > 10000,
    body: {
      start: query.p || '1',
      length:  window.localStorage.getItem('pageLength') || '50',
    },
  });   

  const handleChangePageSize = e => {
    window.localStorage.setItem('pageLength', e.target.value);
    setState({...state, body: {...state.body, length: e.target.value}});
  };

  const accountListRequest = useRequest(
    body => ({
      url: '/blockBrowser/blockChain/account/accountList',
      method: 'post',
      body: JSON.stringify(body),
    }),
    {manual: true},
  );

  useEffect(() => {
    if (!state.isLimitPages) {
      accountListRequest.run(state.body);
    }
  }, [state]);

  if (state.isLimitPages) {
    return window.location.replace('/error');
  }

  if (accountListRequest.loading) {
    return <Loading />;
  }

  const data = accountListRequest.data?.account_list || [];
  const counts = accountListRequest.data?.counts || 0;
  const account_count = accountListRequest.data?.account_count || 0;
  const totalPage = Math.ceil(Number(account_count) / state.body.length);

  return (
    <main role="main">
      <div className="container">
        <div className="d-md-flex justify-content-between align-items-center py-3">
          <div className="mb-1 mb-md-0">
            <h1 className="h4 font-weight-normal mb-0">
            {t('account.title')}
            </h1>
          </div>
        </div>
      </div>

      <div className="container space-bottom-2">
        <div className="card">
          <div className="card-body">
            <div className="d-md-flex justify-content-between mb-4">
              <p className="mb-2 mb-md-0">
                <i className="fa fa-spin fa-spinner fa-1x fa-pulse mr-1" style={{display: 'none'}}></i>
                
                {t('account.tip1')} &gt; {counts} {t('account.tip2')}
                <span className="d-block text-secondary small">( {t('account.tip3')}  {account_count}  {t('account.tip4')}  )</span>
              </p>
              <Pager path="/accounts" current={state.body.start} total={totalPage} />
            </div>
            <div className="table-responsive mb-2 mb-md-0">
              <table className="table table-hover" style={{width: '100%'}}>
                <thead className="thead-light">
                  <tr>
                    <th width="40" scope="col">
                    {t('account.table.rank')}
                    </th>
                    <th scope="col" width="370">
                    {t('account.table.address')} 
                    </th>
                    <th className="remove-icon" scope="col"> 
                      {t('account.table.nameTag')} 
                    </th>
                    <th scope="col">
                      <i className="fa fa-angle-down text-secondary"></i>  {t('account.table.balance')}  
                    </th>
                    <th scope="col"> {t('account.table.percentage')}  </th>
                    <th scope="col">{t('account.table.txnCount')}t</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, i) => {
                    // 账户类型, 1-account 2-contract
                    return (
                      <tr key={i}>
                        <td>{i + 1 + Number(state.body.length) * (state.body.start - 1)}</td>
                        <td>
                          {String(item.account_type) === '2' ? <i data-toggle="tooltip" title="" className="far fa-file-alt text-secondary mr-1" data-original-title="Contract"></i> : undefined}
                          <a href={`/address/${item.account_address}`}>{item.account_address}</a>
                          {item.account_lock ? (
                            <a
                              href="https://support.hbfile.net/hc/en-us/articles/900003880226-Huobi-Global-Will-Transfer-HPB-To-Heco"
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View HPB Transfer Information"
                            >
                              <i className="far fa-lock-alt text-secondary ml-1"></i>
                            </a>
                          ) : undefined}
                        </td>
                        <td>{item.name_tag}</td>
                        <td>{item.balance} HPB</td>
                        <td>{item.percentage}%</td>
                        <td>{item.trade_count}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <form method="post">
              <div className="d-md-flex justify-content-between my-3">
                <div className="d-flex align-items-center text-secondary mb-2 mb-md-0">
                {t('account.tip5')}
                  <select onChange={handleChangePageSize} className="custom-select custom-select-xs mx-2" value={state.body.length} >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  {t('account.tip6')}
                </div>
                <Pager path="/accounts" current={state.body.start} total={totalPage} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
