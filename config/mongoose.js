const mongoose = require('mongoose');
const env = require('./environment.js');

mongoose.connect(`mongodb://localhost/${ env.db }`,{useUnifiedTopology : true ,useNewUrlParser:true , useCreateIndex:true, useFindAndModify:false});

const db = mongoose.connection;

db.on('error',function(err){
	console.log(err.message);
});

db.once('open',function(){
	console.log("Successfully connected to the Library database");
});