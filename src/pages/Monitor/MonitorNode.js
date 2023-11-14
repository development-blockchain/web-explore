import { useRequest } from 'ahooks';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import Modal from 'react-bootstrap/Modal';
import UserContext from '../../UserContext';
import Toast, { T } from "react-toast-mobile";
import "react-toast-mobile/lib/react-toast-mobile.css"; 


function MonitorNodeDetail({user,isShow,isType,changeShow,queryList,nodeData}){

  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    id:0,
    tag_name:'',
    node_url: ''
  });
  let {id,tag_name,node_url} = nodeData; 

  const saveNode =()=>{
    if(isType===1){ 

      addMonitorRequest.run({...form}).then(res => {  
        console.log('res----------->',res)
          if (res.code === 0) { 
            prompt.inform('新增成功!') 
            changeShow(false); 
            queryList(true);
            setForm({tag_name:'',node_url:''})
          }else{
            prompt.error(res.cnMsg)
          }

      }); 
    }else{
      const model = {
        id:id,
        tag_name:form.tag_name
      }
      editMonitorRequest.run({...form}).then(res => {  
        console.log('res----------->',res)
          if (res.code === 0) { 
            prompt.inform('修改成功!') 
            changeShow(false); 
            queryList(true);
            setForm({tag_name:'',node_url:''})
          }else{
            prompt.error(res.cnMsg)
          }

      }); 
    }
  }
  const handleForm = field => e => {
    setForm({...form, [field]: e.target.value});

    if (e.target.value) {
      setErrors({...errors, [field]: undefined});
    }
  }; 

  const handleBlur = key => () => {
    const _errors = {}; 
    Object.keys(form)
      .filter(f => f !== 'autologin')
      .forEach(field => {
        _errors[field] = !form[field];
      });

    if (Object.keys(_errors).some(e => !!_errors[e])) {
      if (_errors[key]) {
        setErrors(_errors);
      }
    }
  };
  const addMonitorRequest = useRequest(
    body => ({
    url: '/chainBrowser/user/manager/addMonitorNode', 
    method: 'post',
    headers: {
      'Authorization': user.token,
    },
    body: JSON.stringify(body),
    }),
    {manual: true, formatResult: r => r},
  );  
  const editMonitorRequest = useRequest(
    body => ({
    url: '/chainBrowser/user/manager/updateMonitorNode', 
    method: 'post',
    headers: {
      'Authorization': user.token,
    },
    body: JSON.stringify(body),
    }),
    {manual: true, formatResult: r => r},
  );  

  

  return (
    <Modal show={isShow} onHide={() => changeShow(false)} size="lg"  aria-labelledby="contained-modal-title-vcenter"      centered>
      <Modal.Header closeButton className="p-2">
          <Modal.Title id="contained-modal-title-vcenter">
            {`${isType===1?'新增':'编辑'}监控节点`}
          </Modal.Title> 
      </Modal.Header>
      <Modal.Body>  
          <div class="row g-3"> 
              <div class="col-md-12 mb-3">
                <input type="hidden" id="id" value={id} />
                <div className={`js-form-message form-group ${errors.tag_name ? 'u-has-error' : ''}`}>
                    <span className="d-flex justify-content-between align-items-center">
                    标签名称
                    </span>
                    <input type="text" class="form-control" id="tag_name" placeholder="请输入标签名称"    value={tag_name}  onChange={handleForm('tag_name')}  onBlur={handleBlur('tag_name')}  />
                    <div className="invalid-feedback" style={{display: errors.tag_name ? 'block' : 'none'}}> 
                      标签名称不能为空
                    </div>
                </div>
              </div>
              <div class="col-md-12 mb-3">
                <div className={`js-form-message form-group ${errors.node_url ? 'u-has-error' : ''}`}>
                    <span className="d-flex justify-content-between align-items-center">
                    节点地址
                    </span>
                    <input type="text" class="form-control" id="tag_name" placeholder="请输入节点地址"    value={node_url}  onChange={handleForm('node_url')}  onBlur={handleBlur('node_url')}  />
                    <div className="invalid-feedback" style={{display: errors.node_url ? 'block' : 'none'}}> 
                    节点地址不能为空
                    </div>
                </div>
              </div>  
          </div> 
      </Modal.Body>
      <Modal.Footer>  
          <button type="button" className="btn btn-sm btn-danger" onClick={e=>{e.preventDefault();changeShow(false);}}>关闭</button> 
          <button type="button" className="btn btn-sm btn-primary" onClick={e=>saveNode()}  data-dismiss="modal">保存</button>
      </Modal.Footer>
    </Modal>
  )
}

