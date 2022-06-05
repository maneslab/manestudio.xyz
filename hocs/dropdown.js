import React, { Component } from 'react'

export default function withDropdown(WrappedComponent) {

    return class extends Component {

        constructor(props) {
            super(props)
            this.state = {
                dropdown_visible : false
            }
            this.toggleDropdown = ::this.toggleDropdown
        }

        toggleDropdown() {
            const {dropdown_visible} = this.state;
            this.setState({
                'dropdown_visible' : !dropdown_visible
            })
        }

        render() {

            return <WrappedComponent 
                dropdown_visible={this.state.dropdown_visible} 
                toggleDropdown={this.toggleDropdown}
                {...this.props}/>;
        }

    }

}

