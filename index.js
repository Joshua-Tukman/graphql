var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Initialize a GraphQL schema
var schema = buildSchema(`
  type Query {
    user(shark: String): Person
    users(age: Int): [Person]
  },
  type Person {
    id: Int
    name: String
    age: Int
    shark: String
    sport: String
  }
  type Mutation {
    updateUser(id: Int!, name: String!, age: Int, shark: String, sport: String): Person
  }
`);
var users = [
  {
    id: 1,
    name: 'Brian',
    age: 21,
    shark: 'Great White Shark',
    sport: 'Rock Climbing'
  },
  {
    id: 2,
    name: 'Kim',
    age: 22,
    shark: 'Whale Shark',
    sport: 'Skydiving'
  },
  {
    id: 3,
    name: 'Faith',
    age: 23,
    shark: 'Hammerhead Shark'
  },
  {
    id: 4,
    name: 'Joseph',
    age: 23,
    shark: 'Tiger Shark'
  },
  {
    id: 5,
    name: 'Joy',
    age: 25,
    shark: 'Hammerhead Shark'
  }
];
var getUser = function (args) {
  var shark = args.shark;
  return users.filter(user => user.shark == shark)[0];
}
var retrieveUsers = function (args) {
  if (args.age) {
    var age = args.age;
    return users.filter(user => user.age === age);
    console.log(args)
  } else {
    return users;
  }
}
var updateUser = function ({ id, name, age, shark, sport}) {
  users.map(user => {
    if (user.id === id) {
      user.name = name;
      user.age = age;
      user.shark = shark;
      user.sport = sport;
      return user;
    }
  });
  return users.filter(user => user.id === id)[0];
}
// Root resolver
var root = {
  user: getUser,
  users: retrieveUsers,
  updateUser: updateUser
};

// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,  // Must be provided
  rootValue: root,
  graphiql: true,  // Enable GraphiQL when server endpoint is accessed in browser
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
