module.exports = function(pool){
	return {
		Add: function(dmy, nTask, nTime1, nTime2, priority, callback){
			pool.query('INSERT INTO ?? (taskName, time1, time2, priority) VALUES (?, ?, ?, ?)' , [dmy, nTask, nTime1, nTime2, priority], callback);
			//pool.query("SELECT * FROM tasks", callback);

		},

		Edit: function(dmy, pTask, nTask, nTime1, nTime2, priority, callback){
			pool.query("UPDATE ?? SET taskName= ?, time1 = ?, time2 = ?, priority = ? WHERE taskName = ?", [dmy, nTask, nTime1, nTime2, priority, pTask ], callback);
			//console.log(pTask);
		},

		list: function(dmy, callback){
			//console.log(dmy);
			pool.query("CREATE TABLE IF NOT EXISTS ??" + 
						"(id int(1) unsigned NOT NULL AUTO_INCREMENT," + 
						"taskName varchar(200) DEFAULT NULL," +  
						"time1 varchar(10) DEFAULT NULL," + 
						"time2 varchar(10) DEFAULT NULL," +  
						"priority varchar(1) DEFAULT NULL," +
						"PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8", [dmy], function(){

							pool.query("SELECT * FROM ??", [dmy] ,callback);
			});

			//pool.query("SELECT * FROM ??", [dmy] ,callback);
		},
		deleteList: function(dmy, pTask, callback){
			pool.query("DELETE FROM ?? WHERE taskName = ?", [dmy, pTask], callback);
		}
	}
}