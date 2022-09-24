const {Router} = require('express')
const {createPost,getAllPosts, updatePost, likePost, unlikePost, bookmarkPost, unbookmarkPost, getPostById, getPostByUserId} = require('../controllers/posts')
const { checkAuth } = require('../middleware/auth')

const router = Router()

router.use(checkAuth)

router.post('/',createPost)
router.get('/',getAllPosts)
router.get('/:postId',getPostById)
router.get('/:userId',getPostByUserId)
router.put('/:postId',updatePost)
router.post('/like/:postId',likePost)
router.post('/unlike/:postId',unlikePost)
router.post('/bookmark/:postId',bookmarkPost)
router.post('/unbookmark/:postId',unbookmarkPost)
module.exports = router