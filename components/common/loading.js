import React from 'react'
// import classNames from 'classnames';
// import {RaceBy} from 'components/loading/index'
export default class Loading extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div className='flex justify-center'>
          <div className="loading-container">
          </div>
          </div>
        );
    }
}
