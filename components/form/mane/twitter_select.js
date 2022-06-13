import React from 'react';
import { Field } from 'formik';
import Dropdown from 'rc-dropdown';
import autobind from 'autobind-decorator'
// import classNames from 'classnames';
import Modal from 'components/common/modal'
import Button from 'components/common/button'
import {connect} from 'react-redux'

import withDropdown  from 'hocs/dropdown';
import {withTranslate} from 'hocs/index'
import Erc20 from 'helper/web3/erc20';
import BindModal from 'components/nextid/bind_modal';

import {CurrencyDollarIcon} from '@heroicons/react/outline'
import { httpRequest } from 'helper/http';

import {loadClubKey} from 'redux/reducer/club'
import {loadProofList} from 'redux/reducer/nextid'


@withDropdown
@withTranslate
class TwitterSelect extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_fetching : false,
            kw : '',
            tokens : [],
            'show_bind_modal' : false,
            'contract_address' : '',
            'is_adding_token' : false,

            'step'      :   'init',

            'is_fetching_key'  : false,
            'is_fetching_list' : false,

            'persona'   :   {
                'club_id'   : null,
                'data'      : {
                    'private_key' : '',
                    'public_key'  : ''
                }
            }
        }

        this.addToken = ::this.addToken
        this.setFieldValue = null
    }   

    componentDidMount() {
        this.getClubKey();
    }

    componentDidUpdate(prevProps,prevState) {
        if (prevProps.dropdown_visible != this.props.dropdown_visible && !this.props.dropdown_visible) {
            this.setState({
                'kw' : ''
            })
        }
    }

    async getClubKey() {   
        console.log('debug07,getClubKey');
        const {club_id} = this.props;

        this.setState({
            'is_fetching_key' : true
        })

        try {

            let result = await this.props.loadClubKey(club_id);

            console.log('debug07,result',result);

            
            if (result.status != 'success') {
                throw Error('request person error');
            }

            this.setState({
                'is_fetching_key'   : false,
                'step'              : 'fetched_key',
                'persona'           : {
                    'data'    : result.data,
                    'club_id' : club_id
                }
            })

            //开启一个获得list的方法
            this.getProofList();

        }catch(e) {
            console.log('debug07,error',e)
            this.setState({
                'is_fetching_key' : false
            })
        }

    }

    @autobind
    getProofList() {

    }


    @autobind
    toggleBindModal() {
        this.setState({
            'show_bind_modal' : !this.state.show_bind_modal
        })
        this.props.toggleDropdown();
    }

    getIpfsUrl(url) {
        if (url.indexOf('ipfs://') == 0) {
            return url.replace('ipfs://','https://cloudflare-ipfs.com/ipfs/');
        }else {
            return url;
        }
    }

    @autobind
    handleEventValueChange(key_name,event){
        var value = event.target.value;
        var new_state = {}
        new_state[key_name] = event.target.value;
        this.setState(new_state);
    }

    @autobind
    fetchList() {

        console.log('fetchList');

        this.setState({
            'is_fetching' : true
        })


        var that = this;

        httpRequest({
            'url' : '/v1/club/key',
            'data' : {
                'club_id'   : this.props.club_id
            }
        }).then(response => response.json())
        .then(data => {
            console.log('debug02,data',data)

            let tokens = data.tokens;
            tokens.map((one,i)=>{
                tokens[i]['logoURI'] = this.getIpfsUrl(one.logoURI)
            })

            that.setState({
                'is_fetching' : false,
                'tokens' : tokens
            })
        }).catch(e=>{
            that.setState({
                'is_fetching' : false
            })
        });


    }

    async addToken() {
        const {contract_address} = this.state;

        this.setState({
            'is_adding_token' : true
        })

        try {

            let erc20 = new Erc20(contract_address);

            let decimals = await erc20.getDecimals();
            let symbol = await erc20.getSymbol();
            let name = await erc20.getName();

            let token = {
                'address'  : contract_address,
                'chainId'  : 1,
                'decimals' : decimals,
                'symbol'   : symbol,
                'logoURI'  : '',
                'name'     : name
            }

            let {tokens} = this.state;

            let find = false;
            tokens.map(one=>{
                if (one.address == contract_address) {
                    find = true;
                } 
            })
            if (!find) {
                tokens.push(token);
            }

            this.setState({
                'tokens' : tokens,
                'is_adding_token' : false,
                'show_bind_modal' : false
            })

            if (this.setFieldValue ) {
                this.setFieldValue(this.props.name,token);
            }

        }catch(e) {
            console.log('e',e);
            this.setState({
                'is_adding_token' : false
            })
        }

    }

    render() {
        const {label,name,dropdown_visible,club_id} = this.props;
        const {t} = this.props.i18n;
        const { tokens,kw,show_bind_modal } = this.state;

        console.log('show_bind_modal',show_bind_modal)


        return  <div className="form-control">
            <label className="label">
              <span className="label-text">{label}</span>
            </label>
            <Field name={name}>
            {({
               field : { name, value, onChange, onBlur },
               form: { setFieldValue  }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
               meta,
            }) => {
                const select_token = value;
                this.setFieldValue = setFieldValue;

                console.log('debug-select',select_token);

                let menu = <div className="block-menu2 shadow-xl">
                    <div className='bg-white px-4 py-3 border border-gray-200'>
                        <input placeholder={t('input kw for filter')} className="h-4 w-full text-base" value={kw} onChange={this.handleEventValueChange.bind({},'kw')}/>
                    </div>
                    <ul className="overflow-y-auto max-h-64 w-full bg-white py-2 border-gray-200 border">
                        {
                            tokens.map(token_one=>{
                                if ((kw && token_one.symbol.indexOf(kw.toUpperCase()) >= 0) || !kw) {
                                    return <li key={token_one.address} >
                                        <a className="select-li" 
                                            onClick={()=>{
                                                setFieldValue(name,token_one);
                                                this.props.toggleDropdown();
                                            }}>
                                        <div className="flex justify-start items-center">
                                            {
                                                (token_one.logoURI) 
                                                ? <img src={token_one.logoURI} className="w-8 h-8 rounded-md mr-2"/>
                                                : <CurrencyDollarIcon  className="w-8 h-8 rounded-md mr-2"/>
                                            }
                                            
                                            <div>
                                                <div>{token_one.symbol}</div>
                                                <div className='text-xs text-gray-400'>{token_one.name}</div>
                                            </div>
                                        </div>
                                        </a>
                                    </li>
                                }else {
                                    return null
                                }
                            })
                        }
                        <div className='flex justify-center py-2'><a onClick={this.toggleBindModal} className='btn btn-primary text-sm'>bind twitter</a></div>
                    </ul>
                </div>
                return (
                    <div>   
                        <div>
                            <Dropdown
                                overlay={menu} visible={dropdown_visible}
                               >
                                <div onClick={this.props.toggleDropdown} className="select-box select-arrow">
                                <div className='default-holder'>
                                {
                                    (select_token)
                                    ? <span className="text-sm flex items-center">
                                        <div className="">
                                            {select_token.symbol}    
                                        </div>
                                    </span>
                                    : <span className="text-sm text-gray-400">{t('twitter')}</span>
                                }
                                </div>
                                </div>
                            </Dropdown>
                        </div>


                        {meta.touched && meta.error && (
                           <div className="input-error-msg">{meta.error}</div>
                        )}
                    </div>
                )}
            }
           </Field> 
           <BindModal visible={show_bind_modal} club_id={club_id} closeModal={this.toggleBindModal} />

           
        </div>
    }
}


