const Router = require('koa-router')
const router = Router({ prefix: '/api/v1/auth' })
const util = require('../helpers/util')
const passport = require('../helpers/passport.js')
const config = require('../config')
const auth = require('../controllers/auth')

const jwt = require('jsonwebtoken');

router.post('/',passport.authenticate(['basic'],{session:false}), signin)


router.get('/signout',auth,signout)
router.post('/google/token',passport.authenticate(['google-token'],{session:false}), googleSigninByToken)

router.post('/firebase/token',passport.authenticate(['custom'],{session:false}),firebasesigninByToken)


async function signin(ctx, next) {
  try {
   
    if (ctx.isAuthenticated()) {
      if(ctx.state.user.status){
        //some error status when auth
        ctx.status = ctx.state.user.status
        ctx.message = ctx.state.user.message
        return
      }
      const token = await jwt.sign(ctx.state.user, config.SECRET, { expiresIn: config.TOKEN_EXPIRED });
      
      
      ctx.status = 200
      ctx.body = 'Bearer ' + token
    } else {
      ctx.status = 401
    }

  } catch (ex) {
    console.log(ex)
    util.createErrorResponse(ctx, ex)

  }
}

async function googleSigninByToken(ctx, next) {

  try {
    
    if (ctx.isAuthenticated()) {
      if(ctx.state.user.status){
        ctx.status = ctx.state.user.status
        ctx.message = ctx.state.user.message
        return
      }
      const token = await jwt.sign(ctx.state.user, config.SECRET, { expiresIn: config.TOKEN_EXPIRED });

      ctx.status = 200
      ctx.body = 'Bearer ' + token


    } else {
      ctx.status = 401
    }

  } catch (ex) {
    util.createErrorResponse(ctx, ex)

  }
}

async function firebasesigninByToken(ctx, next) {

  try {
    
    if (ctx.isAuthenticated()) {
      if(ctx.state.user.status){
        ctx.status = ctx.state.user.status
        ctx.message = ctx.state.user.message
        ctx.body = ctx.state.user.message
        return
      }
      ctx.status = 200
      ctx.body = ctx.state.user

    } else {
      ctx.status = 401
    }

  } catch (ex) {
    util.createErrorResponse(ctx, ex)

  }
}

async function firebasesignupByToken(ctx, next) {

  try {
    
    if (ctx.isAuthenticated()) {
      firebaseUser = ctx.state.user.firebaseUser
      

    } else {
      ctx.status = 401
    }

  } catch (ex) {
    util.createErrorResponse(ctx, ex)

  }
}


async function signout(ctx) {
  try {
    if (ctx.isAuthenticated()) {
      ctx.status = 200
      
    }
    ctx.status = 200
    ctx.body = {isLogin:false,token: ''}
  } catch (ex) {
    util.createErrorResponse(ctx, ex)

  }
}


module.exports = router