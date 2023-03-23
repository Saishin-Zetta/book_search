const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findById(context.user._id).select("-__v -password").populate('book');
                return userData;
            }
            throw new AuthenticationError("There is no user logged in.");
        },
        users: async () => {
            return User.find().populate('book')
        }

    },

    Mutation: {
        addUser: async (parent, { userData }) => {
            const user = User.create({
                username: userData.username,
                email: userData.email,
                password: userData.password
             });
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { bookData }) => {
            return User.findOneAndUpdate(
                { _id: bookData.UserId },
                { $addToSet: { savedBooks: bookData.savedBook } },
                { new: true, runValidators: true }
            );
        },
        login: async (parent, { username, email, password }) => {
            const user = User.findOne({ $or: [{ username: username }, { email: email }] }).exec();
            
            if (!user) {
                return res.status(400).json({ message: "Can't find this user" });
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                return res.status(400).json({ message: 'Wrong password!' });
            }
            const token = signToken(user);
            return { token, user };
        },
        removeBook: async (parent, { UserId, deletedBook }) => {
            return User.findOneAndUpdate(
                { _id: UserId },
                { $pull: { savedBooks: deletedBook } },
                { new: true }
            );
        },
    },
};

module.exports = resolvers;
