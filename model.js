module.exports = function(pool){
	return {
		Add: function(nTask, nTime1, nTime2, priority, callback){
			pool.query('INSERT INTO tasks (taskName, time1, time2, priority) VALUES (?, ?, ?, ?)' , [nTask, nTime1, nTime2, priority], callback);
			//pool.query("SELECT * FROM tasks", callback);

		},

		Edit: function(pTask, nTask, nTime1, nTime2, priority, callback){
			pool.query("UPDATE tasks SET taskName= ?, time1 = ?, time2 = ?, priority = ? WHERE taskName = ?", [nTask, nTime1, nTime2, priority, pTask ], callback);
			//console.log(pTask);
		},

		list: function(callback){
			pool.query("SELECT * FROM tasks", callback);
		},
		deleteList: function(pTask, callback){
			pool.query("DELETE FROM tasks WHERE taskName = ?", [pTask], callback);
		}
	}
}