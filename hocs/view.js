import React, { Component } from 'react'

export default function withPageView(WrappedComponent) {

    return class extends Component {

        constructor(props) {
            super(props)
            this.state = {}
            this.refresh = ::this.refresh
            this.load = ::this.load
        }

        componentDidMount() {
            this.load(this.props.id)
        }

        load(id) {
            if (typeof this.props.load !== 'function') {
                console.error('使用withPageView时候发现load方法不正确,得到的是:',typeof this.props.load)
            }
            if (!id) {
                console.error('使用withPageView时候发现id为空:',id)
            }
            // console.log('dd,this.props.load',this.props.load)
            this.props.load(id);
        }

        componentWillUpdate(nextProps,nextState) {
            if (nextProps.id != this.props.id) {
                this.load(nextProps.id)
            }
        }
        
        refresh() {
            this.load(this.props.id);
        }
        
        render() {
          return <WrappedComponent refresh={this.refresh} {...this.props} />;
        }

    }

}

