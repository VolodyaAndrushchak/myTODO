window.onload = function() {
			$('.liPartNews').each(function(i){

				$(this).find('.leftArrowContent').css("height", $(this).find('.contentBetweenArrows').outerHeight());
				$(this).find('.rightArrowContent').css("height", $(this).find('.contentBetweenArrows').outerHeight());
				$(this).find('.afterTitleContentNew').css("height", $(this).find('.leftArrowContent').outerHeight() + 2);

			});
	}

	$(window).resize(function(){

		$('.liPartNews').each(function(i){

			$(this).find('.leftArrowContent').css("height", $(this).find('.contentBetweenArrows').outerHeight());
			$(this).find('.rightArrowContent').css("height", $(this).find('.contentBetweenArrows').outerHeight());
			$(this).find('.afterTitleContentNew').css("height", $(this).find('.leftArrowContent').outerHeight() + 2);

		});
	});

	function overHeaderArrow(event){
		if( ($('#beforeWrapper').css('display')) == 'block') {
			$(event).attr('src', 'img/headerArrowHover.png');
		}
		else
		{
			$(event).attr('src', 'img/upHeaderArrowHover.png');
		}			
	}

	function outHeaderArrow(event){
		if( ($('#beforeWrapper').css('display')) == 'block') {
			$(event).attr('src', 'img/headerArrow.png');
		}
		else
		{
			$(event).attr('src', 'img/upHeaderArrow.png');
		}	
	}


	var counterHeader = 0;

	/*--- click on header arrow---*/
	$('#header').click(function(){

		//$('#beforeWrapper').slideToggle('slow');
		$('#beforeWrapper').slideToggle('slow', function() {
			if( ($('#beforeWrapper').css('display')) == 'block')
			{
				$('#header').find('img').attr("src", "img/headerArrow.png");
			}
			else
			{
				$('#header').find('img').attr("src", "img/upHeaderArrow.png");
			}
		});

	});
	
	/*--- button show/hide---*/ 
	$('#animButSH').click(function(){

		$('#main_content').slideToggle('slow', function(){
			$('#contentNew').slideToggle('slow');
		});
		$('#Add_task').slideToggle('slow');


	});

	/*--- help functions for main animates (#header) and (#animButSH) ---*/
	function firstSlideDown(){
		$('#beforeWrapper').slideDown('slow');
	}
	function secondSlideDown(){
		$('#main_content').slideToggle('slow', function(){
			$('#contentNew').slideToggle('slow');
		});
		$('#Add_task').slideToggle('slow');
		
	}
	function animateMainContent(token){
	}
	/*--- end help functions ---*/
	/****************************************/

	var OBJDATA = new Date();

	var mainpage = function(token, callback){

		var localDate = newDate || OBJDATA;
		var token = token || "+"; 

		var dmyList = '' + localDate.getDate() + '-' + ( localDate.getMonth() + 1 ) + '-' + localDate.getFullYear();
		$('#timeSlider').html(dmyList);

		var dayTodo = {
			dmy: dmyList,
			token: token
		};

		$.ajax({
            url: '/tasks/mainList',
            type: 'GET',
            data: dayTodo,
            success: function(answer){
 		        $('#mainUL').html(answer.mainContent);
 		        $('#statusSlider').html(answer.statusDay);

 		   		if(callback)
 		   		{
 		   			callback(answer);
 		   		}
 		   		else
 		   		{
 		   			$('#listSlider').html(answer.shortContent);
 		   			$('#mainUL').html(answer.mainContent);
 		   		}
            }
		});
	}

	var COUNTER_ARROW_WHEATHER_CLOCK = 0;
	var COUNTER_ARROW_WHEATHER_DATE = 0;
	var DATE_FOR_WEATHER = new Date();
	var wheather = function(){


		var objWheather = {
			timeWheather: DATE_FOR_WEATHER.getFullYear() + '-' + ('0' + (DATE_FOR_WEATHER.getMonth() + 1 )).slice(-2) + '-' + ('0' + DATE_FOR_WEATHER.getDate()).slice(-2),
			countHourWheather: COUNTER_ARROW_WHEATHER_CLOCK,
			countDateWheatre: COUNTER_ARROW_WHEATHER_DATE
		};

      		$("#dayWeek").fadeToggle("fast");
      		$('#imgWheather').fadeToggle("fast");
        	$('#mainTemp').fadeToggle("fast");
        	$('#wind').fadeToggle("fast");
	        $('#humidity').fadeToggle("fast");
	        $('#clockWeather_p').fadeToggle("fast");
	        $('#timeWheather').fadeToggle("fast");
	        $('#addParamWeath').fadeToggle("fast");


		$.ajax({
            url: '/header/wheather',
            type: 'GET',
            data: objWheather,
            success: function(answer){
            	if(typeof answer == 'object')
            	{
	            	$('#dayWeek').html(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturady"][DATE_FOR_WEATHER.getDay()]);
	            	$('#imgWheather').attr('src', 'iconWeather/' + answer.icon + '.gif');
	            	$('#mainTemp').html(answer.temperature);
	            	$('#wind').html(answer.wind + " m/s");
	 		        $('#humidity').html(answer.listWheather.main.humidity + " %");
	 		        $('#clockWeather_p').html(answer.timeClock);
	 		        $('#timeWheather').html(answer.timeDate);


	 		        $("#dayWeek").fadeToggle("fast");
			  		$('#imgWheather').fadeToggle("fast");
			    	$('#mainTemp').fadeToggle("fast");
			    	$('#wind').fadeToggle("fast");
			        $('#humidity').fadeToggle("fast");
			        $('#clockWeather_p').fadeToggle("fast");
			        $('#timeWheather').fadeToggle("fast");
			        $('#addParamWeath').fadeToggle("fast");
 		    	}
 		    	else
 		    	{
 		    		$('#dayWeek').empty();
 		    		$('#imgWheather').empty();
 		    		$('#addParamWeath').empty();
 		    		$('#imgWheather').empty();
 		    		$('#mainTemp').css({
 		    			'font-size': '18px'
 		    		});
 		    		$('#mainTemp').html(answer);
 		    	}
            }
		});
	}

	function leftArrowDate() {
		if(COUNTER_ARROW_WHEATHER_DATE === 0)
		{
			COUNTER_ARROW_WHEATHER_CLOCK = 0;
		}
		else 
		{
			COUNTER_ARROW_WHEATHER_DATE--;
			COUNTER_ARROW_WHEATHER_CLOCK = 0;
			DATE_FOR_WEATHER.setDate(DATE_FOR_WEATHER.getDate() - 1);
			wheather();
		}	
	}

	function rightArrowDate() {
		COUNTER_ARROW_WHEATHER_DATE++;
		COUNTER_ARROW_WHEATHER_CLOCK = 0;
		DATE_FOR_WEATHER.setDate(DATE_FOR_WEATHER.getDate() + 1);
		wheather();
	}

	function leftArrowClock() {
		if (COUNTER_ARROW_WHEATHER_CLOCK === 0)
		{}
		else
		{
			COUNTER_ARROW_WHEATHER_CLOCK--;
			wheather();
		}	
	}

	function rightArrowClock() {
		COUNTER_ARROW_WHEATHER_CLOCK++;
		wheather();
	}

	function efficiency(){

		var dmyToday = '' + OBJDATA.getDate() + '-' + ( OBJDATA.getMonth() + 1 ) + '-' + OBJDATA.getFullYear();
		var obj = {
			dmy: dmyToday
		}
		$.ajax({
            url: '/header/efficiency',
            type: 'GET',
            data: obj,
            success: function(answer){

            		var VisX = [];
            		VisX[0] = answer.x[0];
            		for(var i = 1; i < answer.localLength - 2; i++)
            		{
            			VisX[i] = '';
            		}
            		VisX.push(answer.x[1]);

            	 	var data = {
  						labels: VisX,
						series: [answer.y]
					};

					var options = {
						// Don't draw the line chart points
  						axisY: {
    						offset: 60,

							labelInterpolationFnc: function(value) {
      							return '' + value + "%";
    						}
    					}
					}

					new Chartist.Line('.ct-chart', data, options);
            }
        });
	}

	function getNumberUser(){
		$.ajax({
            url: '/numberUsers',
            type: 'GET',
            success: function(answer){
            	console.log(answer);
            	$('#numberUsers').html('<p>Us already <b>' + answer + '</b> join us</p>');
            }
        });
	}

	function ConstrGetNews(url, doman, localClass, subNews) {
		this.url = url;
		this.doman = doman;
		this.localClassName = localClass;
		this.counter = 0;
		this.subNews = subNews || false;
		this.rightClick = function() {
			this.counter++;
			this.getNews();
		};
		this.leftCLick = function() {
			this.counter--;
			this.getNews();

		};
		this.getNews = function() {
			$(this.localClassName).fadeToggle("fast");
			
			if (this.subNews) {
				var obj = {
					subNewStud : this.subNews,
					counter: this.counter,
					doman: this.doman
				};
			} 
			else {
				var obj = {
					subNewStud : "News",
					counter: this.counter,
					doman: this.doman
				};
			}
		var that = this;
		 $.ajax({
            url: this.url,
            type: 'GET',
            data: obj,
            success: function(answer){ 
            	$(that.localClassName).empty();
            	$(that.localClassName).html(answer);
            	$(that.localClassName).fadeToggle("fast", function(){
            		$('.liPartNews').each(function(i){

						$(this).find('.leftArrowContent').css("height", $(this).find('.contentBetweenArrows').outerHeight());
						$(this).find('.rightArrowContent').css("height", $(this).find('.contentBetweenArrows').outerHeight());
						$(this).find('.afterTitleContentNew').css("height", $(this).find('.leftArrowContent').outerHeight() + 2);

					});
            	});           		
            }
	     });
		}
	}

	var objStudWay = new ConstrGetNews('/getNewsStudway', 'http://studway.com.ua','.Studway', 'News'); 
	var objNULP = new ConstrGetNews('/getNewsNULP','http://www.lp.edu.ua' ,'.NULP', 'NewsNulp');
	var objTerytorija = new ConstrGetNews('/getNewsTerytorija', 'http://terytoriya.com.ua','.Terytorija', 'NewsTerytorija');
	var objZaxid = new ConstrGetNews('/getNewsZaxid', 'http://zaxid.net', '.Zaxid', 'NewsZaxid');

	var objId = {
		'Studway' : objStudWay,
		'NULP' : objNULP,
		'Terytorija': objTerytorija,
		'Zaxid': objZaxid
	};

	function rightClickStudway(event){
		objId[$(event).closest('li').attr('id')].rightClick();
	}

	function leftClickStudway(event){
	if ( objId[$(event).closest('li').attr('id')].counter != 0 )
		objId[$(event).closest('li').attr('id')].leftCLick();
	}

	var SUB_NEWS_STUDWAY = '';

	$('.subNewsStudway').click(function(event){
	
		objStudWay.subNews = $(event.target).html();
		objStudWay.counter = 0;
		objStudWay.getNews();

	});


	//subNewsNULP

	$('.subNewsNULP').click(function(event){
		
		objNULP.subNews = $(event.target).html();
		objNULP.counter = 0;
		objNULP.getNews();

	});


		$('.subNewsTerytorija').click(function(event){

		objTerytorija.subNews = $(event.target).html();
		objTerytorija.counter = 0;
		objTerytorija.getNews();

	});


		$('.subNewsZaxid').click(function(event){
		
		objZaxid.subNews = $(event.target).html();
		objZaxid.counter = 0;
		objZaxid.getNews();

	});

	 $('#main_content').each(function(){
		mainpage();
		wheather();
		efficiency();
		getNumberUser();
		objStudWay.getNews();
		objNULP.getNews();
		objTerytorija.getNews();
		objZaxid.getNews();

	});

	$('#add_button').click(function(){
		
		$('#mainUL').append("<li class='liTodo' onmouseover='evMOverList(this);' onmouseout='evMOutList(this);'><div class = 'container-fluid'> <div class = 'row'><div class = 'col-lg-1 col-md-1 col-sm-1 col-xs-1'> </div><div class = 'col-lg-10 col-md-10 col-sm-10 col-xs-10'><div class='TaskContent container-fluid' style='background-color:#4C7C35;'> <div class = 'row'><div class = 'col-lg-10 col-md-10 col-sm-10 col-xs-10'><div class='helpDivTC container-fluid' onclick='clickList(this);'><div class = 'row'><div class = 'col-lg-9 col-md-9 col-sm-9 col-xs-9 textContent'>New Task</div><div class = 'col-lg-2 col-md-2 col-sm-2 col-xs-2'><div class='time1'>10:00</div> <div class='time2'>11:30</div></div><div class = 'col-lg-1 col-md-1 col-sm-1 col-xs-1'><div class='priority'>A</div> </div></div></div></div><div class = 'col-lg-2 col-md-2 col-sm-2 col-xs-2'><div class='done' onclick='deleteTask(this);'> done</div><div class='delete' onclick='deleteTask(this);'> delete</div></div></div></div></div><div class = 'col-lg-1 col-md-1 col-sm-1 col-xs-1'><div class='arrowForNextDay' onclick='taskOnTomorrow(this);''>»</div> </div></div></div><div class = 'container-fluid'><div class = 'row'><div class = 'col-lg-1 col-md-1 col-sm-1 col-xs-1'></div><div class = 'col-lg-10 col-md-10 col-sm-10 col-xs-10'><div class='popUpGRUD' style='background-color:#4C7C35;'><div class='popInput'><div class = 'container-fluid'><div class = 'row'><div class = 'col-lg-5 col-md-5 col-sm-5 col-xs-5'><input class='tastInput'></div><div class = 'col-lg-3 col-md-3 col-sm-3 col-xs-3 textPopMenu'>time <input class='time1Pop'>to<input class='time2Pop'></div><div class = 'col-lg-2 col-md-2 col-sm-2 col-xs-2 textPopMenu'>priority<select class='newPriority'><option>A</option><option>B</option><option>C</option></select></div><div class = 'col-lg-2 col-md-2 col-sm-2 col-xs-2'><div class='editAdd' onclick='editADD(this)'>add</div></div></div></div> </div> </div></div><div class = 'col-lg-1 col-md-1 col-sm-1 col-xs-1'></div></div> </div></li> ");
		$('.wrapperLI').last().show('fast');
	});
 
		var editADD = function(event, method, next){

			var localDate = newDate || OBJDATA;
			var $eventPoint = $(event).closest("li");
			console.log($(event).closest("li"));
			var typeReqAjax = '';
			var previousDate = ''; 
			if(!method || !next)
			{
				if ($eventPoint.find('.editAdd').html() === 'add')
				{
					typeReqAjax = 'POST';
				}
				else
				{
					typeReqAjax = 'PUT';
				}
			}
			else
			{
				previousDate = localDate.getDate() + '-' + ( localDate.getMonth() + 1 ) + '-' + localDate.getFullYear() + "";
				localDate.setDate(localDate.getDate() + 1);
				typeReqAjax = method;
				iter = 1;
			}

			var obj = {
				pTask : $eventPoint.find('.textContent').html(),
				nTask: $eventPoint.find('.tastInput').val() || $eventPoint.find('.textContent').html( ),
				nTime1: $eventPoint.find('.time1Pop').val() || $eventPoint.find('.time1').html(),
				nTime2: $eventPoint.find('.time2Pop').val() || $eventPoint.find('.time2').html(),
				priority: $eventPoint.find('.newPriority option:selected').text() || $eventPoint.find('.priority').html(),
				dmy :  localDate.getDate() + '-' + ( localDate.getMonth() + 1 ) + '-' + localDate.getFullYear() + "",
				previousDate: previousDate
			};

			 $.ajax({
	            url: '/tasks/editAdd',
	            type: typeReqAjax,
	            data: obj,
	            success: function(answer){           
	            	$('#mainUL').empty();
		            $('#mainUL').html(answer.mainContent);
		            if(previousDate)
		            {
		            	localDate.setDate(localDate.getDate() - 1);
		            }
	            }
	        });
		}

		var deleteTask = function(event){
			
			var localDate = newDate || OBJDATA;
			var $eventPoint = $(event).closest("li");

			var obj = {
					pTask : $eventPoint.find('.textContent').html(),
					dmy : "" + localDate.getDate() +'-' + ( localDate.getMonth() + 1 ) + '-' + localDate.getFullYear()
				};

			$eventPoint.slideToggle("slow", function(){

				 $.ajax({
		            url: '/tasks/delete',
		            type: 'DELETE',
		            data: obj,
		            success: function(answer){
		            	console.log(answer);
		            	$('#mainUL').empty();
		            	$('#mainUL').html(answer.mainContent);
		            }
		        });
			});		
		}

		var doneTask = function(event){
			
			var localDate = newDate || OBJDATA;
			var $eventPoint = $(event).closest("li");

			var obj = {
					pTask : $eventPoint.find('.textContent').html(),
					dmy : "" + localDate.getDate() +'-' + ( localDate.getMonth() + 1 ) + '-' + localDate.getFullYear()
				};
			
				 $.ajax({
		            url: '/tasks/donetask',
		            type: 'PUT',
		            data: obj,
		            success: function(answer){
		            	console.log(answer);
		            	$('#mainUL').empty();
		            	$('#mainUL').html(answer.mainContent);
		            }
		        });
		}



	var clickList = function(event){

		 var $eventPoint = $(event).closest("li");
		$eventPoint.find('.tastInput').val( $eventPoint.find('.textContent').html() );
		$eventPoint.find('.time1Pop').val( $eventPoint.find('.time1').html() );
		$eventPoint.find('.time2Pop').val( $eventPoint.find('.time2').html() );
		console.log($(event).attr('class'));

			if ($eventPoint.find('.popUpGRUD').css('display') == 'none')
			{
				$eventPoint.find('.popUpGRUD').show("fast");
			}
			else
			{
				$eventPoint.find('.popUpGRUD').hide(300);	
			}
	}
	
	var counterData = 0; 
	var newDate;

	/*---Arrows - this is rigth arrows ---*/
	$('#rightArrowSlider').click(function(){

		++counterData;
		newDate = new Date(OBJDATA.getFullYear(), OBJDATA.getMonth(), OBJDATA.getDate() + counterData);

		actionArrow('+');
		
	});
	/*--- this is left arrows ---*/
	$('#leftArrowSlider').click(function(){

		--counterData;
		newDate = new Date(OBJDATA.getFullYear(), OBJDATA.getMonth(), OBJDATA.getDate() + counterData);

		actionArrow('-');
	});

	/*--- help function for right and left arrows---*/
		function actionArrow(token){
			$('#mainUL').slideToggle("slow", function(){
				mainpage(token, function(content){
					$('#mainUL').html(content.mainContent);
					$('#mainUL').slideToggle('slow');
				});
			});

			$('#listSlider').slideToggle("slow", function(){
				mainpage(token, function(content){
					$('#listSlider').html(content.shortContent);
					$('#listSlider').slideToggle('slow');
				});
			});
		}


	function checkTime1(event){
		$eventPoint = $(event).closest('li');
		var objClass = ['.time1Pop', '.time2Pop'];

		objClass.forEach(function(item, i, arr){
			var locObj = {
				locStrTime : $eventPoint.find(item).val(),
				resultRegExp: $eventPoint.find(item).val().match(/^\d{2}:\d{2}$/)
			};

			if(locObj.locStrTime === 'HH:mm' || locObj.resultRegExp != null)
			{
				if($eventPoint.find(item).css('borderTopColor') == 'rgb(255, 255, 255)')
				{
				}
				else
				{
					$eventPoint.find(item).css({'border-color': 'white'});
				}
			}
			else
			{
				$eventPoint.find(item).css({'border-color': 'red', 'border-width': '1px'});
			}
		});		
	}

	/*function which check the actual task in this time*/
	setInterval(checkActualTask, 5000);

	 function checkActualTask(){
	 	
			$('.liTodo').each(function(){
					$time1 = $(this).find('.time1').html().split(':');
					$time2 = $(this).find('.time2').html().split(':');
					var dataForCheck = new Date();
					//console.log($time1[1] <= dataForCheck.getMinutes());
					if( ($time1[0] <= dataForCheck.getHours()) /*&& ($time1[1] <= dataForCheck.getMinutes()) */)
					{

						if( $time2[0] > dataForCheck.getHours() || ( ($time2[0] == dataForCheck.getHours()) && ($time2[1] > dataForCheck.getMinutes()) ) )
						{
							$(this).find('.TaskContent').css('background-color', '#3C4670');
							$(this).find('.popUpGRUD').css('background-color', '#3C4670');
						}
					}

				});
		}

		/*--- help function---*/

		function evMOverList(event){
			$(event).find('.arrowForNextDay').css('display', 'block');
		}

		function evMOutList(event){
			$(event).find('.arrowForNextDay').css('display', 'none');
		}

		function taskOnTomorrow(event){
			var $eventPoint = $(event).closest('li');
			$(event).animate({"left": "+=200px", opacity: "hide"  }, "slow", function(){
				$(event).closest('li').hide(500, function(){
					editADD(event, 'POST', 1);
				});
				
			});
		}