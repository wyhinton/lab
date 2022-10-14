import { NextFunction, Request, Response } from 'express';
import Joi, { ObjectSchema } from 'joi';
import { IJoiData } from '../interfaces/joi';

export const ValidateJoi = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);
            //if schema validation successful, then execute controller
            next();
        } catch (error) {
            //return unprocessable entity message (422) if schema validation fails
            console.error(error);
            return res.status(422).json({ error });
        }
    };
};

/**Define rules for username and password request */
export const Schemas = {
    data: Joi.object<IJoiData>({
        username: Joi.string().alphanum().min(3).max(15).required(),
        password: Joi.string().pattern(new RegExp(`^[a-zA-z0-9]{2,30}$`)).required()
    })
};
