const {UnprocessableEntity,Forbidden,NotFound,Unauthorized} = require('http-errors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

require('dotenv').config()

const {JWT_SECRET} = process.env

const signup = async(req,res,next)=>{
  try{
    console.log(req.body)
    const {name,email,password} = req.body
    if(!name || !email || !password) throw UnprocessableEntity('Please provide a valid name,email and password')
    if(await User.findOne({email:email})) throw Forbidden('This email is already registered')
    const user = {
      name:name,
      email:email,
      password:password
    }
    await User.create(user)
    res.json({success:true})
  }catch(err){
    next(err)
  }
}

const login = async(req, res, next)=>{
  try{
    console.log(req.body)
    const {email,password} = req.body
    if(!email || !password) throw UnprocessableEntity('Please provide email and password')
    const user = await User.findOne({email:email})
    if(!user) throw NotFound('This user does not exist')
    const valid = await bcrypt.compare(password,user.password)
    if(!valid) throw Unauthorized('Please provide a valid email and password')

    const userInfo = {
      id:user._id,
    }

    const token = await jwt.sign(userInfo,JWT_SECRET,{expiresIn:"1h"})

    res.json({success:true,token})
  }catch(err){
    next(err)
  }
}

const logout = async(req,res,next)=>{
  try{

    res.send('Still working on it')

  }catch(err){
    next(err)
  }
}

const updateUser = async(req,res,next)=>{
  try{
    if(!req.params.id ) throw BadRequest('No User_id found')
    const updatedUser = await User.findByIdAndUpdate(req.params.id,req.body,{new:true})
    if(!updatedUser) throw NotFound('Invalid user id or request body keys')
    res.json({success:true,data:updatedUser})
  }catch(err){
    next(err)
  }
}

const followUser = async(req,res,next)=>{
  try{
    if(!req.params.followId) throw BadRequest('No follow id found')

    const user = await User.findByIdAndUpdate(req.user.id,{
      $addToSet: {following: req.params.followId},
    },{new:true})

    if(!user) throw NotFound('Invalid user id')
    res.json({success:true,data:user})
  }catch(err){
    next(err)
  }
}

const unfollowUser = async(req,res,next)=>{
  try{
    if(!req.params.followId) throw BadRequest('No follow id found')

    const user = await User.findByIdAndUpdate(req.user.id,{
      $pull: {following: req.params.followId},
    },{new:true})

    if(!user) throw NotFound('Invalid user id')
    res.json({success:true,data:user})
  }catch(err){
    next(err)
  }
}

module.exports = {signup,login,logout,updateUser,followUser,unfollowUser}