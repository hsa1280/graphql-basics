import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)
const typeDefs = `
  type Query {
    greeting(name: String, position: String): String!
    sum(a: Int, b: Int): Int!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`
// Resolvers
const resolvers = {
  Query: {
    greeting(parent, args, context, info) {
      if (args.name && args.position) {
        return `Hello ${args.name}, you position is ${args.position}`
      }

      return 'Hello'
    },
    sum(parent, args, context, info) {
      return args.a + args.b
    },
    me() {
      return {
        id: '123',
        name: 'Mike',
        email: 'mike@example.com'
      }
    },
    post() {
      return {
        id: '456',
        title: 'title',
        body: 'This is body',
        published: true
      }
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(({ port }) => {
  console.log(`The server is up at ${JSON.stringify(port)}`)
})