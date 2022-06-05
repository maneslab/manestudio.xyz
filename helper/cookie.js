import Cookies from 'universal-cookie';
import {getConfig} from 'helper/config'


function setCookie(key,value) {

　　 let startDate = new Date();
    let endDate = new Date();
    endDate.setDate(startDate.getDate() + 365);


    const cookies = new Cookies();

    console.log('debug:写入cookie,key:',key,value);
    
    cookies.set(key, value, { 
        path    : '/' , 
        // httpOnly: true,
        expires : endDate
    });
}

function getCookie(key) {

    let cookies = new Cookies();
    let value = cookies.get(key);
    // console.log('debug003,cookies中获得的jwt_token是',jwt_token);
    if (!value) {
        return '';
    }
    return value;
}


function getJwtToken() {
    let jwt_token = getCookie('jwt_token');
    if (!jwt_token) {
        return '';
    }
    return 'Bearer ' + jwt_token;
}

function setJwtToken(value) {
    setCookie('jwt_token',value);
    return true;
}



module.exports = {
    getJwtToken : getJwtToken,
    setJwtToken : setJwtToken,

    getCookie : getCookie,
    setCookie : setCookie
}