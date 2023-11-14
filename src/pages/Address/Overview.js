import {useState, useRef} from 'react';
import {useRequest} from 'ahooks';

import {useOnClickOutside} from '../../hooks';
import {useTranslation} from 'react-i18next';
import Loading from '../../components/Loading';
import React from 'react';

function Token({data, address, holding_counts, holding_list}) {
  const {t} = useTranslation(['address']);
  const addressRequest = useRequest(
    body => {
      return {
        url: '/blockBrowser/blockChain/contractInternalTrade/contractDetail',
        method: 'post',
        body: JSON.stringify({
          field: 'address',
          value: body,
        }),
      };
    },
    {manual: true},
  );
  const [state, setState] = useState({
    showTokenList: false,
  });
  const targetRef = useRef();
  const ref = useRef();

  const handleToggleTokenList = e => {
    e.preventDefault();
    setState({...state, showTokenList: !state.showTokenList});
  };

  useOnClickOutside(ref, targetRef, () => {
    setState({...state, showTokenList: false});
  });

  if (addressRequest.loading) {
    return <Loading />;
  }

  return (
    <div>
      <hr className="hr-space" />
      <div className="row align-items-center">
        <div className="col-md-4 mb-1 mb-md-0">{t('address.token.token')}:</div>
        <div className="col-md-8 d-flex justify-content-between">
          <div className="position-relative w-100 mr-1">
            <a
              ref={targetRef}
              className="btn btn-xs btn-custom btn-custom-balance dropdown-toggle"
              href="#"
              role="button"
              aria-controls="basicDropdownClick"
              aria-haspopup="true"
              aria-expanded={String(state.showTokenList)}
              data-unfold-type="css-animation"
              data-unfold-duration="300"
              data-unfold-delay="300"
              data-unfold-hide-on-scroll="false"
              data-unfold-animation-in="slideInUp"
              data-unfold-animation-out="fadeOut"
              onClick={handleToggleTokenList}
            >
              ${data.token || '0.00'}
              <span className="badge badge-primary mx-1" data-toggle="tooltip" title="" data-original-title="More than 100 token contracts found, but displaying the first 100 only">
                {Number(holding_counts) > 100 ? '>100' : holding_counts}
              </span>
            </a>
            <div
              ref={ref}
              className={`dropdown-menu dropdown-unfold dropdown-balance w-100 u-unfold--css-animation ${state.showTokenList ? 'slideInUp' : 'u-unfold--hidden'}`}
              aria-labelledby="availableBalanceDropdown"
              style={{animationDuration: '300ms'}}
            >
              <div className="pl-2 pr-3 js-focus-state" style={{display: 'none'}}>
                <input type="text" className="form-control form-control-xs search mb-3" placeholder="Search for Token Name" aria-label="Search for Token name" aria-describedby="filter-search" />
              </div>
              <div className="js-scrollbar pl-2 pr-3 mCustomScrollbar _mCS_1 mCS-autoHide mCS_no_scrollbar" style={{maxHeight: '280px', position: 'relative', overflowY: 'scroll'}}>
                <div className="mCustomScrollBox mCS-minimal-dark mCSB_vertical mCSB_outside" style={{maxHeight: 'none'}} tabIndex="0">
                  <div className="mCSB_container mCS_y_hidden mCS_no_scrollbar_y" style={{position: 'relative', top: 0, left: 0}} dir="ltr">
                    <div className="list-not-found text-center pt-5" style={{display: 'none'}}>
                      <img className="mb-4 mCS_img_loaded" width="100" src="/assets/svg/empty-states/empty-search-state.svg" alt="Search Not Found" />
                      <p className="lead mb-0">Could not find any matches!</p>
                    </div>
                    <div className="text-center pt-5" style={{display: 'none'}}>
                      <img className="mb-4 mCS_img_loaded" width="100" src="/assets/svg/empty-states/empty-search-state.svg" alt="Search Not Found" />
                      <p className="lead mb-0">
                        Token display limit reached. Click to
                        <a href="#" data-toggle="tooltip" title="" data-original-title="Click for Show More Result">
                          Show more
                        </a>
                      </p>
                    </div>
                    <ul className="list list-unstyled mb-0">
                      <li className="list-custom-divider list-custom-divider-HRC-20 d-flex justify-content-between align-items-center font-size-1 rounded-sm py-1 px-2 mb-1">
                        <span>
                          <i className="fa fa-angle-right text-secondary"></i>
                          {/* <!-- 合约类型：0-不是，1-erc20 2-erc721，3-其他类型 --> */}
                          {data.contract_type === 1 ? <strong> HRC-20 Tokens</strong> : undefined}
                          {data.contract_type === 2 ? <strong> HRC-20 Tokens</strong> : undefined}
                          <span>({Number(holding_counts) > 100 ? '>100' : holding_counts})</span>
                        </span>
                        <button type="button" className="btn sort text-secondary font-size-1 p-0" data-toggle="tooltip" title="" data-original-title="Click to sort">
                          &nbsp;&nbsp;<i className="fad fa-sort-down"></i>&nbsp;&nbsp;
                        </button>
                      </li>
                      {React.Children.toArray(
                        holding_list.map(item => {
                          return (
                            <li className="list-custom list-custom-HRC-20">
                              <a className="link-hover d-flex justify-content-between align-items-center" href={`/token/${item.token_address}?a=${address}`}>
                                <div>
                                  <div className="d-flex align-items-center">
                                    <img className="mr-1 mCS_img_loaded" width="25" src={item.token_image ? item.token_image : '/images/main/empty-token.png'} alt={item.symbol} />
                                    <span className="list-name hash-tag text-truncate">
                                      <i className="fa fa-refresh" data-toggle="tooltip" title="" data-original-title="** Pending Token Balance Update ** "></i> {item.token_name} ({item.symbol})
                                    </span>
                                  </div>
                                  <span className="list-amount link-hover__item hash-tag hash-tag--md text-truncate">
                                    {item.in_value} {item.symbol}
                                  </span>
                                </div>
                                <div className="text-right" style={{display: 'none'}}>
                                  <span className="list-usd-value d-block">$962,463.55</span>
                                  <span className="list-usd-rate link-hover__item">@1.71</span>
                                </div>
                              </a>
                            </li>
                          );
                        }),
                      )}

                      <li className="list-custom" style={{display: 'none'}}>
                        <a className="btn btn-xs btn-block btn-soft-primary" href="#">
                          <i className="fas fa-plus"> Show More </i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mCSB_scrollTools mCSB_1_scrollbar mCS-minimal-dark mCSB_scrollTools_vertical" style={{display: 'none'}}>
                  <div className="mCSB_draggerContainer">
                    <div className="mCSB_dragger" style={{position: 'absolute', minHeight: '50px', top: 0}}>
                      <div className="mCSB_dragger_bar" style={{lineHeight: '50px'}}></div>
                    </div>
                    <div className="mCSB_draggerRail"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span>
            <a
              className="btn btn-xs btn-custom btn-custom-secondary"
              data-toggle="tooltip"
              data-placement="top"
              data-title="View expanded HRC-20 token holding"
              href={`/tokenholdings?a=${address}`}
              data-original-title=""
              title=""
            >
              <i className="fas fa-expand"></i>
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Overview({data, address, loading, error, holding_list, holding_counts}) {
  const {t} = useTranslation(['address']);

  if (loading) {
    return <Loading />;
  }


  if (error) {
    return <div>Error</div>;
  }

  // 账户类型:0-不是，1-account 2-contract

  return (
    <div className="card h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="card-header-title">{data.account_type === 2 ?  t('address.overview.contractOverview') : t('address.overview.accountoverview')}</h2>
        {/* {data.account_type === 2 ?  (
          <div>
            <span className="u-label u-label--secondary text-dark font-size-1 rounded py-1 px-3">
              <span data-toggle="tooltip" title="" data-original-title="Public Name Tag (viewable by anyone)">
                Mdex: Heco Pool
              </span>
              <a href="https://mdex.com" target="_blank" rel="nofollow" data-toggle="tooltip" title="" data-original-title="External Site - More Info">
                <i className="fa fa-external-link-alt pos-top-n1 small ml-1"></i>
              </a>
            </span>
          </div>
        ):undefined} */}
      </div>
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-4 mb-1 mb-md-0">{t('address.overview.Balance')}:</div>
          <div className="col-md-8">{data.balance} HPB </div>
        </div>
        <hr className="hr-space" />
        <div className="row align-items-center">
          <div className="col-md-4 mb-1 mb-md-0">{t('address.overview.hpbValue')}:</div>
          <div className="col-md-8">${data.value}</div>
        </div>
        {Array.isArray(holding_list) && holding_list.length ? <Token address={address} data={data} holding_counts={holding_counts} holding_list={holding_list} /> : undefined}
      </div>
    </div>
  );
}
