import http from 'http';
import string_decoder from 'string_decoder';

import config from './config';
import { DEFAULT_RESPONSE_STATUS } from './constants';
import { getParsedUrl, getQueryStringObject, getTrimmedPath } from './helpers.mjs';
import { responseHandlersMap as usersRsponseHandlersMap } from "./modules/user/respnseHandlers";

const notFoundHandler = (data, callback) => callback({ statusCode: 404, payload: 'Page not found' });

const registeredHandlers = {
    ...usersRsponseHandlersMap,
}

const getHandler = ({ method, path }) => {
  const pathHandlers = registeredHandlers[path]
  const methodHandler = pathHandlers && registeredHandlers[path][method]

  return methodHandler ? methodHandler : notFoundHandler;
}

function runServer(req, res) {
  const parsedUrl = getParsedUrl(req);
  const trimmedPath = getTrimmedPath(parsedUrl.pathname);
  const queryStringObject = getQueryStringObject(parsedUrl);
  const httpMethodInLowerCase = req.method.toLowerCase();
  const httpHeaders = req.headers;
  const decoder = new string_decoder.StringDecoder('utf-8');
  let buffer = '';

  req.on('data', data => buffer += decoder.write(data))
  req.on('end', () => {
    buffer += decoder.end()

    const handler = getHandler({ method: httpMethodInLowerCase, path: trimmedPath })
    const data = {
      trimmedPath,
      queryStringObject,
      httpMethodInLowerCase,
      httpHeaders,
      payload: buffer,
    };

    handler(data, ({ statusCode = DEFAULT_RESPONSE_STATUS, payload = {} }) => {
      const payloadString = JSON.stringify(payload);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log(`Response on ${trimmedPath}, with data: ${payloadString}`);
    })

  })
}

const httpServer = http.createServer(function(req,res){
  runServer(req,res);
});

httpServer.listen(config.httpPort, () => console.log('The HTTP server is running on port '+config.httpPort))