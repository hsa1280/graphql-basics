import uuid from 'uuid/v4';

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some(user => user.email === args.data.email);
    if (emailTaken) {
      throw new Error('Email taken');
    }

    const user = {
      id: uuid(),
      ...args.data
    }

    db.users.push(user);

    return user;
  },
  createPost(parent, args, { db }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);

    if (!userExists) {
      throw new Error('User not found');
    }

    const post = {
      id: uuid(),
      ...args.data
    }

    db.posts.push(post);

    return post;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);
    
    if (!userExists) {
      throw new Error("Can't find the user");
    }

    const postExists = db.posts.some(post => post.id === args.data.post && post.published);

    if (!postExists) {
      throw new Error("Can't find the post");
    }

    const comment = {
      id: uuid(),
      ...args.data
    }

    db.comments.push(comment);
    pubsub.publish(`comment ${args.data.post}`, {comment})

    return comment;
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex(user => user.id === args.id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const deletedUser = db.users.splice(userIndex, 1);

    posts = db.posts.filter(post => {
      const match = post.author === args.id;

      if (match) {
        comments = db.comments.filter(comment => comment.post !== post.id)
      }

      return !match;
    });

    comments = db.comments.filter(comment => comment.author !== args.id);

    return deletedUser[0];
  },
  deletePost(parent, args, { db }, info) {
    const postIndex = db.posts.findIndex(post => post.id === args.id);

    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    const deletePosts = db.posts.splice(postIndex, 1);

    comments = db.comments.filter(comment => comment.post !== args.id);

    return deletePosts[0];
  },
  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex(comment => comment.id === args.id);

    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }

    const deletedComments = db.comments.splice(commentIndex, 1);

    return deletedComments[0];
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find(user => user.id === id);

    if (!user) {
      throw new Error('User not found');
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(user => user.email === data.email)

      if (emailTaken) {
        throw new Error('Email taken');
      }

      user.email = data.email;
    }

    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age;
    }

    return user;
  },
  updatePost(parent, args, { db }, info) {
    const { id, data } = args;
    const post = db.posts.find(post => post.id === id);

    if (!post) {
      throw new Error("Post not found");
    }

    if (data.title) {
      post.title = data.title;
    }

    if (data.body) {
      post.body = data.body;
    }

    post.published = data.published;

    return post;
  }
}

export { Mutation as default }