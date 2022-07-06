import React from 'react';
import PropTypes from 'prop-types';

import autobind from 'autobind-decorator';

import Modal from 'components/common/modal'
import Button from 'components/common/button'


import PrefixInput from 'components/form/prefix_input'

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import {withTranslate} from 'hocs/index'

import { PieChart } from 'react-minimal-pie-chart';
import {percentDecimal} from 'helper/number'
import { getColorList } from 'helper/color';

@withTranslate
class GroupProbabilityModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_adding : false,
            chart_map : [],
        }
        this.formRef = React.createRef()
    }

    // componentDidMount() {
    //     // 
    // }

    componentDidUpdate(prevProps) {
        if (this.props.visible &&  !prevProps.visible) {
            this.resetForm();
        } 
    }

    @autobind
    submitForm(values) {
        // console.log('debug03,values',values)

        ///如果最后一个没有填，或是0，那么最后一个自动填进去
        ///如果最后一个填了，但是不是0，则每一个按照全部的计算一下
        let last_key = values.generate_number_map.length - 1;
        let last_probability = Number(values.generate_number_map[last_key]['probability'])

        let total = 0;
        let empty_count = 0;
        Object.keys(values.generate_number_map).map(key=>{
            let is_empty = values.generate_number_map[key]['probability'] == '';
            total += Number(values.generate_number_map[key]['probability']);
            if (is_empty) {
                empty_count += 1;
            }
        });
        let data_map = {
            'ids'           :  [],
            'probabilities' :  []
        }

        ///如果总的加起来小于100，并且有空的部分，那么就平均填满空位
        if (total < 100 && empty_count > 0) {
            let each_empty = percentDecimal((100 - total) / (empty_count * 10000),4)*10000
            Object.keys(values.generate_number_map).map(key=>{
                let is_empty = values.generate_number_map[key]['probability'] == '';
                let pro = Number(values.generate_number_map[key]['probability']);
                data_map['ids'].push(values.generate_number_map[key]['id'])
                if (!is_empty) {
                    data_map['probabilities'].push(percentDecimal(pro / 10000,4)*10000)
                }else {
                    data_map['probabilities'].push(each_empty)
                }
            });
        }else {
            Object.keys(values.generate_number_map).map(key=>{
                data_map['ids'].push(values.generate_number_map[key]['id'])
                data_map['probabilities'].push(percentDecimal(values.generate_number_map[key]['probability']/(100*total),4)*10000)
            })
        }

        // console.log('debug03,data_map',data_map)

        this.setState({
            'is_adding' : true
        });

        var that = this;
        this.props.updateGroupProbability(data_map).then(data=>{
            // console.log('result',data);
            if (data.status == 'success') {
                that.setState({
                    'is_adding' : false
                })

                this.resetForm();
                ///URL跳转
                // this.props.refreshList();
                // this.props.closeModal();
            }else {
                Object.keys(data.messages).map(key=>{
                    this.formRef.current.setFieldError(key,data.messages[key].join(','));
                })
            }
        }).catch(error=>{
            that.setState({
                'is_adding' : false
            })
        })
    }

    @autobind
    resetForm() {

        if (!this.formRef.current) {
            this.timer = setTimeout(this.resetForm,500);
        }

        const {list_rows} = this.props;
        let {chart_map} = this.state;

        let generate_number_map = [];

        let color_map = getColorList(list_rows.length);

        let total_number = 0;
        list_rows.map(one=>{
            total_number += Number(one.get('generate_number'));
        })

        let i = 0;
        list_rows.map(one=>{
            generate_number_map.push({
                'name'            : one.get('name'),
                'id'              : one.get('id'),
                'probability'     : percentDecimal(one.get('generate_number') / total_number)
            })
            if (chart_map[i]) {
                chart_map[i]['value'] = one.get('generate_number');
            }else {
                chart_map.push({
                    'title'     : one.get('name'),
                    'value'     : one.get('generate_number'),
                    'color'     : color_map[i]
                })
            }

            i += 1;
        })

        let init_data = {
            'generate_number_map' : generate_number_map
        }

        // console.log('this.formRef.current',this.formRef.current,init_data);
        this.formRef.current.setValues(init_data);

        this.setState({
            chart_map : chart_map
        })
    }

    render() {
        const {is_adding,chart_map} = this.state;
        const {list_rows,visible} = this.props;
        const {t} = this.props.i18n;

        if (!visible) {
            return null;
        }


        let init_data ={
            'generate_number_map' : []
        }

        const formSchema = Yup.object().shape({
            generate_number_map : Yup.array().of(Yup.object().shape({
                probability :  Yup.number(),
            })).required(),
        });
        const shiftSize = 7;

        return  <Modal
                    width={650}
                    title={null}
                    visible={visible} 
                    footer={null}
                    onClose={this.props.closeModal}>

                    <h2 className='modal-title'>{t('edit rarity')}</h2>
                  
                    <div>

                    <Formik
                        innerRef={this.formRef}
                        initialValues={init_data}
                        validationSchema={formSchema}
                        onSubmit={this.submitForm}>
                        {({ errors, touched,values }) => (
                            
                            <Form className="w-full">
                            

                            <div className="p-0">

                                <div className='w-1/2 mx-auto py-12'>
                                <PieChart
                                    data={chart_map}
                                    radius={PieChart.defaultProps.radius - shiftSize}
                                    segmentsShift={(index) => (index === 0 ? shiftSize : 0.5)}
                                    lineWidth={30}
                                    label={({ dataEntry }) => dataEntry.percentage.toFixed(2) + '%'}
                                    labelStyle={(index) => ({
                                        fill: '#fff',
                                        fontSize: '5px',
                                        fontFamily: 'ubuntu',
                                    })}
                                />

                                <div className='mt-4 flex justify-start flex-wrap'>
                                    {Object.keys(chart_map).map(k=>{
                                        return <div key={k} className="flex items-center justify-start mx-4">
                                            <div className={'w-3 h-3 block rounded-full mr-2'} style={{'backgroundColor':chart_map[k]['color']}}>
                                                
                                            </div>
                                            {chart_map[k]['title']}
                                        </div>
                                    })}
                                </div>
                                </div>

                                <div className='font-bold text-base capitalize mb-4 text-center'>
                                    {t('rarity')}
                                </div>

                                <div className='probability_wapper'>

                                {values.generate_number_map.map((one,index) =>  <div key={one['id']}>
                                    <PrefixInput prefix={one['name']} endfix={'%'} name={'generate_number_map.'+index+'.probability'} placeholder={t("probability")} />
                                </div>)}

                                </div>


                                <div className='border-t d-border-c-1 my-4' />

                                <div className="form-submit flex justify-end mt-4">
                                    <Button loading={is_adding} className="btn btn-primary" type="submit">{t("update group")}</Button>
                                </div>

                            </div>

                        </Form>
                        )}
                    </Formik>


                    </div>

                    
                </Modal>
    }

    
}

GroupProbabilityModal.propTypes = {
    visible     : PropTypes.bool.isRequired,
    closeModal  : PropTypes.func.isRequired,
};
  

module.exports = GroupProbabilityModal


