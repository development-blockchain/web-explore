import {useState} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

export default function Copy({text, title}) {
  const [copied, setCopied] = useState(false);

  return (
    <CopyToClipboard
      text={text}
      onCopy={() => {
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 1000);
      }}
    >
      <a className="js-clipboard text-muted" href="#">
        {copied ? (
          <>
            <span className="far fa-check-circle"></span>
            {/* Copied */}
          </>
        ) : (
          <span className="far fa-copy"></span>
        )}
      </a>
    </CopyToClipboard>
  );
}
