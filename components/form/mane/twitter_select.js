import React from 'react';
import { Field } from 'formik';
import Dropdown from 'rc-dropdown';
import autobind from 'autobind-decorator'

import {connect} from 'react-redux'

import withDropdown  from 'hocs/dropdown';
import {withTranslate} from 'hocs/index'
import BindModal from 'components/nextid/bind_modal';


import {loadClubKey} from 'redux/reducer/club'
import {loadClubSocialList} from 'redux/reducer/club_social'
import {denormalize} from 'normalizr'
import {clubSocialListSchema } from 'redux/schema/index'
import {defaultListData} from 'helper/common'

import TwitterIcon from 'public/img/share/twitter.svg'

import DropdownComponent from 'components/common/dropdown';

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
        this.dropdownRef = React.createRef();
        this.setFieldValue = null
    }   

    componentDidMount() {
        this.getClubKey();
        this.props.loadClubSocialList(this.props.club_id);
    }

    componentDidUpdate(prevProps,prevState) {
        if (prevProps.club_id != this.props.club_id && this.props.club_id) {
            this.props.loadClubSocialList(this.props.club_id);
        }
    }

    @autobind
    refreshList() {
        this.props.loadClubSocialList(this.props.club_id);
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

        }catch(e) {
            console.log('debug07,error',e)
            this.setState({
                'is_fetching_key' : false
            })
        }

    }

    @autobind
    toggleBindModal() {
        this.setState({
            'show_bind_modal' : !this.state.show_bind_modal
        })
        this.toggleDropdown();
    }   

    @autobind
    toggleDropdown() {
        console.log('this.dropdownRef',this.dropdownRef);
        this.dropdownRef.current.toggleDropdown();
    }



    render() {
        const {label,name,dropdown_visible,club_id,key_data,club_social_list} = this.props;
        const {t} = this.props.i18n;
        const { show_bind_modal } = this.state;


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


                let menu = <div className="block-menu2 shadow-xl">
                    <ul className="overflow-y-auto max-h-64 w-full bg-white border-gray-200 border">
                        {
                            (club_social_list)
                            ? <>{club_social_list.map(social_one=>{
                                console.log('socail_one',social_one)
                                return <li key={social_one.get('id')} >
                                    <a className="py-4 px-4 text-sm block hover:bg-gray-100 cursor-pointer" 
                                        onClick={()=>{
                                            setFieldValue(name,social_one.get('identity'));
                                            this.toggleDropdown();
                                        }}>
                                    <div className="flex justify-start items-center ">
                                        <TwitterIcon className="w-5 mr-2 text-[#1d9bf0]" /> 
                                        <div>{social_one.get('identity')}</div>
                                    </div>
                                    </a>
                                </li>

                            })}</>
                            : null

                        }
                        <div className='flex justify-center py-2 border-t border-black'><a onClick={this.toggleBindModal} className='btn btn-primary'>bind twitter</a></div>
                    </ul>
                </div>
                return (
                    <div>   
                        <DropdownComponent
                            ref={this.dropdownRef}
                            menu={menu} 
                            >
                            <div className="select-box select-arrow">
                            <div className='default-holder'>
                            {
                                (select_token)
                                ? <span className="text-sm flex items-center">
                                    <TwitterIcon className="w-5 mr-2 text-[#1d9bf0]" /> 
                                    {select_token}    
                                </span>
                                : <span className="text-sm text-gray-400">{t('twitter')}</span>
                            }
                            </div>
                            </div>
                        </DropdownComponent>
                        {meta.touched && meta.error && (
                           <div className="input-error-msg">{meta.error}</div>
                        )}
                    </div>
                )}
            }
           </Field> 
           <BindModal visible={show_bind_modal} club_id={club_id} key_data={key_data} closeModal={this.toggleBindModal} refreshList={this.refreshList} />

           
        </div>
    }
}


function mapStateToProps(state,ownProps) {

    let club_id = ownProps.club_id;
    let key_data = state.getIn(['club','key',club_id]);

    if (key_data) {
        console.log('debug07,key_data',key_data);
    }else {
        console.log('debug07,key_data_no_exist');
    }

    let club_social_list = null;
    let is_fetching_club_social  = null;


    let list_data_one = state.getIn(['club_social','list',club_id+'_twitter'])
    if (!list_data_one) {
        list_data_one = defaultListData
    }

    if (list_data_one.get('list')) {
        club_social_list = denormalize(list_data_one.get('list'),clubSocialListSchema,state.get('entities'))
    }

    is_fetching_club_social = list_data_one.get('is_fetching');

    return {
        is_fetching_club_social : is_fetching_club_social,
        club_social_list        : club_social_list,
        key_data                : key_data
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadClubSocialList   : (club_id) => {
            return dispatch(loadClubSocialList(club_id))
        },
        loadClubKey : (club_id) => {
            return dispatch(loadClubKey(club_id))
        }
    }
}

module.exports = connect(mapStateToProps,mapDispatchToProps)(TwitterSelect)

