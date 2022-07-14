import React from 'react';
import {withTranslate} from 'hocs/index'
import autobind from 'autobind-decorator';
import { PencilIcon } from '@heroicons/react/outline';
import withContractUpdate from 'hocs/contract_update';
import Showtime from 'components/time/showtime';
import TimeSelect from 'components/time/timeselect';
// import { data } from 'autoprefixer';
import message from 'components/common/message'

@withTranslate
@withContractUpdate
class WlTime extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
        }
    }

    // componentWillReceiveProps(newProps){
    //     console.log('componentWillReceiveProps,value',newProps.value,newProps.data_value)
    // } 

    @autobind
    handleValueChange(index,v) {
        const {data_value,value} = this.props;
        data_value[index] = v
        this.props.setDataValue(data_value)
    }

    @autobind
    submit() {

        const {data_value,value} = this.props

        console.log('validate-equals',data_value,value);

        if (Number(data_value[0])==Number(value[0]) 
            && Number(data_value[1]) == Number(value[1])) {
            this.props.closeEditMode();
            return;
        }else {

            if (Number(data_value[1]) < Number(data_value[0])) {
                message.error('mint time end time must be after mint time start time');

                return;
            }

            this.callContract(this.props.data_value);
        }
    }

    @autobind
    close() {
        this.props.setDataValue(this.props.value);
        this.props.closeEditMode();
    }

    @autobind
    async callContract(value) {

        const {t} = this.props.i18n;

        var that = this;

        await this.props.manenft.request({
            'text' : {
                'loading' : t('update whitelist mint time'),
                'sent'    : t('update whitelist mint time tx sent'),
                'success' : t('update whitelist mint time successful'),
            },
            'func' : {
                'send_tx' : async () => {

                    this.props.closeEditMode();
                    let tx_in = await this.props.manenft.contract.setPresaleTimes(value[0],value[1]);
                    console.log('tx is send',tx_in)
                    this.props.onUpdate(tx_in.hash)
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
        const {data_value,edit_mode,is_calling_contract} = this.props;
        const {t} = this.props.i18n;

        console.log('data_value',data_value)
//                <input type="text" className='input-box' value={data_value} onChange={this.props.handleDataValueChange} onBlur={this.props.handleDataValueBlur} />

        if (edit_mode) {
            return <div className='flex flex-col gap-2'>
                <div className='flex justify-start'>
                    <TimeSelect value={data_value[0]} handleValueChange={this.handleValueChange.bind({},0)}/>
                </div>
                <div className='flex justify-start'>
                    <TimeSelect value={data_value[1]} handleValueChange={this.handleValueChange.bind({},1)}/>
                </div>
                <div>
                    <button className='btn btn-primary' onClick={this.submit}>update contract</button>
                    <button className='btn btn-default ml-2' onClick={this.close}>{t('cancel')}</button>
                </div>
            </div>
        }else {
            return <div className='edit-form-line flex justify-start items-center' onClick={this.props.toggleEditMode}>
                <div>
                <Showtime unixtime={data_value[0]?data_value[0]:0} />
                <Showtime unixtime={data_value[1]?data_value[1]:0} />
                </div>
                <PencilIcon  className='icon-xs ml-4'/>
            </div>
        }
    }
}


export default WlTime

