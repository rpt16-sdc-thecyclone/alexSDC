const express = require('express');
const db = require('./controllers');

const app = express();
express.json();

app.use("/", express.static("../public"))

app.get("/ratings1", (req, res) => {
  db.getRatings1()
    .then((answer) => {
      // console.log("~~~~~~~~~~~~~~~~~\n",answer)
      res.status(200).send(answer);
    })
    .catch(error => {
      console.error("~~~~~~\n\n\n ", error);
      res.sendStatus(400).send(JSON.stringify(error))
    })
})

app.get("/reviews1", (req, res) => {
  db.getReviews1()
  .then(answer => {
    console.log("~~~~~~~~~~~~~~~~~\n",answer)
    res.status(200).send(answer);
  })
  .catch(error => {
    console.error("~~~~~~\n\n\n ", error);
    res.sendStatus(400);
  })
})

app.delete("/delete1", (req, res) => {
  db.deleteReviews1()
    .then(result => {
      res.status(200).send(JSON.stringify(result));
    })
    .catch(err => {
      console.log('delete server error: ', err);
      res.status(404);
    })
});


app.put("/update", (req, res) => {
  console.log(req);
  res.sendStatus(200);
  let id = (req.query.id);
  let name = (req.query.name)
  console.log(`req query ${id} ${name}`) //both are string.
  db.updateUsers(id, name)
  .then(result => {
    console.log('app.put updated: ',result);
    res.status(200).send(JSON.stringify(result));
  })
  .catch(err => {
    console.log('app.put update err: ',err);
    res.status(404);
  })
})


module.exports = app