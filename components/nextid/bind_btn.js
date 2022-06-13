import React from 'react';

import { connect } from "react-redux";

import autobind from 'autobind-decorator';
import BindModal from 'components/nextid/bind_modal'
import UnbindModal from 'components/nextid/unbind_modal'

import Loading from 'components/common/loading'

import {withTranslate} from 'hocs/index'
import {defaultListData} from 'helper/common'
import { loadProofList } from 'redux/reducer/nextid';
import { denormalize } from 'normalizr';
import {personListSchema} from 'redux/schema/index'
import Immutable from 'immutable';

@withTranslate
class BindingModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'show_bind_modal' : false,
            'show_unbind_modal' : false
        }
    }

    componentDidMount() {
        const {address} = this.props;
        this.props.loadProofList(address);
    }

    @autobind
    toggleBindModal() {
        this.setState({
            'show_bind_modal' : !this.state.show_bind_modal
        })
    }

    @autobind
    toggleUnbindModal() {
        this.setState({
            'show_unbind_modal' : !this.state.show_unbind_modal
        })
    }

    


    render() {
        const {show_bind_modal,show_unbind_modal} = this.state;
        const {t} = this.props.i18n;
        const {address,is_fetching,twitter} = this.props;

        if (is_fetching){
            return <div className='bg-white py-8 rounded-lg mb-8'> 
            <Loading />
            </div>
        }

        if (twitter) {
            return <div>
                <div className='border-2 p-4 rounded-lg border-white mb-4 font-bold text-white flex justify-between'>
                    <div>
                        <h2>{t('binded')} @ {twitter.get('identity')}</h2>
                        <div className='text-sm'>{t('if you wanna unbind twitter account please click unbind')}</div>
                    </div>
                    <div>
                        <button className='btn btn-default' onClick={this.toggleUnbindModal}>{t('unbind twitter')}</button>
                    </div>
                </div>
                <UnbindModal visible={show_unbind_modal} address={address} closeModal={this.toggleUnbindModal} proof={twitter}/>
            </div>
        }

        return  <div>
            <div className='border-2 p-4 rounded-lg border-white mb-4 font-bold text-white flex justify-between'>
                <div>
                    <h2>{t('bind twitter')}</h2>
                    <div className='text-sm'>{t('After binding you can display your twitter name under your nft')}</div>
                </div>
                <div>
                    <button className='btn btn-default' onClick={this.toggleBindModal}>{t('bind twitter')}</button>
                </div>
            </div>
            <BindModal visible={show_bind_modal} address={address} closeModal={this.toggleBindModal} />
        </div>
    }

    
}



function mapStateToProps(state,ownProps) {
    let list_data_one = state.getIn(['nextid','proof_list',ownProps.address])
    if (!list_data_one) {
        list_data_one = defaultListData
    }

    let person_list = Immutable.List([]);
    let twitter = null;

    if (list_data_one.get('result')) {
        person_list = denormalize(list_data_one.get('result'),personListSchema,state.get('entities'))
    }

    // console.log('person_list',person_list.toJS());
    person_list.map(one=>{
        // console.log('person_list_one',one.toJS());
        if (one.get('proofs')) {
            one.get('proofs').map(proof_one=>{
                if (proof_one.get('platform') == 'twitter')
                // console.log('proof_one',proof_one.toJS())
                twitter = proof_one;
            })
        }
    })

    return {
        twitter         : twitter,
        is_fetching     : list_data_one.get('is_fetching'),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadProofList   : (adddress) => {
            return dispatch(loadProofList(adddress))
        },
    }
}

module.exports = connect(mapStateToProps,mapDispatchToProps)(BindingModal)
