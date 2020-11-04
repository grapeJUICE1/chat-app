const { ApolloServer } = require("apollo-server");
const { sequelize } = require("./models");

// The GraphQL schema
const typeDefs = require("./graphql/typeDefs");
const contextMiddleware = require("./utils/contextMiddleware");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);

  sequelize
    .authenticate()
    .then(() => console.log("database connected"))
    .catch((err) => console.log(err));
});
