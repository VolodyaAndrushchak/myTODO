var viewMainList = function(content, callback){

	var htmlContent = '';
	for(var i = 0; i < content.length; i++)
	{
		var colorBlock = '';
		var addButDone = '';
		var styleBut = '';
		var styleForNextDay ='';
		if(content[i].done == 1)
		{
			colorBlock = 'background-color' + ':' + '#4C7C35;';
			styleBut = 'top' + ':' + '-60px;'; 
			styleForNextDay = 'top' + ':' +  '-110px';
		}
		else
		{
			addButDone = "<div onclick ='doneTask(this);' class='done'>done</div>";
		}

		htmlContent = htmlContent + "<li class='liTodo' onmouseover = 'evMOverList(this);' onmouseout = 'evMOutList(this);' ><div class='TaskContent' style="+ colorBlock + "> <div class = 'helpDivTC' onclick='clickList(this);'>" 
			+ "<div class='textContent'>"+ content[i].taskName + "</div><div class='time1'>" + content[i].time1 + "</div> <div class='time2'>" + content[i].time2 + "</div>" +
			"<div class='priority'>" + content[i].priority + "</div> </div><div class='delete' onclick= 'deleteTask(this);' style = " + styleBut +"> delete</div> " + 
			addButDone + "  <div class = 'arrowForNextDay'  onclick = 'taskOnTomorrow(this);'  style = " + styleForNextDay + " >&#187</div> </div>  <div class = 'popUpGRUD' style="+ colorBlock + "><div class = 'popInput'> " +
			" <input class='tastInput'>time <input class = 'time1Pop'>to<input class = 'time2Pop'>priority<select class = 'newPriority'><option>A</option><option>B</option><option>C</option></select></div> "
			+ " <div class = 'editAdd' onclick= 'editADD(this)'>edit</div> </li> "
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
			shortContent = shortContent + "<li class = 'lisSlider'> <div class = 'liSliderContent'>" + content[i].taskName + "</div><div class = 'liSliderTime'>" 
			+ content[i].time1 + " - " + content[i].time2 + "</div> <div class = 'LiSliderStatus'>" + content[i].priority + "</div></li>";
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
	obj.x[0] = answerDB[0].data;
	obj.x[1] = answerDB[answerDB.length - 1].data;
	obj.localLength = 0;

	if(answerDB.length <= 30)
	{
		obj.localLength = answerDB.length;
	}
	else
	{
		obj.localLength = 30
	}

	for(var i = 0; i < obj.localLength; i++)
	{
		if(!answerDB[i])
		{
			obj.y[i] = 0;
		}
		else
		{
			obj.y[i] = ((parseFloat(answerDB[i].doneNumbTasks) / parseFloat(answerDB[i].totalNumbTasks))*100).toFixed(1);
		}
	}

	callback(obj);
}

module.exports = {
	viewMainList,
	viewEfficiency
}