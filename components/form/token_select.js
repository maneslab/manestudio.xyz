import React from 'react';
import { Field } from 'formik';
import Dropdown from 'rc-dropdown';
import autobind from 'autobind-decorator'
// import classNames from 'classnames';
import Modal from 'components/common/modal'
import Button from 'components/common/button'

import {getConfig} from 'helper/config'
import withDropdown  from 'hocs/dropdown';
import {withTranslate} from 'hocs/index'
import Erc20 from 'helper/web3/erc20';

import {CurrencyDollarIcon} from '@heroicons/react/outline'

@withDropdown
@withTranslate
class TokenSelect extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            is_fetching : false,
            kw : '',
            tokens : [],
            'add_token_modal' : false,
            'contract_address' : '',
            'is_adding_token' : false
        }

        this.addToken = ::this.addToken
        this.setFieldValue = null
    }   

    componentDidMount() {
        this.fetchList();
    }

    componentDidUpdate(prevProps,prevState) {
        if (prevProps.dropdown_visible != this.props.dropdown_visible && !this.props.dropdown_visible) {
            this.setState({
                'kw' : ''
            })
        }
    }

    @autobind
    toggleAddTokenModal() {
        this.setState({
            'add_token_modal' : !this.state.add_token_modal
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

        let env = getConfig('USE_TOKEN_LIST');

        console.log('debug-env',env)
        var that = this;

        if (env == 'testing') {
            let tokens = getConfig('ALLOW_TOKEN_LIST');
            that.setState({
                'is_fetching' : false,
                'tokens' : tokens
            })
        }else {

            fetch('https://cloudflare-ipfs.com/ipfs/Qmd7uwrKBHTgAM3LmDv2uhwtbZsd267kuYL53QPn8cXVdm/')
            .then(response => response.json())
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
                'add_token_modal' : false
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
        const {label,name,dropdown_visible} = this.props;
        const {t} = this.props.i18n;
        const { tokens,kw,add_token_modal } = this.state;


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
                        <div className='flex justify-center py-2'><a onClick={this.toggleAddTokenModal} className='btn btn-primary text-sm'>add token</a></div>
                    </ul>
                </div>
                return (
                    <div>
                        <div>
                            <Dropdown
                                overlay={menu} visible={dropdown_visible}
                               >
                                <div onClick={this.props.toggleDropdown} className="jd-select jd-select-arrow">
                                <div className='default-holder'>
                                {
                                    (select_token)
                                    ? <span className="text-sm flex items-center">
                                        <div className="">
                                            {select_token.symbol}    
                                        </div>
                                    </span>
                                    : <span className="text-sm text-gray-400">{t('please select token')}</span>
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
           <Modal 
                title={t('add token')} 
                onClose={this.toggleAddTokenModal} 
                visible={add_token_modal}
                footer={<div className="py-2 flex justify-end jd-border-t">
                    <Button loading={this.state.is_adding_token} onClick={this.addToken} className="btn btn-primary" >{t('add token')}</Button>
                </div>}
                >
                <div>
                    <input className='input-box' placeholder={"contract address"} value={this.state.contract_address} onChange={this.handleEventValueChange.bind({},'contract_address')} />
                </div>

           </Modal>
        </div>
    }
}




module.exports = TokenSelect
