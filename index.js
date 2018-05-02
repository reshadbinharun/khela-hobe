const { Client } = require('pg');
var express = require('express'); 
var app = express();
app.use(express.static(__dirname + '/public'));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

	DATABASE_URL = 'postgres://xmjmejyqovmyxr:f83166d3ca07aa04da2b3b1e1b92cf7fd8a769a54d6ac89d2171ff5cdd5113fd@ec2-54-225-199-107.compute-1.amazonaws.com:5432/d9gfqjbk55m9bs?ssl=true';
	const client = new Client({
  	connectionString: DATABASE_URL,
  	ssl: true,
	});
	client.connect();


app.post('/getHit', function (req, res){
	
});

app.listen(process.env.PORT || 3000);

