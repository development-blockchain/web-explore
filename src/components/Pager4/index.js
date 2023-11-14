import { useTranslation } from 'react-i18next';

export default function Pager4({current, handleChangPageNum,total}) {  
  const {t} = useTranslation(['common']); 
  const changeNum=(e,curNum)=>{
    e.preventDefault();
    if(curNum===0) curNum = 1 
    current = curNum;
    handleChangPageNum(curNum + "");
  } 
// console.log(current, total)
  return (
    <nav aria-label="page navigation">
      <ul className="pagination pagination-sm mb-0">
        {current === '1' ? (
          <li className="page-item disabled">
            <span className="page-link">{t('common.pager.first')}</span>
          </li>
        ) : (
          <li className="page-item">
            {/* <a className="page-link" href={`${path}?p=1`}> */}
            <a className="page-link" href="/#"  onClick={e=>changeNum(e,1)}>
              <span aria-hidden="True">{t('common.pager.first')}</span> <span className="sr-only">{t('common.pager.first')}</span>
            </a>
          </li>
        )}

        {current === '1' ? (
          <li className="page-item disabled">
            <span className="page-link">
              <i className="fa fa-chevron-left small"></i>
            </span>
            <span className="sr-only">{t('common.pager.previous')}</span>
          </li>
        ) : (
          <li className="page-item" data-toggle="tooltip"   title={t('common.pager.previous')}>
            <a className="page-link"  href="/#"   onClick={e=>changeNum(e,Number(current) - 1)} aria-label="Previous">
              <span aria-hidden="True">
                <i className="fa fa-chevron-left small"></i>
              </span>
              <span className="sr-only"> {t('common.pager.previous')}</span>
            </a>
          </li>
        )}

        <li className="page-item disabled">
          <span className="page-link text-nowrap">
            {t('common.pager.page')} 
            <strong className="font-weight-medium">{current}</strong>
             {t('common.pager.of')}
            <strong className="font-weight-medium">{total || '1'}</strong>{t('common.pager.ye')} 
          </span> 
        </li> 
        {current === String(total) ? (
          <li className="page-item disabled">
            <span className="page-link">
              <i className="fa fa-chevron-right small"></i>
            </span>
            <span className="sr-only">  {t('common.pager.next')}</span>
          </li>
        ) : (
          <li className="page-item"  title= {t('common.pager.next')}>
            <a className="page-link" href="/#"   onClick={e=>changeNum(e,Number(current) + 1)} aria-label="Next">
              <span aria-hidden="True">
                <i className="fa fa-chevron-right small"></i>
              </span>
              <span className="sr-only">  {t('common.pager.next')}</span>
            </a>
          </li>
        )}
        {current === String(total) ? (
          <li className="page-item disabled">
            <span className="page-link"> {t('common.pager.last')}</span>
          </li>
        ) : (
          <li className="page-item"  title="最后一页"> 
            <a className="page-link" href="/#"    onClick={e=>changeNum(e,total)}>
              <span aria-hidden="True"> {t('common.pager.last')}</span> <span className="sr-only"> {t('common.pager.last')}</span>
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}
