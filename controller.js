module.exports = function(model, view){
	return {
		add: function(req, res){
			model.Add(req.body.dmy, req.body.nTask, req.body.nTime1, req.body.nTime2, req.body.priority, function(){
				res.json('Done');
			});			
		},
		
		edit: function(req, res){		

			{
				model.Edit(req.body.dmy, req.body.pTask, req.body.nTask, req.body.nTime1, req.body.nTime2, req.body.priority, function(){
					res.json('Done');
				});		
			}

		},
		mainList: function(req, res){
			model.list(req.query.dmy, function(err, answerDB){
				view.viewMainList(answerDB, function(htmlContent){
					res.json(htmlContent);
				});
			});
		},
		deleteList: function(req, res){
			console.log(req.body.dmy + "delete");
			model.deleteList(req.body.dmy, req.body.pTask, function(){ 
				model.list(req.body.dmy, function(err, answerDB){
					view.viewMainList(answerDB, function(htmlContent){
						res.json(htmlContent);
					});
				}); 
			});		
		}
	}
}
