var Product = require('../models/product.model')
var Category = require('../models/category.model')
const Cart = require("../models/cart");
const Order = require("../models/order");
var UserG = require('../models/userG.model')
var md5 = require('md5');
var recentlyViewed = []

module.exports.index = async function(req,res){
   var products = await Product.find();
   var smartphone = await Product.find({idCate: "5de12f6c4c37031ee087e5da"})
   var laptop = await Product.find({idCate: "5ed5766606854e12286197d6"})
   var smartphonenew = smartphone.sort(function(a, b) {
      a = new Date(a.dateAdded);
      b = new Date(b.dateAdded);
      return a>b ? -1 : a<b ? 1 : 0;
  }).slice(0,20);
   var laptopnew = laptop.sort(function(a, b) {
      a = new Date(a.dateAdded);
      b = new Date(b.dateAdded);
      return a>b ? -1 : a<b ? 1 : 0;
  }).slice(0,20);
   var featured = products.sort(function(a, b) {
      a = new Date(a.dateAdded);
      b = new Date(b.dateAdded);
      return a>b ? -1 : a<b ? 1 : 0;
  }).slice(0,20);
  var productSale = (products.filter(function(pro){
     return pro.isSale.status == true
  })).slice(0,20)
   var categorys = await Category.find();
   res.render('in',{
      featured:featured,
      laptopnew:laptopnew,
      smartphonenew: smartphonenew,
      categorys: categorys,
      recentlyViewed: recentlyViewed,
      productSale:productSale
   });
}
module.exports.search = async function(req,res){
   var page = parseInt(req.query.page) || 1
   var q = req.query.q;
   var perpage = 25
   let start = (page - 1) * perpage;
   let end =  page * perpage

   var product = await Product.find()
   var products = product.slice(start,end).filter(function(pro){
      return  pro.name.toLowerCase().indexOf(q.toLowerCase()) !== -1
   })
   let numberpages = Math.ceil(parseFloat(products.length/perpage))
   let arrpages = []
   for(let i = 1; i<=numberpages; i++){
      arrpages.push(i)
   }
   let brands = []
   for(pro of products){
      if(brands.indexOf(pro.brand) <= -1) {
         brands.push(pro.brand);
      }
   }
   let countProduct  = products.length;
   var categorys = await Category.find();
   res.render('webpage/shop',{
      products: products,
      categorys: categorys,
      countProduct: countProduct,
      title: 'Search Product',
      brands:brands,
      arrpages:arrpages
   });
}
module.exports.blog = async function(req,res) {
   var categorys = await Category.find();
   res.render('webpage/blog',{
      categorys: categorys
   })
}
module.exports.contact = async function(req,res) {
   var categorys = await Category.find();
   res.render('webpage/contact',{
      categorys: categorys
   })
}
module.exports.viewAll = async function(req,res){
   var product = await Product.find()
   var page = parseInt(req.query.page) || 1
   var perpage = 25
   let start = (page - 1) * perpage;
   let end =  page * perpage
   let numberpages = Math.ceil(parseFloat(product.length/perpage))
   let arrpages = []
   for(let i = 1; i<=numberpages; i++){
      arrpages.push(i)
   }
   var products = product.slice(start,end)
   let brands = []
   for(pro of products){
      if(brands.indexOf(pro.brand) <= -1) {
         brands.push(pro.brand);
      }
   }
   let countProduct  = products.length;
   var categorys = await Category.find();
   res.render('webpage/shop',{
      products: products,
      categorys: categorys,
      countProduct: countProduct,
      title: 'All Product',
      brands:brands,
      arrpages:arrpages
   });
}

