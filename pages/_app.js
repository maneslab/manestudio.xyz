import {wrapper} from 'redux/store';
import App from "next/app";
import autobind from 'autobind-decorator'

// import * as gtag from 'helper/gtag'
import Router from 'next/router'
import config from 'helper/config'
import {getTheme,setThemeInCss} from 'helper/local'

import MobileWggIcon from 'public/img/icons/mobile_wgg.svg'

//rainbowkit开始
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
  Theme
} from '@rainbow-me/rainbowkit';

import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { isMobile } from 'react-device-detect';
import DiscordIcon from 'public/img/icons/discord.svg'
import TwitterIcon from 'public/img/icons/twitter.svg'
import NewwindowIcon from 'public/img/icons/newwindow.svg'
//rainbowkit导入结束

const { chains, provider } = configureChains(
    [chain.mainnet,  chain.goerli ],
    [
        alchemyProvider({ alchemyId: config.get('ALCHEMY_ID') }),
        publicProvider()
    ]
);

const { connectors } = getDefaultWallets({
    appName: 'ManeSTUDIO',
    chains
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
})

import merge from 'lodash.merge';

const myLightTheme = merge(lightTheme(),{
    colors: {
    },
    shadows : {
        connectButton : 'none'
    },
    radii : {
        actionButton: 'none',
        connectButton: 'none',
        menuButton: 'none',
        modal: 'none',
        modalMobile: 'none',
    }
});
const myDarkTheme = merge(darkTheme(),{
    colors: {
    },
    shadows : {
        connectButton : 'none'
    },
    radii : {
        actionButton: 'none',
        connectButton: 'none',
        menuButton: 'none',
        modal: 'none',
        modalMobile: 'none',
    }
});


  
//rainbowkit结束

require("styles/globals.css");

// Router.events.on('routeChangeComplete', url => gtag.pageview(url))

class MyApp extends App {

    constructor(props) {
        super(props)
        this.state = {
            theme : 'default',
            is_mobile : false
        }
    }

    componentDidMount() {
        Router.events.on('routeChangeStart', this.routerChangeStart)
        Router.events.on('routeChangeComplete', this.routerChangeComplete)

        let theme = getTheme();
        setThemeInCss(theme);
        this.setState({
            'theme' :theme,
            'is_mobile' : isMobile 
        })
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
        const {theme,is_mobile} = this.state;
        // const isServer = (typeof window === 'undefined');

        if (is_mobile) {
            return <div className='bg-[#2e2c9b] h-screen flex justify-between flex-col'>
                <div className='py-24'>
                    <MobileWggIcon className="w-6/12 mx-auto"/>
                </div>
                <div className='mb-24 text-white flex justify-center items-center space-x-2'>
				    <a href="https://twitter.com/manestudioxyz" target="_blank" className="hover:text-gray-400"><TwitterIcon className="icon-xs"/></a>
				    <a href="https://discord.gg/EnCUugtfVn" target="_blank" className="hover:text-gray-400"><DiscordIcon className="icon-xs"/></a>
				    <a href="https://docs.manestudio.xyz" target="_blank" className="hover:text-gray-400 capitalize flex justify-start items-center">{'Doc'}<NewwindowIcon className="icon-xs ml-1"/></a>
                </div>
            </div>
        }

        return <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains} theme={(theme=='dark')?myDarkTheme:myLightTheme}>
                <Component {...pageProps} />
                {
                    (this.state.show_page_loading)
                    ? <div className="m-loading-bar active"></div>
                    : <div className="m-loading-bar"></div>
                }
            </RainbowKitProvider>
        </WagmiConfig>
        
    }
}

MyApp.getInitialProps = async (appContext) => {

    const {req} = appContext;

    const appProps = await App.getInitialProps(appContext);

    ///关于中国地区的关停
    if (config.get('FORBIDDEN_CHINA')) {
        if (req && req.headers['cf-ipcountry'] == 'CN') {
            appProps['errorCode'] = 403;
            appProps['errorMessage'] = '由于你所在的地区限制，禁止访问';
        }
    }


    return {
        ...appProps
    }
};

export default wrapper.withRedux(MyApp)
