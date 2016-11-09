module.exports = function(model, view, request, cheerio){
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

			model.delFirstRowList(req.session.passport.user);

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
				var cityUser = '';
				if (answerDB.length == 0)
				{
					cityUser = 'Lviv';
				}
				else
				{
					cityUser = answerDB[0].cityLatin;
				}
				request.get('http://api.openweathermap.org/data/2.5/forecast/city?q=' + cityUser + 
						'&units=metric&APPID=286ff9ff4dfbca6883247c211e36349c', function(error, response, body){
				var bodyObj = JSON.parse(body);
				var temperature = '';
				try
				{
					if(Math.sign(bodyObj.list[0].main.temp) === 1)
					{
						temperature = '+';
					}

					var reg = {
						clock: /[0-2]{1}[0-9]{1}:00/,
						date: /20\d{2}-[0-1]{1}\d{1}-[0-3]{1}\d{1}/
					};

					var i = 0;


					/*--- algorithm for changing the time and date in weather (start)---*/
					if ( (req.query.countDateWheatre != 0) && (req.query.countHourWheather != 0) ) {
						while( (bodyObj.list[i].dt_txt ) != (req.query.timeWheather + ' 03:00:00') ) {
							i++;
						}

						i = i + Number(req.query.countHourWheather) + 1;
					} else {

						if (req.query.countDateWheatre != 0) {

							while( ( bodyObj.list[i].dt_txt ) != (req.query.timeWheather + ' 03:00:00') ) {
								i++;				
							}

							i++;
						} else {
							i =  Number(req.query.countHourWheather) ;
						}
					}
					/*--- algorithm for changing the time and date in weather (end)---*/

					res.json({ 	listWheather: bodyObj.list[i], 
							icon: bodyObj.list[i].weather[0].icon, 
							temperature: temperature + bodyObj.list[i].main.temp + '<sup>o</sup> C',
							wind: bodyObj.list[i].wind.speed.toFixed(1),
							timeClock: reg.clock.exec(bodyObj.list[i].dt_txt),
							timeDate: reg.date.exec(bodyObj.list[i].dt_txt)
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
					model.delFirstRowEff(req.session.passport.user);
				}
			});
		},

		getNews: function(req, res) {
			function ConstrGetNews() {
				this.request = function() {

					model.getDataNews(req.query.subNewStud, function(err, answerDB){
						request.get(answerDB[0].link, function(err, response, body){
						
							view.getNews(req, answerDB[0], cheerio, body, function(htmlNews){
									res.json(htmlNews);
							});
						});
					});					
				}
			}
			var objReqNew = new ConstrGetNews();
			objReqNew.request();
		}

	}
}
