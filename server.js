const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
var nunjucks = require('nunjucks');
const app = express()

const apiKey = '041a27fc4bdf6dc16f1adc20cf31ec43';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.set('view engine', 'nunjucks');
app.set('view options', {
  layout: false
});

app.get('/', function(req, res) {
  res.render('index.html')
})

app.get('/:lat/:lon', function(req, res) {
  var options = {
    method: 'GET',
    url: 'https://api.darksky.net/forecast/' + apiKey + '/' + req.params.lat + ',' + req.params.lon + '?units=si'
  };
  request(options, function(err, response, body) {
    if (err) {
      res.render('index.html', {
        weather: null,
        error: 'Error, please try again'
      });
    } else {
      let weather = JSON.parse(body)
      if (weather.daily == undefined) {
        res.render('index.html', {
          weather: null,
          error: 'Error, please try again'
        });
      } else {
        var a = getdate(weather)
        res.render('index.html', {
          weather: weather,
          b: a,
          error: null
        });
      }
    }
  });
})

app.post('/', function(req, res) {
  var options = {
    method: 'GET',
    url: 'https://api.darksky.net/forecast/' + apiKey + '/' + req.body.lat + ',' + req.body.lon + '?units=si'
  };
  request(options, function(err, response, body) {
    if (err) {
      res.render('index.html', {
        weather: null,
        error: 'Error, please try again'
      });
    } else {
      let weather = JSON.parse(body)
      if (weather.daily == undefined) {
        res.render('index.html', {
          weather: null,
          error: 'Error, please try again'
        });
      } else {
        var a = getdate(weather)
        res.render('index.html', {
          weather: weather,
          b: a,
          error: null
        });
      }
    }
  });
})

function getdate(weather) {
  var weekdate = []
  for (var i = 0; i < 3; i++) {
    var date = new Date(weather.daily.data[i].time * 1000)
    var weekday = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
    var monthname = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    var formattedDate = weekday[date.getDay()] + ' ' + monthname[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()
    weekdate.push(formattedDate);
  }
  return weekdate
}
app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
})
