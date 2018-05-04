const Express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = new Express();
const port = 3030;

app.use(bodyParser.json());

const getReqConf = (userID, endpoint, updates) => ({
  url: `${endpoint.url}/${userID}`,
  method: endpoint.method,
  data: { ...updates },
  validateStatus: () => true,
});

app.post('/batch', (req, res) => {
  const responsesArr = {};
  const functionsArr = req.body.userIDs.map(userID => (async () => {
    const reqConf = getReqConf(userID, req.body.endpoint, req.body.updates);
    let data = null;
    try {
      data = await axios(reqConf);

      if (data.status !== 200) {
        data = await axios(reqConf);

        if (data.status !== 200) {
          throw data;
        }
      }

      return {
        ...data.data,
      };
    } catch (e) {
      return {
        status: e.status,
        statusText: e.statusText,
      };
    }
  }));

  Promise.all(functionsArr.map(func => func())).then((results) => {
    res.status(200).send(results);
  })
});

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info('Open up http://localhost:%s/ in your browser.', port, port);
  }
});
