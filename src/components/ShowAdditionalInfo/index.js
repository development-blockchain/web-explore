import React, {useState} from 'react'; 
import { Popover ,OverlayTrigger} from 'react-bootstrap';
import './index.css'
import {HexToDec} from '../../commons/utils';

 
function getDivLoadding(){
  return  (
      <div style={{position: 'relative', minHeight: '100px'}}>
        <div style={{position: 'absolute', left: '50%',top:'10%', marginLeft: '-31px'}}>
          <div className="py-3 text-center">
            <img src="/images/main/loadding.gif" alt="Loading"  />
          </div>
        </div>
      </div>
    )
 }

 function TokensTransferred({data}) { 
  if (!Array.isArray(data.tokens_transferred)) {
    return null;
  }
  const leg = data.tokens_transferred.length;
  return (
    <div>
        <hr className='hr-space' />
        <h5 className='font-size-1 font-weight-bold mb-1'>Token Transfer:{leg > 1 ? <span className="badge badge-pill badge-secondary align-midle">{leg}</span> : undefined}</h5>
        {React.Children.toArray(
            data.tokens_transferred.map((item, i) => {
              return (
              <div className='media align-items-center'>
                <div className='media-body text-truncate'>
                  <div className='d-flex'>
                    <span className='text-secondary mr-1'>From</span>
                    <span className='hash-tag text-truncate hash-tag-custom-to-721 mr-1'>
                      <a href={`/token/${item.contact_address}?a=${item.trade_from}`} className="hash-tag text-truncate">
                              <span className="hash-tag text-truncate hash-tag-custom-from-721 tooltip-address" data-toggle="tooltip" title="" data-original-title={item.trade_from}>
                                {item.trade_from}
                              </span>
                      </a> 
                    </span>
                    <span className='text-secondary mr-1'>To</span>
                    <span className='hash-tag text-truncate hash-tag-custom-to-721 mr-1'>
                      <a href={`/token/${item.contact_address}?a=${item.trade_to}`}>
                              <span className="hash-tag text-truncate hash-tag-custom-to-721 tooltip-address" data-toggle="tooltip" title="" data-original-title={item.trade_to}>
                                {item.trade_to}
                              </span>
                        </a>
                    </span>
                  </div>
                </div>
              </div>
              )    
          }),
          )} 
    </div>
  );
   
}

