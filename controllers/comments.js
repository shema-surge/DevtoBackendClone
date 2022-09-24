const Comments = require('../models/comment')
const {BadRequest,NotFound} = require('http-errors')
const Posts = require('../models/post')
const Users = require('../models/user')


const createComment = async(req,res,next)=>{
    try{
        const {body} = req.body
        if(!req.params.postId) throw BadRequest('Please provide a postId')
        if(!await Posts.findById(req.params.postId)) throw NotFound('No such post found')

        const comment = {
            body:body,
            parentPost:req.params.postId,
            author:req.user.id
        }

        if(req.params.commentId){
            if(!await Comments.findById(req.params.commentId)) throw NotFound('No such Comment found')
            comment.parentId = req.params.commentId
        }
        
        const newComment = await Comments.create(comment)
        await Posts.findByIdAndUpdate(req.params.postId,{
            $addToSet:{comments:newComment._id}
        })
        await Users.findByIdAndUpdate(req.user.id,{
            $addToSet:{comments:newComment._id}
        })
        res.json({success:true,data:newComment})
    }catch(err){
        next(err)
    }
}

const updateComment = async(req,res,next)=>{
    try{
        const {body} = req.body
        if(!req.params.commentId) throw BadRequest('Please provide a commentId')
        if(!await Comments.findById(req.params.commentId)) throw NotFound('No such comment found')
        const updatedComment = await Comments.findByIdAndUpdate(req.params.commentId, {body:body})
        res.json({success:true,data:updatedComment})
    }catch(err){
        next(err)
    }
}

const deleteComment = async(req,res,next)=>{
    try{
        if(!req.params.commentId) throw BadRequest('Please provide a commentId')
        if(!await Comments.findById(req.params.commentId)) throw NotFound('No such comment found')
        await Posts.findByIdAndUpdate(req.params.postId,{
            $pull:{comments:req.params.commentId}
        })
        await Comments.findByIdAndDelete(req.params.commentId)
        res.json({success:true})
    }catch(err){
        next(err)
    }
}

const getCommentById = async(req,res,next)=>{
    try{
        if(!req.params.commentId) throw BadRequest('Please provide a commentId')
        const comment = await Comments.findById(req.params.commentId)
        if(!comment) throw NotFound('No such comment found')
        res.json({success:true,data:comment})
    }catch(err){
        next(err)
    }
}

const getCommentByUserId = async(req,res,next)=>{
    try{
        if(!req.params.userId) throw BadRequest('Please provide a userId')
        const comment = await Comments.find({author:req.params.userId})
        if(!comment) throw NotFound('No such comment found')
        res.json({success:true,data:comment})
    }catch(err){
        next(err)
    }
}


const likeComment = async(req,res,next)=>{
    try{
        if(!req.params.commentId) throw BadRequest('Please provide a commentId')
        if(!await Comments.findById(req.params.commentId)) throw NotFound('No such comment found')
        await Comments.findByIdAndUpdate(req.params.commentId,{
            $addToSet:{likes:req.user.id}
        })
        res.json({success:true})
    }catch(err){
        next(err)
    }
}

const unlikeComment = async(req,res,next)=>{
    try{
        if(!req.params.commentId) throw BadRequest('Please provide a commentId')
        if(!await Comments.findById(req.params.commentId)) throw NotFound('No such comment found')
        await Comments.findByIdAndUpdate(req.params.commentId,{
            $pull:{likes:req.user.id}
        })
        res.json({success:true})
    }catch(err){
        next(err)
    }
}


module.exports = {createComment,getCommentById,getCommentByUserId,updateComment,deleteComment,likeComment,unlikeComment}