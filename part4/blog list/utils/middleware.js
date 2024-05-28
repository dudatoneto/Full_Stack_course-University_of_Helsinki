const logger = require("./logger");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const User = require("../models/user");

function tokenExtractor(request, response, next) {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  } else request.token = null;
  next();
}

async function userExtractor(request, response, next) {
  const decodedToken = jwt.verify(request.token, config.SECRET_TOKEN);
  if (!decodedToken.id) {
    return response.status(400).json({ error: "invalid token" });
  }

  request.user = await User.findById(decodedToken.id);
  next();
}

const requestLogger = (request, response, next) => {
  const requestBodyCopy = { ...request.body };
  if (requestBodyCopy.hasOwnProperty("password")) {
    delete requestBodyCopy.password;
  }

  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", requestBodyCopy);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    console.log("*** malformatted value ***");
    console.log(`property: ${error.path}`);
    console.error(error.message);

    return response
      .status(400)
      .send({ error: "malformatted value", property: error.path });
  } else if (error.name === "ValidationError") {
    console.log("*** validation failed ***");

    let errorString = "";
    Object.keys(error.errors).forEach((key) => {
      const property = error.errors[key];
      errorString += `property ${property.path} is ${property.kind}; `;
    });

    console.log(errorString);
    console.error(error.message);

    return response.status(400).json({ error: errorString });
  } else if (error.name === "JsonWebTokenError") {
    console.log("*** token error ***");
    console.error(error.message);

    return response.status(400).json({ error: error.message });
  } else if (error.code === 11000) {
    console.log("*** unique constraint violated ***");
    console.log(`properties: ${Object.keys(error.keyValue)}`);
    console.error(error.message);

    return response.status(400).send({
      error: "unique constraint violated",
      properties: Object.keys(error.keyValue),
    });
  }

  logger.error(error.message);
  response.status(500).end();
  next(error);
};

module.exports = {
  tokenExtractor,
  userExtractor,
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
