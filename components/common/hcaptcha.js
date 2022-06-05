import React,{useRef} from 'react'
import {getConfig} from 'helper/config'
import HCaptcha from '@hcaptcha/react-hcaptcha';

export default function HcaptchaWapper({handleVerificationSuccess}) {

    const sitekey  = getConfig('HCAPTCHA_SITE_KEY')

    console.log('debug:sitekey',sitekey);

    const captchaRef = useRef(null);

    const onLoad = () => {
      // this reaches out to the hCaptcha JS API and runs the
      // execute function on it. you can use other functions as
      // documented here:
      // https://docs.hcaptcha.com/configuration#jsapi
      captchaRef.current.execute();
    };

    return <HCaptcha
          sitekey={sitekey}
          onVerify={(token,ekey) => this.props.handleVerificationSuccess(token, ekey)}
          ref={captchaRef}
        />

}


