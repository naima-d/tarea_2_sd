const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');
const inquirer = require('inquirer');

const API_URL = 'http://192.168.1.130:3000/api/requests';

const readCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

const sendPostRequest = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Response:', response.status, response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message);
  }
};

const getRandomRows = (data, n) => {
  const shuffled = data.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

const main = async () => {
  try {
    const higherEdData = await readCSV('higher_ed_employee_salaries.csv');
    const retailSalesData = await readCSV('Warehouse_and_Retail_Sales.csv');

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'numRequests',
        message: '¿Cuántas peticiones quieres hacer?',
        validate: (value) => {
          const valid = !isNaN(parseInt(value));
          return valid || 'Por favor, introduce un número válido';
        }
      },
      {
        type: 'input',
        name: 'totalInterval',
        message: '¿Cuál es el intervalo de tiempo total para todas las peticiones (en milisegundos)?',
        validate: (value) => {
          const valid = !isNaN(parseInt(value));
          return valid || 'Por favor, introduce un número válido';
        }
      }
    ]);

    const numRequests = parseInt(answers.numRequests);
    const totalInterval = parseInt(answers.totalInterval);
    const intervalPerRequest = totalInterval / numRequests;

    const allData = [...higherEdData, ...retailSalesData];
    const randomRows = getRandomRows(allData, numRequests);

    for (let i = 0; i < randomRows.length; i++) {
      randomRows[i].correo = "email.recepcion.t2@gmail.com";
      await sendPostRequest(randomRows[i]);
      if (i < randomRows.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, intervalPerRequest));
      }
    }

    console.log('Todas las peticiones se han enviado correctamente.');
  } catch (error) {
    console.error('Error:', error.message);
  }
};

main();