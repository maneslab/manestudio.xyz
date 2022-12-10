
import config from 'helper/config';

const v2_begin_club_id = config.get('MANE_CONTRACT_V2.begin_club_id');

export const getParentContractVersion = (club_id) => {
    if (club_id >= v2_begin_club_id) {
        return 'v2';
    }else {
        return 'v1';
    }
}

export const getParentContractAddress = (club_id,network) => {
    let version = getParentContractVersion(club_id);
    switch (version) {
        case 'v1':
            return getParentContractAddressV1(network);
        case 'v2':
            return getParentContractAddressV2(network);
        default:
            return '';
    }
}


export const getParentContractAddressV2 = (network) => {
    switch(network) {
        case 'goerli':
            return config.get('MANE_CONTRACT_V2.goerli');
        case 'mainnet':
        case 'homestead':
            return config.get('MANE_CONTRACT_V2.homestead');
        default:
            return '';
    }
}

export const getParentContractAddressV1 = (network) => {
    switch(network) {
        case 'goerli':
            return config.get('MANE_CONTRACT.goerli');
        case 'mainnet':
        case 'homestead':
            return config.get('MANE_CONTRACT.homestead');
        default:
            return '';
    }
}