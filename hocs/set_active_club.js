import React, { Component } from 'react'
import { connect } from 'react-redux'
import {setActiveClub} from 'redux/reducer/setting'


export default function withSetActiveClub(WrappedComponent) {

    class WithSetActiveClubComponent extends Component {

        constructor(props) {
            super(props)
        }

        componentDidMount() {
            if (!this.props.club_id) {
                console.log('准备设置active_club_id时候发现是空')
                return;
            }
            this.props.setActiveClub(this.props.club_id)
        }
    
        componentDidUpdate(prevProps) {
            if (this.props.club_id != prevProps.club_id) {
                if (!this.props.club_id) {
                    console.log('准备设置active_club_id时候发现是空')
                    return;
                }
                this.props.setActiveClub(this.props.club_id);
            }
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    }

    const mapDispatchToProps = (dispatch) => {
        return {
            setActiveClub : (id) => {
                return dispatch(setActiveClub(id))
            }
        }
    }
    function mapStateToProps(state,ownProps) {
        return {}
    }
   
   return connect(mapStateToProps,mapDispatchToProps)(WithSetActiveClubComponent)

}

