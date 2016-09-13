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

					var md5Code = md5(req.body.username + req.body.password);
					model.createAccount(dmy, req.body.username, req.body.town, req.body.email, req.body.password, md5Code, function(err, answerDB){
					res.render('registration', {status: "Congratulations, you successfully registered!"});
					});
				}
			});
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
      					subject: 'Hi, body!',
      					text: "Hello " + answerDB[0].name + "!\n\n" + 
      						  "You sent a request for getting password. \n" + 
      						  "Your password: " + answerDB[0].pass + ".\n\n" + 
      						  "Thank you, support service accounts SoftForStudent!"
    				};

    				transport.sendMail(params, function (err, res) {
     		 			if (err) {
         					//console.error(err);
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