module.exports =  {

    'ENV'               : 'production',

    'WEBSITE'           : 'https://zksafebox.vercel.app',
    'LOGO'              : 'online',
    'FORBIDDEN_CHINA'   : true,
    'GA_TRACKING_ID'    : '',

    'ETHERSCAN_BASE'    : 'https://mumbai.polygonscan.com/',

    'ZKSAFEBOX_CONTRACT_ADDRESS'        :   '0x072777f02Ad827079F188D8175FB155b0e75343D',

    'TOKEN_LIST' : [
        '0x6009234967B1c7872de00BB3f3e77610b8D6dc9e',
        '0x6D288698986A3b1C1286fB074c45Ac2F10409E28'
    ],

    'USE_TOKEN_LIST' : 'testing',

    'ALLOW_TOKEN_LIST'     : [
        {
            address: "0x6009234967B1c7872de00BB3f3e77610b8D6dc9e",
            chainId: 1,
            decimals: 18,
            logoURI: "",
            name: "MockUSDT",
            symbol: "USDT"
        },
        {
            address : "0x6D288698986A3b1C1286fB074c45Ac2F10409E28",
            chainId: 1,
            decimals: 18,
            logoURI: "",
            name: "MockBUSD",
            symbol: "BUSD"
        }
    ]
}