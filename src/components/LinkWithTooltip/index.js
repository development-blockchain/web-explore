import React, { Component } from 'react';
import { Tooltip ,OverlayTrigger} from 'react-bootstrap';
class LinkWithTooltip extends Component {
    render() {
        let tooltip = <Tooltip>  <div  dangerouslySetInnerHTML = {{ __html: this.props.tooltip }} /></Tooltip>;  
        return (
          <OverlayTrigger placement={this.props.placement} overlay={tooltip} >
            {this.props.children}
          </OverlayTrigger>
        );
      }
} 
export default LinkWithTooltip;