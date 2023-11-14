import { useContext } from 'react'; 
import UserContext from '../../UserContext';
import {useLocation,Link} from 'react-router-dom'; 

export default function LeftMenu({user}) { 
    return (
    <div className="iq-sidebar  sidebar-default">
        {/* logo  begin*/}
        <div className="iq-sidebar-logo d-flex align-items-end justify-content-between">
        <a href="/" className="header-logo">
            <img src="assets/images/logo.png" className="img-fluid rounded-normal light-logo" alt="logo" />
            <img src="assets/images/logo-dark.png" className="img-fluid rounded-normal d-none sidebar-light-img" alt="logo" />
            <span>联盟链</span>            
        </a>
        <div className="side-menu-bt-sidebar-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-light wrapper-menu" width="30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        </div>
        {/* logo  end*/}

        <div className="data-scrollbar" data-scroll="1">
            <nav className="iq-sidebar-menu">
                <ul id="iq-sidebar-toggle" className="side-menu"> 
                    <li className=" sidebar-layout">
                        <Link to='/' className="svg-icon">
                            <i className="">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </i>
                            <span className="ml-2">区块链概述</span> 
                        </Link>  
                    </li> 
                    {user.token ? 
                        <> 
                            <li className=" sidebar-layout">
                                <Link to='/myaccount' className="svg-icon">
                                    <i className="">
                                        <svg className="svg-icon" id="iq-user-1-1" xmlns="http://www.w3.org/2000/svg"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </i>
                                    <span className="ml-2">用户信息</span> 
                                </Link>  
                            </li>

                            <li className="sidebar-layout">
                                <a href="#blockmanage" className="collapsed svg-icon" data-toggle="collapse" aria-expanded="false">
                                    <i>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </i>
                                    <span className="ml-2">区块链管理</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="svg-icon iq-arrow-right arrow-active" width="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                                <ul id="blockmanage" className="submenu collapse" data-parent="#iq-sidebar-toggle">                        
                                    <li className=" sidebar-layout">
                                        <Link to='/blocks' className="svg-icon">
                                            <i className="">
                                                <svg className="svg-icon" width="18" id="iq-ui-1-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" strokeDasharray="48,68" strokeDashoffset={0}></path>
                                                </svg>
                                            </i>
                                            <span className="ml-2">区块列表</span>
                                        </Link>
                                    </li>
                                    <li className=" sidebar-layout">
                                        <Link to='/transactions' className="svg-icon">
                                            <i className="">
                                                <svg className="icon line" width="18" id="receipt" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path d="M17,16V3L13,5,10,3,7,5,3,3V17.83A3.13,3.13,0,0,0,5.84,21,3,3,0,0,0,9,18V17a1,1,0,0,1,1-1H20a1,1,0,0,1,1,1v1a3,3,0,0,1-3,3H6" strokeLinecap="round" strokeLinejoin="round"   strokeWidth="2"  fill="none"></path>
                                                    <line x1="8" y1="10" x2="12" y2="10" strokeLinecap="round" strokeLinejoin="round"   strokeWidth="2"  fill="none"></line>
                                                </svg> 
                                            </i>
                                            <span className="ml-2">交易列表</span>
                                        </Link>
                                    </li>
                                    <li className=" sidebar-layout">
                                        <Link to='/#' className="svg-icon">
                                            <i className="">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                                </svg>
                                            </i>
                                            <span className="ml-2">读交易</span>
                                        </Link>
                                    </li>
                                    <li className=" sidebar-layout">
                                        <Link to='/#' className="svg-icon">
                                            <i className="">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                            </i>
                                            <span className="ml-2">写交易</span>
                                        </Link> 
                                    </li> 
                                    <li className=" sidebar-layout">
                                        <Link to='/#' className="svg-icon">
                                            <i className="">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </i>
                                            <span className="ml-2">合约管理</span>
                                        </Link>
                                    </li> 

                                </ul>
                            </li> 
                        </>  
                        :
                     ""
                    }
                    {
                    (user.token &&user.permission===1)?
                        <>
                          <li className="sidebar-layout">
                                <a href="#monitorLog" className="collapsed svg-icon" data-toggle="collapse" aria-expanded="false">
                                    <i>
                                        <svg className="svg-icon" width="18" id="iq-ui-1-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeDasharray="84,104" stroke-strokedashoffset={0}></path>
                                        </svg>
                                    </i>
                                    <span className="ml-2">节点监控</span> 
                                    <svg xmlns="http://www.w3.org/2000/svg" className="svg-icon iq-arrow-right arrow-active" width="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                                <ul id="monitorLog" className="submenu collapse" data-parent="#iq-sidebar-toggle"> 
                                    <li className=" sidebar-layout">
                                        <Link to='/nodelist' className="svg-icon">
                                            <i className="">
                                                <svg className="svg-icon" width="18" id="iq-ui-1-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeDasharray="79,99" stroke-strokedashoffset={0}></path>
                                                </svg>
                                            </i>
                                            <span className="ml-2">节点详情</span>
                                        </Link>
                                    </li> 
                                    <li className=" sidebar-layout">
                                        <Link to='/monitor' className="svg-icon">
                                            <i className="">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                                            </svg>

                                            </i>
                                            <span className="ml-2">监控管理</span>
                                        </Link>
                                    </li>
                                </ul>
                            </li> 
                        </>
                        
                        :""
                    }
                   

                </ul>
            </nav>
            <div className="pt-5 pb-5"></div>
        </div>
    </div>
    )
}