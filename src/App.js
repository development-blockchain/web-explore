import {useEffect, useState} from 'react';
import {useRequest} from 'ahooks';

import {BrowserRouter as Router} from 'react-router-dom';
import {UseRequestProvider} from 'ahooks';

import Header from './components/Header';
import LeftMenu from './components/LeftMenu';
import Footer from './components/Footer';
import Loading from './components/Loading';

import UserContext from './UserContext';
import SwitchRoute from './SwitchRoute';
import{sign} from './commons/sm2';
import "apexcharts/dist/apexcharts.css"

function App() {
  const [state, setState] = useState(true);
 
  const [token, setToken] = useState(window.localStorage.getItem('token') || undefined);

  const chain_user = window.localStorage.getItem('chain_user') ||'{"email":"","publicKey":"","provider_username":"","provider_pubkey":"","permission":""}';
  const chainUser = JSON.parse(chain_user) ; 

  const [user, setUser] = useState({
    token: window.localStorage.getItem('token') || undefined,
    email: chainUser.email || undefined,
    key: window.localStorage.getItem('key') || undefined,
    publicKey: chainUser.publicKey || undefined,
    provider_username:chainUser.provider_username|| undefined,
    provider_pubkey:chainUser.provider_pubkey  || undefined,
    permission:chainUser.permission  || undefined,
    user_id:chainUser.user_id  || undefined,
    tdh2_pubkey:chainUser.tdh2_pubkey  || undefined,
  });
 
  const userInfoRequest = useRequest(
    body => ({ 
      url: '/chainBrowser/user/info/getUserInfo',
      method: 'post',
      headers: {
        'Authorization': user.token,
      },
      body: JSON.stringify(body),
    }),
    {manual: true},
  ); 
  
  const getStorageToken = () => {
    const item =localStorage.getItem('token') ?? undefined; 
    setToken(item);
  };

  useEffect(() => {
    if (user.token) {  
      const date=new Date();
      const min=date.getMinutes();
      const curTimestamp = date.getTime();
      const expireTimestamp = date.setMinutes(min+30);
      const curMsg = curTimestamp +user.email + user.publicKey   + user.provider_username + user.provider_pubkey + expireTimestamp;
      const auth_token = sign(curMsg, user.key);
      const checkParam = { 
        timestamp:curTimestamp + "",
        expired_timestamp:expireTimestamp+ "", 
        auth_token:auth_token 
      }

      userInfoRequest.run({...checkParam}).then(
        res => {   
          if (res.code === 0) {
            setState(true);
            setUser({...user, ...res.data});
          }else{
            setState(false);
            prompt.error(res.cnMsg,false); 
            window.localStorage.removeItem('token'); 
            window.localStorage.removeItem('chain_user');    
            window.location.href = '/login'
          }
      
        },
        (err) =>{ 
          prompt.error('网络异常!',false); 
          window.localStorage.removeItem('token'); 
          window.localStorage.removeItem('chain_user');    
          window.location.href = '/login'
        }
      );
    } else {
      setState(true);
    }

    window.addEventListener('event_token', getStorageToken); 
    return () => {
      window.removeEventListener('event_token', getStorageToken);
    };

  }, []);

  if (userInfoRequest.loading) {
    return <Loading />;
  } 

  return (
    <UseRequestProvider value={{formatResult: r => r.data}}>
      <UserContext.Provider
        value={{
          user: user, 
          updateUser: e => {
            setUser({...user, ...e});
          },
        }}
      >
        <Router>
          <div className="wrapper display-flex">
           
          {token ? <LeftMenu user={user} />:""}
            <div className={`content-page ${token ?"":"ml-0"} `}>
              <Header />
              {state ? <SwitchRoute /> : undefined}
            </div> 
          </div>
          <Footer /> 
        </Router>
      </UserContext.Provider>
    </UseRequestProvider>
  );
}

export default App;