export default function MonitorKafa() {

  const defaultLNG = window.localStorage.getItem('lng') || 'zh_CN';
  moment.locale(defaultLNG);  


  const userContext = useContext(UserContext); 
  const [user, setUser] = useState({
    token: userContext.user.token || undefined,
    email:userContext.user.email || undefined,
    key: userContext.user.key || undefined,
    publicKey: userContext.user.publicKey || undefined,
    provider_username: userContext.user.provider_username || undefined,
    provider_pubkey: userContext.user.provider_pubkey || undefined,
  });   

  const [isShow, setIsShow] = useState(false);
  //1 新增 2 编辑
  const [type, setType] = useState(0); 
    
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    id:0,
    tag_name:'',
    node_url: ''
  });
 

  const saveNode =()=>{
    T.loading("正在提交...");  
    if(type===1){  
      addMonitorRequest.run({tag_name:form.tag_name,node_url:form.node_url}).then(res => {  
          T.loaded(); 
          if (res.code === 0) { 
            prompt.inform('新增成功!') 
            setIsShow(false); 
            queryList(true);
            setForm({id:0,tag_name:'',node_url:''})
          }else{
            prompt.error(res.cnMsg)
          } 
        },
        err=>{
          console.log('新增失败,',err);
          T.loaded();
        }
      ); 
    }else{ 
      editMonitorRequest.run({...form}).then(
        res => {  
          T.loaded(); 
          if (res.code === 0) { 
            prompt.inform('修改成功!') 
            setIsShow(false); 
            queryList(true);
            setForm({id:0,tag_name:'',node_url:''})
          }else{
            prompt.error(res.cnMsg)
          }

        },
        err=>{
          console.log('修改失败,',err);
          T.loaded();
        }
      ); 
    }
  }
  //删除
  const delNode = (e,id)=>{ 
    T.confirm({
      title: "提示!",
      message: "您是否要删除当前节点？",
      option: [
          {
              text: "是",
              fn: function fn() {
                delMonitorRequest.run({id:id}).then(res => {  
                  console.log('res----------->',res)
                    if (res.code === 0) { 
                      prompt.inform('删除成功!') 
                      setIsShow(false); 
                      queryList(true);
                      setForm({id:0,tag_name:'',node_url:''})
                    }else{
                      prompt.error(res.cnMsg)
                    } 
                }); 
              },
          },
          {
              text: "否",
              fn: () => { 
                  return;
              },
          },
      ],
    });

    
  }
  const handleForm = field => e => {
    setForm({...form, [field]: e.target.value});

    if (e.target.value) {
      setErrors({...errors, [field]: undefined});
    }
  }; 

  const handleBlur = key => () => {
    const _errors = {}; 
    Object.keys(form)
      .filter(f => f !== 'autologin')
      .forEach(field => {
        _errors[field] = !form[field];
      });

    if (Object.keys(_errors).some(e => !!_errors[e])) {
      if (_errors[key]) {
        setErrors(_errors);
      }
    }
  };
  const addMonitorRequest = useRequest(
    body => ({
    url: '/chainBrowser/user/manager/addMonitorNode', 
    method: 'post',
    headers: {
      'Authorization': user.token,
    },
    body: JSON.stringify(body),
    }),
    {manual: true, formatResult: r => r},
  );  
  const editMonitorRequest = useRequest(
    body => ({
    url: '/chainBrowser/user/manager/updateMonitorNode', 
    method: 'post',
    headers: {
      'Authorization': user.token,
    },
    body: JSON.stringify(body),
    }),
    {manual: true, formatResult: r => r},
  );  
  const delMonitorRequest = useRequest(
    body => ({
    url: '/chainBrowser/user/manager/deleteMonitorNode', 
    method: 'post',
    headers: {
      'Authorization': user.token,
    },
    body: JSON.stringify(body),
    }),
    {manual: true, formatResult: r => r},
  );  



  const [state, setState] = useState({
      body: {
      start: '1',
      length: '25'
      },
  });

  //新增
  const addNode = (e)=>{
    e.preventDefault();   
    setForm({id:0,tag_name:'',node_url:''})
    setIsShow(true);
    setType(1);
  }

    //编辑
  const editNode = (e,item)=>{ 
    e.preventDefault();   
    setForm({id:item.id,tag_name:item.tag_name,node_url:item.node_url})
    setIsShow(true);
    setType(2);
  }

  const url = 'chainBrowser/user/manager/allMonitorNodes' 
  const weeknetIncreaseRequest = useRequest(
      body => ({
      url: url, 
      method: 'post',
      headers: {
        'Authorization': user.token,
      },
      body: JSON.stringify(body),
      }),
      {manual: true},
  ); 
  const queryList=(flag)=>{
    if(flag){
      weeknetIncreaseRequest.run(state.body);
    }
  }

  useEffect(() => {
    queryList(true);
  }, [state]);

  if (weeknetIncreaseRequest.loading) {
      return <Loading />;
  } 
  const data = weeknetIncreaseRequest?.data || [];  

  return (
    <div className="tab-pane fade active show" role="tabpanel" aria-labelledby="events-tab">
      <div className="row">
        <div className="col-lg-12">
          <div className="card-block card-stretch"> 
              <div className="d-flex justify-content-between align-items-center p-3">
                  <h5 className="font-weight-bold">监控节点列表</h5>
                  <a href="#!" className="btn  btn-sm btn-primary position-relative d-flex align-items-center justify-content-between"
                   onClick={e=>{ addNode(e) }} >
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2" width="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    增加监控节点
                  </a>
              </div>
              <div className="table-responsive">
                <table className="table data-table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Id</th>
                      <th scope="col">标签名称</th>
                      <th scope="col">节点地址</th>
                      <th scope="col">创建时间</th>
                      <th scope="col">更新时间</th>
                      <th scope="col">
                          <span className="text-muted" >操作</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, i) => { 
                      return (
                        <tr key={i}> 
                          <td>{item.id}</td> 
                          <td>{item.tag_name}</td>
                          <td>{item.node_url}</td>
                          <td>{moment(item.create_time).local().format('YYYY-MM-DD HH:mm:ss')}</td>  
                          <td>{moment(item.update_time).local().format('YYYY-MM-DD HH:mm:ss')}</td>  
                          <td>
                              <div className="d-flex justify-content-start align-items-center">
                                  <a className="" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete" href="#!" onClick={e=>{delNode(e,item.id)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="text-secondary mr-2" fill="none" width="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg> 
                                  </a> 
                                  <a className="" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit" href="#!" onClick={e=>{editNode(e,item)}}>
                                      <svg xmlns="http://www.w3.org/2000/svg" className="text-secondary" width="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                      </svg>
                                  </a>
                              </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table> 
              </div>
          </div>
          <Modal show={isShow} onHide={() => setIsShow(false)} size="lg"  aria-labelledby="contained-modal-title-vcenter"      centered>
            <Modal.Header closeButton className="p-2">
                <Modal.Title id="contained-modal-title-vcenter">
                  {`${type===1?'新增':'编辑'}监控节点`}
                </Modal.Title> 
            </Modal.Header>
            <Modal.Body>  
                <div class="row g-3"> 
                    <div class="col-md-12 mb-3">
                      <input type="hidden" id="id" value={form.id} />
                      <div className={`js-form-message form-group ${errors.tag_name ? 'u-has-error' : ''}`}>
                          <span className="d-flex justify-content-between align-items-center">
                          标签名称
                          </span>
                          <input type="text" class="form-control" id="tag_name" placeholder="请输入标签名称"    value={form.tag_name}  onChange={handleForm('tag_name')}  onBlur={handleBlur('tag_name')}  />
                          <div className="invalid-feedback" style={{display: errors.tag_name ? 'block' : 'none'}}> 
                            标签名称不能为空
                          </div>
                      </div>
                    </div>
                    <div class="col-md-12 mb-3">
                      <div className={`js-form-message form-group ${errors.node_url ? 'u-has-error' : ''}`}>
                          <span className="d-flex justify-content-between align-items-center">
                          节点地址
                          </span>
                          <input type="text" class="form-control" id="tag_name" placeholder="请输入节点地址"    value={form.node_url}  onChange={handleForm('node_url')}  onBlur={handleBlur('node_url')}  />
                          <div className="invalid-feedback" style={{display: errors.node_url ? 'block' : 'none'}}> 
                          节点地址不能为空
                          </div>
                      </div>
                    </div>  
                </div> 
            </Modal.Body>
            <Modal.Footer>  
                <button type="button" className="btn btn-sm btn-danger" onClick={e=>{e.preventDefault();setIsShow(false);}}>关闭</button> 
                <button type="button" className="btn btn-sm btn-primary" onClick={e=>saveNode()}  data-dismiss="modal">保存</button>
            </Modal.Footer>
          </Modal>    
          <Toast/>     
        </div>
      </div>
    </div>
  );
}
