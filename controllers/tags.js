const Users = require('../models/user')
const Tags = require('../models/tag')
const Posts = require('../models/post')
const {BadRequest} = require('http-errors')

const createTags = async function(postId,tags){
    tags.forEach(async (name)=>{
        let tag = await Tags.findOne({name:name})
        if(!tag){
            tag = await Tags.create({name:name})
        }
        await Posts.findByIdAndUpdate(postId,{
            $addToSet:{tags:tag._id}
        })
    })
}

const removeTags = async function(postId,tags){
    tags.forEach(async (name)=>{
        let tag = await Tags.findOne({name:name})
        if(tag){
            await Posts.findByIdAndUpdate(postId,{
                $pull:{tags:tag._id}
            })
        }
    })
}

const updateTags = async function(postId,tags){
    const post = await Posts.findById(postId)
    const postTags = post.tags
    removeTags(postId,postTags)
    createTags(postId,tags)
}

const getAllTags = async(req,res,next)=>{
    try{
        const tags = await Tags.find()
        res.json({success:true,data:tags})
    }catch(err){
        next(err)
    }
   
}

const followTag = async(req,res,next)=>{
    try{
        if(!req.params.tagId) throw BadRequest('Please provide a tagId')
        if(!await Tags.findById(req.params.tagId)) throw NotFound('No such tag found')
        await Users.findByIdAndUpdate(req.user.id,{
            $addToSet:{followedTags:req.params.tagId}
        })
        res.json({success:true})
    }catch(err){
        next(err)
    }
}

const unfollowTag = async(req,res,next)=>{
    try{
        if(!req.params.tagId) throw BadRequest('Please provide a tagId')
        if(!await Tags.findById(req.params.tagId)) throw NotFound('No such tag found')
        await Users.findByIdAndUpdate(req.user.id,{
            $pull:{followedTags:req.params.tagId}
        })
        res.json({success:true})
    }catch(err){
        next(err)
    }
}



module.exports = {createTags,updateTags,getAllTags,followTag,unfollowTag}