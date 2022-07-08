import BigNumber from "bignumber.js";

const percentDecimal = function(num , dec = 2) {
    return (100 * num).toFixed(dec);
}


const autoDecimal = function(num) {
    num = Number(num);
    let foramt_num;

    let num_abs = Math.abs(num);
    if (num_abs > 10000) {
        foramt_num = parseInt(num);
    }else if (num_abs > 1) {
        // console.log('debug02,2位小数',num);
        foramt_num = num.toFixed(2);
    }else if(num_abs > 0.001) {
        foramt_num = num.toFixed(4);
    }else if(num_abs > 0.000001) {
        // console.log('debug02,8位小数',num);
        foramt_num = num.toFixed(8);
    }else if(num_abs > 0.0000000001) {
        // console.log('debug02,8位小数',num);
        foramt_num = num.toFixed(12);
    }else if(num_abs > 0.00000000000001) {
        // console.log('debug02,8位小数',num);
        foramt_num = num.toFixed(16);
    }else {
        // console.log('debug02,似乎超出了预期的小数',num);
        foramt_num = toNonExponential(num);
    }

    return foramt_num;
    // return parseFloat(foramt_num);
}

function toNonExponential(num) {
    var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    if (m && m.length >= 3) {
        return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
    }else {
        return num.toFixed(12);
    }
}


const formatBigNumber = (num) => {
    num = Number(num)
    if (num > 1000000) {
        return (num/1000000).toFixed(2) + 'M';
    }else {
        return num.toFixed(0);
    }
}



// const getPoolPercent = (token_amount,total_amount) => {
//     token_amount = Number(token_amount);
//     total_amount = Number(total_amount);
//     console.log('计算我占据的算力，原始输入',token_amount,total_amount)
//     if (token_amount) {
//         let p = token_amount / (total_amount + token_amount)
//         console.log('计算我占据的算力大约是',p)
//         if (p < 0.0001) {
//             return  "<" + percentDecimal(token_amount / (total_amount + token_amount)) + '%'
//         }else {
//             return "≈" + percentDecimal(token_amount / (total_amount + token_amount)) + '%'
//         }
//     }else {
//         return '-';
//     }
// }

const getIntAmount = (token_amount,total_decimal) => {
    return Number(token_amount) * Math.pow(10,total_decimal);
}
const forceDecimal = function(num , dec = 12) {
    return Number(num).toFixed(dec);
}

// const getPoolPriceAfter = (pool_amount1,pool_amount2,amount1) => {
//     amount1 = Number(amount1)
//     return (pool_amount1/pool_amount2)*Math.pow(1+(amount1/pool_amount1),2)
// }


// const getExchangePrice = (pool_amount1,pool_amount2,amount1) => {
//     amount1 = Number(amount1)
//     // console.log('T7,getExchangePrice输入',pool_amount1,pool_amount2,amount1)
//     // console.log('T7,计算变动的amount2',(pool_amount2*amount1 / (pool_amount1 + amount1)))
//     // console.log('T7,计算变动的amount1/amount2的价格',amount1 / (pool_amount2*amount1 / (pool_amount1 + amount1)))
//     return amount1 / (pool_amount2*amount1 / (pool_amount1 + amount1))  ;
// }

/*
*   Uniswap的交易遵循的规则如下
*   如果我们认为池子里一共有x,y个代币，每次交易x'和y'个代币，交易完成以后的池子代币金额是x2和y2
*   1.x*y = x2 * y2 = (x+x')*(y-y')
*   2.y' = y * (x' / (x+x')) 
*   由公示1可以推算出来公式3
*   3.x' = (x * y / (y - y')) - x
*/
// const getToAmount = (pool_amount1,pool_amount2,amount1) => {
//     amount1 = Number(amount1)
//     return (pool_amount2*amount1 / (pool_amount1 + amount1));
// }


// const getFromAmount = (pool_amount1,pool_amount2,amount2) => {
//     amount1 = Number(amount2)
//     return (pool_amount1*pool_amount2 / (pool_amount2 - amount2)) - pool_amount1;
// }


const getAmountFromIntAmount = (amount,decimals) => {
    console.log('getAmountFromIntAmount',amount,decimals)
    amount = new BigNumber(amount);
    let value = amount.div(Math.pow(10,Number(decimals)));
    return value;
}

const hex2Number = (str = '') => {
    if (str.indexOf('0x') === 0) {
        str = str.slice(2);
    }
    return parseInt(`0x${str}`, 16);
}


const getIntAmountByAmount = (amount,decimals = 18) => {
    amount = new BigNumber(amount);
    let value = amount.times(Math.pow(10,Number(decimals)));
    return value;
}

const getAmountFromHex = (dex_amount) => {
    return parseInt(dex_amount, 16) 
}

const showBalance = (balance,decimals = 18) => {
    return new BigNumber(balance).dividedBy(Math.pow(10,decimals));
}

const fromPercentToPPM = (value) => {
    return Number(value)*1000000;
}

module.exports = {
    'percentDecimal' : percentDecimal,
    'autoDecimal'    : autoDecimal,
    // 'getPoolPercent' : getPoolPercent,
    'getIntAmount'   : getIntAmount,
    // 'getPoolPriceAfter' : getPoolPriceAfter,
    // 'getExchangePrice'  : getExchangePrice,
    // 'getToAmount'       : getToAmount,
    // 'getFromAmount'     : getFromAmount,
    'forceDecimal'      : forceDecimal,
    'formatBigNumber'   : formatBigNumber,
    'getAmountFromIntAmount' : getAmountFromIntAmount,
    'getIntAmountByAmount'   : getIntAmountByAmount,
    'getAmountFromHex'       : getAmountFromHex,
    'showBalance'            : showBalance,
    'fromPercentToPPM'       : fromPercentToPPM,
    'hex2Number'             : hex2Number
}