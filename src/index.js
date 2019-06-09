import {
  GraphQLServer
} from 'graphql-yoga'
import db from './db';
import Query from './resolvers/query';
import User from './resolvers/user';
import Post from './resolvers/post';
import Mutation from './resolvers/mutation';
import Comment from './resolvers/comment';

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    User,
    Post,
    Mutation,
    Comment
  },
  context: {
    db
  }
})

server.start(({ port }) => {
  console.log(`The server is up at ${JSON.stringify(port)}`)
})