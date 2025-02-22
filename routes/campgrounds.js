const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const campgrounds = require('../controllers/campgrounds.js')
const {isLoggedIn} = require('../middleware.js');
const {validateCampground} = require('../middleware.js')
const {isAuthor} = require('../middleware.js');
const Campground = require('../models/campground.js');

const multer = require('multer');
const {storage} = require('../cloudinary/index.js');
const upload = multer({ storage});



router.route('/')
    .get( catchAsync(campgrounds.index))
    // .post( isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
    router.route('/')
    .get(catchAsync(campgrounds.index))
    // .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
    router.post('/', upload.array('image'), campgrounds.createCampground);
    
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editForm))
    .delete( isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;