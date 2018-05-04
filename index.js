const Express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const axiosRetry = require('axios-retry');

const app = new Express();
const port = 3030;

app.use(bodyParser.json());

axiosRetry(axios, {
  retries: 1,
  delay(retryCount) {
    console.log('retryCount -log- =>', retryCount);
    return 100;
  },
  retryCondition() {
    return true;
  }
});

const getReqConf = (userID, endpoint, updates) => ({
  url: `${endpoint.url}/${userID}`,
  method: endpoint.method,
  data: { ...updates },
});

app.post('/batch', (req, res) => {
  const responsesArr = {};
  axios.all(
    req.body.userIDs.map(userID => {
      return axios(getReqConf(userID, req.body.endpoint, req.body.updates))
        .then(response => {
          responsesArr[userID] = {
            ...response.data,
            statusCode: response.status,
          };
        })
        .catch(err => {
          responsesArr[userID] = {
            status: error.response.status,
            statusCode: error.response.statusCode,
          };
        })
    })
  ).then((resp) => {
    res.status(200).send(responsesArr);
  });
});

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info('Open up http://localhost:%s/ in your browser.', port, port);
  }
});
