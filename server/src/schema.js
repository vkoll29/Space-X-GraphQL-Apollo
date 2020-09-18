const { gql } = require('apollo-server');

const typeDefs = `
  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  },

  type Mission {
    name: String!
    missionPatch(size: PatchSize): String
  },

  type Rocket {
    id: ID!
    name: String
    type: String
  },

  type User {
    id: ID!
    email: String!
    trips: [Launch]!
  },

  enum PatchSize {
    SMALL
    LARGE
  },

  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  },

  type Query {
    launch(id: ID!): Launch
    launches: [Launch]!
    me: User
  },

  type Mutation {
    bookTrips(launchIds: [ID]!): TripUpdateResponse!
    cancelTrip(launchId: ID!): TripUpdateResponse!
    login(email: String): String #login token
  }
`;



module.exports = typeDefs;