

const Router = require('koa-router')



const userModel = require('../models/users')
const model = require('../models/products')
const can = require('../permission/product')
const auth = require('../controllers/auth')
const authWithPublic = require('../controllers/authWithPublic')
const router = Router({ prefix: '/api/v1/products' })
const util = require('../helpers/util')
const { validateProduct } = require('../controllers/validation')
const config = require('../config')
//(ctx, next) => auth(ctx, next, true)
// for public user , so specifiy auth method , if user is not found in db
// , they can read products but can't take any action
// otherwise , auth will check the user is login or not
// router.get('/', authWithPublic, filterConverter, validateDogFilter, getAll)
router.get('/', authWithPublic,filterConverter, getAll)
router.get('/:id([0-9]{1,})', authWithPublic, getById);
router.get('/ids', authWithPublic, getByIds);
router.get('/image/:id([0-9]{1,})', getImageById);
router.post('/', auth, validateProduct, createProduct)
router.put('/:id([0-9]{1,})', auth, validateProduct, editProduct)
router.delete('/:id([0-9]{1,})/:companyCode', auth, deleteProduct)

async function getAll(ctx, next) {
  try {            
    var query = ctx.request.query
    var results = null
    if(query.searchText){
      results = await model.getAllByFilter(
        {$or:[{name:query.searchText},{about:query.searchText} ]},
        {unlimited:false,sorting:-1,page:query.page,limit:query.limit},
      ) 
    }else{
      results = await model.getAllByFilter(
        {},
        {unlimited:false,sorting:-1,page:query.page,limit:query.limit},
      ) 
    }
    if (results.length) {
      ctx.status = 200
      
      for (result of results) {
        if (ctx.isAuthenticated()) {
          const canEdit = can.update(ctx.state.user, result).granted
          const canDelete = can.delete(ctx.state.user, result).granted
         
          result.canEdit = canEdit;
          result.canDelete = canDelete;
          
        }else{
          result.canEdit = false;
          result.canDelete = false;
        }

      }
      
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
  const tryConvertInt = (ctx, key) => {
    try {
      if (ctx.request.query[key]) {
        ctx.request.query[key] = parseInt(ctx.request.query[key])
      }
    } catch (ex) {
      console.error(ex)
    }
  }
  const tryConvertStringLike = (ctx, key) => {
    try {
      if (ctx.request.query[key]) {
        ctx.request.query[key] = new RegExp(".*" + ctx.request.query[key]  + ".*")
      }
    } catch (ex) {
      console.error(ex)
    }
  }
  if (ctx && ctx.request && ctx.request.query) {
    tryConvertInt(ctx, 'page')
    tryConvertInt(ctx, 'limit')
    tryConvertStringLike(ctx,"searchText")

  }
  await next()
}

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

async function createProduct(ctx) {
  try {
    const body = ctx.request.body
    const permission = can.create(ctx.state.user)

    if (!permission.granted) {
      ctx.status = 403;
      return;
    }
    body.createdBy = ctx.state.user.id
    body.companyCode =  ctx.state.user.companyCode
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

async function editProduct(ctx) {
  try {
    let id = ctx.params.id
    const body = ctx.request.body
    const permission = can.update(ctx.state.user,body)

    if (!permission.granted) {
      ctx.status = 403;
      return;
    }
    let result = await model.update(id,body)
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

async function deleteProduct(ctx) {
  try {
    let id = ctx.params.id
    let companyCode = ctx.params.companyCode
    const permission = can.delete(ctx.state.user,{companyCode:companyCode})

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

    
      const createBy = await userModel.getById(result.createdBy)

      ctx.body = result;
      result.createBy = createBy
      

    }

  } catch (ex) {
    util.createErrorResponse(ctx, ex)

  }
}

async function getByIds(ctx) {
  try {
    let ids = ctx.request.query.id
    if(ids==undefined||ids==null){
      ctx.status = 200
      ctx.body = []
      return
    }
    if(typeof(ids)=="string"){
      ids = ids.split(",")
    }
    const result = await model.getByIds(ids)
    ctx.body = result

  } catch (ex) {
    util.createErrorResponse(ctx, ex)

  }
}




module.exports = router