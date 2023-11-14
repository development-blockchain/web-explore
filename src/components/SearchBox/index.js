import {useState, useRef} from 'react';
import {useRequest} from 'ahooks';
import {useTranslation} from 'react-i18next';
export default function SearchBox({className}) {
  const {t} = useTranslation(['home']);

  const [state, setState] = useState({
    f: '0',
  });
  const searchInputRef = useRef();
  const retrievalRequest = useRequest(
    body => ({
      url: '/blockBrowser/index/retrieval',
      method: 'post',
      body: JSON.stringify(body),
    }),
    {manual: true},
  );

  const handleSelect = e => {
    setState({f: e.target.value});
  };

  const handleSearchText = (e) => {
    e.preventDefault();
    const q = searchInputRef.current.value.trim();

    if (!q) {
      return;
    }

    if (String(Number(q)) === q) {
      window.location.href = `/block/${q}`;
      return;
    }

    if (q.length === 66 && q.indexOf('0x') === 0) {
      window.location.href = `/tx/${q}`;
      return;
    }

    if (q.length === 42 && q.indexOf('0x') === 0) {
      window.location.href = `/address/${q}`;
      return;
    }

    retrievalRequest.run({field: 'address', value: q}).then(res => {
      console.log(res);
      if (res.types === 0) {
        window.location.href = `/search?f=0&q=${q}`;
      } else if (res.types === 1) {
        // 通证
        window.location.href = `/token/${q}`;
      } else if (res.types === 2) {
        // 地址
        window.location.href = `/address/${q}`;
      }
    });
  };

  const handleKeydownForm = (e)=>{ 
    if(e.keyCode ===13){ 
      e.preventDefault();
      return false;
    }
  }
  return (
    <form className={`mb-3 ${className}`} method="GET" onSubmit={handleSearchText}>
      <div className="input-group input-group-shadow">
        <div className="input-group-prepend d-none d-md-block">
          <select name="f" value={state.f} onChange={handleSelect} className="custom-select custom-arrow-select input-group-text font-size-base filterby">
            <option value="0">{t('home.searchbox.all')}</option>
            <option value="1">{t('home.searchbox.addresses')}</option>
            <option value="2">{t('home.searchbox.tokens')}</option>
            <option value="3">{t('home.searchbox.nameTags')}</option>
            <option value="4">{t('home.searchbox.labels')}</option>
            <option value="5">{t('home.searchbox.websites')}</option>
          </select>
        </div>
        <input
          id="txtSearchInput"
          ref={searchInputRef}
          type="text"
          className="form-control searchautocomplete ui-autocomplete-input list-unstyled py-3 mb-0"
          placeholder={t('home.searchbox.placeholder')}
          aria-describedby="button-header-search"
          autoComplete="off"
        />
        <input type="hidden" value="" id="hdnSearchText" />
        <input id="hdnIsTestNet" value="False" type="hidden" />
        <div className="input-group-append">
          <button className="btn btn-primary" type="submit"  onClick={handleSearchText}>
            <i className="fa fa-search"></i>
          </button>
        </div>
      </div>
    </form>
  );
}
