# Ratings and Reviews

A Mock service of e-bay ratings and reviews.

## Related Projects

  - https://github.com/rpt16Quarks/Dustins-front-end-capstone-service
  - https://github.com/rpt16Quarks/Service_Matt
  - https://github.com/rpt16Quarks/alexFEC
  - https://github.com/rpt16Quarks/vaishu-proxy

## Development

### Installing Dependencies

From within the root directory

npm install -g webpack
npm install nodemon
npm install babel-loader


# API Endpoints

### Create/Read
You can use a get request to create all the tables with a /reviews1 get request.

### Update
You can use a put request to update the Users table by using an id.
If you query this endpoint with an "id" and a "name" you can change the queried id's name to the name you just queried.

let id = (req.query.id);
let name = (req.query.name)

### Delete
You can delete all four of the tables with the delete request to the /delete1 endpoint