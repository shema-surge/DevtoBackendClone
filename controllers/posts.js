const {Unauthorized,UnprocessableEntity,BadRequest,NotFound} = require('http-errors')
const Posts = require('../models/post')
const Tags = require('../models/tag')
const Users = require('../models/user')
const Comments = require('../models/comment')
const { createTags,updateTags } = require('./tags')

const createPost = async(req, res, next)=>{
    try{
        const {title,coverImg,body,tags} = req.body
        if(!title|| !coverImg || !body) throw UnprocessableEntity('Please fill in the required fields')
        const post = {
            title,
            coverImg,
            body,
            author:req.user.id,
        }

        const newPost = await Posts.create(post)

        if(tags) createTags(newPost._id,tags)

        res.json({success:true})
    }catch(err){
        next(err)
    }
}

const updatePost = async(req, res, next)=>{
    try{
        const {title,body,tags} = req.body
        if(!title==="" || !body==="") throw UnprocessableEntity('Please fill in the required fields')
        if(!req.params.postId) throw BadRequest('Please provide a postId')
        const thepost  = await Posts.findById(req.params.postId)
        if(!thepost) throw NotFound('No such post exists')
        if(!thepost.author === req.user.id) throw Unauthorized('Cannot update this post')
        const post = await Posts.findByIdAndUpdate(req.params.postId,{
            title:title,
            body:body
        })
        updateTags(req.params.postId,tags)
        
        res.json({success:true})
    }catch(err){
        next(err)
    }
}

const getAllPosts = async(req,res,next)=>{
    try{
        const tags = await Posts.find().populate('tags')
        res.json({success:true,data:tags})
    }catch(err){
        next(err)
    }
   
}

const getPostById = async(req,res,next)=>{
    try{
        if(!req.params.postId) throw BadRequest('Please provide a postId')
        const post = await Posts.findById(req.params.postId)
        if(!post) throw NotFound('No such post found')
        res.json({success:true,data:post})
    }catch(err){
        next(err)
    }
}

const getPostByUserId = async(req,res,next)=>{
    try{
        if(!req.params.userId) throw BadRequest('Please provide a userId')
        const post = await Posts.find({author:req.params.userId})
        if(!post) throw NotFound('No such post found')
        res.json({success:true,data:post})
    }catch(err){
        next(err)
    }
}

const likePost = async(req,res,next)=>{
    try{
        if(!req.params.postId) throw BadRequest('Please provide a postId')
        if(!await Posts.findById(req.params.postId)) throw NotFound('No such post found')
        const post = await Posts.findByIdAndUpdate(req.params.postId,{
            $addToSet:{likes:req.user.id}
        })
        res.json({success:true})
    }catch(err){
        next(err)
    }
}

const unlikePost = async(req,res,next)=>{
    try{
        if(!req.params.postId) throw BadRequest('Please provide a postId')
        if(!await Posts.findById(req.params.postId)) throw NotFound('No such post found')
        const post = await Posts.findByIdAndUpdate(req.params.postId,{
            $pull:{likes:req.req.user.id}
        })
        res.json({success:true})
    }catch(err){
        next(err)
    }
}


const bookmarkPost = async(req,res,next)=>{
    try{
        if(!req.params.postId) throw BadRequest('Please provide a postId')
        if(!await Posts.findById(req.params.postId)) throw NotFound('No such post found')
        await Users.findByIdAndUpdate(req.user.id,{
            $addToSet:{bookmarks:req.params.postId}
        })
        res.json({success:true})
    }catch(err){
        next(err)
    }
}

const unbookmarkPost = async(req,res,next)=>{
    try{
        if(!req.params.postId) throw BadRequest('Please provide a postId')
        if(!await Posts.findById(req.params.postId)) throw NotFound('No such post found')
        await Users.findByIdAndUpdate(req.user.id,{
            $pull:{bookmarks:req.params.postId}
        })
        res.json({success:true})
    }catch(err){
        next(err)
    }
}

const deletePost = async(req,res,next)=>{
    try{
        if(!req.params.postId) throw BadRequest('Please provide a postId')
        let post = await Posts.findById(req.params.postId)
        if(!post) throw NotFound('No such post found')
        if(!post.author===req.user.id) throw Unauthorized('Cannot delete this post')
        //delete the comments
        const comments = await Comments.find({parentPost:req.params.postId})
        if(comments){
            comments.forEach(async(comment)=>{
                await Comments.findByIdAndDelete(comment._id)
            })
        }
        await Posts.findByIdAndDelete(req.params.postId)
        res.json({success:true})
    }catch(err){
        next(err)
    }
}

module.exports = {createPost,getAllPosts,getPostById,getPostByUserId,updatePost,likePost,unlikePost,bookmarkPost,unbookmarkPost,deletePost}