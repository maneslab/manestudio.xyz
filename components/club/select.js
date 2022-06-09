import React from 'react';
import Dropdown from 'rc-dropdown';
import { connect } from "react-redux";

import classNames from 'classnames';
import Link from 'next/link'
import { denormalize } from 'normalizr';
import { userSchema,clubListSchema } from 'redux/schema/index'
import {loadClubList} from 'redux/reducer/club'
import {withPageList,withDropdown} from 'hocs/index'
import {removeValueEmpty,getAvatarUrl} from 'helper/common'

import { PlusCircleIcon } from '@heroicons/react/solid';
import {UserGroupIcon} from '@heroicons/react/outline'
import { withTranslate } from 'hocs/index';
import { withRouter } from 'next/router';
import autobind from 'autobind-decorator';

import Loading from 'components/common/loading'
import {defaultListData} from 'helper/common'

@withTranslate
@withDropdown
@withRouter
class ClubSelect extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }   
    
    @autobind
    changeClub(club_id) {
        this.props.toggleDropdown();
        this.props.router.push('/club/'+club_id)
    }

    render() {

        const {list_data,entities,active_club,dropdown_visible,login_user,login_user_id} = this.props;
        const {t} = this.props.i18n;


        let list_data_one =  list_data ? list_data : defaultListData
        let list_rows = denormalize(list_data_one.get('list'),clubListSchema,entities)

        let is_empty = (list_rows.count() == 0)
        let is_fetching = list_data_one.get('is_fetching');
    


        let menu = <div className="block-menu border border-gray-300 shadow-xl w-72">
            <ul className="overflow-y-auto w-full bg-white py-2">
                {
                    list_rows.map((one)=>{
                        return <li key={one.get('id')} >
                            <a className="select-li" onClick={this.changeClub.bind({},one.get('id'))}>
                            <span className="icon">
                                <img src={getAvatarUrl(one)} className="icon-sm rounded-full"/>
                            </span>
                            <span className='name'>
                            {
                                one.get('name')
                            }
                            </span>
                            </a>
                        </li>
                    })
                }
                {
                    (is_fetching) 
                    ? <div className='py-4'><Loading /></div>
                    : null
                }
                {
                    (is_empty)
                    ? <div className='text-sm px-8 py-8 text-center text-gray-600'>
                    <div className='flex justify-center text-gray-400 mb-4'><UserGroupIcon className='icon-base'/></div>
                    <div>{t('creating a community is the first step to riches')}</div>
                    </div>
                    : null
                }
                <li className='border-t border-gray-200 my-2' key="divider" ></li>
                <li key="add" >
                    <Link href="/club/add">
                    <a className="select-li">
                        <span className='icon'><PlusCircleIcon className='icon-sm'/></span>
                        <span className='name capitalize'>
                        {t('add club')}
                        </span>
                    </a>
                    </Link>
                </li>
            </ul>
        </div>
           
        return  <div className='flex items-center'>
            <Dropdown
                overlay={menu} visible={dropdown_visible}
                >
                <div className='flex justify-center items-center cursor-pointer' onClick={this.props.toggleDropdown}>
                    
                    {
                        (active_club)
                        ? <a className={classNames('btn-with-arrow jd-select-arrow mr-4',{"press-down":dropdown_visible})}>
                            <img src={getAvatarUrl(active_club)} className="icon-sm rounded-full mr-2"/>
                            {active_club.get('name')}
                        </a>
                        : <a className={classNames('btn-with-arrow jd-select-arrow mr-4 capitalize',{"press-down":dropdown_visible})}>
                            {t('select club')}
                        </a>
                    }
                </div>
            </Dropdown>
            {
                (dropdown_visible)
                ? <div className='mask-bg' onClick={this.props.toggleDropdown}></div>
                : null
            }
        </div>


    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        loadList : (data) => {
           return dispatch(loadClubList(data))
        }
    }
}
function mapStateToProps(state,ownProps) {

   let entities = state.get('entities');
   ///注册成功

   let login_user_id = state.getIn(['setting','login_user']);
   let login_user = null;
   if (login_user_id) {
       login_user = denormalize(login_user_id,userSchema,entities)
   }


   return {
       'login_user'     : login_user,
       'login_user_id'  : login_user_id,
       'entities'       : entities,
       'list_data'      : state.getIn(['club','my_list',login_user_id]),
    }
}

const formatData = (props) => {
    let result = removeValueEmpty({
        is_mine         : 1,
        login_user_id   : props.login_user_id
    })
    return result;
}

module.exports = connect(mapStateToProps,mapDispatchToProps)(withPageList(ClubSelect,{'formatData':formatData}))

