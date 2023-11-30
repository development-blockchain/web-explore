import {Switch, Route} from 'react-router-dom';
import {useSize} from 'ahooks';

import Welcome from './pages/Welcome';
import Blocks from './pages/Blocks';  
import Block from './pages/Block';
import Txs from './pages/Txs';
import Tx from './pages/Tx'; 
import Login from './pages/Login';
import LostPassword from './pages/LostPassword';
import Register from './pages/Register';
import ResendEmail from './pages/ResendEmail'; 

import MyAccount from './pages/MyAccount'; 
import MySettings from './pages/MySettings'; 
import Activate from './pages/Activate'; 
import Transactions from './pages/Transactions';
import ForgetPassword from './pages/ForgetPassword';
import ModifyPassword from './pages/ModifyPassword';
import ModifySecretKey from './pages/ModifySecretKey';
import ResetPassword from './pages/ResetPassword';
import NodeList from './pages/NodeList';
import NodeLog from './pages/NodeLog';
import Error from './pages/Error';
import Monitor from './pages/Monitor';
import WriteTx from './pages/WriteTx';
import ReadTx from './pages/ReadTx';
import AccountManage from './pages/AccountManage';

export default function SwitchRoute() {
  const header = document.getElementById('Header');
  const footer = document.getElementById('Footer');
  const body = document.querySelector('body');
  const headerSize = useSize(header);
  const footerSize = useSize(footer);
  const bodySize = useSize(body); 
  return (
    <div className="avc" style={{minHeight: `${bodySize.height - headerSize.height - footerSize.height}px`}}>
      <Switch>

        <Route path="/accountmanage">
            <AccountManage />
        </Route>   
        <Route path="/readtx">
            <ReadTx />
        </Route>     
        <Route path="/writetx">
            <WriteTx />
        </Route>  
        <Route path="/monitor">
            <Monitor />
        </Route>  
        
        <Route path="/nodelist">
            <NodeList />
        </Route>           
         <Route path="/nodelog/:nodename">
            <NodeLog />
        </Route>     
        
        <Route path="/resetpassword">
            <ResetPassword />
        </Route>         
        <Route path="/modifysecretkey">
            <ModifySecretKey />
        </Route>         
        
         <Route path="/modifypassword">
            <ModifyPassword />
        </Route>            
        
        <Route path="/transactions">
           <Transactions />
        </Route>    

        <Route path="/tx/:tx">
          <Tx />
        </Route>

        <Route path="/forgetpassword">
          <ForgetPassword/>
        </Route> 
         
        <Route path="/block/:block">
          <Block />
        </Route>
        <Route path="/blocks">
          <Blocks />
        </Route>    

        <Route path="/txs">
          <Txs />
        </Route>            
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/lostpassword">
          <LostPassword />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/resendemail">
          <ResendEmail />
        </Route>   
        <Route path="/myaccount">
          <MyAccount />
        </Route> 
        <Route path="/activate">
          <Activate />
        </Route>    
        <Route path="/mysettings">
          <MySettings />
        </Route>      
        <Route path="/error">
          <Error />
        </Route>
        <Route path="/">
          <Welcome />
        </Route>
      
      </Switch>
    </div>
  );
}
