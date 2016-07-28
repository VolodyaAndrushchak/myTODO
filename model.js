module.exports = function(pool){
	return {
		Add: function(dmy, nTask, nTime1, nTime2, priority, callback){
			pool.query('INSERT INTO ?? (taskName, time1, time2, priority) VALUES (?, ?, ?, ?)' , [dmy, nTask, nTime1, nTime2, priority], callback);

			pool.query('SELECT totalNumbTasks FROM efficiency WHERE data = ?', [dmy], function(err, answerDB){
				var localTotalNumbTasks = answerDB[0].totalNumbTasks + 1;
				pool.query('UPDATE efficiency SET totalNumbTasks = ? WHERE data = ?', [localTotalNumbTasks, dmy]);
			});
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
						"PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8", [dmy], function(err, answerDB){

						if(answerDB.warningCount == 0)
						{
							pool.query('INSERT INTO efficiency  (data, totalNumbTasks, doneNumbTasks, procrastination) VALUES (?, ?, ?, ?)' , [dmy, 0, 0, 0]);
						}

						pool.query("SELECT * FROM ??", [dmy], callback);

			});
			
		},
		doneTask: function(dmy, task, callback){
			pool.query("UPDATE ?? SET done = ? WHERE taskName = ?", [dmy, 1, task], callback);

			pool.query('SELECT doneNumbTasks FROM efficiency WHERE data = ?', [dmy], function(err, answerDB){
				var localdoneNumbTasks = answerDB[0].doneNumbTasks + 1;
				pool.query('UPDATE efficiency SET doneNumbTasks = ? WHERE data = ?', [localdoneNumbTasks, dmy]);
			});

		},
		deleteList: function(dmy, pTask, includeEfficiency, callback){
			if(includeEfficiency)
			{
				pool.query('SELECT totalNumbTasks, doneNumbTasks FROM efficiency WHERE data = ?', [dmy], function(err, answerDB){
					pool.query('SELECT done FROM ?? WHERE taskName = ?', [dmy, pTask], function(err, answerSecondDB){
						var localtotalNumbTasks = answerDB[0].totalNumbTasks - 1;
						var localdoneNumbTasks = answerDB[0].doneNumbTasks - 1;
						if(answerSecondDB[0].done == 1)
						{
							pool.query('UPDATE efficiency SET totalNumbTasks = ?, doneNumbTasks = ? WHERE data = ?', [localtotalNumbTasks, localdoneNumbTasks, dmy]);
						}
						else
						{
							pool.query('UPDATE efficiency SET totalNumbTasks = ? WHERE data = ?', [localtotalNumbTasks, dmy]);
						}				
					});
				});
			}
			pool.query("DELETE FROM ?? WHERE taskName = ?", [dmy, pTask], callback);
		},
		getEfficiency: function(dmy, callback){
			pool.query("SELECT data, totalNumbTasks, doneNumbTasks  FROM efficiency WHERE data <= ?", [dmy], callback); 
		},
		delFirstRow: function(){
			pool.query('DELETE FROM efficiency WHERE 1 LIMIT 1');
		},
		findUserById: function(id, callback){
			pool.query("SELECT * FROM users WHERE id = ?", [id], function(err, answeDB){
				if(answeDB.length != 0)
				{
					callback(null, answeDB);
				}
				else
				{
					callback(new Error('User ' + id + ' does not exist'));
				}
			});
		},
		findUserByToken: function(token, callback){
			pool.query("SELECT id FROM users WHERE token = ?", [token], callback);
		},
		setUserToken: function(token, userId, callback){
			pool.query("UPDATE users SET token = ? WHERE id = ?", [token, userId], callback);
		},
		checkUser: function(username, callback){
			pool.query("SELECT ?? FROM ?? WHERE email = ? LIMIT 1", ['pass','users', username], callback);
		},
		chekUserEmail: function(email, callback){
			pool.query("SELECT name FROM users WHERE email = ?", [email], callback);
		},
		createAccount: function(username, town, email, password, callback){
			pool.query("INSERT INTO users (name, town, email, pass) VALUES (?, ?, ?, ?)", [username, town, email, password], callback);
		},
		getPassword: function(email, callback){
			pool.query("SELECT pass FROM users WHERE email = ?", [email], callback);
		}
	}
}