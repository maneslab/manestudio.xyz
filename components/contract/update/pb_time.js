import React from 'react';
import {withTranslate} from 'hocs/index'
import autobind from 'autobind-decorator';
import { PencilIcon } from '@heroicons/react/outline';
import withContractUpdate from 'hocs/contract_update';
import Showtime from 'components/time/showtime';
import TimeSelect from 'components/time/timeselect';
import Switch from 'rc-switch'
import { t } from 'helper/translate';
import message from 'components/common/message'

@withTranslate
@withContractUpdate
class PbTime extends React.Component {


    constructor(props) {
        super(props)
        let has_end_time = this.hasEndTime(props.data_value);
        this.state = {
            'has_endtime'  : has_end_time,
            'show_endtime' : (has_end_time) ? true : false
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (Number(this.props.data_value[1]) != Number(prevProps.data_value[1])) {
            this.setState({
                'has_endtime' : this.hasEndTime(this.props.data_value),
            })
        }
    }

    @autobind
    setShowEndTime(v) {
        this.setState({
            'show_endtime' : (v) ? true : false
        })
    }

    hasEndTime(data_value) {
        let has_end_time = true;
        if (Number(data_value[1]) == 0) {
            has_end_time = false;
        }
        return has_end_time;
    }

    @autobind
    handleValueChange(index,v) {
        const {data_value} = this.props;
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

            if (Number(data_value[1]) < Number(data_value[0]) && Number(data_value[1]) != 0) {
                message.error('mint time end time must be after mint time start time');
                return;
            }

            this.callContract(this.props.data_value);
        }
    }

    @autobind
    async callContract(value) {

        const {t} = this.props.i18n;

        var that = this;

        await this.props.manenft.request({
            'text' : {
                'loading' : t('update public mint time'),
                'sent'    : t('update public mint time tx sent'),
                'success' : t('update public mint time successful'),
            },
            'func' : {
                'send_tx' : async () => {

                    this.props.closeEditMode();
                    let tx_in = await this.props.manenft.contract.setPresaleTimes(value[0],value[1]);
                    console.log('tx is send',tx_in)
                    this.props.onUpdate(tx_in.hash);
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

    @autobind
    close() {
        this.props.setDataValue(this.props.value);
        this.props.closeEditMode();
    }

    render() {
        const {data_value,edit_mode,is_calling_contract} = this.props;
        const {show_endtime} = this.state;

        let has_end_time = true;
        if (Number(data_value[1]) == 0) {
            has_end_time = false;
        }
        console.log('data_value',data_value)
        //<input type="text" className='input-box' value={data_value} onChange={this.props.handleDataValueChange} onBlur={this.props.handleDataValueBlur} />

        if (edit_mode) {
            return <div className='flex flex-col gap-2'>
                <TimeSelect value={data_value[0]} handleValueChange={this.handleValueChange.bind({},0)}/>
                <div className='flex justify-start items-center my-2'>
                    {
                        (show_endtime)
                        ? <TimeSelect value={data_value[1]} handleValueChange={this.handleValueChange.bind({},1)}/>
                        : <span className=''>(no endtime)</span>
                    }
                    <span className='ml-4'>
                        <Switch
                            onChange={this.setShowEndTime}
                            disabled={false}
                            checked={show_endtime}
                        />
                    </span>

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
                {
                    (has_end_time)
                    ? <Showtime unixtime={data_value[1]?data_value[1]:0} />
                    : <span>(no endtime)</span>
                }
                </div>
                <PencilIcon  className='icon-xs ml-4'/>
            </div>
        }
    }
}


export default PbTime

