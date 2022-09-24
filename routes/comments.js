const {Router} = require('express')
const { createComment, getCommentById, getCommentByUserId, updateComment, likeComment, unlikeComment, deleteComment } = require('../controllers/comments')
const { checkAuth } = require('../middleware/auth')

const router = Router()

router.use(checkAuth)

router.post('/:postId/:commentId',createComment)
router.get('/:commentId',getCommentById)
router.get('/:userId',getCommentByUserId)
router.put('/:commentId',updateComment)
router.post('/like/:commentId',likeComment)
router.post('/unlike/:commentId',unlikeComment)
router.delete('/:commentId',deleteComment)
module.exports = router