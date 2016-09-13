module.exports = function(model, view, request){
	return {
		add: function(req, res){
			var localDay = req.body.dmy,
			includeEfficiency;

			model.Add(req.session.passport.user, req.body.dmy, req.body.nTask, req.body.nTime1, req.body.nTime2, req.body.priority, function(){
				if(req.body.previousDate)
				{
					includeEfficiency = true;
					model.deleteList(req.session.passport.user, req.body.previousDate, req.body.nTask, includeEfficiency, function(){
						model.list(req.session.passport.user, req.body.previousDate, '+', function(err, answerDB){
							view.viewMainList(answerDB, function(htmlContent){
								res.json(htmlContent);
							});
						}); 
					});
				}
				else 
				{	
					model.list(req.session.passport.user, localDay, '+', function(err, answerDB){
						view.viewMainList(answerDB, function(htmlContent){
							res.json(htmlContent);
						});
					}); 
				}
			});
		
			console.log(req.body.previousDate);			
		},
		
		edit: function(req, res){		
			model.Edit(req.session.passport.user, req.body.dmy, req.body.pTask, req.body.nTask, req.body.nTime1, req.body.nTime2, req.body.priority, function(){
				model.list(req.session.passport.user, req.body.dmy, '+',  function(err, answerDB){
					view.viewMainList(answerDB, function(htmlContent){
						res.json(htmlContent);
					});
				}); 
			});		
		},
		mainList: function(req, res){
			model.list(req.session.passport.user, req.query.dmy, req.query.token, function(err, answerDB){
				view.viewMainList(answerDB, function(htmlContent){
					res.json(htmlContent);
				});
			});
		},
		doneTask: function(req, res){
			model.doneTask(req.session.passport.user, req.body.dmy, req.body.pTask, function(){ 
				model.list(req.session.passport.user, req.body.dmy, '+',  function(err, answerDB){
					view.viewMainList(answerDB, function(htmlContent){
						res.json(htmlContent);
					});
				}); 
			});
		},
		deleteList: function(req, res){
			model.deleteList(req.session.passport.user, req.body.dmy, req.body.pTask, true, function(){ 
				model.list(req.session.passport.user, req.body.dmy, '+', function(err, answerDB){
					view.viewMainList(answerDB, function(htmlContent){
						res.json(htmlContent);
					});
				}); 
			});		
		},
		wheather: function(req, res){
			model.getUserByHesh(req.session.passport.user, function(err, answerDB){
				//console.log(answerDB[0].town);
				request.get('http://api.openweathermap.org/data/2.5/forecast/city?q=' + answerDB[0].town + 
						'&units=metric&APPID=286ff9ff4dfbca6883247c211e36349c', function(error, response, body){
				var bodyObj = JSON.parse(body);
				var temperature = '';
				try
				{
					if(Math.sign(bodyObj.list[0].main.temp) === 1)
					{
						temperature = '+';
					}
					res.json({ 	listWheather: bodyObj.list[0], 
							icon: bodyObj.list[0].weather[0].icon, 
							temperature: temperature + bodyObj.list[0].main.temp + '<sup>o</sup> C',
							wind: bodyObj.list[0].wind.speed.toFixed(1)
						});
				}
				catch(errTry)
				{
					res.json("Weather is not available");
				}
			
				});	
			});

				
		},
		efficiency: function(req, res){
			model.getEfficiency(req.session.passport.user, req.query.dmy, function(err, answerDB){
				view.viewEfficiency(answerDB, function(graphCotent){
					res.json(graphCotent);
				});
				if(answerDB.length > 20)
				{
					model.delFirstRow();
				}
			});
		}
	}
}
