module.exports = function(pool){
	return {
		Add: function(dmy, nTask, nTime1, nTime2, priority, callback){
			pool.query('INSERT INTO ?? (taskName, time1, time2, priority) VALUES (?, ?, ?, ?)' , [dmy, nTask, nTime1, nTime2, priority], callback);

		},

		Edit: function(dmy, pTask, nTask, nTime1, nTime2, priority, callback){
			pool.query("UPDATE ?? SET taskName= ?, time1 = ?, time2 = ?, priority = ? WHERE taskName = ?", [dmy, nTask, nTime1, nTime2, priority, pTask ], callback);
		},

		list: function(dmy, callback){
			pool.query("CREATE TABLE IF NOT EXISTS ??" + 
						"(id int(10) unsigned NOT NULL AUTO_INCREMENT," + 
						"taskName varchar(200) DEFAULT NULL," +  
						"time1 varchar(10) DEFAULT NULL," + 
						"time2 varchar(10) DEFAULT NULL," +  
						"priority varchar(1) DEFAULT NULL," +
						"done varchar(1) DEFAULT NULL," +
						"PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8", [dmy], function(){

							pool.query("SELECT * FROM ??", [dmy], callback);

			});
		},
		doneTask: function(dmy, task){
			pool.query("UPDATE ?? SET done = ? WHERE taskName = ?", [dmy, 1, task]);
		},
		deleteList: function(dmy, pTask, callback){
			pool.query("DELETE FROM ?? WHERE taskName = ?", [dmy, pTask], callback);
		}
	}
}