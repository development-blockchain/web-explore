export default function Charts() {
  return (
    <main id="content" role="main">
      <div className="container">
        <div className="d-md-flex justify-content-between align-items-center py-3">
          <div className="mb-1 mb-md-0">
            <h1 className="h4 mb-0">HPB Chain Charts &amp; Statistics</h1>
          </div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small p-0 mb-0">
              <li className="breadcrumb-item active">Charts &amp; Stats</li>
            </ol>
          </nav>
        </div>
      </div>
      <div className="container space-bottom-2">
        <div className="card mb-4" id="marketData">
          <div className="card-header">
            <h2 className="card-header-title">Market Data</h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 col-lg-3 mb-3">
                <div className="card h-100 w-100">
                  <div className="card-header bg-light">
                    <a href="/chart/htprice">HPB Daily Price (USD) Chart</a>
                  </div>
                  <a className="card-body" href="/chart/htprice">
                    <img className="img-fluid w-100" src="/images/charts/etherprice.svg?v=0.0.5" alt="" />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <div className="card h-100 w-100">
                  <div className="card-header bg-light">
                    <a href="/stat/supply">Total Supply &amp; Market Cap Chart</a>
                  </div>
                  <a className="card-body" href="/stat/supply">
                    <img className="img-fluid w-100" src="/images/charts/supply.svg?v=0.0.5" alt="Total Supply &amp; Market Cap Chart" />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <div className="card h-100 w-100">
                  <div className="card-header bg-light">
                    <a href="/chart/marketcap">HPB Market Capitalization Chart</a>
                  </div>
                  <a className="card-body" href="/chart/marketcap">
                    <img className="img-fluid w-100" src="/images/charts/marketcap.svg?v=0.0.5" alt="HPB Market Capitalization Chart" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4" id="blockchainData">
          <div className="card-header">
            <h2 className="card-header-title">Blockchain Data</h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 col-lg-3 mb-3">
                <div className="card h-100 w-100">
                  <div className="card-header bg-light">
                    <a href="/chart/tx">Daily Transactions Chart</a>
                  </div>
                  <a className="card-body" href="/chart/tx">
                    <img className="img-fluid w-100" src="/images/charts/transactionhistory.svg?v=0.0.5" alt="Daily Transactions Chart" />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <div className="card h-100 w-100">
                  <div className="card-header bg-light">
                    <a href="/chart/hrc20txns">HRC-20 Daily Token Transfer Chart</a>
                  </div>
                  <a className="card-body" href="/chart/hrc20txns">
                    <img className="img-fluid w-100" src="/images/charts/tokenerc-20txns.svg?v=0.0.5.7" alt="HRC-20 Daily Token Transfer Chart" />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <div className="card h-100 w-100">
                  <div className="card-header bg-light">
                    <a href="/chart/address">Unique Addresses Chart</a>
                  </div>
                  <a className="card-body" href="/chart/address">
                    <img className="img-fluid w-100" src="/images/charts/address.svg?v=0.0.5" alt="Unique Addresses Chart" />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <div className="card h-100 w-100">
                  <div className="card-header bg-light">
                    <a href="/chart/blocksize">Average Block Size Chart</a>
                  </div>
                  <a className="card-body" href="/chart/blocksize">
                    <img className="img-fluid w-100" src="/images/charts/blocksize.svg?v=0.0.5" alt="Average Block Size Chart" />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <div className="card h-100 w-100">
                  <div className="card-header bg-light">
                    <a href="/chart/blocktime">Average Block Time Chart</a>
                  </div>
                  <a className="card-body" href="/chart/blocktime">
                    <img className="img-fluid w-100" src="/images/charts/blocktime.svg?v=0.0.5" alt="Average Block Time Chart" />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <div className="card h-100 w-100">
                  <div className="card-header bg-light">
                    <a href="/chart/gasprice">Average Gas Price Chart</a>
                  </div>
                  <a className="card-body" href="/chart/gasprice">
                    <img className="img-fluid w-100" src="/images/charts/gasprice.svg?v=0.0.5" alt="Average Gas Price Chart" />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <div className="card h-100 w-100">
                  <div className="card-header bg-light">
                    <a href="/chart/gaslimit">Average Gas Limit Chart</a>
                  </div>
                  <a className="card-body" href="/chart/gaslimit">
                    <img className="img-fluid w-100" src="/images/charts/gaslimit.svg?v=0.0.5" alt="Average Gas Limit Chart" />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <div className="card h-100 w-100">
                  <div className="card-header bg-light">
                    <a href="/chart/gasused">Daily Gas Used Chart</a>
                  </div>
                  <a className="card-body" href="/chart/gasused">
                    <img className="img-fluid w-100" src="/images/charts/gasused.svg?v=0.0.5" alt="Daily Gas Used Chart" />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <div className="card h-100 w-100">
                  <div className="card-header bg-light">
                    <a href="/chart/blocks">Block Count and Rewards Chart</a>
                  </div>
                  <a className="card-body" href="/chart/blocks">
                    <img className="img-fluid w-100" src="/images/charts/blockcount.svg?v=0.0.5" alt="Block Count and Rewards Chart" />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <div className="card h-100 w-100">
                  <div className="card-header bg-light">
                    <a href="/chart/active-address">Daily Active HPB Chain Address</a>
                  </div>
                  <a className="card-body" href="/chart/active-address">
                    <img className="img-fluid w-100" src="/images/charts/tokenerc-20txns.svg?v=0.0.5.7" alt="active-address" />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <div className="card h-100 w-100">
                  <div className="card-header bg-light">
                    <a href="/chart/hrc20-active-address">Daily Active HRC20 Address</a>
                  </div>
                  <a className="card-body" href="/chart/hrc20-active-address">
                    <img className="img-fluid w-100" src="/images/charts/tokenerc-20txns.svg?v=0.0.5.7" alt="hrc20-active-address" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4" id="networkData">
          <div className="card-header">
            <h2 className="card-header-title">Network Data</h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 col-lg-3 mb-3">
                <div className="card h-100 w-100">
                  <div className="card-header bg-light">
                    <a href="/chart/pendingtx">Network Pending Transactions Chart</a>
                  </div>
                  <a className="card-body" href="/chart/pendingtx">
                    <img className="img-fluid w-100" src="/images/charts/pending.svg?v=0.0.5" alt="Network Pending Transactions Chart" />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <div className="card h-100 w-100">
                  <div className="card-header bg-light">
                    <a href="/chart/transactionfee">Network Transaction Fee Chart</a>
                  </div>
                  <a className="card-body" href="/chart/transactionfee">
                    <img className="img-fluid w-100" src="/images/charts/transactionfee.svg?v=0.0.5" alt="Network Transaction Fee Chart" />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <div className="card h-100 w-100">
                  <div className="card-header bg-light">
                    <a href="/chart/networkutilization">Network Utilization Chart</a>
                  </div>
                  <a className="card-body" href="/chart/networkutilization">
                    <img className="img-fluid w-100" src="/images/charts/networkutilization.svg?v=0.0.5" alt="Network Utilization Chart" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4" id="validatorsData">
          <div className="card-header">
            <h2 className="card-header-title">Validators Data</h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 col-lg-3 mb-3">
                <div className="card h-100 w-100">
                  <div className="card-header bg-light">
                    <a href="/stat/miner?range=7&amp;blocktype=blocks">Top 25 Validators by Blocks</a>
                  </div>
                  <a className="card-body" href="/stat/miner?blocktype=blocks">
                    <img className="img-fluid w-100" src="/images/charts/validators.svg?v=0.0.5" alt="Top Validators" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4" id="Contracts_Data">
          <div className="card-header">
            <h2 className="card-header-title">Contracts Data</h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 col-lg-3 mb-3">
                <div className="card h-100 w-100">
                  <div className="card-header bg-light">
                    <a href="/chart/verified-contracts">Verified Contracts Chart</a>
                  </div>
                  <a className="card-body" href="/chart/verified-contracts">
                    <img className="img-fluid w-100" src="/images/charts/verified-contracts.svg?v=0.0.5.11" alt="HPB Daily Verified Contracts Chart" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="share-bottom" className="share-btn socialmediabutton-down" style={{position: 'relative', right: '2px', top: '-10px'}}></div>
    </main>
  );
}
