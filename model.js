module.exports = function(pool){
	return {
		Add: function(nTask, nTime1, nTime2){
			pool.query('INSERT INTO tasks (taskName, time1, time2) VALUES (?, ?, ?)' , [nTask, nTime1, nTime2]);
		},

		Edit: function(pTask, nTask, nTime1, nTime2){
			pool.query("UPDATE tasks SET taskName= ?, time1 = ?, time2 = ? WHERE taskName = ?", [nTask, nTime1, nTime2, pTask]);
		}
	}
}