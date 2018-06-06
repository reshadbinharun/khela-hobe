const { Client } = require('pg');
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
var schedule = require('node-schedule'); //scheduler

DATABASE_URL = 'postgres://sxxgnlsixgcbss:c565e7eeb501bc9dfd7c3b15cff60adaca8bd0a1d051e477fd7cd54e78c75135@ec2-23-23-142-5.compute-1.a\
mazonaws.com:5432/deqf80l6sfj4to?ssl=true';
const client = new Client({
  connectionString: DATABASE_URL,
  ssl: true,
  });
client.connect();

var weather = require('node-openweather')({
  key: "1330048a0ee49d7901ca01f7432498e4", //set as process.env variable using heroku config:set weather_api = ...                             
  accuracy: "like",
  unit: "metric",

    language: "en"
});

// ***** SCHEDULER ******
//send an email every Thu, Fri, Sat @ 3pm

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [4, new schedule.Range(5, 6)];
rule.hour = 15; //@3pm
rule.minute = 0; //first minute
 
var j = schedule.scheduleJob(rule, function(){
	//TREAT CODE AS PSEUDO
  //console.log('Time to play soccer');
  
  var cities = [];
  var query_cities = 'select cities from khela;';
  client.query(query_cities, (err_c, res_c) => {
                if (err_c) {
                        console.log(err_c.stack)
                } else {
                        console.log(res_c.rows[0]);
                        //sendgrid email test                                                                                                  
                }
        });
  for (var i =0; i < cities.size();i++){
  	var emails = [];
  	query_email = 'select email from khela where city='+cities[i];
  	for (var k = 0; k < emails.size();k++){
  		var mail_html = "... form with option to attend ... /agree ... if 6 agree, send email!";
  		//send mail to each mail address from /agree route
  	}
  }
});

//SCHEDULER TEST NOW
/*
var city_list = [];
var query_cities = 'select distinct city from khela;';
  client.query(query_cities, (err_c, res_c) => {
                if (err_c) {
                        console.log(err_c.stack)
                } else {
                        //console.log(res_c.rows);
                        //sendgrid email test
                        cities = res_c.rows;
                        /*for (var i = 0; i < cities.length; i++){
                          //console.log(cities[i].city);
                          console.log("The city "+String(cities[i].city)+"is being pushed into cities array");
                          //the cities[i].city returns the correct city but city_list[k] does not!
                          city_list.push(cities[i].city);
                        }
                        console.log(cities[1].city);
                        console.log(cities.length);

                        for (var k = 0; k < cities.length; k++){

                          var query_em = 'select email from khela where city='+'\''+cities[k].city+'\'';
                          client.query(query_em, (err_e, res_e) => {
                            if (err_e) {
                              console.log(err_e.stack)
                            } else {
                              //console.log(cities[k].city);
                              //console.log("The following is an email from city "+ cities[k].city);//asynchronous issue
                              console.log(res_e.rows[0].email);
                            //sendgrid email test
                            var email = res_e.rows[0].email;

                            //send email if weather is good in city
                            weather.city('medford').now().then(function(res) {
                            //success logic                                                                                                                              
                            console.log('weather api works!');
                            console.log(res);
                          }).catch(function(err) {
                            //error handling                                                                                                                             
                          });
                                                                                                                            
                            }
                          }); 
                        }
                        //console.log(cities);                                                                                                  
                }
        });
*/
//scheduler

//******* EMAIL ******                                                                                                                                        
//THIS WORKS!
/*
const sgMail = require('@sendgrid/mail');                                                                                                      
sgMail.setApiKey('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');                                                                                                          
const msg = {                                                                                                                                  
  to: 'solim.khan902@gmail.com',                                                                                                              
  from: 'definitelyTheFuture@futre.saveusall',                                                                                                                  
  subject: 'MISSION IMPOSSIBLE',                                                                                                                      
  text: 'This is a message from the future. Reshad becomes evil and must be stopped! Are you upto the task?',                                                                                                                  
  html: '<p>would recommend 10/10!</p>',                                                                                                            
};                                                                                                                                             
sgMail.send(msg); 
*/


//****** WEATHER ****** 
                                                                                                                                 

/*
//EXAMPLE CALL WEATHER API                                                                                                                     
weather.city('London').now().then(function(res) {
  //success logic                                                                                                                              
  console.log('weather api works!');
  console.log(res);
}).catch(function(err) {
  //error handling                                                                                                                             
});
*/


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));

});


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
        res.send('Thank you! Expect an email from us when the weather is good in your area! ^_^');


});


