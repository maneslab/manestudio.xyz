import React, { Component } from 'react'

export default function withLabel(WrappedComponent) {

    return class extends Component {

        constructor(props) {
            super(props)
        }

        render() {
            const {label} = this.props;

            console.log('this.props.children',this.props.children)

            if (label) {
                return <div className="form-control">
                    {
                        (label)
                        ?   <label className="label">
                            <span className="label-text">{label}</span>
                        </label> 
                        : null
                    }
                    <WrappedComponent {...this.props} />
                </div>
            }else {
                return <WrappedComponent {...this.props} />
            }
        }

    }

}

