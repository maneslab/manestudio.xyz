import React from 'react';

class GenerateImage2 extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {

        const {trait_list} = this.props;

        // console.log('trait_list',trait_list)

        return <div className='relative aspect-square mt-4'>
            {trait_list.map(one=>{
                return <img src={one.getIn(['img','image_urls','url'])} className="absolute left-0 top-0"/>
            })}
        </div>
    }
    
}

module.exports = GenerateImage2

