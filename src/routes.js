const Joi = require('joi');
const { registerHandler, loginHandler, verifyTokenHandler, logoutHandler, getUserByIdHandler, editUserDataHandler, resetPasswordHandler } = require('./handler')

const routes = [

    //User Register
    {
        method: 'POST',
        path: '/register',
        handler: registerHandler,
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().min(8).required().messages({
                        'string.min': 'Password must be at least 8 characters long',
                    }),
                    username: Joi.string().alphanum().min(3).max(20).required().messages({
                        'string.min': 'Username must be between 3 and 20 characters',
                    }),
                    weight: Joi.number().integer().required(),
                    height: Joi.number().integer().required()
                }),
                failAction: (request, h, err) => {
                    throw err;
                }
            },
        },
    },

    //User Login
    {
        method: 'POST',
        path: '/login',
        handler: loginHandler,
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().min(6).required()
                })
            }
        }

    },

    //Protected Resources
    {
        method: 'GET',
        path: '/protected',
        options: {
            pre: [{ method: verifyTokenHandler }],
            handler: (request, h) => {
                return { success: true, message: 'This is protected resources'};
            }
        }
    },

    //User Logout
    {
        method: 'POST',
        path: '/logout',
        handler: logoutHandler,
    },

    //Get User Info
    {
        method: 'GET',
        path: '/user/{uid}',
        handler: getUserByIdHandler,
    },

    //Edit User Info
    {
        method: 'PUT',
        path: '/edit-profile/{uid}',
        handler: editUserDataHandler,
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().optional(),
                    password: Joi.string().min(8).optional().messages({
                        'string.min': 'Password must be at least 8 characters long',
                    }),
                    username: Joi.string().alphanum().min(3).max(20).optional().messages({
                        'string.min': 'Username must be between 3 and 20 characters',
                    }),
                    height: Joi.number().integer().optional(),
                    weight: Joi.number().integer().optional(),
                    currentEmail: Joi.string().email().required(),
                    currentPassword: Joi.string().min(6).required(),
                }),
                params: Joi.object({
                    uid: Joi.string().required(),
                })
            }
        }
    },
    
    //Reset User Password 
    {
        method: 'POST',
        path: '/reset-password',
        handler: resetPasswordHandler,
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                })
            }
        }
    },
];

module.exports = routes;