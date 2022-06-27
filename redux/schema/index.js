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


const imageGroupSchema =  new schema.Entity('image_group',{
    club :clubSchema
},{ idAttribute: 'id' });
const imageGroupListSchema =  new schema.Array(imageGroupSchema);


const imageLayerSchema =  new schema.Entity('image_layer',{
    group : imageGroupSchema
},{ idAttribute: 'id' });
const imageLayerListSchema =  new schema.Array(imageLayerSchema);


const imageTraitSchema =  new schema.Entity('image_trait',{
    layer : imageLayerSchema
},{ idAttribute: 'id' });
const imageTraitListSchema =  new schema.Array(imageTraitSchema);


const imageSpecialSchema =  new schema.Entity('image_special',{
},{ idAttribute: 'id' });
const imageSpecialListSchema =  new schema.Array(imageSpecialSchema);

const imageGenerateSchema =  new schema.Entity('image_generate',{
},{ idAttribute: 'id' });
const imageGenerateListSchema =  new schema.Array(imageGenerateSchema);


const contractRefundSchema =  new schema.Entity('contract_refund',{
},{ idAttribute: 'id' });
const contractRefundListSchema =  new schema.Array(contractRefundSchema);

const contractSchema =  new schema.Entity('contract',{
    refund : contractRefundListSchema
},{ idAttribute: 'id' });

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
    clubSocialListSchema,

    imageGroupSchema,
    imageGroupListSchema,

    imageLayerSchema,
    imageLayerListSchema,

    imageTraitSchema,
    imageTraitListSchema,

    imageSpecialSchema,
    imageSpecialListSchema,

    contractRefundListSchema,
    contractSchema,

}