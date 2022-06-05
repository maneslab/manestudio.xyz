import { normalize, schema } from 'normalizr';



const safeboxSchema =  new schema.Entity('safebox',{
},{ idAttribute: 'boxhash' });
const safeboxListSchema =  new schema.Array(safeboxSchema);

module.exports = {
    
    safeboxSchema : safeboxSchema,
    safeboxListSchema : safeboxListSchema,

}