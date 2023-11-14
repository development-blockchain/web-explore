import React,{ useState} from 'react';
import LinkWithTooltip from '../../components/LinkWithTooltip';
import { Dropdown } from 'react-bootstrap';
 

export default function CustomDropDown({selectedIndex =0, address}) { 

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <LinkWithTooltip placement="top" tooltip="View Options/Filter">
        <a  className="btn btn-sm btn-icon btn-soft-secondary"  href=""   ref={ref}  onClick={(e) => {
            e.preventDefault();
            onClick(e);
          }}
        >
          {children} 
        </a>
        </LinkWithTooltip>
    ));
      
    const CustomMenu = React.forwardRef(
        ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
          const [value, setValue] = useState(''); 
          return (
            <div
              ref={ref}
              style={style} 
              style={{inset:'30px auto auto -150px' }}
              className={className}
              aria-labelledby={labeledBy}
            > 
              <ul className="list-unstyled">
                {React.Children.toArray(children).filter(
                  (child) =>
                    !value || child.props.children.toLowerCase().startsWith(value),
                )}
              </ul>
            </div>
          );
        },
      );

      
    return  (
        <div className="position-relative ml-1">  
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                <i className="fa fa-ellipsis-v btn-icon__inner"></i>
                </Dropdown.Toggle>  
                <Dropdown.Menu as={CustomMenu} >
                    <Dropdown.Item href={`/txs?a=${address}` } active={selectedIndex ==1}  >
                        <i className="fa fa-circle mr-1"></i> View Completed Txns
                    {(selectedIndex ===1)? <i className="fa fa-check small ml-1"></i>:''}
                    </Dropdown.Item>
                    <Dropdown.Item href={`/txsPending?a=${address}&m=hf`}  active={selectedIndex ==2}>
                        <i className="far fa-circle mr-1"></i> View Pending Txns
                        {(selectedIndex ===2)? <i className="fa fa-check small ml-1"></i>:''}
                    </Dropdown.Item> 
                    <Dropdown.Item  href={`/txs?a=${address}&f=1`}  active={selectedIndex ==3} >
                        <i className="fa fa-exclamation-circle mr-1"></i> View Failed Txns
                        {(selectedIndex ===3)?  <i className="fa fa-check small ml-1"></i> :''}
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href={`/txs?a=${address}&f=2`}   active={selectedIndex ==4}>
                        <i className="fa fa-long-arrow-alt-right mr-1"></i> View Outgoing Txns
                        {(selectedIndex ===4)?  <i className="fa fa-check small ml-1"></i> :''}
                    </Dropdown.Item>
                    <Dropdown.Item href={`/txs?a=${address}&f=3`}  active={selectedIndex ==5}>
                        <i className="fas fa-long-arrow-alt-left mr-1"></i> View Incoming Txns
                        {(selectedIndex ===5)?<i className="fa fa-check small ml-1"></i> :''}
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown> 
    </div>
  );

}