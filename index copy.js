const express = require('express');
const path = require('path')
const { initialDiagnosis, simulateLearning } = require('./planner');

const app = express();

const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(express.static('public'));

let currentPlan = simulateLearning(_.cloneDeep(initialDiagnosis));
let currentStep = 0;

app.get('/plan', (req, res) => {
  const currentResource = currentPlan[currentStep]?.resources[0] || "No hay más recursos";
  res.json({ resource: currentResource });
});

app.post('/next', (req, res) => {
  if (currentStep < currentPlan.length - 1) {
    currentStep++;
  }
  res.redirect('/');
});

app.post('/previous', (req, res) => {
  if (currentStep > 0) {
    currentStep--;
  }
  res.redirect('/');
});


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api', (req, res) => {
  res.json({"msg": "Hello world"});
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
})