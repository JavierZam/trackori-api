const Joi = require('joi');
const { registerHandler, loginHandler, verifyTokenHandler, logoutHandler, getUserByIdHandler, editUserDataHandler, editUserInfoHandler, resetPasswordHandler, addCalorieHistoryHandler, getCalorieHistoryByDateHandler, getAllCalorieHistoryHandler, editCalorieHistoryHandler, addAllCalorieHistoryHandler, getAllFoodsHistoryHandler, getFoodsHistoryByIdHandler, getAllFoodsCollectionHandler, getFoodsByIdHandler } = require('./handler')

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
                    plan: Joi.string().trim().allow('', null).valid('defisit', 'bulking', 'no plan').optional()
                }),
                failAction: (request, h, err) => {
                    throw err;
                }
            }
        }
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

    // Create new document in calorie-history subcollection
    {
        method: 'POST',
        path: "/users/{uid}/calorie-history",
        handler: addCalorieHistoryHandler,
        options: {
            validate: {
                payload: Joi.object({
                    calories: Joi.number().positive().required(),
                    name:Joi.string().required(),
                    portion: Joi.number().positive().required(),
                    unit: Joi.string().required()
                }),
                failAction: (request, h, err) => {
                    throw err;
                }
            }
        }
    },

    // Get data in calorie-history subcollection by date
    {
        method: 'GET',
        path: '/users/{uid}/get-calorie-history',
        handler: getCalorieHistoryByDateHandler,
        options: {
            validate: {
                query: Joi.object({
                    date: Joi.date().iso().required()
                }),
                failAction: (request, h, err) => {
                    throw err;
                }
            }
        }
    },

    // Get all data in calorie-history subcollection
    {
        method: 'GET',
        path: '/users/{uid}/all-calorie-history',
        handler: getAllCalorieHistoryHandler
    },

    // Edit data in calorie-history subcollection
    {
        method: 'PUT',
        path: '/users/{uid}/calorie-history/{docId}',
        handler: editCalorieHistoryHandler,
        options: {
            validate: {
                payload: Joi.object({
                    calories: Joi.number().positive().allow(null).optional(),
                    name: Joi.string().trim().allow('', null).optional(),
                    portion: Joi.number().positive().allow(null).optional(),
                    unit: Joi.string().allow('', null).optional(),
                }),
                failAction: (request, h, err) => {
                    throw err;
                }
            }
        }
    },

    // Edit user information
    {
        method: 'PUT',
        path: '/edit-info/{uid}',
        handler: editUserInfoHandler,
        options: {
            validate: {
                payload: Joi.object({
                    username: Joi.string().alphanum().trim().allow('', null).min(3).max(20).optional().messages({
                        'string.min': 'Username must be between 3 and 20 characters',
                    }),
                    age: Joi.number().integer().allow(null).min(1).optional(),
                    height: Joi.number().positive().allow(null).optional(),
                    weight: Joi.number().positive().allow(null).optional(),
                    dailyCalorieNeeds: Joi.number().positive().allow(null).optional(),
                    plan: Joi.string().trim().allow('', null).valid('defisit', 'bulking', 'no plan').optional(),
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

    //Protected Resources, verifying user token
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

    //Get user info by uid
    {
        method: 'GET',
        path: '/user/{uid}',
        handler: getUserByIdHandler,
    },

    //Edit user credential, email or password
    {
        method: 'PUT',
        path: '/edit-credential/{uid}',
        handler: editUserDataHandler,
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().trim().allow('', null).optional(),
                    password: Joi.string().trim().allow('', null).min(8).optional().messages({
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

    //Reset user password using email 
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

    //User Logout
    {
        method: 'POST',
        path: '/logout',
        handler: logoutHandler,
    },

    // // Create new document for all user
    {
        method: 'POST',
        path: "/users/calorie-history",
        handler: addAllCalorieHistoryHandler,
        options: {
            validate: {
                payload: Joi.object({
                    calories: Joi.number().positive().required(),
                    portion: Joi.number().positive().required(),
                    unit: Joi.number().positive().required()
                }),
                failAction: (request, h, err) => {
                    throw err;
                }
            }
        }
    },

    // Get all data in foods-history subcollection
    {
        method: 'GET',
        path: '/users/{uid}/all-foods-history',
        handler: getAllFoodsHistoryHandler
    },
    
    // Get data in foods-history by id
    {
        method: 'GET',
        path: '/users/{uid}/foods-history/{docId}',
        handler: getFoodsHistoryByIdHandler
    },

    // Get all data in foods collection
    {
        method: 'GET',
        path: '/foods',
        handler: getAllFoodsCollectionHandler
    },

    // Get data in foods collection by id
    {
        method: 'GET',
        path: '/foods/{docId}',
        handler: getFoodsByIdHandler
    }

];

module.exports = routes;