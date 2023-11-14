import {useState} from 'react';
import {useRequest} from 'ahooks';
import Loading from '../../../components/Loading';

function WriteContractItemBody({input, output, name, account, contract}) {
  const firstOutput = Array.isArray(output) ? output[0] : {};
  const [inputParams, setInputParams] = useState([]);
  const [outputRet, setOutputRet] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  console.log('firstOutput', firstOutput);
  const handleQuery = async () => {
    if (!contract) {
      return alert('please connect to web3');
    }

    try {
      setLoading(true);
      console.log('contract', contract);

      const ret = await contract.methods[name].apply(contract.methods, inputParams).send({from: account});

      console.log('ret', ret);
      setOutputRet(ret);
      setError(false);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      console.log(error.message);
    }
  };
  return (
    <form>
      <div className="form-group">
        {Array.isArray(input)
          ? input.map((item, i) => {
              return (
                <div className="form-group" key={i}>
                  <label>
                    {item.name} ({item.type})
                  </label>
                  <input
                    type="text"
                    onChange={e => {
                      const v = [...inputParams];
                      v[i] = e.target.value;
                      setInputParams(v);
                    }}
                    className="form-control form-control-xs"
                    data-type={item.type}
                    placeholder={` ${item.name} (${item.type})`}
                  />
                </div>
              );
            })
          : undefined}

        <button type="button" id="btn_1" className="btn btn-xs btn-light border" onClick={handleQuery}>
          Write
        </button>
        {loading ? <img className="waitingImg" src="/images/ajax-loader2.gif" style={{marginLeft: '5px'}} /> : undefined}
      </div>
      {typeof firstOutput.name !== 'undefined' ? (
        <div className="text-secondary mt-3">
          <img src="/images/svg/shapes/shape-1.svg" className="mt-n1" width="8" />
          {firstOutput.name}
          <i>
            <span className="text-monospace text-secondary"> {firstOutput.type}</span>
          </i>

          <span id="myanswer_2" className="" style={{display: outputRet || error ? '' : 'none'}}>
            {error ? (
              <span class="text-danger"> {error}</span>
            ) : (
              <>
                <br />
                <br />
                <span>
                  [<b> {name}</b> method Response ]
                </span>
                <br />
                <span className="text-success">
                  <i className="fa fa-angle-double-right"></i>
                </span>
                <strong></strong>
                <span className="text-secondary">
                  <i>{firstOutput.type}</i>
                </span>
                <b>:</b>
                <span> {outputRet}</span>
                <br />
                <br />
              </>
            )}
          </span>
        </div>
      ) : undefined}
    </form>
  );
}

export default function Write({address, account, contract, onConnect}) {
  const contractReadFuncQueryByAddressRequest = useRequest(body => ({
    url: '/blockBrowser/contract/contractWriteFuncQueryByAddress',
    method: 'post',
    body: JSON.stringify({contract_address: address}),
  }));

  if (contractReadFuncQueryByAddressRequest.loading) {
    return <Loading />;
  }

  const data = contractReadFuncQueryByAddressRequest.data || [];

  return (
    <div className="tab-pane fade active show" id="tokenExchange">
      <div className="d-sm-flex justify-content-between mb-3">
        <p className="ml-3 mr-3 mb-1">
          <i id="connector" className={`fa fa-circle text-${contract ? 'success' : 'danger'} mr-1`}></i>
          <a href="#close" className="forum-title" onClick={onConnect}>
            Connect to Web3
          </a>
        </p>
        {/* <a className="ml-3 mr-3" href="#">
          [Reset]
        </a> */}
      </div>

      <div id="readContractAccordion">
        {data.map((item, i) => {
          return (
            <div className="card mb-3" key={i}>
              <div className="card-header bg-light card-collapse p-0" id="readHeading1">
                <a
                  className="btn btn-link btn-block text-dark d-flex justify-content-between align-items-center py-2"
                  data-toggle="collapse"
                  href="#"
                  aria-expanded="false"
                  aria-controls="readCollapse1"
                  onClick={e => {
                    e.preventDefault();
                  }}
                >
                  {i + 1}. {item.function_name}
                  <span className="accordion-arrow">
                    <i className="fas fa-arrow-down small"></i>
                  </span>
                </a>
              </div>
              <div className="collapse show" aria-labelledby="readHeading1">
                <div className="card-body p-3">
                  <WriteContractItemBody account={account} contract={contract} input={item.args.input} name={item.function_name} output={item.args.output} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
