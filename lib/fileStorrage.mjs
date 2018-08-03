import fs from 'fs'
import path from 'path'
import config from '../config'

const basePath = path.join(process.cwd(), `${config.filesStorageDirectory}`);

export const createFile = ({ path, fileName, fileExtension = 'json', data = '' }) => new Promise((resolve, reject) => {
    const filePath = `${basePath}${path}/${fileName}.${fileExtension}`

    fs.open(filePath, 'wx', (err, fileDescriptor) => {
       if(err) {
           reject(err)
           return
       }

       fs.writeFile(fileDescriptor, data, err => {
           if(err) {
               reject(err)
               return
           }

           fs.close(fileDescriptor, err => {
               if(err) {
                   reject(err)
                   return
               }

               resolve(`File ${filePath} was created`)
           })
       })
    })
})

export const readFile = ({ path, fileName, fileExtension = 'json' }) => new Promise((resolve, reject) => {
    fs.readFile(`${basePath}${path}/${fileName}.${fileExtension}`, 'utf8', (err, data) => {
        if(err) {
            reject(err)
            return
        }

        resolve(data)
    });
})

export const updateFile = ({ path, fileName, fileExtension = 'json', data = '' }) => new Promise((resolve, reject) => {
    const filePath = `${basePath}${path}/${fileName}.${fileExtension}`

    fs.open(filePath, 'r+', (err, fileDescriptor) => {
        if(err) {
            reject(err)
            return
        }

        fs.truncate(fileDescriptor, err => {
            if(err) {
                reject(err)
                return
            }

            fs.writeFile(fileDescriptor, data, err => {
                if(err) {
                    reject(err)
                    return
                }

                fs.close(fileDescriptor, err => {
                    if(err) {
                        reject(err)
                        return
                    }

                    resolve(`File ${filePath} was updated`)
                })
            })
        })
    })
})

export const deleteFile = ({ path, fileName, fileExtension = 'json' }) => new Promise((resolve, reject) => {
    const filePath = `${basePath}${path}/${fileName}.${fileExtension}`
    fs.unlink(filePath, err => {
        if(err) {
            reject(err)
            return
        }

        resolve(`File ${filePath} was removed`)
    })
})