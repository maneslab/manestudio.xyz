import React from 'react';

import { connect } from "react-redux";
import {defaultListData} from 'helper/common'

import Link from 'next/link'
import {loadProofList} from 'redux/reducer/nextid'
import {loadFutureMessageOwner} from 'redux/reducer/future_message'
import {denormalize} from 'normalizr';
import {personListSchema} from 'redux/schema/index'
import TwitterIcon from 'public/img/share/twitter.svg'

class Twitter extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.loadFutureMessageOwner(this.props.future_message.get('tokenId'));
    }

    componentDidUpdate(prevProps,prevState) {
        if (this.props.owner && prevProps.owner != this.props.owner) {
            this.props.loadProofList(this.props.owner)
        }
    }

    render() {
        const { is_fetching,twitter } = this.props;

        if (twitter) {
            return <div className='mt-2' >
                <a className='flex justify-start items-center text-gray-800 text-base font-ubuntu hover:text-blue-500'  href={"https://twitter.com/"+twitter.get('identity')} target="_blank">
                    <TwitterIcon className="w-4 h-4 mr-1 text-blue-500"/>{twitter.get('identity')}
                </a>
            </div>
        }

        return null;

    }
}

function mapStateToProps(state,ownProps) {

    let token_id = ownProps.future_message.get('tokenId');
    let address = state.getIn(['future_message','load_owner',token_id,'result']);

    let twitter = null;
    let is_fetching = null;
    if (address) {
        let list_data_one = state.getIn(['nextid','proof_list',address])
        if (!list_data_one) {
            list_data_one = defaultListData
        }
    
        let person_list = null;
    
        if (list_data_one.get('result')) {
            person_list = denormalize(list_data_one.get('result'),personListSchema,state.get('entities'))
    
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
        }

        is_fetching = list_data_one.get('is_fetching');
    }

    return {
        twitter         : twitter,
        is_fetching     : is_fetching,
        owner           : address
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadProofList   : (adddress) => {
            return dispatch(loadProofList(adddress))
        },
        loadFutureMessageOwner : (token_id) => {
            return dispatch(loadFutureMessageOwner(token_id))
        }
    }
}

module.exports = connect(mapStateToProps,mapDispatchToProps)(Twitter)

