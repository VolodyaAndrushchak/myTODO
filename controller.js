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
						console.log(i);
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
					model.delFirstRow();
				}
			});
		},

		getNews: function(req, res) {
			function ConstrGetNews() {
				this.request = function() {
					var picture = "<div class = 'container-fluid'><div class = 'rows'>";

					var objSubNewsStudway = { 'News' : [4, 'http://studway.com.ua/category/news/', '.entry-wrap', '.post-thumbnail', '.wp-post-image', '.entry-title', '.entry-title'],
											'Inside' : [4, 'http://studway.com.ua/category/inside/', '.entry-wrap', '.post-thumbnail', '.wp-post-image', '.entry-title', '.entry-title'],
											'Lifehack' : [4, 'http://studway.com.ua/category/lifehack/','.entry-wrap', '.post-thumbnail', '.wp-post-image', '.entry-title', '.entry-title'],
											'Tests' : [4, 'http://studway.com.ua/category/test/', '.entry-wrap', '.post-thumbnail', '.wp-post-image', '.entry-title', '.entry-title'],
											'Journey' : [4, 'http://studway.com.ua/category/travel/', '.entry-wrap', '.post-thumbnail', '.wp-post-image', '.entry-title', '.entry-title'],
											'Blogs' : [4, 'http://studway.com.ua/category/columns/', '.entry-wrap', '.post-thumbnail', '.wp-post-image', '.entry-title', '.entry-title'],
											'NewsNulp': [8, 'http://www.lp.edu.ua/news/', '.views-row', '.field-content', '.field-content'],
											'Students' : [8, 'http://www.lp.edu.ua/students', '.col-md-3', '.field-content', '.field-content'],
											'Graduares': [8, 'http://www.lp.edu.ua/alumni', '.col-md-3', '.field-content', '.field-content'],
											'Employees': [8, 'http://www.lp.edu.ua/faculty', '.col-md-3', '.field-content', '.field-content'],
											'NewsTerytorija': [4, 'http://terytoriya.com.ua/index.php/category/novini/', '.post-block-item', '.post-image', '.img-responsive', '.post-block-name', '.post-block-name'],
											'Reach': [4, 'http://terytoriya.com.ua/index.php/category/dosyagay/', '.post-block-item', '.post-image', '.img-responsive', '.post-block-name', '.post-block-name'],
											'Travel': [4, 'http://terytoriya.com.ua/index.php/category/mandruy/', '.post-block-item', '.post-image', '.img-responsive', '.post-block-name', '.post-block-name'],
											'Visit': [4, 'http://terytoriya.com.ua/index.php/category/vidviduy/', '.post-block-item', '.post-image', '.img-responsive', '.post-block-name', '.post-block-name'],
											'Listen': [4, 'http://terytoriya.com.ua/index.php/category/sluhay/', '.post-block-item', '.post-image', '.img-responsive', '.post-block-name', '.post-block-name'],
											'NewsZaxid': [8, 'http://zaxid.net/news/showList.do', '.default-news-list', '.default-news-list', '.news-title'],
											'Lviv': [8, 'http://zaxid.net/news/showList.do?novini_lvova&tagId=50956', '.default-news-list', '.default-news-list', '.news-title'],
											'Society': [8, 'http://zaxid.net/news/showList.do?suspilstvo&tagId=52456', '.default-news-list', '.default-news-list', '.news-title'],
											'Economy': [8, 'http://zaxid.net/news/showList.do', '.default-news-list', '.default-news-list', '.news-title'],
											'IQ': [4, 'http://zaxid.net/news/showList.do?iq&tagId=52457', '.b_video', '.b_photo', '.photo_inner', '.title'],
											'World': [8, 'http://zaxid.net/news/showList.do?novini_svitu&tagId=50962', '.default-news-list', '.default-news-list', '.news-title']

					};
					request.get(objSubNewsStudway[req.query.subNewStud][1], function(err, response, body){
						var $ = cheerio.load(body);

						$(objSubNewsStudway[req.query.subNewStud][2]).each(function(i, element){

							if ( (i < ((Number(req.query.counter) + 1) * objSubNewsStudway[req.query.subNewStud][0] )) && (i >= (req.query.counter * objSubNewsStudway[req.query.subNewStud][0] )) )
							{

								switch (req.query.doman) 
								{
									case 'http://terytoriya.com.ua': 
										var article = "<div class = 'col-lg-3 col-md-3 col-sm-3 col-xs-3'><article class = 'imgText'> <div class = 'title-img'> <a href ='" + $(this).find(objSubNewsStudway[req.query.subNewStud][3]).attr('href') + "'> <img width = '100%' src ='" + $(this).find(objSubNewsStudway[req.query.subNewStud][4]).attr('src') + "'></a></div> <div class = 'title-text'> <a href ='" + 
											$(this).find(objSubNewsStudway[req.query.subNewStud][5]).attr('href') + "'> <p>" + $(this).find(objSubNewsStudway[req.query.subNewStud][6]).html() + "</p> </a> </div> </article></div>";
										break;

									case 'http://studway.com.ua':
										var article = "<div class = 'col-lg-3 col-md-3 col-sm-3 col-xs-3'><article class = 'imgText'> <div class = 'title-img'> <a href ='" + $(this).find(objSubNewsStudway[req.query.subNewStud][3]).attr('href') + "'> <img width = '100%' src ='" + $(this).find(objSubNewsStudway[req.query.subNewStud][4]).attr('src') + "'></a></div> <div class = 'title-text'> <a href ='" + 
										$(this).find(objSubNewsStudway[req.query.subNewStud][5]).find('a').attr('href') + "'> <p>" + $(this).find(objSubNewsStudway[req.query.subNewStud][6]).find('a').html() + "</p> </a> </div> </article></div>";
										break;

									case 'http://www.lp.edu.ua':
										if (i % 4 === 0) {

										}

										var article = "<div class = 'col-lg-3 col-md-3 col-sm-3 col-xs-3'><article class = 'onlyText'> <div class = 'title-onlyText'> <a href ='http://www.lp.edu.ua/" + $(this).find(objSubNewsStudway[req.query.subNewStud][3]).find('a').attr('href') + "'> <p>" + $(this).find(objSubNewsStudway[req.query.subNewStud][4]).find('a').html() + "</p></div> </article></div>";
										break;

									case 'http://zaxid.net':
										if ($(this).find(objSubNewsStudway[req.query.subNewStud][4]).find('img')['0']) 
										{
											if (req.query.subNewStud == 'IQ') 
											{
												var article = "<div class = 'col-lg-3 col-md-3 col-sm-3 col-xs-3'><article class = 'imgText'> <div class = 'title-img'> <a href ='" + $(this).find(objSubNewsStudway[req.query.subNewStud][3]).attr('href') + "'> <img width = '100%' src ='" + $(this).find(objSubNewsStudway[req.query.subNewStud][4]).find('img').attr('src') + "'></a></div> <div class = 'title-text'> <a href ='" + 
											$(this).find(objSubNewsStudway[req.query.subNewStud][3]).attr('href') + "'> <p>" + $(this).find(objSubNewsStudway[req.query.subNewStud][5]).html() + "</p> </a> </div> </article></div>";
											}
											else
											{
												var article = "<div class = 'col-lg-3 col-md-3 col-sm-3 col-xs-3'><article class = 'onlyText'> <div class = 'title-onlyText'> <a href ='http://zaxid.net/" + $(this).find('a').attr('href') + "'> <p>" + $(this).find('.title').html() + "</p></div> </article></div>";
											}
										}
										else
										{
											var article = "<div class = 'col-lg-3 col-md-3 col-sm-3 col-xs-3'><article class = 'onlyText'> <div class = 'title-onlyText'> <a href ='http://zaxid.net/" + $(this).find('a').attr('href') + "'> <p>" + $(this).find(objSubNewsStudway[req.query.subNewStud][4]).html() + "</p></div> </article></div>";
										}

									default: break;
								}

								picture = picture + article;									
							}
 
						});
						picture = picture + "</div></div>";
						res.json(picture);
					});
				};
			}

			var objReqNew = new ConstrGetNews();
			objReqNew.request();
		},


		getNewsStudway: function(req, res){
			var picture = '';

			var objSubNewsStudway = { 'News' : 'http://studway.com.ua/category/news/',
										'Inside' : 'http://studway.com.ua/category/inside/',
										'Lifehack' : 'http://studway.com.ua/category/lifehack/',
										'Tests' : 'http://studway.com.ua/category/test/',
										'Travel' : 'http://studway.com.ua/category/travel/',
										'Blogs' : 'http://studway.com.ua/category/columns/'
			};

				request.get(objSubNewsStudway[req.query.subNewStud], function(err, response, body){
				var $ = cheerio.load(body);

				$('.entry-wrap').each(function(i, element){

					if ( (i < ((Number(req.query.counter) + 1) * 4)) && (i >= (req.query.counter * 4)) )
					{
						var tmp = $(this).find('.post-thumbnail').attr('href').toString();
						var article = "<article> <div class = 'title-img'> <a href ='" + $(this).find('.post-thumbnail').attr('href') + "'> <img width = '220px' src ='" + $(this).find('.wp-post-image').attr('src') + "'></a></div> <div class = 'title-text'> <a href ='" + 
								$(this).find('.entry-title').find('a').attr('href') + "'> <p>" + $(this).find('.entry-title').find('a').html() + "</p> </a> </div> </article>";
						picture = picture + article;
					}

				});

				res.json(picture);
			});
			
		}

	}
}
