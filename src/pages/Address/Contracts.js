import {useState} from 'react';
import {useRequest} from 'ahooks';
import {Metamask} from 'ethpay.core';

import Loading from '../../components/Loading';
import {useTranslation} from 'react-i18next';
import Code from './Contracts.Components/Code';
import Read from './Contracts.Components/Read';
import Write from './Contracts.Components/Write';

let web3 = undefined;

window.Metamask = Metamask;
export default function Contracts({address, overview}) {
  const {t} = useTranslation(['address']);
  
  const [currentTab, setCurrentTab] = useState('code');
  const [currentContract, setCurrentContract] = useState();
  const [currentAccount, setCurrentAccount] = useState();
  const contractQueryByAddressRequest = useRequest({
    url: '/blockBrowser/contract/contractQueryByAddress',
    method: 'post',
    body: JSON.stringify({
      contract_address: address,
    }),
  });

  const checksumAddress = window.Web3.utils.toChecksumAddress(address);
  const handleChangeTab = tab => e => {
    e.preventDefault();
    setCurrentTab(tab);
  };

  if (contractQueryByAddressRequest.loading) {
    return <Loading />;
  }

  const detail = contractQueryByAddressRequest.data?.results || {};

  const handleConnect = async e => {
    e.preventDefault();

    if (!web3) {
      const provider = await Metamask.getProvider();
      console.log('provider', provider);
      web3 = new window.Web3(provider);
      const pool = new web3.eth.Contract(JSON.parse(detail.Abi), checksumAddress);

      Metamask.requestAccounts().then(result => {
        setCurrentAccount(Array.isArray(result) ? result[0] : undefined);
      });

      setCurrentContract(pool);
    }
  };

  // 验证状态 0-未验证 1-验证通过 2-验证失败
  if (String(detail.IsVerfied) === '0') {
    return (
      <div className="tab-pane fade active show" style={{display: 'visible'}}>
        <span className="mb-3">
          <span className="h5 mb-0">
            <i className="fa fa-info-circle text-secondary"></i>
          </span>
          <span> {t('address.contract.tip1')} </span>
          <a href={`/verifyContract?a=${address}`}>
            <b> {t('address.contract.tip2')} </b>
          </a>{' '}
          {t('address.contract.tip3')}
          <br />
          <span className="h6 mb-0">
           {t('address.contract.tip9')} <a href={`/address/${address}`}>{address}</a>
          </span>
          <br />
          {t('address.contract.tip10')}<a href={`/find-similar-contracts?a=${address}&lvl=5`}>6321181 {t('address.contract.tip11')} </a> {t('address.contract.tip12')}
          <br />
          <br />
        </span>
        <a
          id="btnConvert2"
          className="btn btn-warning btn-xss mb-1 mr-1"
          href={`/bytecode-decompiler?a=${address}`}
          data-toggle="tooltip"
          title=""
          target="_blank"
          data-original-title="Opens up the Runtime ByteCode Decompiler page"
        >
          {t('address.contract.tip13')} <i className="fa fa-external-link-alt pos-top-n1 small ml-1"></i>
        </a>
        <button id="ContentPlaceHolder1_btnconvert222" className="btn btn-warning btn-xss mb-1 mr-1" type="button">
        {t('address.contract.tip14')} 
        </button>
        <button
          id="ContentPlaceHolder1_btnFindSimiliarContracts"
          className="btn btn-secondary btn-xss mb-1"
          type="button"
          onClick={e => {
            window.location.href = `/find-similar-contracts?a=${checksumAddress}&lvl=5'`;
          }}
          data-toggle="tooltip"
          title=""
          data-toggle-second="tooltip"
          data-original-title="Find other contracts with Similar Contract Codes using a 'Fuzzy' Search Algorithm"
        >
           {t('address.contract.tip15')} 
        </button>
        <div id="dividcode">
          <pre className="wordwrap" style={{height: '15pc'}}>
            {detail.ContractCreator}
          </pre>
        </div>
      </div>
    );
  }

  if (String(detail.IsVerfied) === '2') {
    return (
      <div className="tab-pane fade active show" id="contracts" style={{minHeight: '500px'}}>
        验证失败
      </div>
    );
  }

  return (
    <div className="tab-pane fade active show" id="contracts" style={{minHeight: '500px'}}>
      <ul className="nav nav-pills nav-pills-secondary mb-3" id="nav_subtabs" role="tablist">
        <li className="nav-item">
          <a className={`nav-link ${currentTab === 'code' ? 'show active' : ''}`} href="#code" data-toggle="tab" onClick={handleChangeTab('code')}>
            <span>{t('address.contract.tip4')}</span>
          </a>
        </li>
        <li className="nav-item">
          <a className={`nav-link ${currentTab === 'read' ? 'show active' : ''}`} href="#readContract" data-toggle="tab" onClick={handleChangeTab('read')}>
             <span className="d-none d-sm-inline-block">{t('address.contract.tip5')}</span>
          </a>
        </li>
        <li className="nav-item">
          <a className={`nav-link ${currentTab === 'write' ? 'show active' : ''}`} href="#writeContract" data-toggle="tab" onClick={handleChangeTab('write')}>
             <span className="d-none d-sm-inline-block">{t('address.contract.tip6')}</span>
          </a>
        </li>
      </ul>
      {currentTab === 'code' ? <Code address={address} overview={overview} detail={detail} /> : undefined}
      {currentTab === 'read' ? <Read address={address} overview={overview} account={currentAccount} contract={currentContract} onConnect={handleConnect} /> : undefined}
      {currentTab === 'write' ? <Write address={address} overview={overview} account={currentAccount} contract={currentContract} onConnect={handleConnect} /> : undefined}
    </div>
  );
}
