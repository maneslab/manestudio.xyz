import { normalize, schema } from 'normalizr';



const userSchema =  new schema.Entity('user',{
},{ idAttribute: 'user_id' });
const userListSchema =  new schema.Array(userSchema);

const roadmapSchema =  new schema.Entity('roadmap',{
},{ idAttribute: 'id' });
const roadmapListSchema =  new schema.Array(roadmapSchema);

const clubSchema =  new schema.Entity('club',{
    'roadmaps'  :   roadmapListSchema
},{ idAttribute: 'id' });
const clubListSchema =  new schema.Array(clubSchema);


const imgSchema =  new schema.Entity('img',{
},{ idAttribute: 'img_id' });
const imgListSchema =  new schema.Array(imgSchema);

const gallerySchema =  new schema.Entity('gallery',{
    img : imgSchema
},{ idAttribute: 'id' });
const galleryListSchema =  new schema.Array(gallerySchema);



const creatorSchema =  new schema.Entity('creator',{
},{ idAttribute: 'id' });
const creatorListSchema =  new schema.Array(creatorSchema);


module.exports = {
    
    userSchema : userSchema,
    userListSchema : userListSchema,

    clubSchema : clubSchema,
    clubListSchema : clubListSchema,

    roadmapSchema : roadmapSchema,
    roadmapListSchema : roadmapListSchema,

    gallerySchema : gallerySchema,
    galleryListSchema : galleryListSchema,

    creatorSchema : creatorSchema,
    creatorListSchema : creatorListSchema,
}