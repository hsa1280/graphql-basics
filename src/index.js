import {
  GraphQLServer
} from 'graphql-yoga'

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data
const users = [{
  id: '1',
  name: 'Andrew',
  email: 'andrew@example.com',
  age: 27,
  comment: '13'
}, {
  id: '2',
  name: 'Sarah',
  email: 'sarah@example.com',
  comment: '14'
}, {
  id: '3',
  name: 'Mike',
  email: 'mike@example.com',
  comment: '15'
}]

const posts = [{
  id: '10',
  title: 'GraphQL 101',
  body: 'This is how to use GraphQL...',
  published: true,
  author: '1'
}, {
  id: '11',
  title: 'GraphQL 201',
  body: 'This is an advanced GraphQL post...',
  published: false,
  author: '1'
}, {
  id: '12',
  title: 'Programming Music',
  body: '',
  published: false,
  author: '2'
}]

const comments = [
  {
    id: '13',
    text: 'First comment',
    author: '1'
  },
  {
    id: '14',
    text: 'Second comment',
    author: '1'
  },
  {
    id: '14',
    text: 'Third comment',
    author: '2'
  },
  {
    id: '15',
    text: 'Fourth comment',
    author: '3'
  }
]

// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
    comments: [Comment!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comment: [Comment]
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
  }
`

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users
      }

      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts
      }

      return posts.filter((post) => {
        const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
        const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
        return isTitleMatch || isBodyMatch
      })
    },
    me() {
      return {
        id: '123098',
        name: 'Mike',
        email: 'mike@example.com'
      }
    },
    post() {
      return {
        id: '092',
        title: 'GraphQL 101',
        body: '',
        published: false
      }
    },
    comments(parent, args, ctx, info) {
      return comments
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        return post.author === parent.id
      })
    },
    comment(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.id === parent.comment
      })
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    }
  },
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(({ port }) => {
  console.log(`The server is up at ${JSON.stringify(port)}`)
})