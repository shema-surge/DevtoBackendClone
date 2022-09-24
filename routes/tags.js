const {Router} = require('express')
const { getAllTags, followTag, unfollowTag } = require('../controllers/tags')
const { checkAuth } = require('../middleware/auth')

const router = Router()

router.use(checkAuth)

router.get('/',getAllTags)
router.post('/follow/:tagId',followTag)
router.post('/unfollow/:tagId',unfollowTag)

module.exports = router