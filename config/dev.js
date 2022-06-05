module.exports =  {

    'ENV'               : 'local',
    'WEBSITE'           : 'http://127.0.0.1:3000',
    'LOGO'              : 'test',
    'FORBIDDEN_CHINA'   : true,
    'GA_TRACKING_ID'    : 'G-5FDR19R00J',

    'ETH_SIGN_NAME'     : 'zkpayroll',

    'ETHERSCAN_BASE'    : 'https://testnet.bscscan.com',

    'SALARY_TOKEN_LIST' : {
        '0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee'    :  'busd',
        '0x822ca080e094bf068090554a19bc3d6618c800b3'    :  'usdt'
    },

    'ZKSAFEBOX_CONTRACT_ADDRESS'        :   '0x0542E32040bc70519C3cFaed438072050F1Ad977',

    'TOKEN_LIST' : [
        '0x2F4117b7CCb0605C7BC40Dd7F6a023827fBFB840',
        '0xA2F3f13A599fC56a4965Bb2c306a42313c24217a'
    ],

    'USE_TOKEN_LIST' : 'testing',

    'ALLOW_TOKEN_LIST'     : [
        {
            address: "0x2F4117b7CCb0605C7BC40Dd7F6a023827fBFB840",
            chainId: 1,
            decimals: 18,
            logoURI: "",
            name: "MockUSDT",
            symbol: "USDT"
        },
        {
            address : "0xA2F3f13A599fC56a4965Bb2c306a42313c24217a",
            chainId: 1,
            decimals: 18,
            logoURI: "",
            name: "MockBUSD",
            symbol: "BUSD"
        }
    ]

}