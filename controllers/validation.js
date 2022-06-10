const {Validator,ValidationError} = require('jsonschema')
//const ValidationError  = require('sequelize/types')

const product= require('../schemas/product.schema.js')
const user = require('../schemas/user.schema.js')
const userProfile = require('../schemas/userProfile.schema.js')
const userGoogle = require('../schemas/userGoogle.schema.js')
const userPwd = require('../schemas/userPwd.schema.js')
const v = new Validator()


exports.validateDog = async(ctx,next) => {
    const validationOptions = {
        throwError:true,
        allowUnknownAttributes:false
    }
    const body = ctx.request.body
    try{
        v.validate(body,product,validationOptions)
        await next()
    }catch(error){
        if(error instanceof ValidationError){
            ctx.body = error
            ctx.status = 400
        }else{
            throw error
        }
    }
}

exports.validateDogFilter = async(ctx,next) => {
    const validationOptions = {
        throwError:true,
        allowUnknownAttributes:false
    }
    const body = ctx.request.query
    try{
        v.validate(body,dogFilter,validationOptions)
        await next()
    }catch(error){
        if(error instanceof ValidationError){
            ctx.body = error
            ctx.status = 400
        }else{
            throw error
        }
    }
}

exports.validateProduct = async(ctx,next) => {
    const validationOptions = {
        throwError:true,
        allowUnknownAttributes:false
    }
    const body = ctx.request.body
    try{
        v.validate(body,product,validationOptions)
        await next()
    }catch(error){
        if(error instanceof ValidationError){
            ctx.body = error
            ctx.status = 400
        }else{
            throw error
        }
    }
}

exports.validateUser = async(ctx,next) => {
    const validationOptions = {
        throwError:true,
        allowUnknownAttributes:false
    }
    const body = ctx.request.body
    try{
        v.validate(body,user,validationOptions)
        await next()
    }catch(error){
        if(error instanceof ValidationError){
            ctx.body = error
            ctx.status = 400
        }else{
            throw error
        }
    }
}

exports.validateUserProfile = async(ctx,next) => {
    const validationOptions = {
        throwError:true,
        allowUnknownAttributes:false
    }
    const body = ctx.request.body
    try{
        v.validate(body,userProfile,validationOptions)
        await next()
    }catch(error){
        if(error instanceof ValidationError){
            ctx.body = error
            ctx.status = 400
        }else{
            throw error
        }
    }
}

exports.validateUserGoogle = async(ctx,next) => {
    const validationOptions = {
        throwError:true,
        allowUnknownAttributes:false
    }
    const body = ctx.request.body
    try{
        v.validate(body,userGoogle,validationOptions)
        await next()
    }catch(error){
        if(error instanceof ValidationError){
            ctx.body = error
            ctx.status = 400
        }else{
            throw error
        }
    }
}

exports.validateUserPwd = async(ctx,next) => {
    const validationOptions = {
        throwError:true,
        allowUnknownAttributes:false
    }
    const body = ctx.request.body
    try{
        v.validate(body,userPwd,validationOptions)
        await next()
    }catch(error){
        if(error instanceof ValidationError){
            ctx.body = error
            ctx.status = 400
        }else{
            throw error
        }
    }
}

exports.validateCompany = async(ctx,next) => {
    const validationOptions = {
        throwError:true,
        allowUnknownAttributes:false
    }
    const body = ctx.request.body
    try{
        v.validate(body,company,validationOptions)
        await next()
    }catch(error){
        if(error instanceof ValidationError){
            ctx.body = error
            ctx.status = 400
        }else{
            throw error
        }
    }
}

