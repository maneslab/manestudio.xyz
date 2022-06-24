import React from 'react';
import Loading from 'components/common/loading'

class GenerateImage2 extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {

        const {trait_list,id,index} = this.props;

        if (this.props.handlePreview){
            return <div className='relative aspect-square cursor-pointer' onClick={this.props.handlePreview.bind({},id,index)}>
                {trait_list.map(one=>{
                    return <img src={one.getIn(['img','image_urls','url'])} className="absolute left-0 top-0"/>
                })}
            </div>
            
        }else {
            return <div className='relative aspect-square'>
                {trait_list.map(one=>{
                    return <img src={one.getIn(['img','image_urls','url'])} className="absolute left-0 top-0"/>
                })}
                {
                    (this.props.is_fetching)
                    ? <>
                        <div className='bg-white opacity-75 absolute left-0 top-0 w-full h-full'>
                        </div>
                        <div className='absolute inset-y-1/2 w-full justify-center'>
                            <Loading />
                        </div>
                    </>
                    : null
                }
            </div>
        }

        
    }
    
}

module.exports = GenerateImage2