//TESTING for EMAIL and weather

app.post('/cityTest', function (req, res){
  var city = req.body.city;
  //select email from database with given city
  //use promise so that emails are sent only after async database request is finished


  //TESTING OUT PROMISE CHAINING
    var promise = new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…
    var query_ins = 'select email from khela where city=\''+city+'\'';
        console.log(query_ins);
        client.query(query_ins, (err1, res1) => {
                if (err1) {
                  reject(err1);
                        //console.log(err1.stack)
                } else {
                  //console.log(res1.rows[0]);
                  resolve(res1);                                                                                                
                }
        });
    });
    
    promise.then(function(res1) {
      console.log(res1.rows[0]); // "Stuff worked!"
      //console.log(res1.rows[0].email);
      var emails = []
      //extract all emails as string and convert to JSON
      for(var i = 0; i < res1.rows.length; i++){
        var temp = res1.rows[i].email;
        temp = temp.replace(/\s/g, '');
        emails.push({
          email:temp
        });
        console.log(emails[i].email);
      }
      //NOW TO SEND THE EMAIL
      const sgMail = require('@sendgrid/mail');                                                                                                      
      sgMail.setApiKey('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');                                                                                                          
      const msg = {                                                                                                                                  
        to: emails, //parse emails and separate                                                                                                             
        from: 'khelahobe@reshadisking.money',                                                                                                                  
        subject: 'Testing for Khela Hobe!',                                                                                                                      
        text: 'Test message',                                                                                                                  
        html: '<p>This is a test messge to test Reshad\'s app! Thank you for participating...</p>',                                                                                                            
      };                                                                                                                                             
      sgMail.send(msg); 
    }, function(err) {
      console.log(err); // Error: "It broke"
    });

  
  //TESTING OUT PROMISE CHAINING


  res.send('Testing Done for city!')
});


//chainging order: check weather with city, if weather good, query database and send email!
app.post('/cityWeatherTest', function (req, res){
  var city = req.body.city;
    var promise = new Promise(function(resolve, reject) {
        weather.city(city).now().then(function(res_w) {
          //success logic                                                                                                                              
          console.log('weather api works!');
        }).catch(function(err_w) {
          //error handling                                                                                                                             
        });
        var weather_good = false;
        var temp = Number(res_w.main.temp);
        if (temp > 290 && temp < 300){
          console.log("Temperature is" + temp);
          weather_good = true;
        }
        else{
          weather_good = false;
        }
        
    }).then(function() {
      var emails = [];
        //IF WEATHER GOOD
        if (weather_good){
          var query_ins = 'select email from khela where city=\''+city+'\'';
          console.log(query_ins);
            client.query(query_ins, (err1, res1) => {
              console.log("Making SQL query!");
                    if (err1) {
                      reject(err1);
                            //console.log(err1.stack)
                    } else {
                      //console.log(res1.rows[0]);
                      resolve(res1);
                      for(var i = 0; i < res1.rows.length; i++){
                        var temp = res1.rows[i].email;
                        temp = temp.replace(/\s/g, '');
                        emails.push({
                          email:temp
                        });
                        console.log(emails[i].email);
                      }                                                                                                
                    }
                  }).then(function(){
                    console.log("sending emails");
                    const sgMail = require('@sendgrid/mail');                                                                                                      
                    sgMail.setApiKey('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');                                                                                                          
                    const msg = {                                                                                                                                  
                      to: emails, //parse emails and separate                                                                                                             
                      from: 'khelahobe@reshadisking.money',                                                                                                                  
                      subject: 'Testing for Khela Hobe!',                                                                                                                      
                      text: 'Test message',                                                                                                                  
                      html: '<p>This is a test messge to test Reshad\'s app! Thank you for participating...</p>',                                                                                                            
                    };                                                                                                                                             
                    sgMail.send(msg); 
                  });
          } else{
            res.send("There was no report of good weather!")
          }
      }, function(err){
        console.log(err);
      });
  //TESTING OUT PROMISE CHAINING


  res.send('Testing Done for weather and email!')
});

app.listen(process.env.PORT || 3000);


//TRIAL CODE BELOW

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
//TRY OTHER APPROACH TO SENDING EMAIL TOO

