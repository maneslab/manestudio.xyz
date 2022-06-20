import React from 'react';
import Link from 'next/link'

import { connect } from "react-redux";
import autobind from 'autobind-decorator'
import { denormalize } from 'normalizr';

import Loading from 'components/common/loading'
import Empty from 'components/common/empty'
import Pager from 'components/common/pager'
import ClubOne  from 'components/club/one'

import {removeValueEmpty} from 'helper/common'

import {withPageList} from 'hocs/index'

import {loadClubList} from 'redux/reducer/club'
import {clubListSchema} from 'redux/schema/index'
import {withTranslate} from 'hocs/index'
import {UserGroupIcon} from '@heroicons/react/outline'

import {defaultListData} from 'helper/common'


@withTranslate
class MyClubList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            show_modal_id : null,
            show_modal    : 'close',
        }
        this.wapperRef = React.createRef();
    }

    @autobind
    showModal(one) {
        this.setState({
            'show_Club'     : one,
            'show_modal'    : 'open'
        })
    }

    @autobind
    hideModal(i) {

        this.setState({
            'show_modal' : 'before_close',
        });

        setTimeout(()=>{
            this.setState({
                'show_Club'     : null,
                'show_modal'    : 'close'
            })
        },600);
    }

  

    render() {

        let {list_data_one,list_rows,grid_span} = this.props;
        let {show_create_modal} = this.state;
        const {t} = this.props.i18n;


        let count = list_data_one.get('total');
        let is_empty = (list_data_one.get('is_fetched') && list_rows.count() == 0)

        console.log('debug03,is_empty',is_empty);
        console.log('debug03,list_data_one',list_data_one.toJS());

        return <div>
            {
                (list_data_one.get('is_fetching'))
                ? <div className="my-16"><Loading /></div>
                : null
            }

            {
                (is_empty)
                ? <div className='py-12 shadow-lg bg-white my-12 text-center'>
                    <Empty text={t('I have not created any project yet')} icon={<UserGroupIcon className='icon-base'/>}/>
                    <button className={"btn btn-primary"} onClick={this.toggleCreateModal}>{t('create project')}</button>
                </div>
                : <div className={""}>

                    {
                        (list_data_one.get('is_fetched'))
                        ? <>
                            {
                                list_rows.map((one)=>{
                                    return <ClubOne club={one} key={one.get('id')} />
                                })
                            }
                        </>
                        : null
                    }
                </div>
            }
            
            <div>
            </div>
        </div>;

    }



    
}

function mapStateToProps(state,ownProps) {
    
    let login_user_id = state.getIn(['setting','login_user']);
    let list_data_one = state.getIn(['club','my_list',login_user_id]) ? state.getIn(['club','my_list',login_user_id]) : defaultListData
    let list_rows = denormalize(list_data_one.get('list'),clubListSchema,state.get('entities'));

    return {
        entities        : state.getIn(['entities']),
        login_user_id   : login_user_id,
        list_rows   : list_rows,
        list_data_one : list_data_one
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadList   : (cond) => {
            return dispatch(loadClubList(cond))
        },
    }
}
const formatData = (props) => {
    console.log('debug03props',props);
    let result = removeValueEmpty({
        is_mine         : 1,
        order_by        : props.order_by,
        login_user_id   : props.login_user_id
    })
    return result;
}

module.exports = connect(mapStateToProps,mapDispatchToProps,null, {forwardRef: true})(withPageList(MyClubList,{'formatData':formatData}))

