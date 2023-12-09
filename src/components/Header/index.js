import {useEffect,useState, useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {useMediaQuery} from 'react-responsive';
import {useLocation,Link} from 'react-router-dom'; 

import {mediaquerys} from '../../constant'; 

import UserContext from '../../UserContext';
import { useRequest } from 'ahooks';
import qs from 'qs';
import './style.css'; 

export default function Header() {
  const userContext = useContext(UserContext);
  const user = userContext.user || {};

  const [token, setToken] = useState(window.localStorage.getItem('token') || undefined);

  const [darkMode, setDarkMode] = useState(localStorage.getItem('dark') ||'false');
 
  const location = useLocation(); 
  const {t} = useTranslation(['common']);   
 
  const [state] = useState({
    navs: {
      home: {
        title: t('common.nav.home'),
        path: '/',
        children: [],
      },
      blockchain: {
        title: t('common.nav.blockchain'),
        children: [
          {
            title: t('common.nav.topaccounts'),
            path: '/accounts',
          },
          {
            type: 'divider',
          },
          {
            title: t('common.nav.txns'),
            path: '/txs',
          },
          {
            title:  t('common.nav.txsPending'),
            path: '/txsPending',
          },
          {
            title: t('common.nav.txsInternal'),
            path: '/txsInternal',
          },
          {
            type: 'divider',
          },
          {
            title: t('common.nav.blocks'),
            path: '/blocks',
          }
        ],
      }, 
      tokens: {
        title: t('common.nav.tokens'),
        children: [
          {
            title: t('common.nav.hrc20marketcap'),
            path: '/tokens',
          },
           {
            title: t('common.nav.hrc20volume'),
            path: '/tokens-volume',
          },  
          {
            title: t('common.nav.hrc20Transfers'),
            path: '/tokentxns',
          },
          {type: 'divider'},
          {
            title: t('common.nav.hrc721'),
            path: '/tokens-nft',
          },
          {
            title: t('common.nav.hrc721Transfers'),
            path: '/tokentxns-nft',
          },
        ],
      }, 
      misc: {
        title: 'Misc',
        minWidth: '200px',
        children: [
         
        ],
      },
      more:{
        title: t('common.nav.more'),
        minWidth: '200px',
        children:[
          {
            title: 'HPB Mainnet',
            path: 'https://hpbnode.com',
          }
        ]
      },
      explorers: {
        title: () => {
          return (
            <>
              <span className="btn btn-sm btn-icon btn-soft-primary cursor-pointer d-none d-md-inline-block">
                <img className="u-xs-avatar btn-icon__inner" src="/images/svg/brands/hpb-icon.svg?v=1.4" alt="HPB" />
              </span>
              <span className="d-inline-block d-md-none">Explorers</span>
            </>
          );
        },
        minWidth: '140px',
        children: [
          {
            title: 'HPB Mainnet',
            path: 'https://hpbnode.com',
          },
        /*   {
            title: 'HPB Testnet',
            path: 'https://hpbnode.com',
          }, */
        ],
      },
    },
    signIn: {
      path: '/login',
      title: () => {
        return (
          <>
            <i className="fa fa-user-circle mr-1"></i>{t('common.nav.login')}
          </>
        );
      },
      minWidth: '190px',
    },
    account: {
      title: u => {
        return (
          <>
            <i className="fa fa-user-circle mr-1"></i>
            {u.user_name}
          </>
        );
      },
      minWidth: '190px',
      children: [
        // {
        //   title: 'My Profile',
        //   path: '/myaccount',
        // },
        {
          title: t('common.myauthenticator'),
          path: '/myauthenticator',
        },
        {
          title: t('common.myapikey'),
          path: '/myapikey',
        }, 
        {type: 'divider', className: 'mb-3'},
        {
          className: 'px-3',
          component: () => {
            return (
              <a className="btn btn-xs btn-block btn-soft-primary" href="/login?cmd=logout">
                {t('common.signOut')}
              </a>
            );
          },
        },
      ],
    },
  });

  const logOutRequest = useRequest(
    body => ({
      url: '/loginapi/sys/login/logout',
      method: 'post',
      headers: { 
        'Content-Type': 'application/json',
      'X-Access-Token': (user.token ||'')
      },
      body: JSON.stringify(body),
    }),
    {manual: true, formatResult: r => r},
  );


  const getStorageToken = () => {
    const item =localStorage.getItem('token') ?? undefined; 
    setToken(item);
  };

  useEffect(() => {  
    const query = qs.parse(location.search, {ignoreQueryPrefix: true}); 
    if (query.cmd === 'logout') {
      window.localStorage.removeItem('token'); 
      window.localStorage.removeItem('chain_user');    
      window.location.href = '/login'
    }

    window.addEventListener('event_token', getStorageToken); 
    return () => {
      window.removeEventListener('event_token', getStorageToken);
    };

  }, []);

 
  return (
    <div className="iq-top-navbar">
        <div className="iq-navbar-custom">
            <nav className="navbar navbar-expand-lg navbar-light p-0">
              {token ?
                  <div className="side-menu-bt-sidebar">
                      <svg xmlns="http://www.w3.org/2000/svg" className="text-secondary wrapper-menu" width="30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                      </svg>
                  </div>
                  :
                  <div className="top-header-logo d-flex align-items-end justify-content-between">
                      <a href="/" className="header-logo">
                          <img src="assets/images/logo.png" className="img-fluid rounded-normal light-logo1" alt="logo" />
                          <img src="assets/images/logo-dark.png" className="img-fluid rounded-normal darkmode-logo1 sidebar-light-img" alt="logo" />
                          <span>联盟链</span>            
                      </a>
                  </div>
              }
              <div className="d-flex align-items-center ">
                  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-label="Toggle navigation">
                      <svg xmlns="http://www.w3.org/2000/svg" className="text-secondary" width="30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                      </svg>
                  </button>
                  <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {token ? 
                              <ul className="navbar-nav ml-auto navbar-list align-items-center"> 
                                <li className="nav-item nav-icon dropdown">
                                    <a href="#!" className="nav-item nav-icon dropdown-toggle pr-0 search-toggle" id="dropdownMenuButton" data-toggle="dropdown"   >
                                        <svg   className="svg-icon mr-0 text-secondary" viewBox="0 0 1024 1024" width="40" height="40" xmlns="http://www.w3.org/2000/svg" >
                                          <path d="M510.7 509.5m-400.3 0a400.3 400.3 0 1 0 800.6 0 400.3 400.3 0 1 0-800.6 0Z" fill="#3378ff"></path><path d="M748.1 727c-9.6-48.3-32-92.8-65.4-128.6-31.3-33.6-69.8-56.9-111.7-68.3 53.5-23.4 91-76.8 91-138.8 0-83.4-67.9-151.3-151.3-151.3s-151.3 67.9-151.3 151.3c0 62 37.5 115.4 91 138.8-41.9 11.4-80.4 34.7-111.7 68.3-33.4 35.8-55.8 80.2-65.4 128.6-0.9 4.7 0.5 9.6 3.8 13.1l0.3 0.3c8.3 8.7 23 4.5 25.4-7.3 20.6-103.3 106.1-180.9 208-180.9 102 0 187.4 77.6 208 180.9 2.4 11.8 17.1 16.1 25.4 7.3l0.3-0.3c3.1-3.6 4.6-8.4 3.6-13.1zM389.3 391.4c0-66.9 54.4-121.3 121.3-121.3s121.3 54.4 121.3 121.3-54.4 121.3-121.3 121.3c-66.8 0-121.3-54.4-121.3-121.3z" fill="#ffffff" p-id="12022"></path>
                                        </svg>
                                        <span className="mb-0 ml-2 user-name">{user.email}</span>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton"> 
                                        <li className="dropdown-item  d-flex svg-icon">
                                            <svg className="svg-icon mr-0 text-secondary"  width="20" id="iq-user-1-1" xmlns="http://www.w3.org/2000/svg"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <Link to='/myaccount'>用户信息</Link>
                                            {/* <a href="/myaccount">用户信息</a> */}
                                        </li>  
                                          <li className="dropdown-item  d-flex svg-icon">
                                            <svg className="svg-icon mr-0 text-secondary" id="h-05-p" width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <a href="/login?cmd=logout">退出登录</a>
                                        </li>
                                    </ul>
                                </li> 
                                <li className="nav-item nav-icon dropdown pl-1 "> 
                                {user.permission===1? <span className=' u-label  u-label--sm  u-label--success rounded' style={{padding:'0 10px;'}}>普通用户</span> 
                                :<span className='u-label  u-label--sm  u-label--info rounded'  style={{padding:'0 10px'}}>管理员</span> }
                                </li> 
                              </ul> 
                            :
                            
                              <ul className="navbar-nav ml-auto navbar-list align-items-center"> 
                                <li className="nav-item nav-icon">
                                  <Link to='/login'  className="nav-item nav-icon dropdown-toggle pr-0 search-toggle" >
                                  <svg className="svg-icon mr-0 text-secondary w-6 h-6" xmlns="http://www.w3.org/2000/svg"  width="20"  fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                  </svg>

                                      <span className="mb-0 ml-2 user-name">登录</span>
                                  </Link> 
                                </li> 
                                <li className="nav-item nav-icon">
                                    <Link to='/register'  className="nav-item nav-icon dropdown-toggle pr-0 search-toggle" >
                                <svg className="svg-icon mr-0 text-secondary w-6 h-6" xmlns="http://www.w3.org/2000/svg"  width="20"  fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                                </svg>

                                        <span className="mb-0 ml-2 user-name">注册</span>
                                    </Link> 
                                </li>
                              </ul> 
                            }
                                            
                  </div> 
                  <div className="change-mode">
                      <div className="custom-control custom-switch custom-switch-icon custom-control-inline">
                          <div className="custom-switch-inner">
                              <p className="mb-0"> </p>
                              <input type="checkbox" className="custom-control-input" id="dark-mode" data-active={darkMode==='true'?"false":"true"}  defaultChecked={darkMode==='true'?true:false}/>
                              <label className="custom-control-label" htmlFor="dark-mode" data-mode="toggle">
                                  <span className="switch-icon-right">
                                      <svg xmlns="http://www.w3.org/2000/svg" id="h-moon" height="20" width="20" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                                      </svg>
                                  </span>
                                  <span className="switch-icon-left">
                                      <svg xmlns="http://www.w3.org/2000/svg" id="h-sun" height="20" width="20" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                      </svg>
                                  </span>
                              </label>
                          </div>
                      </div>
                  </div>
              </div>
            </nav>
        </div>
    </div>
  );
}
