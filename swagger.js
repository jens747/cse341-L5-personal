// Import Swagger Autogen module
const swaggerAutogen = require("swagger-autogen")();


const doc = {
  info: {
    title: "Accounts API",
    description: "Accounts API"
  },
  // host: 'cse341-l2-personal.onrender.com',
  // schemes: ['https']
  host: "localhost.com", 
  schemes: ["http"]
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);

// Run server after it gets generated
// swaggerAutogen(outputFile, endpointsFiles, doc).then(async () => {
//   await import('./index.js');
// });