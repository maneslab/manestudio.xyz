const fs = require('fs')
const parse = require('csv-parse');
const path = require('path');
const util = require('util');
const stringify = require('csv-stringify')

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

function removeUnuseChars(str) {
    str = str.replace(/\n/g, '')
    return str.trim();
}

function unique (arr) {
  return Array.from(new Set(arr))
}


const fileDisplay = async function(filePath,addFilePath = null){
    //根据文件路径读取文件，返回文件列表
    let files = await readdir(filePath)

    //遍历读取到的文件列表
    const promises = files.map(async function(filename){
        //获取当前文件的绝对路径
        var filedir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        var stats = await stat(filedir)

        var isFile = stats.isFile();//是文件
        var isDir = stats.isDirectory();//是文件夹
        if(isFile){
            // 读取文件内容
            console.log('filedir:',filedir);
            if (addFilePath) {
                addFilePath(filedir);
            }
        }
        if(isDir){
            await fileDisplay(filedir,addFilePath);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }

    });

    await Promise.all(promises);
}

function findChars(text,before,end) {

    let chats = [];
    let r = findChar(text,before,end);

    while(r['status'] == 'find') {
        console.log('找到了数据',r['text']);
        chats.push(r['text']);
        r = findChar(r['rest_text'],before,end);
    }
    return chats;

}

function findChar(text,before,end) {
    let find_l,find_r;
    find_l = text.indexOf(before);

    let result = {
        'status' : 'unfind'
    };

    if (find_l != -1) {
        let temp_text = text.slice(find_l+before.length);
        find_r = temp_text.indexOf(end);
        if (find_r != -1) {

            // console.log('find数据',find_l+before.length,find_r);
            let r_pos = find_l+before.length+find_r;

            result['status'] = 'find';
            result['text'] = text.slice(find_l+before.length,r_pos);
            result['rest_text'] = text.slice(r_pos+end.length);
        }
    }

    return result
}


function ConvertArrToMap(arr) {
    let new_map = {}
    arr.map(one=>{
        let format_key = removeUnuseChars(one);

        if (new_map[format_key]) {
            console.log('发现一个重复的',one);
        }else {
            new_map[format_key] = 1;
        }
    })

}

module.exports = {
    removeUnuseChars    : removeUnuseChars,
    readdir             : readdir,
    stat                : stat,
    unique              : unique,
    fileDisplay         : fileDisplay,
    findChars           : findChars,
    ConvertArrToMap     : ConvertArrToMap
}
