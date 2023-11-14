import {useState} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

export default function InnerCopy({text, title}) {
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
      <a className="js-clipboard btn btn-sm btn-icon btn-soft-secondary rounded-circle" href="#" data-original-title={title}>
        {copied ? <span className="btn-icon__inner fa fa-check"></span> : <span className="btn-icon__inner far fa-copy"></span>}
      </a>
    </CopyToClipboard>
  );
}
