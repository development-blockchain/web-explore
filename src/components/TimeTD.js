import moment from 'moment';
import 'moment/locale/zh-cn'; 
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function TimeTD({time, interval, type = 'showAge'}) {
  const defaultLNG = window.localStorage.getItem('lng') || 'zh_CN';
  moment.locale(defaultLNG);

  const formatTime=moment(time).format("YYYY-MM-DD HH:mm:ss"); //2022-03-25 14:59:13
  const now = new Date().getTime();
  const intervalTime = moment(now - Number(interval) * 1000)
    .startOf('minute')
    .fromNow();
  // 设置中文

  
  return (
    <>
      <td className="showDate td_normal " style={{display: type === 'showAge' ? 'none' : ''}}>
        <OverlayTrigger placement="bottom" overlay={<Tooltip>{formatTime}</Tooltip>}>
          <span>{formatTime}</span>
        </OverlayTrigger> 
      </td>
      <td className="showAge td_normal" style={{display: type === 'showDate' ? 'none' : ''}}>
        <OverlayTrigger placement="bottom" overlay={<Tooltip>{formatTime}</Tooltip>}>
          <span>{intervalTime}</span>
        </OverlayTrigger>
      </td>
    </>
  );
}
