import React from 'react';
import Link from 'next/link'
import BigNumber from "bignumber.js";

class ClubOne extends React.Component {

    getTotalBalance(info) {
        let balance = new BigNumber(info.get('collectorBalance'));
        let owner_balance = new BigNumber(info.get('ownerBalance'));
        return balance.plus(owner_balance).toFixed(8);
    }

    getMintedPercent(info) {
        let minted = new BigNumber(info.get('totalSupply'));
        let total = new BigNumber(info.get('_maxSupply'));
        return minted.dividedBy(total).multipliedBy(100).toFixed(2);
    }


    render() {

        const { club,t } = this.props;

        let tag = null;
        if (club.getIn(['contract_address_list_map','kovan'])) {
            tag = <div class="badge badge-info capitalize">kovan testnet</div>
        }
        if (club.getIn(['contract_address_list_map','ropsten'])) {
            tag = <div class="badge badge-info capitalize">ropsten testnet</div>
        }
        if (club.getIn(['contract_address_list_map','mainnet'])) {
            tag = <div class="badge badge-primary capitalize">mainnet</div>
        }
        
        let percent = 0;
        if (club.getIn(['financial_info','totalSupply'])) {
            percent = this.getMintedPercent(club.get('financial_info'));
        }

        return <div>
            <Link href={"/project/"+club.get('id')+"/group"}>
            <div className="flex justify-between mb-4 d-bg-c-1 p-4 cursor-pointer">
                <div className="w-56 h-56 mr-4">
                    {
                        (!club.get('image_url'))
                        ? <div className='bg-gray-100 text-gray-400 dark:bg-[#33363e] dark:text-[#555] flex justify-center items-center h-56'>
                            NO COVER
                        </div>
                        : <div>
                            <img src={club.get('image_url')} className="w-56 h-56"/>
                        </div>
                    }
                </div>
                <div className="flex-grow flex flex-col justify-between">
                    
                    <div>
                    <div className='flex justify-between items-center mb-2'>
                        {
                            (club.get('project_type') == 'normal')
                            ? <div>{t('batch upload')}</div>
                            : <div>{t('use generation')}</div>
                        }
                        {tag}
                    </div>
                    <h2 className='font-bold text-xl capitalize'>{club.get('name')}</h2>
                    <div className='border-t d-border-c-1 my-2' />
                    {
                        (club.getIn(['financial_info','collectorBalance']))
                        ? <div className='flex justify-between py-2'>
                            <div>
                                <div className='capitalize'>{t('income balance')}</div>
                                <div className='text-xl font-bold'>{this.getTotalBalance(club.get('financial_info'))} <span className='text-sm'>ETH</span></div>
                            </div>
                            
                            <div className="radial-progress text-primary" style={{"--value":percent}}>
                                <div className='text-sm text-center'>
                                <div className='text-base'>{percent}%</div>
                                <div className='text-black dark:text-white'>minted</div>
                                </div>
                            </div>
                        </div>
                        : <div></div>
                    }
                    </div>
                    <div className='flex justify-end'>
                        <Link href={"/project/"+club.get('id')+"/group"}>
                        <button className='btn btn-default'>{t('edit')}</button>
                        </Link>
                    </div>
                </div>
            </div>
            </Link>
        </div>
    }
}


module.exports = ClubOne
