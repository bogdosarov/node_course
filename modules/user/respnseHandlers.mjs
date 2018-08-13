import { readFile, createFile, deleteFile, updateFile } from "../../lib/fileStorrage"
import { validateUserModel } from "./model";

const usersStoragePath = '/users'

export const handleUserCreate = userInfo => new Promise((resolve, reject) => {
    const modelValidationErrors = validateUserModel(userInfo)

    if (modelValidationErrors.length) {
        reject({code: 422, payload: modelValidationErrors})
        return
    }

    readFile({ path: usersStoragePath, fileName: userInfo.email })
        .then(() => reject({
            code: 409,
            payload: `User with mail ${userInfo.email} already exist.`
        }))
        .catch(() => {
           createFile({ path: usersStoragePath, fileName: userInfo.email, data: JSON.stringify(userInfo) })
               .then(() => resolve({ code: 200 }))
               .catch(err => reject({ code: 400, payload: err }))
        })
})

export const handleUserRead = userEmail => new Promise((resolve, reject) => {
    readFile({ path: usersStoragePath, fileName: userEmail })
        .then(data => {
            const dataToSend = JSON.parse(data)
            delete dataToSend['password']

            resolve({ code: 200, payload: dataToSend })
        })
        .catch(err => reject({ code: 400, payload: err }))
})

export const handleUserUpdate = data => new Promise((resolve, reject) => {
    const requiredField = 'email'
    const requiredFields = [requiredField]

    Object.keys(data)
        .filter(key => key!== requiredField)
        .map(key => requiredFields.push(key))

    if(requiredFields.length < 2) {
        reject({code: 422, payload: 'Unprocessable Entity. Request should contain data to patch'})
        return
    }

    const validationErrors = validateUserModel({ data, validateFields: requiredFields })

    if( validationErrors.length ) {
        reject({code: 422, payload: validationErrors})
    } else {
        updateFile({ path: usersStoragePath, fileName: data.email, data: JSON.stringify(data) })
            .then(resolve)
            .catch(reject)
    }
})

export const handleUserDelete = userEmail => new Promise((resolve, reject) => {
    deleteFile({ path: usersStoragePath, fileName: userEmail })
        .then(() => resolve({ code: 200 }))
        .catch(err => reject({ code: 400, payload: err }))
})