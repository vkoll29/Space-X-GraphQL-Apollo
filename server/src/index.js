require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { createStore } = require('./utils');
const resolvers = require('./resolvers');
const isEmail = require('isemail');

const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');

const store = createStore();

const server = new ApolloServer({
  context: async ({ req }) => {
    //obtain value of authorization included in request
    const auth = req.headers && req.headers.authorization || '';
    //decode the value of authorization header
    const email = Buffer.from(auth, 'base64').toString('ascii');
    //check if decoded value resembles an email address. if not, exit
    if (!isEmail.validate(email)) return { user: null };
    //if it is a valid email address, get user details for that email address from the database
    //return a user object with the user's details
    const users = await store.users.findOrCreate({ where: { email } });
    const user = users && users[0] || null;
    return { user: { ...user.dataValues } };
  },
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store })
  })
});
server.listen().then(({ url }) => {
  console.log(`🚀 Apollo server started at ${url}`);
});
