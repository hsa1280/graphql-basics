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
  published: true,
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
    id: '15',
    text: 'Third comment',
    author: '2',
    post: '10'
  },
  {
    id: '16',
    text: 'Fourth comment',
    author: '3',
    post: '12'
  }
]

const db = {
  users,
  comments,
  posts
}

export { db as default }