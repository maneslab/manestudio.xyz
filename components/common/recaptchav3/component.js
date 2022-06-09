import React from 'react'
import { withGoogleReCaptcha} from 'react-google-recaptcha-v3';

import message from 'components/common/message';

class ReCaptchaComponent extends React.Component {

    constructor(props) {
        super(props);
        this.handleVerifyRecaptcha = ::this.handleVerifyRecaptcha
        this.state = {
            'is_fetching' : false
        }
    }

    async handleVerifyRecaptcha(e) {

        e.stopPropagation();

        console.time('get_recaptcha_token') 

        const { executeRecaptcha } = this.props.googleReCaptchaProps;

        console.log('executeRecaptcha',executeRecaptcha);

        if (!executeRecaptcha) {
            message.error('waiting for recaptcha loading');
            return;
        }

        if (!this.props.action_name) {
            message.error('action_name cannot be empty');
            return;
        }

        let loading = false;
        if (this.props.show_loading == true) {
            loading = message.loading('loading');
        }

        this.setState({
            'is_fetching' : true
        })

        const token = await executeRecaptcha(this.props.action_name);

        if (loading) {
            loading();
        }

        console.timeEnd('get_recaptcha_token') 

        this.setState({
            'is_fetching' : false
        })

        this.props.handleFinish(token);
    }

    render() {
        const {is_fetching} = this.state;
        const {loading} = this.props;

        if (is_fetching && loading) {
            return loading;
        }

        return (
            <div className="block-recaptcha" onClick={this.handleVerifyRecaptcha}>
                {this.props.children}
            </div>
        );
    }
}


export default withGoogleReCaptcha(ReCaptchaComponent);
