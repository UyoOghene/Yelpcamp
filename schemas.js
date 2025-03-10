const Joi = require('joi');

const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        // image: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
});

module.exports = { campgroundSchema };

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()
});
