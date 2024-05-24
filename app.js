const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const brain = require('brain.js');

// Datos de recursos educativos
const resources = {
  Observacion: {
    dar_a_conocer: ["recurso1", "recurso2"],
    detectar: ["recurso3", "recurso4"],
    identificar: ["recurso5", "recurso6"]
  },
  Comparacion: {
    definir: ["recurso7", "recurso8"],
    diferenciar: ["recurso9", "recurso10"],
    relacionar: ["recurso11", "recurso12"]
  },
  Clasificacion: {
    asociar: ["recurso13", "recurso14"],
    proponer: ["recurso15", "recurso16"],
    caracterizar: ["recurso17", "recurso18"]
  },
  Descripcion: {
    describir: ["recurso19", "recurso20"],
    explicar: ["recurso21", "recurso22"],
    sintetizar: ["recurso23", "recurso24"]
  }
};

// Diagnóstico inicial del estudiante
const initialDiagnosis = {
  Observacion: {
    dar_a_conocer: 1,
    detectar: 0,
    identificar: 0
  },
  Comparacion: {
    definir: 0,
    diferenciar: 0,
    relacionar: 0
  },
  Clasificacion: {
    asociar: 0,
    proponer: 0,
    caracterizar: 0
  },
  Descripcion: {
    describir: 0,
    explicar: 0,
    sintetizar: 0
  }
};

// Datos de entrenamiento
const trainingData = [
  { input: { dar_a_conocer: 0 }, output: { recurso1: 1 } },
  { input: { dar_a_conocer: 0 }, output: { recurso2: 0 } },
  { input: { detectar: 0 }, output: { recurso3: 1 } },
  { input: { detectar: 0 }, output: { recurso4: 0 } },
  // Agrega más datos de entrenamiento según sea necesario
];

// Crear y entrenar la red neuronal
const net = new brain.NeuralNetwork();
net.train(trainingData, {
  iterations: 20000,
  errorThresh: 0.005,
  log: true,
  logPeriod: 10
});

// Función para generar un plan basado en el diagnóstico inicial usando IA
function generatePlan(diagnosis) {
  const plan = [];
  
  for (const [dimension, indicators] of Object.entries(diagnosis)) {
    for (const [indicator, score] of Object.entries(indicators)) {
      if (score === 0) {
        const resourceScores = resources[dimension][indicator].map(resource => ({
          resource,
          score: net.run({ [indicator]: 0 })[resource] || 0
        }));
        resourceScores.sort((a, b) => b.score - a.score);
        plan.push({ dimension, indicator, resources: resourceScores.map(r => r.resource) });
      }
    }
    if (Object.values(indicators).some(score => score < 1)) {
      break;
    }
  }
  
  return plan;
}

// Simulación de respuesta del estudiante y replanificación
function simulateLearning(diagnosis) {
  return generatePlan(diagnosis);
}

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