/*
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

//WEATHER AND CITY PROMISE TESTING VERSION 1:
//TESTING OUT PROMISE CHAINING

    var promise = new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…
    var query_ins = 'select email from khela where city=\''+city+'\'';
        console.log(query_ins);
        client.query(query_ins, (err1, res1) => {
                if (err1) {
                  reject(err1);
                        //console.log(err1.stack)
                } else {
                  //console.log(res1.rows[0]);
                  resolve(res1);                                                                                                
                }
        });
    });
    
    promise.then(function(res1) {
      console.log(res1.rows[0]); // "Stuff worked!"
      //console.log(res1.rows[0].email);

      //ANOTHER promise
      var prom_1 = new Promise(function(resolve, reject){
        //weather with city
        weather.city(city).now().then(function(res_w) {
          //success logic                                                                                                                              
          console.log('weather api works!');
          console.log(res_w);
        }).catch(function(err_w) {
          //error handling                                                                                                                             
        });
      })

      //after prom_1 resolved
      prom_1.then(function(res_w){
        //IF WEATHER GOOD
        console.log("in 2nd promise");
          //craft and send email
          var emails = []
          //extract all emails as string and convert to JSON
          for(var i = 0; i < res1.rows.length; i++){
            var temp = res1.rows[i].email;
            temp = temp.replace(/\s/g, '');
            emails.push({
              email:temp
            });
            console.log(emails[i].email);
          }
          //NOW TO SEND THE EMAIL
          const sgMail = require('@sendgrid/mail');                                                                                                      
          sgMail.setApiKey('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');                                                                                                          
          const msg = {                                                                                                                                  
            to: emails, //parse emails and separate                                                                                                             
            from: 'khelahobe@reshadisking.money',                                                                                                                  
            subject: 'Testing for Khela Hobe!',                                                                                                                      
            text: 'Test message',                                                                                                                  
            html: '<p>This is a test messge to test Reshad\'s app! Thank you for participating...</p>',                                                                                                            
          };                                                                                                                                             
          sgMail.send(msg); 
        //else
          console.log("bad weather");
      }, function(err_w){
        console.log(err);
      });

    }, function(err) {
      console.log(err); // Error: "It broke"
    });

3RD ATTEMPT WEATHER PROMISES
app.post('/cityWeatherTest', function (req, res){
  var city = req.body.city;
  //select email from database with given city
  //use promise so that emails are sent only after async database request is finished
  //TESTING OUT PROMISE CHAINING
    var promise = new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…
    var query_ins = 'select email from khela where city=\''+city+'\'';
        console.log(query_ins);
        client.query(query_ins, (err1, res1) => {
                if (err1) {
                  reject(err1);
                        //console.log(err1.stack)
                } else {
                  //console.log(res1.rows[0]);
                  resolve(res1);                                                                                                
                }
        });
    }).then(function(res1) {
      console.log(res1.rows[0]); // "Stuff worked!"
      //console.log(res1.rows[0].email);
        weather.city(city).now().then(function(res_w) {
          //success logic                                                                                                                              
          console.log('weather api works!');
          console.log(res_w);
        }).catch(function(err_w) {
          //error handling                                                                                                                             
        });
      }).then(function(res_w,res1){
        //IF WEATHER GOOD
        console.log("in 2nd promise");
          //craft and send email
          var emails = []
          //extract all emails as string and convert to JSON
          for(var i = 0; i < res1.rows.length; i++){
            var temp = res1.rows[i].email;
            temp = temp.replace(/\s/g, '');
            emails.push({
              email:temp
            });
            console.log(emails[i].email);
          }
          //NOW TO SEND THE EMAIL
          const sgMail = require('@sendgrid/mail');                                                                                                      
          sgMail.setApiKey('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');                                                                                                          
          const msg = {                                                                                                                                  
            to: emails, //parse emails and separate                                                                                                             
            from: 'khelahobe@reshadisking.money',                                                                                                                  
            subject: 'Testing for Khela Hobe!',                                                                                                                      
            text: 'Test message',                                                                                                                  
            html: '<p>This is a test messge to test Reshad\'s app! Thank you for participating...</p>',                                                                                                            
          };                                                                                                                                             
          sgMail.send(msg); 
        //else
          console.log("bad weather");
      }, function(err){
        console.log(err);
      });
  //TESTING OUT PROMISE CHAINING


  res.send('Testing Done for weather and email!')
});



*/

