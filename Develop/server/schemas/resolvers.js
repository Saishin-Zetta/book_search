const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        Users: async () => {
            return User.find();
        },

        User: async (parent, { UserId }) => {
            return User.findOne({ _id: UserId });
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            return User.create({ username, email, password });
        },
        saveBook: async (parent, { UserId, savedBook }) => {
            return User.findOneAndUpdate(
                { _id: UserId },
                { $addToSet: { savedBooks: savedBook } },
                { new: true, runValidators: true }
            );
        },
        login: async (parent, { username, email, password }) => {
            const user = User.findOne({ $or: [{ username: username }, { email: email }] });
            
            if (!user) {
                return res.status(400).json({ message: "Can't find this user" });
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                return res.status(400).json({ message: 'Wrong password!' });
            }
            const token = signToken(user);
            res.json({ token, user });
        },
        deleteBook: async (parent, { UserId, deletedBook }) => {
            return User.findOneAndUpdate(
                { _id: UserId },
                { $pull: { savedBooks: deletedBook } },
                { new: true }
            );
        },
    },
};

module.exports = resolvers;
