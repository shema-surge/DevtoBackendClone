const {BadRequest , NotFound , Unauthorized} = require('http-errors')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const {JWT_SECRET} = process.env

const checkAuth = async(req,res,next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1]
        if(!token) throw Unauthorized("Please login")
        const userInfo = await jwt.verify(token,JWT_SECRET)
        if(!userInfo) throw BadRequest("Invalid token")

        req.user = userInfo
        
        next()
    }catch(err){
        next(err)
    }
}

module.exports = { checkAuth }