function mapStateToProps(state,ownProps) {

    let club_id = ownProps.club_id;
    let key_data = state.getIn(['club','map',club_id]);

    if (key_data) {
        console.log('debug07,key_data',key_data);
    }else {
        console.log('debug07,key_data_no_exist');
    }

    let person_list = null;
    let is_fetching_proof = null;
    if (key_data && key_data.get('public_key')) {

        let public_key = key_data.get('public_key');

        let list_data_one = state.getIn(['nextid','proof_list',public_key])
        if (!list_data_one) {
            list_data_one = defaultListData
        }
    
        let person_list = null;
    
        if (list_data_one.get('result')) {
            person_list = denormalize(list_data_one.get('result'),personListSchema,state.get('entities'))
    
            // // console.log('person_list',person_list.toJS());
            // person_list.map(one=>{
            //     // console.log('person_list_one',one.toJS());
            //     if (one.get('proofs')) {
            //         one.get('proofs').map(proof_one=>{
            //             if (proof_one.get('platform') == 'twitter')
            //             // console.log('proof_one',proof_one.toJS())
            //             twitter = proof_one;
            //         })
            //     }
            // })
        }

        is_fetching_proof = list_data_one.get('is_fetching');
    }

    return {
        is_fetching_proof   : is_fetching_proof,
        person_list         : person_list
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadProofList   : (adddress) => {
            return dispatch(loadProofList(adddress))
        },
        loadClubKey : (club_id) => {
            return dispatch(loadClubKey(club_id))
        }
    }
}

module.exports = connect(mapStateToProps,mapDispatchToProps)(TwitterSelect)

