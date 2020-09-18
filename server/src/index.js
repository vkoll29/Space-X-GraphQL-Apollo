require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');

const server = new ApolloServer({ typeDefs });
server.listen().then(({ url }) => {
  console.log(`🚀 Apollo server started at ${url}`);
});