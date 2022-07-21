import React, { Component } from 'react'
import Dropdown from 'rc-dropdown';

export default class DropdownComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dropdown_visible : false
        }
        this.toggleDropdown = ::this.toggleDropdown
    }

    toggleDropdown() {
        const {dropdown_visible} = this.state;

        if (!dropdown_visible) {
            document.body.style.overflow = 'hidden';
        }else {
            document.body.style.overflow = 'auto';
        }

        this.setState({
            'dropdown_visible' : !dropdown_visible
        })
    }

    render() {
        const {children,menu} = this.props; 
        const {dropdown_visible} = this.state;

        return <>
            <Dropdown overlay={menu} visible={dropdown_visible}>
                <div onClick={this.toggleDropdown} className="cursor-pointer">
                    {children}
                </div>
            </Dropdown>
            {
                (dropdown_visible)
                ? <div className='mask-bg' onClick={this.toggleDropdown}></div>
                : null
            }
        </>
    }


}

