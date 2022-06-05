import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

console.log('publicRuntimeConfig',publicRuntimeConfig)
const getConfigHelper = (name) => {
    return publicRuntimeConfig['env'][name]
} 


module.exports = {
    getConfig           : getConfigHelper,
}
