const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

module.exports = {
    createUser: async (args) => {
        try {
            const user =  await User.findOne({
                email: args.userInput.email
            });
            if(user) {
                throw new Error('User exists already')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const createUser = new User ({ email : args.userInput.email, password: hashedPassword });
            const result = await createUser.save();
            return { ...result._doc, password: null, _id:result.id }
        }
        catch(err) {
            throw err;
        }
    },
    login: async ({email, password }) => {
        try {
            const user = await User.findOne({ email: email });
            if(!user) {
                throw new Error('User does not exist!');
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                throw new Error('Invalid credentials')
            }
            const token = await jwt.sign(
                { userId: user.id, email: user.email }, process.env.SECRET_KEY
                , { expiresIn: '1h' }
                );
            return { userId: user.id, token: token, tokenExpiration: 1 }
        }
        catch(err) {
            throw err;
        }
    }
};