const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findById(context.user._id).select("-__v -password");
                return userData;
            }
            throw new AuthenticationError("There is no user logged in.");
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
