import React from 'react';

import autobind from 'autobind-decorator'

import Input from 'components/form/input'
import Button from 'components/common/button'
import Dropdown from 'rc-dropdown';

import { SketchPicker } from 'react-color';

class ColorInput extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'visible' : false
        }
    }

    @autobind
    toggleColorPicker() {
        this.setState({
            'visible' : !this.state.visible
        })
    }

    @autobind
    overlayClick() {
        console.log('overlayClick');
        this.setState({
            'visible' : true
        })
    }

    render() {

        const {value} = this.props;
        const {visible} = this.state;


        let colorPopover = <div className="color-picker-wapper">
        <SketchPicker 
            color={ value }
            onChange={ this.props.onChange } 
        /></div>

        return <Dropdown overlay={colorPopover} placement='bottomRight' visible={visible} onOverlayClick={this.overlayClick} minOverlayWidthMatchTrigger={false} >
        <div className="color-input relative cursor-pointer" onClick={this.toggleColorPicker}>
            <span className="prefix">#</span>
            <Input value={value.slice(1)} />
            <div className="color-btn-out">
                <a className="color-btn" style={{'background':value}}>
                </a>
            </div>
        </div>
        </Dropdown>

    }
}

module.exports = ColorInput
