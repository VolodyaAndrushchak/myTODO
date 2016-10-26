var viewMainList = function(content, callback){

	var htmlContent = '';
	
	for(var i = 0; i < content.length; i++)
	{
		var colorBlock = '';
		var addButDone = '';
		var positionDeleteButton = '';

		if(content[i].done == 1)
		{
			colorBlock = 'background-color' + ':' + '#4C7C35;';
			positionDeleteButton = 'margin-top' + ':' + '33px;'
		}
		else
		{
			addButDone = "<div onclick ='doneTask(this);' class='done'>done</div>";
		}

		htmlContent = htmlContent + "<li class='liTodo' onmouseover = 'evMOverList(this);' onmouseout = 'evMOutList(this);' > <div class = 'container-fluid'> <div class = 'row'><div class = 'col-lg-1 col-md-1 col-sm-1 col-xs-1'> </div>" + 
		"<div class = 'col-lg-10 col-md-10 col-sm-10 col-xs-10'><div class='TaskContent container-fluid' style="+ colorBlock + "> <div class = 'row'><div class = 'col-lg-10 col-md-10 col-sm-10 col-xs-10'><div class = 'helpDivTC container-fluid' onclick='clickList(this);'> <div class = 'row'>" 
			+ "<div class='textContent col-lg-9 col-md-9 col-sm-9 col-xs-9'>"+ content[i].taskName + "</div><div class = 'col-lg-2 col-md-2 col-sm-2 col-xs-2 mainTasksTime'><div class='time1 '>" + content[i].time1 + "</div> <div class='time2'>" + content[i].time2 + "</div></div>" +
			"<div class = 'col-lg-1 col-md-1 col-sm-1 col-xs-1 mainTasksPriority'><div class='priority'>" + content[i].priority + "</div></div> </div></div></div><div class = 'col-lg-2 col-md-2 col-sm-2 col-xs-2'>" + addButDone +"<div class='delete' onclick= 'deleteTask(this);' style = "+ positionDeleteButton +"> delete</div></div></div></div>" + 
			"</div><div class = 'col-lg-1 col-md-1 col-sm-1 col-xs-1'> <div class = 'arrowForNextDay' onclick = 'taskOnTomorrow(this);'>&#187</div> </div> </div></div> <div class = 'container-fluid'><div class = 'row'><div class = 'col-lg-1 col-md-1 col-sm-1 col-xs-1'></div><div class = 'col-lg-10 col-md-10 col-sm-10 col-xs-10'>" + 
			"<div class='popUpGRUD' style =" + colorBlock + "><div class='popInput'><div class = 'container-fluid'><div class = 'row'><div class = 'col-lg-5 col-md-5 col-sm-5 col-xs-5'><input class='tastInput'></div><div class = 'col-lg-3 col-md-3 col-sm-3 col-xs-3 textPopMenu'>time <input class='time1Pop'>to<input class='time2Pop'></div> " + 
			" <div class = 'col-lg-2 col-md-2 col-sm-2 col-xs-2 textPopMenu'>priority<select class='newPriority'><option>A</option><option>B</option><option>C</option></select></div><div class = 'col-lg-2 col-md-2 col-sm-2 col-xs-2'><div class='editAdd' onclick='editADD(this)'>edit</div></div></div></div> </div> </div></div><div class = 'col-lg-1 col-md-1 col-sm-1 col-xs-1'></div></div> </div> </li> "
	}

	var statusDay = '';
	if(content.length <= 3)
	{
		statusDay = "Easy day :)";
	}
	else
	{
		if(content.length <= 5)
		{
			statusDay = "Normal day :)";
		}
		else
		{
			statusDay = "Hot day :)";
		}
	}

	var shortContent = '', counter = 1;
	for(var i = 0; i < content.length; i++)
	{	
		if( (content[i].priority === 'A') && (counter <= 5) )
		{
			shortContent = shortContent + "<li class = 'lisSlider'> <div class = 'container-fluid'> <div class = 'row'> <div class = 'liSliderContent col-lg-8  col-md-8  col-sm-8 col-xs-8'>" + content[i].taskName + "</div><div class = 'liSliderTime col-lg-3 col-md-3  col-sm-3 col-xs-3'>" 
			+ content[i].time1 + " - " + content[i].time2 + "</div> <div class = 'LiSliderStatus col-lg-1 col-md-1  col-sm-1 col-xs-1'>" + content[i].priority + "</div></div></div></li>";
			counter++;
		}
	}

	var objHtmlContent = {
		mainContent: htmlContent,
		shortContent:  shortContent,
		statusDay: statusDay
	}

	callback(objHtmlContent);
}

function viewEfficiency(answerDB, callback){
	var obj = {};
	obj.x = [];
	obj.y = [];

	if(answerDB.length != 0)
	{
		obj.x[0] = answerDB[0].data;
		obj.x[1] = answerDB[answerDB.length - 1].data;

		obj.x.forEach(function(item, i, arr){
			var localTime = obj.x[i].split('-');
			obj.x[i] = localTime[0] + "." + localTime[1];
		});

		obj.localLength = 0;

		if(answerDB.length <= 30)
		{
			obj.localLength = answerDB.length;
		}
		else
		{
			obj.localLength = 30;
		}
		var counter = 0;
		for(var i = 0; i < obj.localLength; i++)
		{
			if(answerDB[i].totalNumbTasks == 0)
			{
				counter++;
				continue;
			}
			else
			{
				obj.y.push(((parseFloat(answerDB[i].doneNumbTasks) / parseFloat(answerDB[i].totalNumbTasks))*100).toFixed(1));
			}	
		}
		//console.log(obj.y.length);
		obj.localLength = obj.localLength - counter;
		//console.log(obj);
		callback(obj);
	}
	
}

module.exports = {
	viewMainList,
	viewEfficiency
}