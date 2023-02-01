const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const discountSchema=new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'user id is required']
    },
    shopLocation:{
        type:String,
        required:[true, 'shop location is required']
    },
    shoppingAmount:{
        type:Number,
    },
    product:{
        type:[],
    },
    discounts:{
        type:Number,
    },
    date:{
        type:Date,
        required:[true ,'dates is required']
    }

})

const Discount =  mongoose.model('discount',discountSchema);

module.exports= Discount