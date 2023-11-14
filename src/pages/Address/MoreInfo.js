import Loading from '../../components/Loading';
import LinkWithTooltip from '../../components/LinkWithTooltip';
import {useTranslation} from 'react-i18next';
export default function MoreInfo({data, address, loading, error}) {
  const {t} = useTranslation(['address']);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error</div>;
  }


  return (
    <div className="card h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <h2 className="card-header-title mr-1">{t('address.more.more')}</h2>
        </div>
      {/*   <div className="d-flex">
          <div className="ml-auto mr-1"></div>
          <div className="ml-auto mr-1">
            <span data-toggle="tooltip" data-placement="top" data-title="Add address to Watch List" data-original-title="" title="">
              <a className="btn btn-xs btn-icon btn-soft-info" href="/myaddress?cmd=addnew&a=${address}#add">
                <i className="fa fa-heart btn-icon__inner"></i>
              </a>
            </span>
          </div>
          <div className="position-relative">
            <a
              className="btn btn-xs btn-icon btn-soft-secondary"
              href="#"
              role="button"
              aria-controls="dropdownTools-2"
              aria-haspopup="true"
              aria-expanded="false"
              data-unfold-event="click"
              data-unfold-target="#dropdownTools-2"
              data-unfold-type="css-animation"
              data-unfold-duration="300"
              data-unfold-delay="300"
              data-unfold-hide-on-scroll="false"
              data-unfold-animation-in="slideInUp"
              data-unfold-animation-out="fadeOut"
            >
              <i className="fa fa-ellipsis-v btn-icon__inner"></i>
            </a>
            <div className="dropdown-menu dropdown-menu-right dropdown-unfold u-unfold--css-animation u-unfold--hidden" aria-labelledby="dropdownToolsInvoker-2" style={{animationDuration: '300ms'}}>
              <a className="dropdown-item" data-toggle="modal" data-target="#responsive" title="Attach a private note to this address">
                <i className="far fa-sticky-note mr-1"></i> View Private Note
              </a>
              <a className="dropdown-item" href="/balancecheck-tool?a=${address}">
                <i className="fa fa-fw fa-history  mr-1"></i>Check Previous Balance
              </a>
              <hr className="my-1" />
              <a className="dropdown-item" href="/contactus?id=5&a=${address}">
                <i className="fa fa-fw fa-user-tag mr-1"></i>Update Name Tag
              </a>
              <a className="dropdown-item" href="/contactus?id=5&a=${address}">
                <i className="fa fa-fw fa-tags mr-1"></i>Submit Label
              </a>
              <a className="dropdown-item" href="/contactus?id=6">
                <i className="fa fa-fw fa-flag mr-1"></i>Report/Flag Address
              </a>
              <a className="dropdown-item" href="/tokenapprovalchecker?search=${address}">
                <i className="fas fa-user-check"></i> Token Approvals
                <sup>
                  <span className="badge badge-secondary ml-1"> Beta</span>
                </sup>
              </a>
            </div>
          </div>
        </div> */}
      </div>
      <div className="card-body">      
      <div className="row align-items-center">
          <div className="col-md-4 mb-1 mb-md-0">
            <i
              className="far fa-question-circle text-muted"
              data-toggle="tooltip"
              data-html="true"
              data-title="<p className='text-white text-left'>Name tags or notes can be attached to an address for identifying addresses of interest. <br /><br />(This info is private and can ONLY be viewed by you)</p>"
              data-original-title=""
              title=""
            ></i>
            {t('address.more.mynametag')}:
          </div>
          <div className="col-md-8">
            <span> 
              {data.name ||  t('address.more.NotAvailable') }
              {/* <a data-toggle="modal" data-target="#responsive" rel="tooltip" title="" href="#" data-original-title="Assign a Private Name Tag or Note to this address (only viewable by you)">
                Update?
              </a> */}
            </span>
            <span></span>
          </div>
      </div>
      


    {
      (data.account_type === 2)? 
      <div>
          <hr className="hr-space" />
          <div className="row align-items-center">
            <div className="col-md-4 mb-1 mb-md-0">
              <span className="d-md-none d-lg-inline-block mr-1"></span>{t('address.more.createor')}:
            </div>
            <div className="col-md-8">
                <LinkWithTooltip placement="bottom" tooltip="Creator Address">
                <a href={`/address/${data.creator}`} className="hash-tag text-truncate" data-toggle="tooltip" title="" data-original-title="Creator Address">
                    {data.creator}
                  </a>  
                </LinkWithTooltip>             
              <span className="">{t('address.more.attxn')} &nbsp;&nbsp;
                <LinkWithTooltip placement="bottom" tooltip="Creator Txn Hash">
                  <a  href={`/tx/${data.hash}`}  data-toggle="tooltip" title=""   className="hash-tag text-truncate"  >
                  {data.hash}
                  </a>
                </LinkWithTooltip> 
              </span>
            </div>
          </div>

          {
            data.contract_type !== 3? 
            <div>
                <hr className="hr-space" />
                <div className="row align-items-center">
                        <div className="col-md-4 mb-1 mb-md-0">
                          <span className="d-md-none d-lg-inline-block mr-1"></span>{t('address.more.tokenTracker')}:
                        </div>
                        <div className="col-md-8">
                            <img className="u-xs-avatar mr-2" src={`/images/main/empty-token.png`} alt="token" />
                              <a href={`/token/${address}`} data-toggle="tooltip" title="" 
                                data-original-title="View Token Tracker Page">{data.name}</a>
                      
                        </div>
                </div>
            </div>:''
          }
          
      </div>:''
    }    
       
    </div>

   
    </div>
  );
}
