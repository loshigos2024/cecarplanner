const _ = require('lodash');

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

// Función para generar un plan basado en el diagnóstico inicial
function generatePlan(diagnosis) {
  const plan = [];
  
  for (const [dimension, indicators] of Object.entries(diagnosis)) {
    for (const [indicator, score] of Object.entries(indicators)) {
      if (score === 0) {
        plan.push({ dimension, indicator, resources: resources[dimension][indicator] });
      }
    }
    // Solo procedemos a la siguiente dimensión si todos los indicadores actuales son satisfactorios
    if (Object.values(indicators).some(score => score < 1)) {
      break;
    }
  }
  
  return plan;
}

// Función de actualización del diagnóstico basado en los resultados del estudiante
function updateDiagnosis(diagnosis, dimension, indicator, score) {
  diagnosis[dimension][indicator] = score;
  return diagnosis;
}

// Simulación de respuesta del estudiante y replanificación
function simulateLearning(diagnosis) {
  let plan = generatePlan(diagnosis);
  
  while (plan.length > 0) {
    console.log("Current Plan:", plan);
    for (const step of plan) {
      const { dimension, indicator } = step;
      // Simulación de resultado (0 = deficiente, 1 = satisfactorio, 2 = superior)
      const score = Math.floor(Math.random() * 3);
      console.log(`Student result for ${dimension} - ${indicator}: ${score}`);
      diagnosis = updateDiagnosis(diagnosis, dimension, indicator, score);
      if (score < 1) {
        console.log("Replanning due to failure...");
        break;
      }
    }
    plan = generatePlan(diagnosis);
  }
  
  console.log("All dimensions and indicators have been successfully completed.");
}

// Ejecución de la simulación
simulateLearning(_.cloneDeep(initialDiagnosis));
