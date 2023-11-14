import {useLocation} from 'react-router-dom';
import qs from 'qs';
import {useTranslation} from 'react-i18next';
export default function Pager3({current, total, path}) {
  const location = useLocation();
  const {t} = useTranslation(['common']);
  const query = qs.parse(location.search, {ignoreQueryPrefix: true});
  const firstPage = `${path}${qs.stringify({...query, p:1}, {addQueryPrefix: true})}`;

  const prevPage = `${path}${qs.stringify({...query, p: Number(current) - 1}, {addQueryPrefix: true})}`;
  const nextPage = `${path}${qs.stringify({...query, p: Number(current) + 1}, {addQueryPrefix: true})}`;


  const lastPage = `${path}${qs.stringify({...query, p: total}, {addQueryPrefix: true})}`;
// console.log(current, total)
  return (
    <nav aria-label="page navigation">
      <ul className="pagination pagination-sm mb-0">
        {current === '1' ? (
          <li className="page-item disabled">
            <span className="page-link text-white"  >{t('common.pager.first')}</span>
          </li>
        ) : (
          <li className="page-item">
            {/* <a className="page-link" href={`${path}?p=1`}> */}
            <a className="page-link"  style={{color:'#fff'}} href={firstPage}>
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
          <li className="page-item" data-toggle="tooltip" title={t('common.pager.previous')} data-original-title="Go to Previous">
            <a className="page-link" href={prevPage} aria-label="Previous">
              <span aria-hidden="True">
                <i className="fa fa-chevron-left small"></i>
              </span>
              <span className="sr-only text-white"> {t('common.pager.previous')}</span>
            </a>
          </li>
        )}

        <li className="page-item disabled">
          <span className="page-link text-nowrap text-white">
          {t('common.pager.page')} <strong className="font-weight-medium">{current}</strong> {t('common.pager.of')} <strong className="font-weight-medium">{total || '1'}</strong>
          </span>
        </li>
        {current === String(total) ? (
          <li className="page-item disabled">
            <span className="page-link">
              <i className="fa fa-chevron-right small"></i>
            </span>
            <span className="sr-only text-white">  {t('common.pager.next')}</span>
          </li>
        ) : (
          <li className="page-item" data-toggle="tooltip" title= {t('common.pager.next')}>
            <a className="page-link text-white" href={nextPage} aria-label="Next">
              <span aria-hidden="True">
                <i className="fa fa-chevron-right small"></i>
              </span>
              <span className="sr-only text-white">  {t('common.pager.next')}</span>
            </a>
          </li>
        )}
        {current === String(total) ? (
          <li className="page-item disabled">
            <span className="page-link text-white">{t('common.pager.last')}</span>
          </li>
        ) : (
          <li className="page-item">
            {/* <a className="page-link" href={`${path}?p=${total}`}> */}
            <a className="page-link text-white" href={lastPage}>
              <span aria-hidden="True">{t('common.pager.last')}</span> <span className="sr-only">{t('common.pager.last')}</span>
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}
