import { useTranslation } from 'react-i18next';
export default function Pager2({current, total, pageChange}) {
 
  const {t} = useTranslation(['common']); 
  const firstPage = 1 ;//`${path}${qs.stringify({...query, p:1}, {addQueryPrefix: true})}`;

  const prevPage =  Number(current) - 1;//`${path}${qs.stringify({...query, p: Number(current) - 1}, {addQueryPrefix: true})}`;
  const nextPage = Number(current) + 1 ;//`${path}${qs.stringify({...query, p: Number(current) + 1}, {addQueryPrefix: true})}`;


  const lastPage = total;//`${path}${qs.stringify({...query, p: total}, {addQueryPrefix: true})}`; 
  return (
    <nav aria-label="page navigation">
      <ul className="pagination pagination-sm mb-0">
        {current === '1' ? (
          <li className="page-item disabled">
            <span className="page-link">{t('common.pager.first')}</span>
          </li>
        ) : (
          <li className="page-item">
            
            <a className="page-link"  href="#!" title=""  onClick={e => {  e.preventDefault(); pageChange(firstPage); }} >
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
          <li className="page-item" data-toggle="tooltip" title={t('common.pager.previous')}>
            <a className="page-link" href="#!"  onClick={e => {  e.preventDefault(); pageChange(prevPage); }}     aria-label="Previous">
              <span aria-hidden="True">
                <i className="fa fa-chevron-left small"></i>
              </span>
              <span className="sr-only"> {t('common.pager.previous')}</span>
            </a>
          </li>
        )}

        <li className="page-item disabled">
          <span className="page-link text-nowrap">
          {t('common.pager.page')} <strong className="font-weight-medium">{current}</strong> {t('common.pager.of')} <strong className="font-weight-medium">{total || '1'}</strong>
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
          <li className="page-item" data-toggle="tooltip"  title= {t('common.pager.next')}>
            <a className="page-link" href="#!" onClick={e => {  e.preventDefault(); pageChange(nextPage); }}  aria-label="Next">
              <span aria-hidden="True">
                <i className="fa fa-chevron-right small"></i>
              </span>
              <span className="sr-only">  {t('common.pager.next')}</span>
            </a>
          </li>
        )}
        {current === String(total) ? (
          <li className="page-item disabled">
            <span className="page-link">{t('common.pager.last')}</span>
          </li>
        ) : (
          <li className="page-item">
            {/* <a className="page-link" href={`${path}?p=${total}`}> */}
            <a className="page-link"  href="#!" onClick={e => {  e.preventDefault(); pageChange(lastPage); }}  >
              <span aria-hidden="True">{t('common.pager.last')}</span> <span className="sr-only">{t('common.pager.last')}</span>
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}
