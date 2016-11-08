module.exports = function(pool){
	return {

		Add: function(sessHesh, dmy, nTask, nTime1, nTime2, priority, callback){

			pool.query('SELECT * FROM ?? WHERE data = ?', [sessHesh, dmy], function(err, answerDB){
				if (answerDB.length === 0)
				{
					pool.query('INSERT INTO ??  (data, totalNumbTasks, doneNumbTasks, procrastination) VALUES (?, ?, ?, ?)' , [sessHesh+'efficiency',dmy, 0, 0, 0], function(err, answerDB2){
							pool.query('INSERT INTO ?? (data, taskName, time1, time2, priority) VALUES (?, ?, ?, ?, ?)' , [sessHesh, dmy, nTask, nTime1, nTime2, priority], callback);

							pool.query('SELECT totalNumbTasks FROM ?? WHERE data = ?', [sessHesh+'efficiency', dmy], function(err, answerDB){
								var localTotalNumbTasks = answerDB[0].totalNumbTasks + 1;
								pool.query('UPDATE ?? SET totalNumbTasks = ? WHERE data = ?', [sessHesh+'efficiency', localTotalNumbTasks, dmy]);
							});
						});
				}
				else
				{
						pool.query('INSERT INTO ?? (data, taskName, time1, time2, priority) VALUES (?, ?, ?, ?, ?)' , [sessHesh, dmy, nTask, nTime1, nTime2, priority], callback);

						pool.query('SELECT totalNumbTasks FROM ?? WHERE data = ?', [sessHesh+'efficiency', dmy], function(err, answerDB){
							var localTotalNumbTasks = answerDB[0].totalNumbTasks + 1;
							pool.query('UPDATE ?? SET totalNumbTasks = ? WHERE data = ?', [sessHesh+'efficiency', localTotalNumbTasks, dmy]);
						});
				}
			});				
		},

		Edit: function(sessHesh, dmy, pTask, nTask, nTime1, nTime2, priority, callback){
			pool.query("UPDATE ?? SET taskName= ?, time1 = ?, time2 = ?, priority = ? WHERE taskName = ? AND data = ?", [sessHesh, nTask, nTime1, nTime2, priority, pTask, dmy], callback);
		},
		list: function(sessHesh, dmy, token, callback){
			pool.query("SELECT * FROM ?? WHERE data = ?", [sessHesh, dmy], callback);		
		},

		delFirstRowList: function(sessHesh) {
			pool.query("SELECT * FROM ??", [sessHesh], function(err, answerDB){
				if(answerDB.length >  300)
					pool.query('DELETE FROM ?? LIMIT 1', [sessHesh]);
			});
		},

		doneTask: function(sessHesh, dmy, task, callback){
			pool.query("UPDATE ?? SET done = ? WHERE taskName = ? AND data = ?", [sessHesh, 1, task, dmy], callback);

			pool.query('SELECT doneNumbTasks FROM ?? WHERE data = ?', [sessHesh+'efficiency', dmy], function(err, answerDB){
				var localdoneNumbTasks = answerDB[0].doneNumbTasks + 1;
				pool.query('UPDATE ?? SET doneNumbTasks = ? WHERE data = ?', [sessHesh+'efficiency', localdoneNumbTasks, dmy]);
			});

		},
		deleteList: function(sessHesh, dmy, pTask, includeEfficiency, callback){
			if(includeEfficiency)
			{
				pool.query('SELECT totalNumbTasks, doneNumbTasks FROM ?? WHERE data = ?', [sessHesh+'efficiency', dmy], function(err, answerDB){
					pool.query('SELECT done FROM ?? WHERE taskName = ? AND data = ?', [sessHesh, pTask, dmy], function(err, answerSecondDB){
						var localtotalNumbTasks = answerDB[0].totalNumbTasks - 1;
						var localdoneNumbTasks = answerDB[0].doneNumbTasks - 1;
						if(answerSecondDB[0].done == 1)
						{
							pool.query('UPDATE ?? SET totalNumbTasks = ?, doneNumbTasks = ? WHERE data = ?', [sessHesh+'efficiency', localtotalNumbTasks, localdoneNumbTasks, dmy]);
						}
						else
						{
							pool.query('UPDATE ?? SET totalNumbTasks = ? WHERE data = ?', [sessHesh+'efficiency', localtotalNumbTasks, dmy]);
						}
						pool.query("DELETE FROM ?? WHERE taskName = ? AND data = ?", [sessHesh, pTask, dmy], callback);				
					});
				});
			}
			
		},
		getEfficiency: function(sessHesh, dmy, callback){
			pool.query("SELECT data, totalNumbTasks, doneNumbTasks  FROM ??", [sessHesh+'efficiency'], callback); 
		},
		delFirstRowEff: function(sessHesh){
			pool.query('DELETE FROM ?? WHERE 1 LIMIT 1', [sessHesh+'efficiency']);
		},
		checkUser: function(username, callback){
			pool.query("SELECT *  FROM ?? WHERE email = ? LIMIT 1", ['users', username], callback);
		},
		chekUserEmail: function(email, callback){
			pool.query("SELECT name FROM users WHERE email = ?", [email], callback);
		},
		createAccount: function(dmy, username, town, email, password, md5Code, callback){
			pool.query("INSERT INTO users (name, town, email, pass, hesh) VALUES (?, ?, ?, ?, ?)", [username, town, email, password, md5Code], callback);
			pool.query("CREATE TABLE IF NOT EXISTS ??" + 
						"(id int(10) unsigned NOT NULL AUTO_INCREMENT," + 
						"data varchar(10) DEFAULT NULL," +  
						"totalNumbTasks int(10) DEFAULT NULL," + 
						"doneNumbTasks int(10) DEFAULT NULL," +  
						"procrastination int(10) DEFAULT NULL," +
						"PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8", [md5Code+'efficiency'], function(err, answerDB){
				pool.query('INSERT INTO ?? (data, totalNumbTasks, doneNumbTasks, procrastination)',[md5Code+'efficiency', dmy, 0, 0, 0]);
			});
			pool.query("CREATE TABLE IF NOT EXISTS ??" + 
						"(id int(10) unsigned NOT NULL AUTO_INCREMENT," +
						"data varchar(10) DEFAULT NULL," +  
						"taskName varchar(200) DEFAULT NULL," + 
						"time1 varchar(10) DEFAULT NULL," + 
						"time2 varchar(10) DEFAULT NULL," +  
						"priority varchar(1) DEFAULT NULL," +
						"done varchar(1) DEFAULT NULL," +
						"PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8", [md5Code]);

		},
		getPassword: function(email, callback){
			pool.query("SELECT pass, name FROM users WHERE email = ?", [email], callback);
		},
		getUserByHesh: function(hesh, callback){
			pool.query('SELECT town FROM users WHERE hesh = ?', [hesh], function(err, answerDB){
				pool.query('SELECT cityLatin FROM citybase WHERE cityCyrillic = ?', [answerDB[0].town], callback)
			});
		},
		getNumberUsers: function(callback){
			pool.query("SELECT name FROM users WHERE 1", callback);
		},
		getDataNews: function(nameSubNews, callback){
			pool.query("SELECT * FROM datanews WHERE title = ?", [nameSubNews], callback);
		}
	}
}