const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const sessionStorage = require("sessionstorage");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

// Library to provide natual language processing and
// basic machine learning cabailities
const NLP = require("natural");

// Built-in Node library for loading files operations
const fs = require("fs");

// Create a new classifier to train
const classifier = new NLP.LogisticRegressionClassifier();

/**
 * Function to easily parse a given json file to a JavaScript Object
 *
 * @param {String} filePath
 * @returns {Object} Object parsed from json file provided
 */
function parseTrainingData(filePath) {
  const trainingFile = fs.readFileSync("./trainingData.json");
  return JSON.parse(trainingFile);
}

/**
 * Will add the phrases to the provided classifier under the given label.
 *
 * @param {Classifier} classifier
 * @param {String} label
 * @param {Array.String} phrases
 */
function trainClassifier(classifier, label, phrases) {
  console.info("Teaching set", label, phrases);
  phrases.forEach(phrase => {
    console.info(`Teaching single ${label}: ${phrase}`);
    classifier.addDocument(phrase.toLowerCase(), label);
  });
}

/**
 * Uses the trained classifier to give a prediction of what
 * labels the provided pharse belongs to with a confidence
 * value associated with each and a a guess of what the actual
 * label should be based on the minConfidence threshold.
 *
 * @param {String} phrase
 *
 * @returns {Object}
 */
function interpret(phrase) {
  console.info("interpret", phrase);
  const guesses = classifier.getClassifications(phrase.toLowerCase());
  console.info("guesses", guesses);
  const guess = guesses.reduce((x, y) => (x && x.value > y.value ? x : y));
  return {
    probabilities: guesses,
    guess: guess.value > 0.7 ? guess.label : null
  };
}

/**
 * Callback function message call. Provided is the message
 * that was input by the user.
 * This function will take the input message text, attempt to label it
 * using the trained classifier, and return the corresponding
 * answer from the training data set. If no label can be matched
 * with the set confidence interval, it will respond back saying
 * the message was not able to be understood.
 *
 * @param {Object} message
 */
async function handleMessage(message) {
  const interpretation = interpret(message);
  console.info("FAQ Bot heard: ", message);
  console.info("FAQ Bot interpretation: ", interpretation);

  if (interpretation.guess && trainingData[interpretation.guess]) {
    console.info("Found response");
    if (questionHasBeenAsked(message)) {
      return "You've already asked this";
    }
    updateAskedQuestions(message);
    return trainingData[interpretation.guess].answer;
  } else {
    console.info("Couldn't match phrase");
    return "Sorry, I'm not sure what you mean";
  }
}

function updateAskedQuestions(question) {
  let prevQuestions = JSON.parse(sessionStorage.getItem("asked")) || [];
  prevQuestions = prevQuestions.push(question);
  sessionStorage.setItem("asked", JSON.stringify(prevQuestions));
}

function questionHasBeenAsked(question) {
  let prevQuestions = JSON.parse(sessionStorage.getItem("asked")) || [];
  return prevQuestions.indexOf(question) > -1;
}

// Load our training data
const trainingData = parseTrainingData("./trainingData.json");

// For each of the labels in our training data,
// train and generate the classifier
var i = 0;
Object.keys(trainingData).forEach((element, key) => {
  trainClassifier(classifier, element, trainingData[element].questions);
  i++;
  if (i === Object.keys(trainingData).length) {
    classifier.train();
    const filePath = "./classifier.json";
    classifier.save(filePath, (err, classifier) => {
      if (err) {
        console.error(err);
      }
      console.info("Created a Classifier file in ", filePath);
    });
  }
});

app.get("/handlemessage", (req, res) => {
  const message = req.query.message || "";
  res.setHeader("Content-Type", "application/json");
  handleMessage(message).then(msg => {
    res.send(JSON.stringify({ reply: msg }));
  });
});

app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);
