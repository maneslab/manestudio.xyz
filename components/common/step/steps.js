import React from 'react'

export default function Steps({children,active,...props}) {
    // console.log('children',children);
    let i = 1;
    let children_formated = children.map( (o, i)=>{
        i += 1;
        return React.cloneElement(o, { step : i, isActive:(i == active),isDone:(i<active)})
    });
    return (
    <div className='block-steps'>
        {
            children_formated
        }
    </div>
  )
}
