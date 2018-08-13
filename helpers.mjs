import url from "url";

export const getParsedUrl = req => url.parse(req.url, true);
export const getTrimmedPath = path => path.replace(/^\/+|\/+$/g, '');
export const getQueryStringObject = url => url.query || {};

export const validateEmail = email => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const validateUserPassword = password => password.length >= 8