import React from 'react'
import {
  GoogleReCaptchaProvider
} from 'react-google-recaptcha-v3';


import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()


class Recaptcha extends React.Component {
    
    constructor(props) {
        super(props);
        this.componentRef = React.createRef();
    }

    render() {
        return <GoogleReCaptchaProvider 
                useRecaptchaNet={true}
                useEnterprise={true}
                scriptProps={{
                  appendTo: "body", // optional, default to "head", can be "head" or "body",
                }}
                reCaptchaKey={publicRuntimeConfig['env']['RECAPTCHA_KEY']}>
            {this.props.children}
        </GoogleReCaptchaProvider>
    }
}


export default Recaptcha;
