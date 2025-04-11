import { param} from 'express-validator'

export const validateUserId =[
    param('userId').isMongoId().withMessage('Invalid userId format')
]