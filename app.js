const flash = require('connect-flash');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const expressSession = require('express-session');
const mongoose = require('mongoose')
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const indexRoutes = require('./routes/index');
const authMiddleware = require('./middleware/authMiddleware');

mongoose.connect('mongodb://127.0.0.1:27017/rewardsdb',
    { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
        if (db) {
            console.log('database connected successfully')
        }
        if (err) {
            console.log(err);
        }
    });
app.use(expressSession({
    secret: 'danceingcat',
    saveUninitialized: true,
    resave: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use('/admin', adminRoutes);
app.use('/dashboard',authMiddleware, userRoutes);
app.use(indexRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found' });
next()
})



app.listen(3000, () => {
    console.log('listening on port 3000');
});