module.exports.brand = async function(req,res) {
   let namebrand  = req.params.brand;
   var Allproduct = await Product.find();
   var product = Allproduct.filter(prduct => prduct.brand == namebrand)
   var page = parseInt(req.query.page) || 1
   var perpage = 25
   let start = (page - 1) * perpage;
   let end =  page * perpage
   let numberpages = Math.ceil(parseFloat(product.length/perpage))
   let arrpages = []
   for(let i = 1; i<=numberpages; i++){
      arrpages.push(i)
   }
   products = product.slice(start,end)
   let brands = []
   for(pro of product){
      if(brands.indexOf(pro.brand) <= -1) {
         brands.push(pro.brand);}
   }
   let countProduct  = products.length;
   var categorys = await Category.find();
   res.render('webpage/shop',{
      products: products,
      categorys: categorys,
      countProduct: countProduct,
      arrpages: arrpages,
      title: namebrand,
      brands:brands
   });
}
module.exports.viewProductByCateId = async function(req,res){
    var id = req.params.id;
    var page = parseInt(req.query.page) || 1
    var perpage = 25
    let start = (page - 1) * perpage;
    let end =  page * perpage
    var product = await Product.find({idCate: id})
    var products = product.splice(start,end)
    let numberpages = Math.ceil(product.length/perpage)
    let arrpages = []
    for(let i = 1; i<=numberpages; i++){
       arrpages.push(i)
    }
    var catein = await Category.findOne({_id:id});
    let title = catein.name;
    var categorys = await Category.find();
    let brands = []
    let countProduct  = products.length;
   for(pro of products){
      if(brands.indexOf(pro.brand) <= -1) {
         brands.push(pro.brand);}
   }
    res.render('webpage/shop',{
       products: products,
       categorys: categorys,
       countProduct: countProduct,
       title: title,
       brands:brands,
       arrpages:arrpages
    });
 }
 module.exports.viewProductById = async function(req,res){
    var id = req.params.id;
    var products = await Product.findOne({_id: id})
    var categorys = await Category.find();
    var catein = await Category.findOne({_id: products.idCate});
    var productOrthers = await Product.find({idCate: products.idCate});
    res.render('webpage/singleProduct',{
       products: products,
       categorys: categorys,
       catein: catein,
       productOrthers: productOrthers,
    });
 }
 module.exports.register = function(req,res){
   if(req.signedCookies.userG)
	{
		res.redirect('/');
		return;
	}else
      res.render('authG/register');
 }
 module.exports.login = function(req,res){
   if(req.signedCookies.userG)
	{
		res.redirect('/');
		return;
	}else
   res.render('authG/signin');
 }
 module.exports.postRegister  = async function(req,res){
      req.body.pass = md5(req.body.pass);
      req.body.avatar = "";
      req.body.phone = "";
      req.body.address = "";
      req.body.avatar = "";
      req.body.status = 'IN_PROGRES';
      await UserG.insertMany(req.body);
   res.render('authG/register',{
      success : "Register success"
   })
 }


 module.exports.postLogin = async function(req,res){
   var email = req.body.your_email;
	var your_pass = req.body.your_pass;

	var userg = await UserG.findOne({email: email});
	if(!userg){
		res.render('authG/signin',{
			errors : ['User does not exit.']
		});
		return;
	}
	var haspassword = md5(your_pass);
	if (userg.pass !== haspassword) {
		// statement
		res.render('authG/signin',{
			errors : ['Password not true.']
		});
		return;
   }
   if(userg.status == 'BLOCKED'){
      res.render('authG/signin',{
			errors : ['User is blocked.']
		});
		return;
   }
	res.cookie('userG',userg._id,{signed:true});
	res.redirect('/');
 }
 module.exports.logout  = function(req,res){
   res.clearCookie('userG')
	res.redirect('/');
 }
 module.exports.cart = async function(req,res){
   if(req.session.cart){
      var arrayPro = Object.values(req.session.cart.items);
      var categorys = await Category.find();
      res.render('webpage/cart',{categorys: categorys, arrayPro: arrayPro})
   }else{
      var categorys = await Category.find();
      res.render('webpage/cart',{categorys: categorys})
   }
 }
 module.exports.clear = function(req,res){
   req.session.cart = null;
   if (req.user) {
     req.user.cart = {};
     req.user.save();
   }
   res.redirect("back");
 }
 module.exports.checkout = async function(req,res,next){
   if(!req.session.cart){
      res.redirect('/cart')
   }
   var categorys = await Category.find();
      res.render('webpage/checkout',{categorys: categorys})
 }
 module.exports.postCheckout = async function(req,res){
    req.body.cart = req.session.cart;
    const userG = await UserG.findByIdAndUpdate({_id: req.signedCookies.userG},{
      order: req.body.cart
    },function(err){
		if(err)	res.json(err);
   })
   console.log(userG)
    req.body.checked = false;
    await Order.insertMany(req.body);
    res.clearCookie('connect.sid');
    res.redirect('/');
 }
 module.exports.getProfile = async function(req,res){
   var categorys = await Category.find();
    res.render('webpage/profile',{categorys: categorys})
 }
 module.exports.postProfile = async function(req,res){
   await UserG.findByIdAndUpdate({_id:req.signedCookies.userG},{
		name:req.body.name,
		phone:req.body.phone,
		address:req.body.address,
		update_time : new Date()
	},function(err){
		if(err)	res.json(err);
		else	res.redirect('/profile');
	})
 }
 exports.postComment = (req, res, next) => {
   const prodId = req.params.id;
   var tname;
   tname = req.body.inputName;
   Product.findOne({
     _id: prodId
   }).then(product => {
     var today = new Date();
     product.comment.items.push({
       title: req.body.inputTitle,
       content: req.body.inputContent,
       name: tname,
       date: today,
     });
     product.comment.total++;
     product.save();
   });
   res.redirect("back");
 };

 exports.addToCart = async (req, res, next) => {
   var prodId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(prodId, (err, product) => {
    if (err) {
      return res.redirect("back");
    }
    cart.add(product, prodId);
    req.session.cart = cart;
    if (req.user) {
      req.user.cart = cart;
      req.user.save();
    }
    res.redirect("back");
  });
 };

 exports.getDeleteItem = (req, res, next) => {
   var prodId = req.params.id;
   var cart = new Cart(req.session.cart ? req.session.cart : {});
   Product.findById(prodId, (err, product) => {
     if (err) {
       return res.redirect("back");
     }
     cart.deleteItem(prodId);
     req.session.cart = cart;
     if (req.user) {
       req.user.cart = cart;
       req.user.save();
     }
     res.redirect("back");
   });
 };
 exports.detailsUser = async (req,res) =>{
   if(req.signedCookies.userG){
      var users = await UserG.findOne({_id: req.signedCookies.userG});
      const categorys = await Category.find()

      res.render('users/detailUser',{ users: users, categorys:categorys})
   }
 }
 exports.editUser = async(req,res)=>{
   if(req.signedCookies.userG){
      var users = await UserG.findOne({_id: req.signedCookies.userG});
      const categorys = await Category.find();
      res.render('users/edit',{ users: users, categorys:categorys})
 }
}
exports.posteditUser = async(req,res)=>{
   const id = req.params.id
   const name = req.body.name
   const phone = req.body.phone
   const address = req.body.address
   var ava = req.file.path.split('\\').slice(1).join('/')
   await UserG.findOneAndUpdate({_id:id},{
      name: name,
      phone:phone,
      address:address,
      avatar: ava,
      update_time: Date.now()
   },function(err){
		if(err)	res.json(err);
		else	res.render('/account');
	})
}
