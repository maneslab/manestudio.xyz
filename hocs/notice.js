import React, { Component } from 'react'

export default function withNotice(WrappedComponent) {

    return class extends Component {

        constructor(props) {
            super(props)
            this.state = {
                notice : {},
                default_notice : {}
            }
            this.setNotice = ::this.setNotice
            this.getNotice = ::this.getNotice
            this.setDefaultNotice = ::this.setDefaultNotice

        }

        setDefaultNotice(key,value) {
            const {default_notice} = this.state;
            default_notice[key] = value;
            this.setState({
                'default_notice' : default_notice
            })
        }
        
        setNotice(key,value) {
            console.log('debug:setNotice',key,value);
            const {notice} = this.state;
            notice[key] = value;
            this.setState({
                'notice' : notice
            })
        }

        getNotice(key) {
            const {notice,default_notice} = this.state;
            if (notice[key]) {
                return notice[key];
            }else if (default_notice[key]) {
                return default_notice[key];
            }else {
                return null
            }
        }

        render() {
            return <WrappedComponent 
                    notice={this.state.notice} 
                    setDefaultNotice={this.setDefaultNotice}
                    setNotice={this.setNotice}
                    getNotice={this.getNotice}
                    {...this.props}/>
        }

    }

}

