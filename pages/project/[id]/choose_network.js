import React from 'react';

import {wrapper} from 'redux/store';
import Head from 'next/head'
import autobind from 'autobind-decorator'
import {connect} from 'react-redux'
import Link from 'next/link'
import Loading from 'components/common/loading'

import PageWrapper from 'components/pagewrapper'
import ClubHeader from 'components/club/header'
import ContractStep from 'components/contract/step'
import SwitchChainButton from 'components/wallet/switch_chain';

import withMustLogin from 'hocs/mustlogin';
import withTranslate from 'hocs/translate';

import {updateClub} from 'redux/reducer/club'
import config from 'helper/config'
import manenft from 'helper/web3/manenft';
import withClubView from 'hocs/clubview'
// import message from 'components/common/message'
// import { httpRequest } from 'helper/http';

// import {ChevronRightIcon} from '@heroicons/react/outline'
import manestudio from 'helper/web3/manestudio'
import {hex2Number} from 'helper/number'
// import { t } from 'helper/translate';

import useTranslation from 'next-translate/useTranslation'

@withTranslate
@withMustLogin
@withClubView
class ChooseNetwork extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'kovan' : {
                'is_fetching'       : false,
                'is_fetched'        : false,
                'contract_address'  : null
            },
            'homestead' : {
                'is_fetching'       : false,
                'is_fetched'        : false,
                'contract_address'  : null
            }
        }
    }

    componentDidMount() {
        if (this.props.chain.network) {
            this.fetchContractAddress(this.props.club_id,this.props.chain.network);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.chain.network != prevProps.chain.network) {
            this.fetchContractAddress(this.props.club_id,this.props.chain.network);
        }
    } 

    @autobind
    async fetchContractAddress(club_id,network) {
        
        const {t} = this.props.i18n;
        let state = this.state[network];

        let contract_list = config.get('MANE_CONTRACT');
        if (!contract_list[network]) {
            console.error('准备调用ManeStudio的父合约不存在,network:',network);  
            return;
        }

        let mane = new manestudio(t,network);

        ///获得对应的合约地址
        state['is_fetching'] = true;
        this.setState(state);

        ///
        let addr = '0x0';
        try {
            addr = await mane.contract.clubMap(club_id);
        }catch(e) {
            console.log('debug-e',e)
        }

        ///判断合约是否被销毁
        if (addr) {
            let manenftInstance = new manenft(t,network,addr);
            let is_destoryed = await manenftInstance.isDeployed();
            if (is_destoryed) {
                addr = '0x0';
            }
     
        }

        state['is_fetching'] = false;
        state['is_fetched'] = true;
        if (hex2Number(addr) != 0) {
            state['contract_address'] = addr;
        }else {
            state['contract_address'] = null;
        }


        this.setState(state)
    }


    render() {
        const {t} = this.props.i18n;
        const {club_id,club} = this.props;

        console.log('debug01,this.props',this.props);

        return <PageWrapper>
            <Head>
                <title>{'Drop details'}</title>
            </Head>
            <div>
                
                <ClubHeader club={club} title={t('smart contract')} active_id={2} intro={null} />

                <ContractStep club_id={club_id} active_name={'deploy'} next_step={false} />

                <div className="max-w-screen-sm mx-auto pb-32">

                    <div>

                        <h2 className='h2 mb-4'>{t('choose network')}</h2>


                        <div className='mb-8'>
                            <h3 className='font-bold mb-2'>Kovan Testnet</h3>
                            <div className='d-bg-c-1'>
                                {
                                    (this.props.chain.network == 'kovan')
                                    ? <ChooseNetworkOne network={'kovan'} state={this.state['kovan']} club_id={club_id}/>
                                    : <div className='flex justify-between p-4 pl-6 border-b d-border-c-2 h-20 items-center cursor-pointer'>
                                        <div>{'wrong network'}</div>
                                        <div><SwitchChainButton /></div>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className='mb-8'>
                            <h3 className='font-bold mb-2'>Eth Mainnet</h3>
                            <div className='d-bg-c-1'>
                                {
                                    (this.props.chain.network == 'homestead')
                                    ? <ChooseNetworkOne network={'homestead'} state={this.state['homestead']} club_id={club_id}/>
                                    : <div className='flex justify-between p-4 pl-6 border-b d-border-c-2 h-20 items-center cursor-pointer'>
                                        <div>{'wrong network'}</div>
                                        <div><SwitchChainButton /></div>
                                    </div>
                                }
                            </div>
                        </div>

                    </div>
                   
                </div> 
            </div>
    </PageWrapper>
    }
    
}

let ChooseNetworkOne = ({network,state,club_id}) => {

    console.log('choose-network-one,state',state,network);

    let {t} = useTranslation('common');
    let network_name;
    switch(network) {
        case 'kovan':
            network_name = 'Kovan Testnet'
            break;
        case 'homestead':
            network_name = 'Eth Mainnet'
            break;
        default:
            network_name = network;
    }

    if (state.is_fetching) {
        return <div className='flex justify-center items-center p-4 h-20'>
            <Loading />
        </div>
    }


    if (state.contract_address) {
        return <div className='flex justify-between p-4 pl-6 border-b d-border-c-2 h-20 items-center'>
            {t('Manage Deployed Contracts')}
            <Link href={"/project/"+club_id+'/manage_contract?network='+network+"&address="+state.contract_address}>
            <a className='btn btn-primary'>
                {t('manage')}
            </a>
            </Link>
        </div>
    }

    if (state.contract_address == null && state.is_fetched) {
        return <div className='flex justify-between p-4 pl-6 border-b d-border-c-2 h-20 items-center'>
            {t('No contract deployed')}
            <Link href={"/project/"+club_id+'/deploy?network='+network}>
            <a className='btn btn-primary'>
                {t('deploy')}
            </a>
            </Link>
        </div>
    }

    return <div className='flex justify-between p-4 pl-6 border-b d-border-c-2 h-20 items-center'>
        {t('Manastudio Contract is not deployed on this network yet')}
    </div>;
}



ChooseNetwork.getInitialProps =  wrapper.getInitialPageProps((store) => async ({pathname, req, res,query}) => {
    return {
        club_id : query.id
    };
});


const mapDispatchToProps = (dispatch) => {
    return {
        updateClub : (id,data) => {
           return dispatch(updateClub(id,data))
        },
    }
}
function mapStateToProps(state,ownProps) {
   return {
   }
}

export default connect(mapStateToProps,mapDispatchToProps)(ChooseNetwork)
