const fetch = require('node-fetch');

exports.handler = async function (event) {
  const { path, httpMethod, headers, body } = event;
  
  // Extract the API path from the incoming request and append it to the base API URL
  const apiPath = path.replace('/api/', ''); // Remove the '/api/' prefix
  const apiUrl = `http://sahosoftweb.com/api/${apiPath}`;

  let options = {
    method: httpMethod,
    headers: {
      'Content-Type': 'application/json',
      ...headers // Pass through any incoming headers
    }
  };

  // Add the request body if the method is not GET
  if (httpMethod !== 'GET' && body) {
    options.body = body;
  }

  try {
    // Fetch the data from the external API
    const response = await fetch(apiUrl, options);
    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
