var express = require('express');
var multer  = require('multer');
var webpageController = require('../controller/webpage.controller')
var router = express.Router()
const authcheck = require('../midlewares/userG.midleware')
var upload = multer({ dest: './public/uploads' })

router.get('/',webpageController.index);
router.get('/search',webpageController.search);
router.get('/viewAll',webpageController.viewAll);
router.get('/productofcategorys/:id',webpageController.viewProductByCateId);
router.get('/viewDetailProduct/:id',webpageController.viewProductById);
router.post('/viewDetailProduct/:id',webpageController.postComment);
router.get('/register',webpageController.register)
router.post('/register',webpageController.postRegister)
router.get('/login',webpageController.login)
router.get('/contact',webpageController.contact)
router.get('/blog',webpageController.blog)
router.post('/login',webpageController.postLogin)
router.get('/searchProductOfBrand/:brand',webpageController.brand)
router.get('/logout',webpageController.logout)
router.get('/add-to-cart/:id', webpageController.addToCart)
router.get('/cart',webpageController.cart);
router.get('/cart/clear',webpageController.clear);
router.get('/checkout',authcheck.checkout,webpageController.checkout);
router.post('/checkout',webpageController.postCheckout);
router.get('/profile',webpageController.getProfile);
router.post('/profile',webpageController.postProfile);
router.get("/delete-item/:id", webpageController.getDeleteItem);
router.get('/account',webpageController.detailsUser)
router.get('/account/edit',webpageController.editUser)
router.post('/account/edit/:id',upload.single('avatar'),
webpageController.posteditUser)

// router.get('/search',userController.search);
// router.get('/:id',userController.get);
// router.get('/edits/:id',userController.edit);
// router.post('/edits/:id',userController.putEdit)
// router.get('/:id/delete',userController.deleteUser)
module.exports = router;
