const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [bookSchema]
  }

  type bookSchema {
    authors: String
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): User

    // Kept in case of needing to shape another mutation
    // addSkill(profileId: ID!, skill: String!): Profile
    // removeProfile(profileId: ID!): Profile
    // removeSkill(profileId: ID!, skill: String!): Profile
  }
`;

module.exports = typeDefs;
