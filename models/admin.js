const mongoose=require('mongoose');

const bcrypt = require('bcrypt')
const Schema=mongoose.Schema;

const adminSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

})

adminSchema.pre('save', function (next) {
    const user = this
    bcrypt.hash(user.password, 10, (error, hash) => {
        user.password = hash
        next()
    })

})
const Admin =  mongoose.model('admin',adminSchema);

module.exports= Admin