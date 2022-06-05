import Telegram from "public/img/social/default/telegram.svg";
import Tiktok from "public/img/social/default/tiktok.svg";
import Instagram from "public/img/social/default/instagram.svg";
import Youtube from "public/img/social/default/youtube.svg";
import Github from "public/img/social/default/github.svg";
import Linkedin from "public/img/social/default/linkedin.svg";
import Twitter from 'public/img/social/default/twitter.svg';
import Wechat from 'public/img/social/default/wechat.svg';
import Whatsapp from 'public/img/social/default/whatsapp.svg';
import Opensea from 'public/img/social/default/opensea.svg';
import Bitcoin from 'public/img/social/default/bitcoin.svg';
import Eth from 'public/img/social/default/eth.svg';

import {GlobeAltIcon,MailIcon} from '@heroicons/react/outline'

import * as Yup from 'yup';

const getSocialMediaIcon = (name,classname = "icon-xs") => {
    var icon;
    switch(name) {
        case 'instagram':
            icon = <Instagram className={classname} />
            break;
        case 'tiktok':
            icon = <Tiktok className={classname} />
            break;
        case 'telegram':
            icon = <Telegram className={classname} />
            break;
        case 'youtube':
            icon = <Youtube className={classname} />
            break;
        case 'github':
            icon = <Github className={classname} />
            break;
        case 'twitter':
            icon = <Twitter className={classname}/>
            break;
        case 'linkedin':
            icon = <Linkedin className={classname} />
            break;
        case 'wechat':
            icon = <Wechat className={classname}/>
            break;
        case 'whatsapp':
            icon = <Whatsapp className={classname}/>
            break;
        case 'email':
            icon = <MailIcon className={classname}/>
            break;
        case 'opensea':
            icon = <Opensea className={classname} />
            break;
        case 'bitcoin':
            icon = <Bitcoin className={classname} />
            break;
        case 'eth':
            icon = <Eth className={classname} />
            break;
        default:
            icon = <GlobeAltIcon className={classname} />
            break;
    }
    return icon;
}

const getDefaultPlatforms = () => {
    return {
        'opensea' : {
            'placeholder' : 'https://opensea.com',
        },
        'twitter' : {
            'placeholder' : '@twitter_user_name',
        },
        'instagram' : {
            'placeholder' : '@instagram_user_name',
        },
        'tiktok' : {
            'placeholder' : '@tiktok_user_name',
        },
        'wechat' : {
            'placeholder' : '@wechat_user_name',
        },
        'github' : {
            'placeholder' : 'https://github.com/',
        },
        'telegram' : {
            'placeholder' : 'https://t.me/',
        },
        'linkedin' : {
            'placeholder' : 'https://linkedin.com/in/username',
        },
        'whatsapp' : {
            'placeholder' : '+000000000000',
        },
        'youtube' : {
            'placeholder' : 'https://youtube.com/channel/youtube_channel_url',
        },
        'website' : {
            'placeholder' : 'https://website.com',
        },
        'email' : {
            'placeholder' : 'email address',
        },
        'bitcoin' : {
            'placeholder' : 'bitcoin address',
        },
        'eth' : {
            'placeholder' : 'eth address',
        }
    }
}

const getValidate = (platform) => {
    let linkFormSchema;
    switch(platform) {
        case 'twitter':
        case 'tiktok':
        case 'instagram':
        case 'wechat':
        case 'whatsapp':
        case 'bitcoin':
        case 'eth':
            linkFormSchema = Yup.object().shape({
                platform    : Yup.string().required(),
                account     : Yup.string().required(),
            });
            break;
        case 'email':
            linkFormSchema = Yup.object().shape({
                platform    : Yup.string().required(),
                account     : Yup.string().email().max(255).required(),
            });
            break;
        default:
            linkFormSchema = Yup.object().shape({
                platform    : Yup.string().required(),
                account     : Yup.string().matches(
                    /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                    'Enter correct url!'
                ).required('Please enter url'),
            })
            break;
    }
    return linkFormSchema;
}

const getShowData = (link) => {
    let account;
    let url;
    switch(link.get('platform')) {
        case 'twitter':
        case 'tiktok':
        case 'instagram':
        case 'wechat':
        case 'whatsapp':
            account = link.get('account');
            if (account.indexOf('@') == 0) {
                account = account.substr(1);
            }
            break;
        case 'bitcoin':
        case 'eth':
            account = link.get('account');

            break;
        case 'email':
            url = 'mailto:'+link.get('account');
            break;
        default:
            url = link.get('url');
    }

    switch(link.get('platform')) {
        case 'twitter':
            url = 'https://twitter.com/'+account;
            break;
        case 'instagram':
            url = 'https://instagram.com/'+account+'/';
            break;
        case 'bitcoin':
            url = 'https://www.blockchain.com/btc/address/'+account;
            break;
        case 'eth':
            url = 'https://www.etherscan.io/address/'+account;
            break;

        default:
            break;

    }

    if (url) {
        return {
            'type' : 'url',
            'url'  : url
        }
    }else{
        return {
            'type' : 'modal',
            'account'  : account
        }
    }
}
const getValueKey = (platform) => {
    let value_key;
    switch(platform) {
        case 'twitter':
        case 'tiktok':
        case 'instagram':
        case 'wechat':
        case 'whatsapp':
        case 'bitcoin':
        case 'eth':
            value_key='account'
            break;
        case 'email':
            value_key='account'
            break;
        default:
            value_key='url'
            break;
    }
    return value_key;
}
module.exports = {
    getSocialMediaIcon  : getSocialMediaIcon,
    getDefaultPlatforms : getDefaultPlatforms,
    getValidate : getValidate,
    getValueKey : getValueKey,
    getShowData : getShowData
}