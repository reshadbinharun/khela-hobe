const { Client } = require('pg');
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
var schedule = require('node-schedule'); //scheduler


//SCHEDULER
//send an email every Thu, Fri, Sat @ 3pm
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [4, new schedule.Range(5, 6)];
rule.hour = 15; //@3pm
rule.minute = 0; //first minute
 
var j = schedule.scheduleJob(rule, function(){
  console.log('Time to play soccer');
});

//scheduler

//EMAIL                                                                                                                                        

var helper = require('sendgrid').mail;
var sg = require('sendgrid')('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'); //changing to process.env.sg_api gives error

var from_email = new helper.Email('tx@sendgrid.com');
var to_email = new helper.Email('reshadbinharun@gmail.com');
var subject = 'Subject';
var content = new helper.Content('text/plain', 'test');
var mail = new helper.Mail(from_email, subject, to_email, content);

var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mail.toJSON(),
});

sg.API(request, function(err, response) {
  console.log(response.statusCode);
  console.log(response.body);
  console.log(response.headers);
});


//weather api                                                                                                                                  
var weather = require('node-openweather')({
  key: "1330048a0ee49d7901ca01f7432498e4", //set as process.env variable using heroku config:set weather_api = ...                             
  accuracy: "like",
  unit: "metric",

    language: "en"
});

//EXAMPLE CALL WEATHER API                                                                                                                     
weather.city('London').now().then(function(res) {
  //success logic                                                                                                                              
  console.log('weather api works!');
  console.log(res);
}).catch(function(err) {
  //error handling                                                                                                                             
});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

        DATABASE_URL = 'postgres://sxxgnlsixgcbss:c565e7eeb501bc9dfd7c3b15cff60adaca8bd0a1d051e477fd7cd54e78c75135@ec2-23-23-142-5.compute-1.a\
mazonaws.com:5432/deqf80l6sfj4to?ssl=true';
        const client = new Client({
        connectionString: DATABASE_URL,
        ssl: true,
        });
        client.connect();


app.post('/store', function (req, res){
        var name = req.body.name;
        var city = req.body.city;
        var email = req.body.email;



        var query_ins = 'insert into khela (name,email,city) values(\''+name+'\',\''+email+'\','+'\''+city+'\')';
        console.log(query_ins);
        client.query(query_ins, (err1, res1) => {
                if (err1) {
                        console.log(err1.stack)
                } else {
                        console.log(res1.rows[0]);
                        //sendgrid email test                                                                                                  
                }
        });


});

app.listen(process.env.PORT || 3000);

/*                                                                                                                                             
const sgMail = require('@sendgrid/mail');                                                                                                      
sgMail.setApiKey(process.env.sg_api);                                                                                                          
const msg = {                                                                                                                                  
  to: 'reshadbinharun@gmail.com',                                                                                                              
  from: 'sender@example.org',                                                                                                                  
  subject: 'Hello world',                                                                                                                      
  text: 'Hello plain world!',                                                                                                                  
  html: '<p>Hello HTML world!</p>',                                                                                                            
};                                                                                                                                             
sgMail.send(msg);                                                                                                                              
*/


/*                                                                                                                                             
var sg = require('sendgrid')(process.env.sg_api);                                                                                              
var request = sg.emptyRequest({                                                                                                                
  method: 'POST',                                                                                                                              
  path: '/v3/mail/send',                                                                                                                       
  body: {                                                                                                                                      
    personalizations: [                                                                                                                        
      {                                                                                                                                        
        to: [                                                                                                                                  
          {                                                                                                                                    
            email: 'reshadbinharun@gmail.com',                                                                                                 
          },                                                                                                                                   
        ],                                                                                                                                     
        subject: 'Hello World from the SendGrid Node.js Library!',                                                                             
      },                                                                                                                                       
    ],                                                                                                                                         
    from: {                                                                                                                                    
      email: 'test@example.com',                                                                                                               
    },                                                                                                                                         
    content: [                                                                                                                                 
      {                                                                                                                                        
        type: 'text/plain',                                                                                                                    
        value: 'Hello, Email!',                                                                                                                
      },                 
          ],                                                                                                                                         
  },                                                                                                                                           
});                                                                                                                                            
                                                                                                                                               
//with callback                                                                                                                                
                                                                                                                                               
sg.API(request, function(error, response) {                                                                                                    
  if (error) {                                                                                                                                 
    console.log('Error response received with email');                                                                                         
  }                                                                                                                                            
  console.log(response.statusCode);                                                                                                            
  console.log(response.body);                                                                                                                  
  console.log(response.headers);                                                                                                               
});                                                                                                                                            
*/
//EMAIL                                                                                                                                        



/*
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

	DATABASE_URL = 'postgres://sxxgnlsixgcbss:c565e7eeb501bc9dfd7c3b15cff60adaca8bd0a1d051e477fd7cd54e78c75135@ec2-23-23-142-5.compute-1.amazonaws.com:5432/deqf80l6sfj4to?ssl=true';
	const client = new Client({
  	connectionString: DATABASE_URL,
  	ssl: true,
	});
	client.connect();


app.post('/store', function (req, res){
	var name = req.body.name;
	var city = req.body.city;
	var email = req.body.email;


	var query_ins = 'insert into khela (name,email,city) values(\''+name+'\',\''+email+'\','+'\''+city+'\')';
	console.log(query_ins);
	client.query(query_ins, (err1, res1) => {
		if (err1) {
			console.log(err1.stack)
		} else {
			console.log(res1.rows[0])
		}
	});		


});

app.listen(process.env.PORT || 3000);
*/

/*                                                                                                                                             
var email = new sendgrid.Email();                                                                                                              
                                                                                                                                               
email.addTo("test@sendgrid.com");                                                                                                              
email.setFrom("reshadbinharun@gmail.com");                                                                                                     
email.setSubject("Sending with SendGrid is Fun");                                                                                              
email.setHtml("and easy to do anywhere, even with Node.js");                                                                                   
                                                                                                                                               
sendgrid.send(email);                                                                                                                          
*/
