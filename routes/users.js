const express = require('express');
const { signup, updateUser, logout, login, followUser , unfollowUser} = require('../controllers/users');
const { checkAuth } = require('../middleware/auth');
const router = express.Router()

router.post('/signup',signup)

router.post('/login',login)

router.use(checkAuth)

router.post('/logout',logout)

router.put('/:id',updateUser)

router.put('/follow/:followId',followUser)

router.put('/unfollow/:followId',unfollowUser)

module.exports = router;
