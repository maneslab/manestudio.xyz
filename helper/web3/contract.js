import notification from 'components/common/notification'
import message from 'components/common/message'

export default class Contract {

    constructor(t = null) {
        if (t == null) {
            this.t = () => {}
        }else {
            this.t = t;
        }
    }


    async request(extra_cond = {}) {

        const {t} = this;

        let base_cond = {
            'func'  : {
                'send_tx' : async () => {},
                'before_send_tx' : () => {},
                'finish_tx' : () => {},
                'after_finish_tx' : () => {}
            },
            'text'  : {
                'loading' : 'loading',
                'sent'    : 'tx send',
                'success' : 'tx successful',
            }
        }

        let merge_cond = {
            ...base_cond,
            ...extra_cond
        }

        let tx;
        let clear_create_msg;
        let clear_loading_create_notification;
        try {

            clear_create_msg = message.loading(merge_cond['text']['loading']);

            tx = await merge_cond['func']['send_tx']();

            console.log('debug:send_tx',merge_cond['func']['send_tx'])
            console.log('debug:tx',tx)

            clear_create_msg();

            clear_loading_create_notification = notification.loading({
                'message' : merge_cond['text']['sent'],
                'description' : t('waiting for the transaction to be executed'),
            })

            merge_cond['func']['before_send_tx']();
            
            await tx.wait();

            clear_loading_create_notification();

            merge_cond['func']['finish_tx']();

            notification.success({
                'key' : tx.hash,
                'message' : 'tx success',
                'description' : merge_cond['text']['success'],
                'duration' : 5
            })

            merge_cond['func']['after_finish_tx'](tx);

        }catch(e) {

            console.log(Object.keys(e));
            Object.keys(e).forEach(k=>{
                console.log(k+":"+e[k]+ `${
                    (typeof(e[k]) == 'object' && Object.keys(e[k])) || ''
                }`)
            })
            console.error("ERROR: ", e.message);

            notification.error({
                message: t('tx failed'),
                description : e.message,
            })

            if (clear_loading_create_notification) {
                clear_loading_create_notification();
            }

            if (clear_create_msg) {
                clear_create_msg();
            }
        }
    }
}