function TokensTransferred721({data}) {
  if (!Array.isArray(data.tokens_transferred_721)) {
    return null;
  }
  const length = data.tokens_transferred_721.length;
  if(length === 0) return null;
  return (
    <div>
        <hr className='hr-space' />
        <h5 className='font-size-1 font-weight-bold mb-1'>Token Transfer:{length > 1 ? <span className="badge badge-pill badge-secondary align-midle">{length}</span> : undefined}</h5>
        {React.Children.toArray(
            data.tokens_transferred_721.map((item, i) => {
              return (
              <div className='media align-items-center'>
                <div className='media-body text-truncate'>
                  <div className='d-flex mb-1'>
                      <div className='mr-1'>
                          <img src={item.contact_image || '/images/main/empty-token.png'} className="mt-n1 mr-1" width="15" />
                      </div> 
                        <a className='d-flex'  href={`/token/${item.contact_address}`}>
                              <span data-toggle="tooltip" title="" data-original-title={item.contact_name}>
                                <font color="">{item.contact_name}</font>
                              </span>
                              ({item.contact_symbol})
                        </a>
                  </div>
                  <div className='d-flex text-secondary text-truncate mb-1'>
                    <span className='mr-1'>HRC-721 TokenID</span>
                    <a className='d-block text-truncate'  href={`/token/${item.contact_address}?a=${item.token_id}`}>
                                {HexToDec(item.token_id)}
                      </a> 
                  </div>
                  <div className='d-flex'>
                    <span className='text-secondary mr-1'>From</span>
                    <span className='hash-tag text-truncate hash-tag-custom-to-721 mr-1'>
                      <a href={`/token/${item.contact_address}?a=${item.trade_from}`} className="hash-tag text-truncate">
                              <span className="hash-tag text-truncate hash-tag-custom-from-721 tooltip-address" data-toggle="tooltip" title="" data-original-title={item.trade_from}>
                                {item.trade_from}
                              </span>
                      </a> 
                    </span>
                    <span className='text-secondary mr-1'>To</span>
                    <span className='hash-tag text-truncate hash-tag-custom-to-721 mr-1'>
                      <a href={`/token/${item.contact_address}?a=${item.trade_to}`}>
                              <span className="hash-tag text-truncate hash-tag-custom-to-721 tooltip-address" data-toggle="tooltip" title="" data-original-title={item.trade_to}>
                                {item.trade_to}
                              </span>
                        </a>
                    </span>
                  </div>
                </div>
              </div>
              )    
          }),
          )} 
    </div>
  );
}

 function getDivData(data){
  const percent = (Number(data.gas_used_by_trade) / Number(data.gas_limit)) * 100;
    return (
      <div>
        <h4 className='h5 mb-3'>Additional Info</h4>              
        <h5 className='font-size-1 font-weight-bold mb-1'>Status:</h5>
        {data.status===1?
        <span className='text-success' title=''><i className='fa fa-check-circle mr-1'></i>Success</span>
        :
        <span className='text-danger' title=''><i className='fa fa-check-circle mr-1'></i>Fail, with error '1'</span>
        }
        
        <span className='text-secondary ml-1'>({data.block_confirmations} Block Confirmations)</span> 

        {Array.isArray(data.tokens_transferred) && data.tokens_transferred.length ? <TokensTransferred data={data} /> : undefined} 
        {Array.isArray(data.tokens_transferred_721) && data.tokens_transferred_721.length ? <TokensTransferred721 data={data} /> : undefined} 

        <hr className='hr-space' />
        <h5 className='font-size-1 font-weight-bold mb-1'>Transaction Fee:</h5>
        <div>
          <span data-toggle="tooltip" title="" data-original-title="Gas Price * Gas Used by Transaction">
            {data.trade_fee} HPB (${Number(data.trade_fee) * Number(data.currency_price)})
          </span>
         
        </div>
        <hr className='hr-space' />
        <h5 className='font-size-1 font-weight-bold mb-1'>Gas Info:</h5>
        <div>
        {data.gas_used_by_trade} ({percent.toFixed(2)}%) Gas Used From  {data.gas_limit} Gas Limit @ {data.gas_price} HPB (1 Gwei)
        </div>
        <hr className='hr-space' />
        <h5 className='font-size-1 font-weight-bold mb-1'>
          Nonce:
        </h5>
        <div>
          <span title='Transaction Nonce'>
          {data.nonce}
          </span>
          <span className='text-secondary' title='Index position of Transaction in the block'>(in the position {data.trade_index})
          </span>
        </div>
        <hr className='hr-space' />
        <a href={`/tx/${data.trade_hash}`} target='_blank'>
            See more details<i className='far fa-external-link-alt ml-1'></i>
        </a>
      </div>
    )
}
export default function ShowAdditionalInfo(props) {
 
    const [content, setContent] = useState('');  


    //显示数据
    const ShowData=()=>{

        if(props.popOverTitle.length !==0){ 
          setContent(props.popOverTitle[0]) 
          return ;
        }

        const loadingConteng = getDivLoadding()
        setContent(loadingConteng)

        fetch('/blockBrowser/blockChain/trade/tradeDetail', { 
          method: 'post',
          body: JSON.stringify({field: 'trade_hash', value:  props.txHash}), 
        }).then(res => {
            res.json().then((data) => { 
              const popContent = getDivData(data.data) 
              setContent(popContent)
              props.popOverTitle.push(popContent);
            })
        }).catch(e => {
            console.log(e)
        });
      
      } 



      //定义显示数据
    const popoverRight = ( <Popover id="popover-positioned-right" className="popover popover-body" style={{minWidth:"400px"}}> {content} </Popover>);   
    
    //返回数据
    return (
      <OverlayTrigger rootClose trigger="click" onEntering={ShowData} placement={props.placement} overlay={popoverRight}> 
        {props.children}
      </OverlayTrigger>
    );
 
} 
 