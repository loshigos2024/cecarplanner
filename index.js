const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');


const app = express();

const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');



app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api', (req, res) => {
  res.json({"msg": "Hello world"});
});

app.get('/plan', (req, res) => {
  //const currentResource = currentPlan[currentStep]?.resources[0] || "No hay más recursos";
  const currentResource = "55";
  res.json({ resource: currentResource });
});

app.post('/next', (req, res) => {
  if (currentStep < currentPlan.length - 1) {
    currentStep++;
  }
  //res.redirect('/');
  res.json({"msg": "Current Step " + currentStep});
});

app.post('/previous', (req, res) => {
  if (currentStep > 0) {
    currentStep--;
  }
  res.redirect('/');
});



app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
})