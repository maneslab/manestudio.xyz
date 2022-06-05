import React, { Component } from 'react'

export default function withForm(WrappedComponent,default_values) {

    return class extends Component {

        constructor(props) {
            super(props)
            this.state = (default_values) ? default_values : {}
            this.handleEventValueChange = ::this.handleEventValueChange
            this.handleValueChange = ::this.handleValueChange
            this.handleCheckboxValueChange = ::this.handleCheckboxValueChange
            this.toggleValue = ::this.toggleValue
        }

        static getInitialProps = WrappedComponent.getInitialProps

        handleValueChange(key_name,value) {
            var new_state = {}
            new_state[key_name] = value
            this.setState(new_state)
        }

        handleEventValueChange(key_name,event){
            var value = event.target.value;
            var new_state = {}
            new_state[key_name] = event.target.value;
            this.setState(new_state);
        }
        handleCheckboxValueChange(key_name,event){
            var new_state = {}
            new_state[key_name] = event.target.checked;
            this.setState(new_state);
        }

        toggleValue(key_name) {
            var new_state = {}
            new_state[key_name] = !this.state[key_name];
            this.setState(new_state);
        }

        render() {

            console.log('withForm,this.props',this.props)

            return <WrappedComponent 
                form_data={this.state} 
                toggleValue={this.toggleValue}
                handleValueChange={this.handleValueChange}
                {...this.props}/>;
        }

    }

}

