const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type me {
    user: User
  }

  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [bookSchema]
  }


  input BookInput {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }


  type Auth {
    token: ID!
    user: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
    

  }
`;

module.exports = typeDefs;
