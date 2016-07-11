var viewMainList = function(content, callback){

	var htmlContent = '';
	for(var i = 0; i < content.length; i++)
	{
		htmlContent = htmlContent + "<li class='liTodo'><div class='TaskContent'  onclick='clickList(this);'> <div class='textContent'>"+ content[i].taskName + "</div><div class='time1'>" + content[i].time1 + "</div> <div class='time2'>" + content[i].time2 + "</div> <div class='priority'>" + content[i].priority + "</div><input value = 'delete' type='button' class='delete' onclick= 'deleteTask(this);'> <input value = 'done' type='button' class='done'> </div> <div class = 'popUpGRUD'> <input class='tastInput'>time <input class = 'time1Pop'>to<input class = 'time2Pop'>priority<select class = 'newPriority'><option>A</option><option>B</option><option>C</option></select><input class = 'editAdd' onclick= 'editADD(this)' value ='edit' type='button'> </div> </li> "
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
			shortContent = shortContent + "<li class = 'lisSlider'>" + content[i].taskName + '</li>';
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
module.exports = {
	viewMainList
}