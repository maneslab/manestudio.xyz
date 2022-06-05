import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import {getUnixtime} from 'helper/time'

export const getValueFromAmountAndDecimals =  (amount,decimals) => {
    console.log('getValueFromAmountAndDecimals',amount,decimals);
    if (!BigNumber.isBigNumber(amount)) {
        amount = new BigNumber(amount)
    }
    BigNumber.config({ EXPONENTIAL_AT: 36 })

    console.log('getValueFromAmountAndDecimals->amount',amount);

    let value = amount.multipliedBy(new BigNumber(10).pow(decimals));
    console.log('getValueFromAmountAndDecimals->value',value);
    let value_str = value.toString();
    console.log('getValueFromAmountAndDecimals->value_str',value_str);

    return ethers.BigNumber.from(value_str);
}

export const getAmountFromValueAndDecimals = (value,decimals) => {
    if (!BigNumber.isBigNumber(value)) {
        value = new BigNumber(value)
    }
    let amount = value.dividedBy(new BigNumber(10).pow(decimals));
    return amount
}

export const getSteamingData = (before) => {

    let during_time = before.stopTime.sub(before.startTime);    //时间
    let total = during_time.mul(before.ratePerSecond);  //总计
    let claimed = total.sub(before.remainingBalance);    //已经领取

    let unixtime_now = getUnixtime();

    let during_time_until_now = ethers.BigNumber.from(unixtime_now).sub(before.startTime);

    let total_release;
    if (during_time_until_now.mul(before.ratePerSecond).gt(total)) {
        total_release = total;
    }else {
        total_release = during_time_until_now.mul(before.ratePerSecond);
    }

    let total_allow_claim = total_release.sub(claimed);

    return {
        during_time : during_time,
        total : total,
        claimed : claimed,
        unixtime_now : unixtime_now,
        during_time_until_now : during_time_until_now,
        total_allow_claim : total_allow_claim,
        total_release : total_release
    }
}