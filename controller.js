module.exports = function(model){
	return {
		editAdd: function(req, res){
			if (req.query.button == 'add')
			{
				model.Add(req.query.nTask, req.query.nTime1, req.query.nTime2);
				res.json('edit');
				console.log(1);
			}
			else 
				{
					if (req.query.button == 'edit')
					{
						model.Edit(req.query.pTask, req.query.nTask, req.query.nTime1, req.query.nTime2);

					}
				}
		}
	}
}