import {useEffect, useState} from 'react';
import {useInterval, useRequest} from 'ahooks';

import './style.css';
import {useTranslation} from 'react-i18next';
export default function Gasprice() {
  
  const {t} = useTranslation(['gasprice']); 

  const [time, setTime] = useState(0);
  const body = {};
  const gasPriceRequest = useRequest(
    {
      url: '/blockBrowser/misc/gas/gasPrice',
      method: 'post',
      body: JSON.stringify(body),
    },
    {manual: true},
  );

  useInterval(() => {
    gasPriceRequest.run();
  }, 3000);

  useEffect(() => {
    gasPriceRequest.run();
  }, []);

  const data = gasPriceRequest.data || {};

  //   useEffect(() => {
  //     setInterval(() => {
  //       if (time < 100) {
  //         setTime(time + 10);
  //       } else {
  //         setTime(0);
  //       }
  //     }, 1000);
  //   }, [time]);
  return (
    <div className="gas-container">
      <h1>{t('gasprice.title1')}</h1>
      <h5>{t('gasprice.title2')}</h5>
      <div className="loading">
        <div role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" className="el-progress el-progress--line el-progress--without-text">
          <div className="el-progress-bar">
            <div className="el-progress-bar__outer" style={{height: '2px'}}>
              <div className="el-progress-bar__inner" style={{width: `${time}%`, height: '2px', backgroundColor: 'rgb(178, 204, 255)'}}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="gas-card-box">
        <div className="gas-card">
          <div className="fast-box">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjIyNDIgMTMuNTcwN0w2Ljk2MjU0IDUuMzE5OTlMOS4yMTUzNyA0LjcxNTY1TDE3LjMyNDkgMTIuMjA1N0wyMy40NjM5IDEwLjU2MDdDMjMuOTEyMiAxMC40NDA2IDI0LjM4OTkgMTAuNTAzNiAyNC43OTE4IDEwLjczNTdDMjUuMTkzNyAxMC45Njc4IDI1LjQ4NyAxMS4zNTAxIDI1LjYwNyAxMS43OTg1QzI1LjcyNzEgMTIuMjQ2OCAyNS42NjQxIDEyLjcyNDUgMjUuNDMyIDEzLjEyNjRDMjUuMTk5OCAxMy41Mjg0IDI0LjgxNzYgMTMuODIxNiAyNC4zNjkyIDEzLjk0MTdMNi45MDE4NyAxOC42Mkw1Ljk5NjU0IDE1LjIzOUw2LjI3NzcxIDE1LjE2MzJMOS4xNTU4NyAxOC4wMTU3TDYuMDkyMjEgMTguODM3QzUuODQwOTggMTguOTA0MyA1LjU3NDQ1IDE4Ljg4NTggNS4zMzQ5NiAxOC43ODQ0QzUuMDk1NDcgMTguNjgyOSA0Ljg5Njc1IDE4LjUwNDMgNC43NzAzNyAxOC4yNzdMMS43MTAyMSAxMi43NjMzTDMuNDAwNzEgMTIuMzEwN0w2LjI3NzcxIDE1LjE2MzJMMTIuMjI0MiAxMy41Njk1VjEzLjU3MDdaTTQuNjY2NTQgMjIuMTY2N0gyMy4zMzMyVjI0LjVINC42NjY1NFYyMi4xNjY3WiIgZmlsbD0iIzEyQzk4OSIvPgo8L3N2Zz4K"
              alt="fast"
            />
          </div>
          <p className="speed">{t('gasprice.tip1')}</p>
          <p className="speed-number fast">{((data.gas_fast || 0) * 10e8).toFixed(2)}</p>
          <p className="speed-unit">Gwei</p>
        </div>
        <div className="middle-card gas-card">
          <img
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDQiIGhlaWdodD0iNDQiIHZpZXdCb3g9IjAgMCA0NCA0NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBvcGFjaXR5PSIwLjEiIGN4PSIyMiIgY3k9IjIyIiByPSIyMiIgZmlsbD0iIzNGN0ZGRiIvPgo8cGF0aCBkPSJNMzAuMTY2NCAzMS4zMzMzSDEzLjgzMzFWMzIuNUMxMy44MzMxIDMyLjgwOTQgMTMuNzEwMiAzMy4xMDYxIDEzLjQ5MTQgMzMuMzI0OUMxMy4yNzI2IDMzLjU0MzcgMTIuOTc1OCAzMy42NjY2IDEyLjY2NjQgMzMuNjY2NkgxMS40OTk3QzExLjE5MDMgMzMuNjY2NiAxMC44OTM2IDMzLjU0MzcgMTAuNjc0OCAzMy4zMjQ5QzEwLjQ1NiAzMy4xMDYxIDEwLjMzMzEgMzIuODA5NCAxMC4zMzMxIDMyLjVWMjJMMTMuMjY0OSAxNC4xODFDMTMuNDMxNyAxMy43MzYxIDEzLjczMDIgMTMuMzUyOCAxNC4xMjA3IDEzLjA4MjFDMTQuNTExMiAxMi44MTE1IDE0Ljk3NSAxMi42NjY2IDE1LjQ1MDEgMTIuNjY2NkgyOC41NDk0QzI5LjAyNDUgMTIuNjY2NiAyOS40ODgzIDEyLjgxMTUgMjkuODc4OCAxMy4wODIxQzMwLjI2OTIgMTMuMzUyOCAzMC41Njc4IDEzLjczNjEgMzAuNzM0NiAxNC4xODFMMzMuNjY2NCAyMlYzMi41QzMzLjY2NjQgMzIuODA5NCAzMy41NDM1IDMzLjEwNjEgMzMuMzI0NyAzMy4zMjQ5QzMzLjEwNTkgMzMuNTQzNyAzMi44MDkyIDMzLjY2NjYgMzIuNDk5NyAzMy42NjY2SDMxLjMzMzFDMzEuMDIzNiAzMy42NjY2IDMwLjcyNjkgMzMuNTQzNyAzMC41MDgxIDMzLjMyNDlDMzAuMjg5MyAzMy4xMDYxIDMwLjE2NjQgMzIuODA5NCAzMC4xNjY0IDMyLjVWMzEuMzMzM1pNMTIuODI1MSAyMkgzMS4xNzQ0TDI4LjU0OTQgMTVIMTUuNDUwMUwxMi44MjUxIDIyWk0xNS41ODMxIDI3LjgzMzNDMTYuMDQ3MiAyNy44MzMzIDE2LjQ5MjMgMjcuNjQ4OSAxNi44MjA1IDI3LjMyMDdDMTcuMTQ4NyAyNi45OTI1IDE3LjMzMzEgMjYuNTQ3NCAxNy4zMzMxIDI2LjA4MzNDMTcuMzMzMSAyNS42MTkyIDE3LjE0ODcgMjUuMTc0MSAxNi44MjA1IDI0Ljg0NTlDMTYuNDkyMyAyNC41MTc3IDE2LjA0NzIgMjQuMzMzMyAxNS41ODMxIDI0LjMzMzNDMTUuMTE4OSAyNC4zMzMzIDE0LjY3MzggMjQuNTE3NyAxNC4zNDU2IDI0Ljg0NTlDMTQuMDE3NCAyNS4xNzQxIDEzLjgzMzEgMjUuNjE5MiAxMy44MzMxIDI2LjA4MzNDMTMuODMzMSAyNi41NDc0IDE0LjAxNzQgMjYuOTkyNSAxNC4zNDU2IDI3LjMyMDdDMTQuNjczOCAyNy42NDg5IDE1LjExODkgMjcuODMzMyAxNS41ODMxIDI3LjgzMzNaTTI4LjQxNjQgMjcuODMzM0MyOC44ODA1IDI3LjgzMzMgMjkuMzI1NiAyNy42NDg5IDI5LjY1MzggMjcuMzIwN0MyOS45ODIgMjYuOTkyNSAzMC4xNjY0IDI2LjU0NzQgMzAuMTY2NCAyNi4wODMzQzMwLjE2NjQgMjUuNjE5MiAyOS45ODIgMjUuMTc0MSAyOS42NTM4IDI0Ljg0NTlDMjkuMzI1NiAyNC41MTc3IDI4Ljg4MDUgMjQuMzMzMyAyOC40MTY0IDI0LjMzMzNDMjcuOTUyMyAyNC4zMzMzIDI3LjUwNzIgMjQuNTE3NyAyNy4xNzkgMjQuODQ1OUMyNi44NTA4IDI1LjE3NDEgMjYuNjY2NCAyNS42MTkyIDI2LjY2NjQgMjYuMDgzM0MyNi42NjY0IDI2LjU0NzQgMjYuODUwOCAyNi45OTI1IDI3LjE3OSAyNy4zMjA3QzI3LjUwNzIgMjcuNjQ4OSAyNy45NTIzIDI3LjgzMzMgMjguNDE2NCAyNy44MzMzWiIgZmlsbD0iIzNGN0ZGRiIvPgo8L3N2Zz4K"
            alt="average"
          />
          <p className="speed">{t('gasprice.tip2')}</p>
          <p className="speed-number average">{((data.gas_moderate || 0) * 10e8).toFixed(2)}</p>
          <p className="speed-unit">Gwei</p>
        </div>
        <div className="gas-card">
          <img
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDQiIGhlaWdodD0iNDQiIHZpZXdCb3g9IjAgMCA0NCA0NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBvcGFjaXR5PSIwLjEiIGN4PSIyMiIgY3k9IjIyIiByPSIyMiIgZmlsbD0iI0VBMzg1NCIvPgo8cGF0aCBkPSJNMTIuNjY2NSAyMy40NjUzVjIySDEwLjMzMzJWMTkuNjY2N0gxNy43NTlMMjEuMDY2NSAxNy4zMzMzSDI1LjEzOTNMMjMuODY2NSAxMy44MzMzSDIwLjgzMzJWMTEuNUgyNS40OTk4TDI2Ljc3MzggMTVIMzEuMzMzMlYxOC41SDI4LjA0NzhMMjkuNzQ2NSAyMy4xNjlDMzEuMDM1NCAyMy4yMSAzMi4yNjQxIDIzLjcyMzkgMzMuMTk4NCAyNC42MTI3QzM0LjEzMjYgMjUuNTAxNiAzNC43MDcxIDI2LjcwMzIgMzQuODEyMiAyNy45ODg0QzM0LjkxNzMgMjkuMjczNyAzNC41NDU3IDMwLjU1MjcgMzMuNzY4MyAzMS41ODE1QzMyLjk5MDggMzIuNjEwMyAzMS44NjE5IDMzLjMxNyAzMC41OTY4IDMzLjU2NjlDMjkuMzMxNyAzMy44MTY3IDI4LjAxODkgMzMuNTkyMiAyNi45MDg3IDMyLjkzNjFDMjUuNzk4NSAzMi4yODAxIDI0Ljk2ODYgMzEuMjM4NCAyNC41NzczIDMwLjAwOTdDMjQuMTg1OSAyOC43ODA5IDI0LjI2MDUgMjcuNDUxMiAyNC43ODY3IDI2LjI3MzlDMjUuMzEzIDI1LjA5NjYgMjYuMjU0MSAyNC4xNTQyIDI3LjQzMDcgMjMuNjI2M0wyNS45ODg3IDE5LjY2NjdIMjQuODgzOEwyMy4wMzgyIDI2LjUxNUwyMy4wMzU4IDI2LjUxMzhMMjMuMDM4MiAyNi41MjA4TDE5LjYyNTcgMjcuNzYyMkMxOS43NDg4IDI4Ljc0NDggMTkuNTkxNSAyOS43NDIyIDE5LjE3MiAzMC42MzkyQzE4Ljc1MjUgMzEuNTM2MyAxOC4wODc4IDMyLjI5NjQgMTcuMjU0NyAzMi44MzE4QzE2LjQyMTYgMzMuMzY3MSAxNS40NTQgMzMuNjU2IDE0LjQ2MzcgMzMuNjY0OUMxMy40NzM1IDMzLjY3MzggMTIuNTAwOSAzMy40MDI1IDExLjY1ODMgMzIuODgyMkMxMC44MTU2IDMyLjM2MiAxMC4xMzczIDMxLjYxNCA5LjcwMTY5IDMwLjcyNDZDOS4yNjYwNSAyOS44MzUzIDkuMDkwODIgMjguODQwOSA5LjE5NjI1IDI3Ljg1NjJDOS4zMDE2NyAyNi44NzE1IDkuNjgzNDUgMjUuOTM2OCAxMC4yOTc1IDI1LjE1OThDMTAuOTExNSAyNC4zODI5IDExLjczMjggMjMuNzk1NCAxMi42NjY1IDIzLjQ2NTNaTTE0Ljk5OTggMjMuMTk4MkMxNS43NzM4IDIzLjI4NDggMTYuNTE4OSAyMy41NDI2IDE3LjE4MDkgMjMuOTUyOEMxNy44NDMgMjQuMzYzMSAxOC40MDU1IDI0LjkxNTUgMTguODI3NyAyNS41N0wyMS4xMTA4IDI0LjczODJMMjIuNDcgMTkuNjY2N0gyMS44MzE4TDE4LjQ5OTggMjJIMTQuOTk5OFYyMy4xOTgyWk0xNC40MTY1IDMxLjMzMzNDMTQuNzk5NSAzMS4zMzM0IDE1LjE3ODggMzEuMjU4IDE1LjUzMjcgMzEuMTExNEMxNS44ODY2IDMwLjk2NDggMTYuMjA4MiAzMC43NSAxNi40NzkxIDMwLjQ3OTJDMTYuNzQ5OSAzMC4yMDgzIDE2Ljk2NDggMjkuODg2OCAxNy4xMTE0IDI5LjUzMjlDMTcuMjU4IDI5LjE3OSAxNy4zMzM0IDI4Ljc5OTcgMTcuMzMzNCAyOC40MTY3QzE3LjMzMzQgMjguMDMzNiAxNy4yNTggMjcuNjU0MyAxNy4xMTE0IDI3LjMwMDRDMTYuOTY0OCAyNi45NDY2IDE2Ljc0OTkgMjYuNjI1IDE2LjQ3OTEgMjYuMzU0MkMxNi4yMDgyIDI2LjA4MzMgMTUuODg2NiAyNS44Njg1IDE1LjUzMjcgMjUuNzIxOUMxNS4xNzg4IDI1LjU3NTQgMTQuNzk5NSAyNS41IDE0LjQxNjUgMjUuNUMxMy42NDMgMjUuNTAwMSAxMi45MDEyIDI1LjgwNzQgMTIuMzU0MyAyNi4zNTQ0QzExLjgwNzQgMjYuOTAxMyAxMS41MDAxIDI3LjY0MzIgMTEuNTAwMSAyOC40MTY3QzExLjUwMDEgMjkuMTkwMiAxMS44MDc0IDI5LjkzMiAxMi4zNTQzIDMwLjQ3OUMxMi45MDEyIDMxLjAyNTkgMTMuNjQzIDMxLjMzMzMgMTQuNDE2NSAzMS4zMzMzWk0yOS41ODMyIDMxLjMzMzNDMjkuOTY2MiAzMS4zMzM0IDMwLjM0NTUgMzEuMjU4IDMwLjY5OTQgMzEuMTExNEMzMS4wNTMzIDMwLjk2NDggMzEuMzc0OSAzMC43NSAzMS42NDU3IDMwLjQ3OTJDMzEuOTE2NiAzMC4yMDgzIDMyLjEzMTUgMjkuODg2OCAzMi4yNzgxIDI5LjUzMjlDMzIuNDI0NyAyOS4xNzkgMzIuNTAwMSAyOC43OTk3IDMyLjUwMDEgMjguNDE2N0MzMi41MDAxIDI4LjAzMzYgMzIuNDI0NyAyNy42NTQzIDMyLjI3ODEgMjcuMzAwNEMzMi4xMzE1IDI2Ljk0NjYgMzEuOTE2NiAyNi42MjUgMzEuNjQ1NyAyNi4zNTQyQzMxLjM3NDkgMjYuMDgzMyAzMS4wNTMzIDI1Ljg2ODUgMzAuNjk5NCAyNS43MjE5QzMwLjM0NTUgMjUuNTc1NCAyOS45NjYyIDI1LjUgMjkuNTgzMiAyNS41QzI4LjgwOTcgMjUuNTAwMSAyOC4wNjc5IDI1LjgwNzQgMjcuNTIwOSAyNi4zNTQ0QzI2Ljk3NCAyNi45MDEzIDI2LjY2NjggMjcuNjQzMiAyNi42NjY4IDI4LjQxNjdDMjYuNjY2OCAyOS4xOTAyIDI2Ljk3NCAyOS45MzIgMjcuNTIwOSAzMC40NzlDMjguMDY3OSAzMS4wMjU5IDI4LjgwOTcgMzEuMzMzMyAyOS41ODMyIDMxLjMzMzNaIiBmaWxsPSIjRUEzODU0Ii8+Cjwvc3ZnPgo="
            alt="slow"
          />
          <p className="speed">{t('gasprice.tip3')}</p>
          <p className="speed-number slow">{((data.gas_slow || 0) * 10e8).toFixed(2)}</p>
          <p className="speed-unit">Gwei</p>
        </div>
      </div>
    </div>
  );
}
