const fs = require('fs')

const {parse} = require('csv-parse');
const path = require('path');
const util = require('util');
const {stringify} = require('csv-stringify')

const {fileDisplay,findChars,removeUnuseChars,unique,readdir,stat} = require('./utils.js');

class translateHelper  {

    constructor() {

        this.base_path = path.resolve(__dirname + './../../');  ///项目地址
        this.locale_file_path = path.resolve(this.base_path , 'public/locales/');   //locale的文件所在目录

        this.un_translate_csv_path = path.resolve(this.base_path,'./tools/translation/un_translate.csv');
        this.translate_csv_path = path.resolve(this.base_path,'./tools/translation/translate.csv');
      
        this.translated_csv_path = path.resolve(this.base_path,'./tools/translation/translated.csv');

        this.chars = [
            [
                "{t('",
                "'"
            ],
            [
                "{t(\"",
                "\""
            ],
            [
                "getTranslate(\"",
                "\""
            ],
            [
                "getTranslate('",
                "'"
            ], 
            [
                "(t('",
                "'"
            ],
            [
                "(t(\"",
                "\""
            ],
            [
                " t('",
                "'"
            ],
            [
                " t(\"",
                "\""
            ],
        ]

        this.findTranlateText = this.findTranlateText.bind(this)
        this.find = this.find.bind(this)
        this.make = this.make.bind(this)

        this.addFilePath = this.addFilePath.bind(this);
        this.saveTranslateJsonFile = this.saveTranslateJsonFile.bind(this)
        this.getPoFilePath = this.getPoFilePath.bind(this);
        this.ifIsComplexKeyByScan = this.ifIsComplexKeyByScan.bind(this)
        this.generateComplexKey = this.generateComplexKey.bind(this)

        this.file_path = [];    ///所有等待扫描的file列表

        this.find_translate_text_arr = [];  ///扫描到的翻译条目

        this.already_translate_arr = [];    ///已经翻译的条目，英文
        this.already_translate_map = {};    ///已经翻译的条目的map
        this.language_list = [];                ///现在翻译包含的语言的名字

        this.already_translate_map_arr = [];    ///已经翻译的条目,每一个item包含了所有的翻译语言的map

        this.translate_map = {};    ///在生成translate的.po文件时，用于缓存

    }

    getPoFilePath(language) {
        return path.resolve(this.base_path,'./public/locales/'+language+'/common.json');
    }

    addFilePath(file_path) {
        return this.file_path.push(file_path);
    }

    async findTranlateText(filedir) {

        // console.log('准备检查文件的翻译:',filedir);
        var content = fs.readFileSync(filedir, 'utf-8');

        this.chars.map(c=>{
            let result = findChars(content,c[0],c[1]);
            if (result.length > 0) {
                result.map(one=>{
                    this.saveResult(one.trim())
                })
            }
        })

        return true;
    }

    saveResult(text) {
        if (text && text.length > 0) {
            this.find_translate_text_arr.push(text);
        }
    }

    async test(file_path) {

        var full_path = path.resolve(this.base_path , file_path);
        await this.findTranlateText(full_path);
    }

    /*
    *   从public/locales下的翻译文件来对应的翻译文件列表，返回的数据如下结构
    *   [
    *       {
    *           'language' : 'en',
    *           'file_path': '.../en/common.json'
    *       },
    *       ...
    *   ]
     */
    async getLocaleFiles() {

        let lang_maps = [];
        let locale_file_path = this.locale_file_path;

        let files = await readdir(locale_file_path)
        let {getPoFilePath} = this;
        //遍历读取到的文件列表
        const promises = files.map(async function(filename){
            var filedir = path.join(locale_file_path, filename);
            var stats = await stat(filedir)
            if(stats.isDirectory()){
                ///如果是文件夹的情况的话，那么就是一个翻译的文件
                // console.log('找到一个翻译的语言文件夹'+filename);
                lang_maps.push({
                    'language'  : filename,
                    'file_path' : getPoFilePath(filename)
                })
            }
        });

        await Promise.all(promises);
        return lang_maps;
    }

     /*
    *   从public/locales下的翻译文件来对应的翻译文件列表，返回对应的翻译语言列表
    *   [
    *       'en',
    *       'zh'
    *   ]
     */
    async getLanguageList() {
        let lang_maps = [];
        let locale_file_path = this.locale_file_path;
        let files = await readdir(locale_file_path)

        //遍历读取到的文件列表
        const promises = files.map(async function(filename){
            var filedir = path.join(locale_file_path, filename);
            var stats = await stat(filedir)
            if(stats.isDirectory()){
                ///如果是文件夹的情况的话，那么就是一个翻译的文件
                lang_maps.push(filename)
            }
        });

        await Promise.all(promises);
        return lang_maps;
    }

    

