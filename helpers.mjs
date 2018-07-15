import url from "url";

export const getParsedUrl = req => url.parse(req.url, true);
export const getTrimmedPath = path => path.replace(/^\/+|\/+$/g, '');
export const getQueryStringObject = url => url.query || {};
