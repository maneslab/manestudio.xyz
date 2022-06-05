import React from 'react';
import { withRouter } from 'next/router'
import Image from 'next/image'
import classNames from 'classnames';

class Tab extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(path) {
        this.props.router.push(path)
    } 

    render() {

        const {router} = this.props;

        // console.log('router',router)

        return <div className="block-mobile-tab">
            <a className={classNames("tab-btn",{"active":(router.route == '/')})} onClick={this.handleClick.bind({},'/')} >
                <div className="icon"><Image src={'/img/tab/home.svg'} width={20} height={20} /></div>
                <div className="text">HOME</div>
            </a>
            <a className={classNames("tab-btn",{"active":(router.route == '/share')})} onClick={this.handleClick.bind({},'/share')} >
                <div className="icon"><Image src={'/img/tab/share.svg'} width={20} height={20} /></div>
                <div className="text">SHARE</div>
            </a>
            <a className={classNames("tab-btn",{"active":(router.route == '/mine')})} onClick={this.handleClick.bind({},'/mine')} >
                <div className="icon"><Image src={'/img/tab/mine.svg'} width={20} height={20} /></div>
                <div className="text">MY</div>
            </a>
        </div>

    }
}

module.exports = withRouter(Tab)
