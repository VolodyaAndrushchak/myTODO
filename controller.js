module.exports = function(model, view){
	return {
		editAdd: function(req, res){
			//console.log(req.query.button);
			if (req.query.button == 'add')
			{
				model.Add(req.query.nTask, req.query.nTime1, req.query.nTime2, req.query.priority, function(){
					res.json('Done');
				});			
			}
				
			else 
			{
				if (req.query.button == 'edit')
				{
					model.Edit(req.query.pTask, req.query.nTask, req.query.nTime1, req.query.nTime2, req.query.priority, function(){
						res.json('Done');
					});
				}
					
			}

		},
		mainList: function(req, res){
			model.list(function(err, answerDB){
				view.viewMainList(answerDB, function(htmlContent){
					res.json(htmlContent);
				});
			});
		},
		deleteList: function(req, res){
			model.deleteList(req.query.pTask, function(){ 
				model.list( function(err, answerDB){
					view.viewMainList(answerDB, function(htmlContent){
						res.json(htmlContent);
					});
				}); 
			});		
		}
	}
}
