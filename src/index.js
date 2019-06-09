import {
  GraphQLServer
} from 'graphql-yoga'

import uuid from 'uuid/v4';

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data
let users = [{
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

let posts = [{
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

let comments = [
  {
    id: '13',
    text: 'First comment',
    author: '1',
    post: '10'
  },
  {
    id: '14',
    text: 'Second comment',
    author: '1',
    post: '11'
  },
  {
    id: '14',
    text: 'Third comment',
    author: '2',
    post: '10'
  },
  {
    id: '15',
    text: 'Fourth comment',
    author: '3',
    post: '12'
  }
]

// Type definitions (schema)
// Input type only has calar types - String, Boolean, Int, Float, ID 
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
    comments: [Comment!]!
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
    createPost(data: CreatePostInput!): Post!
    createComment(data: CreateCommentInput!): Comment
    deleteUser(id: ID!): User!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    post: ID!
    author: ID!
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
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => user.email === args.data.email);
      if (emailTaken) {
        throw new Error('Email taken');
      }

      const user = {
        id: uuid(),
        ...args.data
      }

      users.push(user);

      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author);

      if (!userExists) {
        throw new Error('User not found');
      }

      const post = {
        id: uuid(),
        ...args.data
      }

      posts.push(post);

      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author);
      
      if (!userExists) {
        throw new Error("Can't find the user");
      }

      const postExists = posts.some(post => post.id === args.data.post && post.published);

      if (!postExists) {
        throw new Error("Can't find the post");
      }

      const comment = {
        id: uuid(),
        ...args.data
      }

      comments.push(comment);

      return comment;
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex(user => user.id === args.id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const deletedUser = users.splice(userIndex, 1);

      posts = posts.filter(post => {
        const match = post.author === args.id;

        if (match) {
          comments = comments.filter(comment => comment.post !== post.id)
        }

        return !match;
      });

      comments = comments.filter(comment => comment.author !== args.id);

      return deletedUser[0];
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.post === parent.id
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
    },
    post(parent, args, ctx, info) {
      return posts.find(post => {
        return post.id === parent.post
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