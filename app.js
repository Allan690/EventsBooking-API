const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const graphQLSchema = require('./graphql/schema');
const graphQLResolvers = require('./graphql/resolvers');
const app = express();
const isAuth = require('./middleware/is-auth');

app.use(bodyParser.json());

app.use(isAuth);
app.use('/graphql', graphqlHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
}));

const url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-yt8sz.mongodb.net/${process.env.MONGO_DB}`;
mongoose.connect(url, { useNewUrlParser: true })
    .then(() => {
        app.listen(3000);
        console.log('listening on port 3000....')
    })
    .catch(err => {
        console.log(err)
    });
