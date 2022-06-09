import { normalize, schema } from 'normalizr';



const userSchema =  new schema.Entity('user',{
},{ idAttribute: 'user_id' });
const userListSchema =  new schema.Array(userSchema);

const clubSchema =  new schema.Entity('club',{
},{ idAttribute: 'id' });
const clubListSchema =  new schema.Array(clubSchema);

module.exports = {
    
    userSchema : userSchema,
    userListSchema : userListSchema,

    clubSchema : clubSchema,
    clubListSchema : clubListSchema
}