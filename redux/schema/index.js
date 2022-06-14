import { normalize, schema } from 'normalizr';

const proofSchema =  new schema.Entity('proof',{
},{ 
    idAttribute: (value) => `${value.platform}-${value.identity}` 
 });
const proofListSchema =  new schema.Array(proofSchema);

const personSchema = new schema.Entity('person',{
    proofs : proofListSchema
},{ idAttribute: 'persona' });
const personListSchema =  new schema.Array(personSchema);

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



const clubSocialSchema =  new schema.Entity('club_social',{
},{ idAttribute: 'id' });
const clubSocialListSchema =  new schema.Array(clubSocialSchema);

module.exports = {
    
    userSchema,
    userListSchema,

    clubSchema,
    clubListSchema,

    roadmapSchema,
    roadmapListSchema,

    gallerySchema,
    galleryListSchema,

    creatorSchema,
    creatorListSchema,

    personSchema,
    personListSchema,

    proofSchema,
    proofListSchema,

    clubSocialSchema,
    clubSocialListSchema

}