 

export default function VerifyEmail2({verifyForm,showVerify}) {  
  return (
 
    <div className="row align-items-center justify-content-center h-100" style={{display:showVerify?'flex':'none'}}    >
        <div className="col-sm-12 col-md-6">
            <div className="card">
            <div className="card-body">
                <div className="row align-items-center">
                    <div className="col-lg-12 text-center">
                        
                    <svg  className="icon" viewBox="0 0 1365 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4932" width="64" height="64"><path d="M1112.00000029 62a150.00000029 150.00000029 0 0 1 149.99999942 150.00000029v599.99999942a150.00000029 150.00000029 0 0 1-149.99999942 150.00000029H212.00000029a150.00000029 150.00000029 0 0 1-150.00000029-150.00000029V212.00000029a150.00000029 150.00000029 0 0 1 150.00000029-150.00000029h900z m0 74.99999971H212.00000029a74.99999971 74.99999971 0 0 0-75.00000058 75.00000058v599.99999942a74.99999971 74.99999971 0 0 0 75.00000058 75.00000058h900a74.99999971 74.99999971 0 0 0 74.99999971-75.00000058V212.00000029a74.99999971 74.99999971 0 0 0-74.99999971-75.00000058z m-98.1 171.60000029a29.025 29.025 0 0 1 40.5 7.425 28.95000029 28.95000029 0 0 1-7.2 40.34999971l-374.25000058 259.65a28.72500029 28.72500029 0 0 1-33.22499942 0L276.27499971 364.10000029a29.025 29.025 0 1 1 33.00000029-47.77500058l347.02499971 240.37500058z" fill="#1296db" p-id="4933"></path></svg>
                        <h3 className="mt-3 mb-0">邮箱确认</h3>
                        <div className="alert alert-warning mt-3 justify-content-center p-2 " style={{lineHeight:'1.5'}}>
                          您的重置密码申请信息已经提交!
                        </div> 

                        <p className="mb-2 text-left" style={{lineHeight:'2',textIndent:'1.5rem'}}>
                        我们已发送带有重置您帐户密码链接的电子邮件到您的邮箱<b>{verifyForm.email}</b>，要完成重置过程，请单击电子邮件中的确认链接。
                        </p> 
                        <p className="mb-2 text-left" style={{lineHeight:'2',textIndent:'1.5rem'}}> 
                          如果您没有收到确认电子邮件，请检查您的垃圾邮件文件夹，并确保您的垃圾邮件过滤器允许电子邮件xxxxx。若仍没有收到邮件请重新申请
                        </p>
                         
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
           
    
  );
}
