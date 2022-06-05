const strFormat = function(str,args) {
    // console.log('debugstr,typeof str',typeof str)
    if (typeof str == 'object') {
        str = str.props.children;
        // console.log('debugstr,str',str)
    }
    var keys = Object.keys(args);
    keys.forEach(one=>{
        // console.log('debugstr,正在替换字符串预计替换',str)
        str = str.toString().replace(new RegExp("\\{" + one + "\\}", "g"), args[one]);
    })
    return str;
}


const notLessThen = function(str_length,getTranslate) {
    return getTranslate('can not less then {{count}} character',{count:str_length})
}

const notMoreThen = function(str_length,getTranslate) {
    return getTranslate('no more than {{count}} character',{count:str_length})
}


const deleteConfirm = function(getTranslate) {
    return getTranslate("are you sure you want to delete this item?");
}

const t = function(text) {
    return text;
}


module.exports = {
    strFormat   : strFormat,
    notLessThen : notLessThen,
    notMoreThen : notMoreThen,
    deleteConfirm : deleteConfirm,
    t : t
}