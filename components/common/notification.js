import Notification from 'rc-notification';
import {XIcon} from '@heroicons/react/solid';
import {CheckCircleIcon,XCircleIcon,ExclamationCircleIcon} from '@heroicons/react/outline';
import LoadingIcon from '/public/img/common/loading.svg'

let notification = null;
if (typeof window !== 'undefined') {
    Notification.newInstance({
        maxCount : 8,
        style : {'top':'60px','right':'10px'},
        className: "block-right-notification",
    }, n => {
        notification = n
    });
}


const successNotification = (config) => {
    config['icon'] = <CheckCircleIcon className="text-green-400 icon-base"/>;
    let cfg = mergeConfig(config);
    notification_open(cfg);
}

const errorNotification = (config) => {
    config['icon'] = <XCircleIcon className="text-red-400 icon-base"/>;
    let cfg = mergeConfig(config);
    notification_open(cfg);
}

const infoNotification = (config) => {
    config['icon'] = <ExclamationCircleIcon className="text-yellow-400 icon-base"/>;
    let cfg = mergeConfig(config);
    notification_open(cfg);
}


function loadingNotification(msg) {
    const key = Date.now();
    let icon =  <svg class="animate-spin icon-base text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>;
    notification.notice({
      duration: null,
      key : key,
      content: <div className="block-notification">
        <div className="mr-4">{icon}</div>
        <div className="font-ubuntu flex-grow">
            <h2 className="font-bold text-base capitalize">{msg.message}</h2>
            <p className="text-gray-500">{msg.description}</p>
        </div>
    </div>,
      onClose() {
        // console.log('loading close');
      },
    });
    return () => {
      notification.removeNotice(key)
    }
}

const removeNotification = (key) => {
    // console.log('removeNotification',key)
    notification.removeNotice(key);
}

const mergeConfig = (config) => {
    let cfg = {
        'closeIcon' : <XIcon className="icon-24"/>,
        'content'   : <div className="block-notification">
            <div className="mr-4">{config.icon}</div>
            <div className="font-ubuntu flex-grow">
                <h2 className="font-bold text-base capitalize">{config.message}</h2>
                <p className="text-gray-500">{config.description}</p>
            </div>
        </div>,
        'duration' : ('duration' in config) ? config.duration : 5,
        'style' : { top: '100', right:'10px'}
    }
    console.log('merged',cfg);
    return cfg
}

const notification_open = (config) => {
    notification.notice(config);
}


module.exports = {
    'success' : successNotification,
    'info'    : infoNotification,
    'error'   : errorNotification,
    'remove'  : removeNotification,
    'loading' : loadingNotification
}