    /*
    *   获得已经翻译的Map，返回结构如下:
    *   {
    *       'member' : {
    *           'en' : 'member',
    *           'zh' : '成员'
    *       }
    *       ...
    *   }
     */
    async getTranslateMap() {

        /*获得locales文件夹下所有的翻译的文件夹（即所有现在的语言和翻译）*/
        let lang_maps = await this.getLocaleFiles();

        /*把现在的所有列表做成一个map*/
        let translate_map = {};

        const read_file_promises = lang_maps.map(async function(langone){
            //获取当前文件的绝对路径
            var lang = langone['language']
            var data = await fs.promises.readFile(langone.file_path,'utf8');
            var json_data = JSON.parse(data);
            //把读取文件循环
            Object.keys(json_data).map((k)=>{
                k = removeUnuseChars(k)
                if (!translate_map[k]) {
                    translate_map[k] = {}
                }
                translate_map[k][lang] = json_data[k]
            })

        });
        await Promise.all(read_file_promises);

        return translate_map;
    }

    makeMapFromArray(arr) {
        let new_map = {}
        arr.map(one=>{
            new_map[one] = true;
        })
        return new_map;
    }


    async find() {

        ///需要扫描的目录
        let loop_dirs = [
            'components',
            'pages',
            'helper',
            'hocs',
        ];

        console.log('this.base_path',this.base_path);

        ///处理文件列表（找到所有需要查找的文件）
        const promises = loop_dirs.map(async dir=>{
            var filePath = path.resolve(this.base_path , dir);
            await fileDisplay(filePath,this.addFilePath);
        })

        //,this.findTranlateText
        await Promise.all(promises);


        ///处理单个文件（寻找翻译）
        const file_promises = this.file_path.map(async file_path=>{
            await this.findTranlateText(file_path);
        })

        //,this.findTranlateText
        await Promise.all(file_promises);

        ///对于找到的翻译条目去重
        this.find_translate_text_arr = unique(this.find_translate_text_arr);
        console.log('总计查询到的需要翻译条目数是:',this.find_translate_text_arr.length);

        this.find_translate_text_map = this.makeMapFromArray(this.find_translate_text_arr)
        ///读取已经翻译的文件，查找需要翻译，已经翻译，尚未翻译的部分

        ///1.读取文件
        let translated_map = await this.getTranslateMap();
        let language_list = await this.getLanguageList();
        let translated_map_keys = Object.keys(translated_map);

        ///2.从读取的数据得到language列表
        console.log('已经被翻译过的条目数',translated_map_keys.length);

        ///已经翻译的
        let already_translated = [];

        ///还没有翻译的
        let un_translated_arr = [];

        ///更改上次翻译的数据
        let need_remove_translated_arr = [];  ///需要移除的翻译
        let need_remove_translated_map = {};
        let keep_translated_arr = [];   ///需要保留的翻译

        //
        this.find_translate_text_arr.map(one=>{
            if (translated_map[one]) {
                already_translated.push(one)
            }else {
                un_translated_arr.push(one)
            }
        });

        translated_map_keys.map(one=>{
            if (!this.find_translate_text_map[one]) {
                need_remove_translated_arr.push(one);
                need_remove_translated_map[one] = 1;
            }else {
                keep_translated_arr.push(one);
            }
        })

        already_translated = unique(already_translated)
        un_translated_arr = unique(un_translated_arr)
        need_remove_translated_arr = unique(need_remove_translated_arr)

        ////对比现在的文字
        console.log('扫描中已经翻译过的条目数:',already_translated.length)
        console.log('扫描中没有翻译过的条目数:',un_translated_arr.length)
        console.log('需要从已翻译中移除的条目数',need_remove_translated_arr.length)

        console.log('需要移除的翻译是:',need_remove_translated_arr);
        console.log('已翻译中需要保持的条目数量:',keep_translated_arr.length)

        ////更新已经翻译的文字
        if (translated_map_keys.length > 0) {
            let new_translated_arr = [];
            keep_translated_arr.map(one=>{
                let row = []
                row.push(one)
                language_list.map(k=>{
                    if (translated_map[one] && translated_map[one][k]) {
                        row.push(translated_map[one][k]);
                    }else {
                        row.push('');
                    }
                })
                new_translated_arr.push(row);
            })
            console.log('已翻译,得到最终的翻译的表的条目数量',new_translated_arr.length)

            let columns = {};
            columns['key'] = 'key';
            language_list.map(one=>{
                columns[one] = one;
            })

            ///写入文件（更新翻译）
            stringify(new_translated_arr, { header: true, columns: columns }, (err, output) => {
                if (err) throw err;
                fs.writeFile(this.translate_csv_path, output, (err) => {
                    if (err) throw err;
                    console.log('[已翻译的列表]translate.csv已保存');
                });
            });
        }

        ///写入文件还没有翻译的
        let columns = {
            key : 'key',
            en  : 'en'
        };
        let data = []
        un_translated_arr.map(one=>{

            //判断是否是complex的key（这个和make时候判断不一样）
            let is_complex = this.ifIsComplexKeyByScan(one);

            if (is_complex) {
                let keys = this.generateComplexKey(one);
                keys.map(kone=>{
                    data.push([kone,kone])
                })
            }else {
                data.push([one,one])
            }

        })


        stringify(data, { header: true, columns: columns }, (err, output) => {
            if (err) throw err;
            fs.writeFile(this.un_translate_csv_path, output, (err) => {
                if (err) throw err;
                console.log('[未翻译的列表]un_translate.csv已保存');
            });
        });

        return true;

    }


