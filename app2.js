const express = require('express');
const bodyParser = require('body-parser');
const { initialDiagnosis, simulateLearning } = require('./planner');

const app = express();
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

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
