

const Router = require('koa-router')



const userModel = require('../models/users')
const breedModel = require('../models/breeds')
const commentModel = require('../models/comments')
const model = require('../models/products')
const can = require('../permission/pet')
const auth = require('../controllers/auth')
const authWithPublic = require('../controllers/authWithPublic')
const router = Router({ prefix: '/api/v1/products' })
const util = require('../helpers/util')
const { validatePet } = require('../controllers/validation')
const config = require('../config')


//(ctx, next) => auth(ctx, next, true)
// for public user , so specifiy auth method , if user is not found in db
// , they can read pets but can't take any action
// otherwise , auth will check the user is login or not
// router.get('/', authWithPublic, filterConverter, validateDogFilter, getAll)
router.get('/', authWithPublic, getAll)
router.get('/:id([0-9]{1,})', authWithPublic, getById);

router.get('/profile', auth, getAllByUserId);

router.get('/image/:id([0-9]{1,})', getImageById);
router.post('/', auth, validatePet, createPet)

router.put('/:id([0-9]{1,})', auth, validatePet, updatePet)
router.del('/:id([0-9]{1,})', auth, deletepet)


async function getAll(ctx, next) {
  try {            
    const results = await model.getAllByFilter(
      {},
      {unlimited:true,sorting:1},
    ) 
    if (results.length) {
      ctx.status = 200
      ctx.body = results          
    }else{
      //return empty
      ctx.status = 200
      ctx.body = []      
    }

  } catch (ex) {
    util.createErrorResponse(ctx, ex)

  }
}


async function getAllByUserId(ctx, next) {
  try {            
    const results = await model.getAllByFilter(
      { "createdBy": ctx.state.user.id },
      {unlimited:true,sorting:1},
    ) 
    if (results.length) {
      ctx.status = 200
      ctx.body = results          
    }else{
      //return empty
      ctx.status = 200
      ctx.body = []      
    }

  } catch (ex) {
    util.createErrorResponse(ctx, ex)

  }
}


async function filterConverter(ctx, next) {
  const tryConvert = (ctx, key) => {
    try {
      if (ctx.request.query[key]) {
        ctx.request.query[key] = parseInt(ctx.request.query[key])
      }
    } catch (ex) {
      console.error(ex)
    }
  }
  if (ctx && ctx.request && ctx.request.query) {
    tryConvert(ctx, 'page')
    tryConvert(ctx, 'limit')
    tryConvert(ctx, 'breedID')

  }
  await next()
}


/*
async function getAll(ctx, next) {
  try {
    const body = ctx.request.query
    
    const { page, limit, ...data } = body
    //string to be like string such as '% str %'
    let filterData = util.filterPrepare(data)
    const results = await model.getAllByFilter(filterData, { page: body.page, limit: body.limit, order: body.order })
    const totalCount = await model.getAllCount(filterData)
    
    let canCreate = false;
    
    if(ctx.state.user){
      canCreate = ctx.state.user.role === "staff"
    }
     
    
    if (results.length) {

      for (result of results) {
        if (ctx.isAuthenticated()) {
          const canUpdate = can.update(ctx.state.user, result).granted
          const canDelete = can.delete(ctx.state.user, result).granted
         
          result.canUpdate = canUpdate;
          result.canDelete = canDelete;
          result.isFavourite = ctx.state.user.favourites[result.id]
        }
      }
      ctx.body = {}
      ctx.body.canCreate = canCreate
      ctx.body.totalCount = totalCount
      ctx.body.list = results
      ctx.body.favourites = ctx.isAuthenticated()?ctx.state.user.favourites:{}
    }else{
      //return empty
      ctx.status = 200
      ctx.body = {}
      ctx.body.canCreate = canCreate
      ctx.body.totalCount = 0
      ctx.body.list = []
      ctx.body.favourites = {}
    }

  } catch (ex) {
    util.createErrorResponse(ctx, ex)

  }
}
*/

async function getImageById(ctx, next) {
  const defaultImg = (ctx) => {
    //somthing wrong , return blank image
    let blankImgBase64 = config.DEFAULT_IMAGE
    const { type, image } = util.getImgByBase64(blankImgBase64)
    ctx.status = 200
    ctx.type = type
    ctx.body = image
  }
  try {
    let id = parseInt(ctx.params.id)
    const result = await model.getById(id)
    if (result) {
      const { type, image } = util.getImgByBase64(result.imageBase64)
      if (!type) {
        defaultImg(ctx)
        return
      }
      ctx.status = 200
      ctx.type = type
      ctx.body = image
    } else {
      defaultImg(ctx)
    }

  } catch (ex) {
    defaultImg(ctx)
  }
}

async function getById(ctx) {
  try {
    let id = parseInt(ctx.params.id)
    const result = await model.getById(id)
    if (result) {

      if (ctx.isAuthenticated()) {
        const canUpdate = can.update(ctx.state.user, result).granted
        const canDelete = can.delete(ctx.state.user, result).granted
        result.canUpdate = canUpdate;
        result.canDelete = canDelete;
        result.isFavourite = ctx.state.user.favourites[id]
        
      }



      result.comments = await commentModel.getByDogId(id)
      for(let comment of result.comments){
        comment.user = await userModel.getById(comment.userId)
      }
      const breed = await breedModel.getById(result.breedID)
      const createBy = await userModel.getById(result.createdBy)

      ctx.body = result;
      result.breed = breed
      result.createBy = createBy
      

    }

  } catch (ex) {
    util.createErrorResponse(ctx, ex)

  }
}

async function createPet(ctx) {
  try {
    const body = ctx.request.body
    const permission = can.create(ctx.state.user)

    if (!permission.granted) {
      ctx.status = 403;
      return;
    }
    body.createdBy = ctx.state.user.id
    let result = await model.add(body)
    if (result) {
      ctx.status = 201
      ctx.body = result
    } else {
      ctx.status = 201
      ctx.body = "{}"
    }
  } catch (ex) {
    util.createErrorResponse(ctx, ex)

  }
}


async function deletepet(ctx) {

  try {
    let id = parseInt(ctx.params.id)
    const pet = await model.getById(id)    
    const permission = can.delete(ctx.state.user, {createdBy:pet.createdBy})
    if (!permission.granted) {
      ctx.status = 403;
      return;
    } 
    let result = await model.delete(id)
    if (result) { 
      ctx.status = 201
      ctx.body = result
    } else {
      ctx.status = 201
      ctx.body = "{}"
    }
  } catch (ex) {
    util.createErrorResponse(ctx, ex)

  }
}

async function updatePet(ctx) {

  try {
    let id = ctx.params.id
    const body = ctx.request.body
    const permission = can.update(ctx.state.user, body)
    if (!permission.granted) {
      ctx.status = 403;
      return;
    }

    requestBody = { ...body }


    let result = await model.update(id, requestBody)
    if (result) {
      ctx.status = 201
      ctx.body = result
    } else {
      ctx.status = 201

      ctx.body = "{}"
    }
  } catch (ex) {
    util.createErrorResponse(ctx, ex)

  }
}

module.exports = router