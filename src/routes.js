const Joi = require('joi');
const { registerHandler, loginHandler, verifyTokenHandler, logoutHandler, getUserByIdHandler, editUserDataHandler, editUserInfoHandler, resetPasswordHandler, addCalorieHistoryHandler, getCalorieHistoryByDateHandler, getAllCalorieHistoryHandler, editCalorieHistoryHandler } = require('./handler')

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
                    gender: Joi.string().valid('male', 'female').required(),
                    age: Joi.number().integer().min(1).required(),
                    weight: Joi.number().positive().required(),
                    height: Joi.number().positive().required(),
                    plan: Joi.string().trim().allow('', null).valid('defisit', 'bulking').optional()
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
                return { success: true, message: 'This is protected resources' };
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

    //Edit User Data
    {
        method: 'PUT',
        path: '/edit-credential/{uid}',
        handler: editUserDataHandler,
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().optional(),
                    password: Joi.string().min(8).optional().messages({
                        'string.min': 'Password must be at least 8 characters long',
                    }),
                    currentEmail: Joi.string().email().required(),
                    currentPassword: Joi.string().min(8).required()
                }),
                params: Joi.object({
                    uid: Joi.string().required(),
                }),
                failAction: (request, h, err) => {
                    throw err;
                }
            }
        }
    },

    {
        method: 'PUT',
        path: '/edit-info/{uid}',
        handler: editUserInfoHandler,
        options: {
            validate: {
                payload: Joi.object({
                    username: Joi.string().alphanum().min(3).max(20).optional().messages({
                        'string.min': 'Username must be between 3 and 20 characters',
                    }),
                    age: Joi.number().integer().min(1).optional(),
                    height: Joi.number().positive().optional(),
                    weight: Joi.number().positive().optional(),
                    dailyCalorieNeeds: Joi.number().positive().optional(),
                    plan: Joi.string().trim().allow('', null).valid('defisit', 'bulking').optional(),
                }),
                params: Joi.object({
                    uid: Joi.string().required(),
                }),
                failAction: (request, h, err) => {
                    throw err;
                }
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

    {
        method: 'POST',
        path: "/users/{uid}/calorie-history",
        handler: addCalorieHistoryHandler,
        options: {
            validate: {
                payload: Joi.object({
                    calories: Joi.number().positive().required()
                })
            }
        }
    },

    {
        method: 'GET',
        path: '/users/{uid}/calorie-history',
        handler: getCalorieHistoryByDateHandler,
        options: {
            validate: {
                query: Joi.object({
                    date: Joi.date().iso().required()
                })
            }
        }
    },

    {
        method: 'GET',
        path: '/users/{uid}/all-calorie-history',
        handler: getAllCalorieHistoryHandler
    },

    {
        method: 'PUT',
        path: '/users/{uid}/calorie-history/{docId}',
        handler: editCalorieHistoryHandler,
        options: {
            validate: {
                payload: Joi.object({
                    calories: Joi.number().positive().required()
                })
            }
        }
    }
];

module.exports = routes;