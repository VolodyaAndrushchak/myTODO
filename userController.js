module.exports = function(model, nodemailer, smtpTransport, md5){
	return{
		createAccount: function(req, res){
			model.chekUserEmail(req.body.email, function(err, answerDB){
				if(answerDB.length != 0)
				{
					res.render('registration', {status: "There is user with this e-mail!"});
				}
				else
				{
					var objData = new Date();
					var dmy = '' + objData.getDate() + '-' + ( objData.getMonth() + 1 ) + '-' + objData.getFullYear();
					var salt = 'myppp789';
					var md5Code = md5(req.body.username + req.body.password);
					var md5CodeForSMTP = md5(req.body.username + req.body.password + salt);
					model.createAccount(dmy, req.body.username, req.body.town, req.body.email, req.body.password, md5Code, md5CodeForSMTP, function(err, answerDB){

						var transport = nodemailer.createTransport(
	     					smtpTransport({
	    						host: 'smtp.ukr.net',
	    						port: 465,
	    						secure: true,
	    						auth: {
	        						user: 'todoforstudent@ukr.net',
	        						pass: 'MyPerfectTODO'
	    						}
							})
	    				);
						console.log(req.body.email);
	   					var params = {
	      					from: 'todoforstudent@ukr.net', 
	     					to: req.body.email, 
	      					subject: 'Confirmation of registration - DailyStudent',
	      					text: "Hello " + "!\n\n" + 
	      						  "You sent a request for registration. \n\n" + 
	      						  "Follow this link for confirmation your registration: \n" + 
	      						  "http://dailystudent.com.ua/confirmRegistration?id_confirm=" + md5CodeForSMTP + "\n\n" + 
	      						  "Thank you, the team of DailyStudent."
	    				};

	    				transport.sendMail(params, function (err, res) {
	     		 			if (err) {
	      					}
	    				});

						res.render('checkEmail');
					});					
				}
			});
		},
		confirmRegistration: function(req, res) {
			model.getRegistered(req.query.id_confirm, function(err, answerDB){
				if (answerDB[0].heshsalt === req.query.id_confirm)
				{
					model.setRegistered(req.query.id_confirm);
					res.render('successRegistration');
				}
			});
			console.log(req.query.id_confirm);
		},

		getPassword: function(req, res){
			model.getPassword(req.body.email, function(err, answerDB){
				if(answerDB.length != 0)
				{
					var transport = nodemailer.createTransport(
     					smtpTransport({
    						host: 'smtp.ukr.net',
    						port: 465,
    						secure: true,
    						auth: {
        						user: 'todoforstudent@ukr.net',
        						pass: 'MyPerfectTODO'
    						}
						})
    				);

   					var params = {
      					from: 'todoforstudent@ukr.net', 
     					to: req.body.email, 
      					subject: 'Password - DailyStudent',
      					text: "Hello " + answerDB[0].name + "!\n\n" + 
      						  "You sent a request for getting password. \n" + 
      						  "Your password: " + answerDB[0].pass + ".\n\n" + 
      						  "Thank you, support service accounts DailyStudent!"
    				};

    				transport.sendMail(params, function (err, res) {
     		 			if (err) {
      					}
    				});

    				res.render('registration', {status: "The letter was successfully sent!"});
				}
				else
				{
					res.render('registration', {status: "This e-mail is absent in base - please, check form of your email address"});
				}
			});
		},
		getNumberUsers: function(req, res){
			model.getNumberUsers(function(err, answer){
				res.json(answer.length + 35);
			});
		}
	}
}