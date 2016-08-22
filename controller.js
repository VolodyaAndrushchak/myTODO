module.exports = function(model, view, request){
	return {
		add: function(req, res){
			var localDay = req.body.dmy,
			includeEfficiency;

			model.Add(req.body.dmy, req.body.nTask, req.body.nTime1, req.body.nTime2, req.body.priority, function(){
				if(req.body.previousDate)
				{
					includeEfficiency = false;
					model.deleteList(req.body.previousDate, req.body.nTask, includeEfficiency, function(){
						model.list(req.body.previousDate, '+', function(err, answerDB){
							view.viewMainList(answerDB, function(htmlContent){
								res.json(htmlContent);
							});
						}); 
					});
				}
				else 
				{	
					model.list(localDay, '+', function(err, answerDB){
						view.viewMainList(answerDB, function(htmlContent){
							res.json(htmlContent);
						});
					}); 
				}
			});
		
			console.log(req.body.previousDate);			
		},
		
		edit: function(req, res){		

			{
				model.Edit(req.body.dmy, req.body.pTask, req.body.nTask, req.body.nTime1, req.body.nTime2, req.body.priority, function(){
				model.list(req.body.dmy, '+',  function(err, answerDB){
					view.viewMainList(answerDB, function(htmlContent){
						res.json(htmlContent);
					});
				}); 
				});		
			}

		},
		mainList: function(req, res){
			model.list(req.query.dmy, req.query.token, function(err, answerDB){
				view.viewMainList(answerDB, function(htmlContent){
					res.json(htmlContent);
				});
			});
		},
		doneTask: function(req, res){
			model.doneTask(req.body.dmy, req.body.pTask, function(){ 
				model.list(req.body.dmy, '+',  function(err, answerDB){
					view.viewMainList(answerDB, function(htmlContent){
						res.json(htmlContent);
					});
				}); 
			});
		},
		deleteList: function(req, res){
			model.deleteList(req.body.dmy, req.body.pTask, true, function(){ 
				model.list(req.body.dmy, '+', function(err, answerDB){
					view.viewMainList(answerDB, function(htmlContent){
						res.json(htmlContent);
					});
				}); 
			});		
		},
		wheather: function(req, res){

			request.get('http://api.openweathermap.org/data/2.5/forecast/city?q=' + req.query.city + 
						'&units=metric&APPID=286ff9ff4dfbca6883247c211e36349c', function(error, response, body){
				var bodyObj = JSON.parse(body);
				var temperature = '';
				if(Math.sign(bodyObj.list[0].main.temp) === 1)
				{
					temperature = '+';
				}
				res.json({ 	listWheather: bodyObj.list[0], 
							icon: bodyObj.list[0].weather[0].icon, 
							temperature: temperature + bodyObj.list[0].main.temp + '<sup>o</sup> C',
							wind: bodyObj.list[0].wind.speed.toFixed(1)
						});
			});		
		},
		efficiency: function(req, res){
			model.getEfficiency(req.query.dmy, function(err, answerDB){
				view.viewEfficiency(answerDB, function(graphCotent){
					res.json(graphCotent);
				});
				if(answerDB.length > 30)
				{
					model.delFirstRow();
				}
			});
		}
	}
}
