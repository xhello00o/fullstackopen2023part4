
const logger = require("./logger");
const jwt = require('jsonwebtoken')
require('dotenv').config()

const userExtractor = async (request, response, next) => {
    console.log("token", request.token);
    if (request.token && request.token !== "") {
        const decodedToken = await jwt.verify(request.token, process.env.SECRET);
        console.log("decoded", decodedToken);
        if (!decodedToken.id) {
            return response.status(401).json({ error: "token invalid" });
        }
        request.user = decodedToken.id.toString();
    }
    else{
        console.log("abc")
        response.status(401).json({ error: "token invalid" });
    }

    
    next();
};

const tokenExtractor = (request, response, next) => {

    const authorization = request.get('Authorization')
    console.log("auth1:",authorization)
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
        console.log("tokenextractor token:",request.token)
    }
    else {
        request.token = null
        console.log("tokenextractor token:",request.token)
    }
    next()

}

const requestLogger = (request, response, next) => {
    logger.info("Method:", request.method);
    logger.info("Path:  ", request.path);
    logger.info("Body:  ", request.body);
    logger.info("---");
    next();
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint", message: response });
};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
};
