import {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import QRCode from 'qrcode.react';
import {useTranslation} from 'react-i18next';
import InnerCopy from '../../components/InnerCopy';

const defaultImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADrklEQVR4Xu3dsY0UQRCF4dmLABOBi0QAGOdhEAISYRANYZADBkLkgITOA5EFCBdv9x+pVNx39tVM9+vXf1X39Mxenry6+30s/nv58fto67+9ezF6/3rzCwM0CRmg6ZejEaBJiABNvwMBooA1HAGaggjQ9EOAqF8OR4AmIQI0/RAg6pfDEaBJiABNPwSI+uVwBGgSIkDTDwGifjkcAZqECND0Q4CoXw5HgCYhAjT99hPg/uEhnQfY/jAkjv94eCXghQHGxzA1gAGSfPuDGWD/GKYeMECSb38wA+wfw9QDBkjy7Q9mgP1jmHrAAEm+/cEMsH8MUw8YIMm3P5gB9o9h6gEDJPn2BzPA/jFMPWCAJN/+YAbYP4apB9kAb79+SecBPr1/nTrw5sPnFL89eFq/CwPMWogBECA5sBIUAZL8PRgBECC5CAGSfPPBCIAAyYUIkOSbD0YABEguRIAk33wwAiBAciECJPnmgxEAAZILESDJNx+MAAiQXIgASb754PUEqBJWAer9p+PrDK7tz08DawMYYPZADANUB8d4BIhHyqL+4+EMwACjJpQCRuU/DgRAgFELIsCo/AhwWAZaBg7PwdnbqwHUAKMOVAOMyq8GUAMMPw1FAARobwdX/awCrAKqh1bHj68Cpn8+vgowTZDt7R//xZDtAm5vPwPEBMIAj1xABmCApMB0DSMFpOHrO3kMEHfCpgWUAh75DGIABkgKTBNMDZCGTw0Q5dsvoBQQLbBdwO3tlwIeuYEZgAHu0tfCo375xYjpKloKiA7YLuD29uefj3/+62eyQJ3BdQBS448jn2ms7f/x9FnqAgMk+RjgQIDZX0xBgPgwKQJACkAABEiTSBHYjoVLAVJAmoBWAUk+qwCrgPh2s32AYQEjAKwCrAKsAtIksgqwCkgGqjk03dyzgEMROFzD2AewD5AgZh8gyfcf7APUn4+P+uVlVL3/dPx0DeMbQcMOYIBYRA2PX749AzBANlG5gBRQ1DshFgEQ4AQb3X4JBLhdu1MiEQABTjHSrRdBgFuVOykOARDgJCvddhkEuE2306IQAAFOM9MtF0KAW1Q7MQYBEOBEO11/KQS4XrNTIxAAAU411LUXcyDkWsX++f/pQ62OhDkSliyMAEm+/+BI2P3DQ/pIlBdDvBiS5tB0Dk2N916A9wKmDawIVAQmiCkCk3yKQK+GxY2suhMoBUgBiWFSQJJPCpACpADfCi4QUQMMz6AyeH9j7QP4WnjyEAIgQDJQXQb+ATsW354A91ssAAAAAElFTkSuQmCC';

export default function Header({address, overview}) {
  const [show, setShow] = useState(false);
  
  const {t} = useTranslation(['address']);

  const checksumAddress = window.Web3.utils.toChecksumAddress(address);
  // 账户类型:0-不是，1-account 2-contract
  return (
    <div className="container py-3">
      <div className="d-flex flex-wrap justify-content-between align-items-center">
        <div className="mb-3 mb-lg-0">
          <h1 className="h4 mb-0">
            <img className="u-xs-avatar rounded mt-n1 mr-1" src={overview.image || defaultImage} alt="" />
            {overview.account_type === 2 ? t('address.header.contract') :  t('address.header.address')}
            <span className="text-size-address text-secondary text-break mx-1" data-placement="top">
              {checksumAddress}
            </span>
            <span className="d-inline-flex">
              <span className="mr-1">
                <InnerCopy text={address} title="" />
              </span>
              <span>
                <OverlayTrigger placement="top" overlay={<Tooltip>{t('address.header.tip1')}</Tooltip>}>
                  <a
                    href="#"
                    className="btn btn-sm btn-icon btn-soft-secondary rounded-circle"
                    onClick={e => {
                      e.preventDefault();
                      setShow(true);
                    }}
                  >
                    <i className="fa fa-qrcode btn-icon__inner"></i>
                  </a>
                </OverlayTrigger>
                <Modal show={show} onHide={() => setShow(false)} size="sm">
                  <Modal.Header closeButton className="p-2">
                    <Modal.Title className="text-break small  text-center w-100">{address}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <QRCode value={address} size={235} style={{margin: '0 auto', display: 'block'}} />
                  </Modal.Body>
                </Modal>
              </span>
            </span>
          </h1>
          <div className="mt-1"></div>
        </div>
        <div className="d-flex flex-wrap"></div>
      </div>
    </div>
  );
}
