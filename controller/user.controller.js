var UserG = require('../models/userG.model');
// var shortid = require('shortid');
var md5 = require('md5');
module.exports.index = async function(req,res){

		var users = await UserG.find();
		res.render('users/index',{
		 users: users
	 });
	// }else res.redirect('/products')
}
module.exports.search = async function(req,res){
	var q = req.query.q;
	var matcheUser = await UserG.find();
	var users = matcheUser.filter(function(user){
		return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
	});
    res.render('users/index',{ users: users });
}

module.exports.get =async function(req,res){
	var id = req.params.id;
	var users = await UserG.find({_id: id});
	res.render('users/detailUser',
		{ users: users });
}

module.exports.block = async function(req,res){
		const user = await UserG.findOne({_id:req.params.id})
		if(user.status === 'IN_PROGRESS'){
			var status = 'BLOCKED'
		}else{
			var status = 'IN_PROGRESS'
		}
		await UserG.findByIdAndUpdate({_id:req.params.id},{
			status: status
	},function(err){
		if(err) console.log(err)
	});
	res.redirect('/users')
}
