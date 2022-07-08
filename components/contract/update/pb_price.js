import React from 'react';
import {withTranslate} from 'hocs/index'
import autobind from 'autobind-decorator';
import { PencilIcon } from '@heroicons/react/outline';
import withContractUpdate from 'hocs/contract_update';
import {ethers} from 'ethers'

@withTranslate
@withContractUpdate
class PbPrice extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
        }
        this.inputRef = React.createRef();
    }

    componentDidUpdate(prevProps,prevState) {
        if (this.props.edit_mode && !prevProps.edit_mode) {
            this.inputAutoFocus();
        }
    }

    @autobind
    inputAutoFocus() {
        if (this.inputRef.current) {
            this.inputRef.current.focus();
        }
    }
    
    @autobind
    submit() {
        console.log('shouldCall',this.props.shouldCallContract());
        if (this.props.shouldCallContract()) {
            this.callContract(this.props.data_value);
        }else {
            return;
        }
    }

    @autobind
    async callContract(value) {

        const {t} = this.props.i18n;

        var that = this;

        await this.props.manenft.request({
            'text' : {
                'loading' : t('update public sale price'),
                'sent'    : t('update public sale price tx sent'),
                'success' : t('update public sale price successful'),
            },
            'func' : {
                'send_tx' : async () => {
                    let tx_in = await this.props.manenft.contract.setMintPrice(ethers.utils.parseEther(value));
                    // console.log('tx is send',tx_in)
                    return tx_in;
                },
                'before_send_tx' : () => {
                    that.setState({
                        is_calling_contract : true,
                    })
                },
                'finish_tx' : () => {
                    that.setState({
                        is_calling_contract : false,
                    })
                },
                'after_finish_tx' : () => {
                    console.log('after_finish_tx');
                },
                'error_tx'  :   ()  =>  {
                    this.props.setDataValue(this.props.value);
                }
            } 
        })
    }

    render() {
        const {data_value,edit_mode} = this.props;

        if (edit_mode) {
            return <div className='flex justify-start gap-4'>
                <input ref={this.inputRef} type="text" className='input-box' value={data_value} onChange={this.props.handleDataValueChange} onBlur={this.props.handleDataValueBlur} />
                <button className='btn btn-primary' onClick={this.submit}>update contract</button>
            </div>
        }else {
            return <div className='edit-form-line flex justify-start items-center' onClick={this.props.toggleEditMode}>
                {data_value} ETH
                <PencilIcon  className='icon-xs ml-4'/>
            </div>
        }
    }
}


export default PbPrice

