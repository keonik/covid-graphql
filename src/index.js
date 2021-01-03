require("dotenv").config();

const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const CovidActNowAPI = require("./datasources/CovidActNowAPI");

const server = new ApolloServer({
  dataSources: () => ({
    covidApi: new CovidActNowAPI(),
  }),
  typeDefs,
  resolvers,
  playground: true,
});

server.listen(process.env.PORT || 9000).then(() => {
  console.log("server running 🔥 http://localhost:9000");
});
