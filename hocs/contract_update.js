import React, { Component } from 'react'

export default function withContractUpdate(WrappedComponent) {

    return class extends Component {

        constructor(props) {
            super(props)

            this.state = {
                'edit_mode'           : false,
                'is_calling_contract' : false,
                'value'               : this.getValueSafe(props.value)
            }
            this.timer = null;

            this.toggleEditMode = ::this.toggleEditMode
            this.closeEditMode = ::this.closeEditMode
            this.onValueChange  = ::this.onValueChange
            this.onBlur         = ::this.onBlur
            this.setDataValue   = ::this.setDataValue
            this.shouldCallContract  = ::this.shouldCallContract
        }

        componentDidUpdate(prevProps,prevState) {
            if (this.props.value != prevProps.value) {
                this.setState({
                    'value' : this.getValueSafe(this.props.value)
                })
            }
        }

        getValueSafe(v) {
            if (typeof v == 'object') {
                return JSON.parse(JSON.stringify(v))
            }else {
                return v;
            }
        }

        toggleEditMode() {
            this.setState({
                'edit_mode' : !this.state.edit_mode
            })
        }
    
        onValueChange(e) {
            this.setState({
                'value' : e.target.value
            })
        }

        setDataValue(v) {
            this.setState({
                'value' : this.getValueSafe(v)
            })
        }
    
        onBlur() {
            this.timer = setTimeout(()=>{
                this.setState({
                    'edit_mode' : false
                })
            },300);
        }

        closeEditMode() {
            this.setState({
                'edit_mode' : false
            })
        }
    
        shouldCallContract() {

            console.log('shouldCallContract')
    
            if (this.timer) {
                clearTimeout(this.timer);
            }
    
            // console.log('submit触发',this.state.value,this.props.value);
            this.setState({
                'edit_mode' : false
            })

            if (this.state.value !== this.props.value) {
                console.log('内容变化了应该call合约');
                // this.callContract(this.state.value)
                return true;
            }else {
                console.log('内容没有变化不会触发');
                return false;
            }

        }
    
        render() {

            const {edit_mode,is_calling_contract,value} = this.state

            return <WrappedComponent 
                edit_mode={edit_mode} 
                is_calling_contract={is_calling_contract}
                data_value={value}
                toggleEditMode={this.toggleEditMode}
                closeEditMode={this.closeEditMode}
                handleDataValueChange={this.onValueChange}
                handleDataValueBlur={this.onBlur}
                setDataValue={this.setDataValue}
                shouldCallContract={this.shouldCallContract}
                {...this.props}/>;
        }

    }

}

