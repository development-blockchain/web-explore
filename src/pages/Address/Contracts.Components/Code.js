import {CopyToClipboard} from 'react-copy-to-clipboard';
import {useTranslation} from 'react-i18next';

export default function Code({address, overview, detail}) {
  const {t} = useTranslation(['address']);
  return (
    <div className="tab-pane fade active show" id="code" style={{display: 'visible'}}>
      <div id="ContentPlaceHolder1_contractCodeDiv">
        <div className="row py-1">
          <div className="col-md-12">
            <h3 className="h6 text-dark font-weight-bold mb-4">
              <i className="fa fa-check-circle text-success"></i>{' '}
              <strong>
               {t('address.contract.tip7')} <span className="font-weight-normal text-secondary">({t('address.contract.tip8')})</span>
              </strong>
              <span id="ContentPlaceHolder1_spanCompilerWarning" className="d-none d-sm-block" style={{position: 'absolute', right: '8px', marginTop: '-22px'}}>
                <a data-toggle="modal" data-target="#myModalCompilerWarning" rel="tooltip" title="" href="#" data-original-title="Solidity Compiler Bugs, click for more info">
                  <i className="fa fa-exclamation-triangle text-warning mr-2" style={{fontSize: '22px'}}></i>
                </a>
              </span>
            </h3>
          </div>
        </div>
        <div className="row mx-gutters-lg-1 mb-5">
          <div className="col-md-6">
            <div className="row align-items-center">
              <div className="col-5 col-lg-4 mb-1 mb-md-0">{t('address.contract.tip16')}:</div>
              <div className="col-7 col-lg-8">
                <span className="h6 font-weight-bold mb-0">{detail.Name}</span>
              </div>
            </div>
            <hr className="hr-space" />
            <div className="row">
              <div className="col-5 col-lg-4 mb-1 mb-md-0">{t('address.contract.tip17')}:</div>
              <div className="col-7 col-lg-8">
                <span className="h6 font-weight-bold mb-0">{detail.CompilerVersion}</span>
              </div>
            </div>
            <hr className="d-block d-md-none" />
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-5 col-lg-4 mb-1 mb-md-0">{t('address.contract.tip18')}:</div>
              <div className="col-7 col-lg-8">
                <span className="h6 font-weight-bold mb-0">
                  <span>{detail.OptimizationEnabled === 1 ? t('address.contract.tip19') : t('address.contract.tip20')}</span>
                  <span className="font-weight-normal"> with {detail.OptimizationRuns} runs</span> 
                </span>
              </div>
            </div>
            <hr className="hr-space" />
            <div className="row">
              <div className="col-5 col-lg-4 mb-1 mb-md-0">{t('address.contract.tip21')}:</div>
              <div className="col-7 col-lg-8">
                <span className="h6 font-weight-bold mb-0">
                  <span>{detail.EvmVersion}</span>
                  <span className="font-weight-normal">
                    <span> {t('address.contract.tip22')}, </span>
                    <b>{detail.LicenseType}</b>
                    <span className="font-weight-normal">
                      <a href="/contract-license-types" data-toggle="tooltip" title="" data-original-title="Click to learn more, open source license">
                        <span> {t('address.contract.tip23')} </span>
                      </a>
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span className="mb-3"></span>
      <div id="dividcode">
        <div className="mb-4">
          <div className="d-md-flex justify-content-between align-items-center bg-white-content py-2">
            <h4 className="card-header-title">
              <i className="far fa-file-code text-secondary mr-1"></i>{t('address.contract.tip24')} <span className="font-weight-normal text-secondary">({t('address.contract.tip25')})</span>
            </h4>
            <div className="mt-1 mt-md-0">
              <CopyToClipboard
                text={detail.SourceCode}
                onCopy={() => {
                  alert('Source code copied to clipboard');
                }}
              >
                <a className="js-clipboard btn btn-sm btn-icon btn-secondary" href="#contracts" data-original-title="Copy source code to clipboard">
                  <i className="far fa-copy btn-icon__inner"></i>
                </a>
              </CopyToClipboard>
            </div>
          </div>
          <pre className="wordwrap js-copytextarea2" style={{height: '400px', maxHeight: '600px', marginTop: '5px'}}>
            {detail.SourceCode}
          </pre>
          <br />
        </div>
        <div className="mb-4">
          <div className="d-md-flex justify-content-between align-items-center bg-white-content py-2">
            <h4 className="card-header-title">
              <i className="fa fa-tasks text-secondary mr-1"></i>{t('address.contract.tip26')}
            </h4>
            <div className="mt-1 mt-md-0">
              <CopyToClipboard
                text={detail.Abi}
                onCopy={() => {
                  alert('Contract Abi copied to clipboard');
                }}
              >
                <a className="js-clipboard btn btn-sm btn-icon btn-secondary" href="#contracts" data-original-title="Copy source code to clipboard">
                  <i className="far fa-copy btn-icon__inner"></i>
                </a>
              </CopyToClipboard>
            </div>
          </div>
          <pre className="wordwrap js-copytextarea2" style={{height: '200px', maxHeight: '600px', marginTop: '5px'}}>
            {detail.Abi}
          </pre>
          <br />
        </div>
        <div className="mb-4">
          <div className="d-md-flex justify-content-between align-items-center bg-white-content py-2">
            <h4 className="card-header-title">
              <i className="fa fa-code text-secondary mr-1"></i>{t('address.contract.tip27')} 
            </h4>
            <div className="mt-1 mt-md-0">
              <CopyToClipboard
                text={detail.ContractCode}
                onCopy={() => {
                  alert('Contract Creation Code copied to clipboard');
                }}
              >
                <a className="js-clipboard btn btn-sm btn-icon btn-secondary" href="#contracts" data-original-title="Copy source code to clipboard">
                  <i className="far fa-copy btn-icon__inner"></i>
                </a>
              </CopyToClipboard>
            </div>
          </div>
          <pre className="wordwrap js-copytextarea2" style={{height: '200px', maxHeight: '600px', marginTop: '5px'}}>
            {detail.ContractCode}
          </pre>
          <br />
        </div>
      </div>
    </div>
  );
}
