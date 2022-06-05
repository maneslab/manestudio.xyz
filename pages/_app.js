import {wrapper} from '../redux/store';
import App from "next/app";
import autobind from 'autobind-decorator'

// import * as gtag from 'helper/gtag'
import Router from 'next/router'
import {getConfig} from 'helper/config'

//rainbowkit开始
import '@rainbow-me/rainbowkit/styles.css';

import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import { chain, createClient, WagmiProvider } from 'wagmi';
import merge from 'lodash.merge';

const env = getConfig('ENV')

let allow_nets = [];
if (env == 'production') {
    allow_nets = [chain.polygonMumbai]
}else {
    allow_nets = [chain.kovan]

}

const { chains, provider } = configureChains(
    allow_nets,
    [
      apiProvider.alchemy(process.env.ALCHEMY_ID),
      apiProvider.fallback()
    ]
);
  
const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    chains
});
  
const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
})

const myTheme = merge(darkTheme(), {
    colors: {
        accentColor: '#333',
        connectButtonBackground : '#fff',
        connectButtonInnerBackground :'#333',
        actionButtonSecondaryBackground  : 'black',
        connectButtonText : '#3b82f6'
    },
    shadows : {
        connectButton : '0px 2px 2px rgba(0, 0, 0, 0.1)'
    }
  });


  
//rainbowkit结束

require("styles/globals.css");

// Router.events.on('routeChangeComplete', url => gtag.pageview(url))

class MyApp extends App {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        Router.events.on('routeChangeStart', this.routerChangeStart)
        Router.events.on('routeChangeComplete', this.routerChangeComplete)
    }

    componentWillUnmount(){
        Router.events.off("routeChangeStart",this.routerChangeStart);
        Router.events.off("routeChangeComplete",this.routerChangeComplete);
    }

    @autobind
    routerChangeStart() {
        console.log('debug-router-start');
        this.setPageLoading(true);
        // this.props.setSlider(false);
    }

    @autobind
    routerChangeComplete(url) {
        console.log('debug-router-end',url);
        // gtag.pageview(url);
        this.setPageLoading(false);
    }

    @autobind
    setPageLoading(is_loading) {
        this.setState({
            'show_page_loading' : is_loading
        })
    }

    render() {
        const {Component, pageProps} = this.props;

        const isServer = (typeof window === 'undefined');

        return <WagmiProvider client={wagmiClient}>
            <RainbowKitProvider chains={chains} theme={myTheme}>
                <Component {...pageProps} />
                {
                    (this.state.show_page_loading)
                    ? <div className="m-loading-bar active"></div>
                    : <div className="m-loading-bar"></div>
                }
            </RainbowKitProvider>
        </WagmiProvider>
        
    }
}

MyApp.getInitialProps = async (appContext) => {

    // console.log('appContext',appContext)
    const {req} = appContext;

    // calls page's `getInitialProps` and fills `appProps.pageProps`
    const appProps = await App.getInitialProps(appContext);

    ///关于中国地区的关停
    if (getConfig('FORBIDDEN_CHINA')) {
        if (req && req.headers['cf-ipcountry'] == 'CN') {
            appProps['errorCode'] = 403;
            appProps['errorMessage'] = '由于你所在的地区限制，禁止访问';
        }
    }

    // console.log('unlogin',getConfig('FORBIDDEN_UNLOGIN'));
    // if (getConfig('FORBIDDEN_UNLOGIN')) {
    //     if (!isUnloginAllowedPage(appContext.router.route)) {
    //         appProps['errorCode'] = 401;
    //     }
    // }

    return {
        ...appProps
    }
};

export default wrapper.withRedux(MyApp)
