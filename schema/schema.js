const graphql = require('graphql');
const _ = require('lodash');
const comments = require('../comments');
const posts = require('../posts');
const users = require('../users');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList,
} = graphql;

const PostType = new GraphQLObjectType({
    name: "Post",
    fields: () => ({
        id: { type: GraphQLID },
        topic: { type: GraphQLString },
        body: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args) {
                const result = _.find(users.users, { id: parent.user_id });

                return result;
            }
        },
        comments: {
            type: GraphQLList(CommentType),
            resolve(parent, args) {
                const result = _.filter(comments.comments, { post_id: parent.id });

                return result;
            }
        }
    })
});

const CommentType = new GraphQLObjectType({
    name: "Comment",
    fields: () => ({
        id: { type: GraphQLID },
        contents: { type: GraphQLString },
        responses: { type: GraphQLList(GraphQLString) },
        post: {
            type: PostType,
            resolve(parent, args) {
                const result = _.find(posts.posts, { id: parent.id });

                return result;
            }
        },
        user: {
            type: UserType,
            resolve(parent, args) {
                const result = _.find(users.users, { id: parent.user_id });

                return result;
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        //Get list of Posts by topic
        postsByTopic: {
            type: GraphQLList(PostType),
            args: {
                topic: { type: GraphQLString }
            },
            resolve(parent, args) {
                const result = _.filter(posts.posts, { topic: args.topic });

                return result;
            }
        },
        //Get Post by ID
        postByID: {
            type: PostType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                const result = _.find(posts.posts, { id: args.id });

                return result;
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        //Add new Post
        addPost: {
            type: PostType,
            args: {
                id: { type: GraphQLString },
                topic: { type: GraphQLString },
                body: { type: GraphQLString },
                user_id: { type: GraphQLString }
            },
            resolve(parent, args) {
                let post = { id: args.id, topic: args.topic, body: args.body, user_id: args.user_id };

                posts.posts.push(post);

                return post;
            }
        },
        //Add new Comment
        addComment: {
            type: CommentType,
            args: {
                id: { type: GraphQLString },
                contents: { type: GraphQLString },
                user_id: { type: GraphQLString },
                post_id: { type: GraphQLString }
            },
            resolve(parent, args) {
                let comment = { id: args.id, contents: args.contents, responses: [], user_id: args.user_id, post_id: args.post_id };

                comments.comments.push(comment);

                return comment;
            }
        },
        //Update comment with reply
        updateComment: {
            type: CommentType,
            args: {
                comment_id: { type: GraphQLString },
                response: { type: GraphQLString },
            },
            resolve(parent, args) {
                let comment = _.find(comments.comments, { id: args.comment_id });

                comment.responses.push(args.response);

                return comment;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});