    saveTranslateJsonFile(translate_map) {
        Object.keys(translate_map).map(lang=>{
            let data = JSON.stringify(translate_map[lang]);
            let save_po_path = this.getPoFilePath(lang);
            fs.writeFileSync(save_po_path, data);
            console.log('文件保存成功',save_po_path,Object.keys(translate_map[lang]).length)
        })
    }

    ifIsComplexKeyByScan(key) {
        let check_keywords = ['-count'];
        let is_complex = false;
        check_keywords.map(kone=>{
            var d = key.length-kone.length;
            if (!is_complex) {
                is_complex = (d>=0&&key.lastIndexOf(kone)==d)
            }
        })
        return is_complex;
    }

    generateComplexKey(key) {
        let keywords = ['_one','_0','_other'];
        let g_keys = [];
        keywords.map(kone=>{
            g_keys.push(key+kone);
        })
        return g_keys;
    }

    ifIsComplexKey(key) {
        let check_keywords = ['_one','_0','_other'];
        let is_complex = false;
        check_keywords.map(kone=>{
            var d = key.length-kone.length;
            if (!is_complex) {
                is_complex = (d>=0&&key.lastIndexOf(kone)==d)
            }
        })
        return is_complex;
    }

    getComplexKey(key) { 
        let check_keywords = ['_one','_0','_other'];
        let is_complex = false;
        let complex_key = '';
        let complex_key_sub = '';
        check_keywords.map(kone=>{
            var d = key.length-kone.length;
            if (!is_complex) {
                is_complex = (d>=0&&key.lastIndexOf(kone)==d)
                if (is_complex) {
                    complex_key = key.substr(0,d);
                    complex_key_sub = kone.substr(1);
                }
            }
        })
        return [complex_key,complex_key_sub];
    }

    async make() {


        const saveTranslateJsonFile = this.saveTranslateJsonFile;
        const ifIsComplexKey = this.ifIsComplexKey.bind(this)
        const getComplexKey = this.getComplexKey.bind(this)

        var parser = parse({columns: true}, function (err, records) {
            // console.log(records);
            let translate_map = {};

            records.map(one=>{
                console.log('record-one',one);
                Object.keys(one).map(lang=>{

                    if (lang != 'key') {

                        let lang_lower = lang.toLowerCase();

                        if (!translate_map[lang_lower]) {
                            translate_map[lang_lower] = {};
                        }

                        let key = removeUnuseChars(one['key']);
                        let value = removeUnuseChars(one[lang_lower]);

                        //检查key是否是复数形式的key
                        if (ifIsComplexKey(key)){
                            let ck = getComplexKey(key)
                            if (!translate_map[lang_lower][ck[0]]) {
                                translate_map[lang_lower][ck[0]] = {}
                            }
                            translate_map[lang_lower][ck[0]][ck[1]] = value;
                        }else {
                            translate_map[lang_lower][key] = value;
                        }

                    }


                })
            })

            console.log('translate_map',translate_map)

            //保存文件
            saveTranslateJsonFile(translate_map);


        });

        fs.createReadStream(this.translated_csv_path).pipe(parser);


    }

}

module.exports = translateHelper