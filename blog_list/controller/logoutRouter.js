const logoutRouter = require('express').Router()
const {Session} = require('../models/index')
const {userExtractor,sessionValidator} = require('../util/middleware')

logoutRouter.delete('/',
userExtractor,
sessionValidator,
async (req,res, next)=> {

    if ( !req.user || !req.session ) {
        const error = new Error('Not Signed in')
        error.name = `NotAuthenticatedError`
        error.message = `You are not signed in`

        next(error)
    }

    const deleteSession = await Session.destroy({
        where:{
            id: req.session
    }})

    
    res.status(204).json(deleteSession)


})


module.exports = logoutRouter