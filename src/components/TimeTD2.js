import moment from 'moment';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function TimeTD2({interval, type = 'showAge'}) {
  const now = new Date().getTime(); 
  debugger
  const formatTime=moment(interval).format("YYYY-MM-DD HH:mm:ss"); //2022-03-25 14:59:13

  const intervalTime = moment(now - Number(interval) * 1000)
    .startOf('minute')
    .fromNow();
  // 设置中文
  const defaultLNG = window.localStorage.getItem('lng') || 'en_US';
  moment.locale(defaultLNG);
  
  return (
    <>
      <td className="showDate" style={{display: type === 'showAge' ? 'none' : ''}}>
        <OverlayTrigger placement="bottom" overlay={<Tooltip>{formatTime}</Tooltip>}>
          <span>{formatTime}</span>
        </OverlayTrigger> 
      </td>
      <td className="showAge" style={{display: type === 'showDate' ? 'none' : ''}}>
        <OverlayTrigger placement="bottom" overlay={<Tooltip>{formatTime}</Tooltip>}>
          <span>{intervalTime}</span>
        </OverlayTrigger>
      </td>
    </>
  );
}
