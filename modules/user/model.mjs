import some from 'lodash/some'
import {validateEmail, validateUserPassword} from "../../helpers"

export const userModel = {
    name: {
        type: 'string',
        required: true,
        minLength: 1,
    },
    email: {
        type: 'string',
        required: true,
        check: validateEmail,
    },
    streetAddress: {
        type: 'string',
        required: true,
        minLength: 5,
    },
    password: {
        type: 'string',
        required: true,
        check: validateUserPassword,
    }
}

export const validateUserModel = ({data, validateFields}) => {
    const validationErrors = []
    const keysToValidate = validateFields ? validateFields : Object.keys(data)

    if(!validateFields) {
        const isWrongModel = some(Object.keys(userModel), key => keysToValidate.indexOf(key) < 0)

        isWrongModel && validationErrors.push({
            errorText: 'Invalid user model'
        })

        return validationErrors
    }

    keysToValidate.map(key => {
        const modelField = userModel[key]

        if(modelField) {
            if(modelField.check) {
                const isValid = modelField.check(data[key])

                if(!isValid) {
                    validationErrors.push({
                        fieldName: key,
                        errorText: `Field invalid ${key}` // todo: add check error message or show default.
                    })
                }
            }

            if(modelField.type === 'string' && !modelField.check) {
                if(typeof data[key]!== 'string') {
                    validationErrors.push({
                        fieldName: key,
                        errorText: `${key} Should be a string`
                    })
                }

                if(data[key].length < modelField.minLength || data[key].length < 1) {
                    validationErrors.push({
                        fieldName: key,
                        errorText: `${key} should have min length ${modelField.minLength || 1}`
                    })
                }
            }

        } else {
            validationErrors.push({
                fieldName: key,
                errorText: `Unknown field ${key}`
            })
        }
    })

    return validationErrors
}
