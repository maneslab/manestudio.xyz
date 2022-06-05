import React,{ Component }  from 'react'
import {showtime} from 'helper/time'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'

export default function ItemInfo({item,closeModal,gotoItem}) {
    let {t} = useTranslation("common")

    return (
        <div className="text-sm text-gray-400 mb-1 flex flex-start">

            <a className="flex flex-start items-center cursor-pointer hover:underline" onClick={gotoItem.bind({},'club',item.get('club'))}>
                <img src={item.getIn(['club','avatar','url'])} className="w-4 h-4 rounded-full mr-2"/>
                {item.getIn(['club','name'])}
            </a>

            <span className="mx-2">
            •
            </span>

            <a className="mr-2 cursor-pointer hover:underline" onClick={gotoItem.bind({},'user',item.get('user'))}>{item.getIn(['user','username'])}</a>
            
            {t("created at {{time}}",{time:showtime(item.get('create_time'))})}
            
        </div>
    )
}
