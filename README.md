# MVC Local Auth

This project demonstrates how to integrate passport-local-mongoose, connect-flash, and express-handlebars within a MVC Express server setup.

I built this because I found it challenging to find information on Passport authentication, how flash messages worked, and how to get flash messages to show up in Handlebars templates.

## Set Up

First, clone or fork this project.

Add an `.env` file to the root directory using `.env.example` as a guide. You will need to add:
- The port number you'd like to run your server on
- The extension you'd like to name your Handlebars files
- Your MongoDB URI connection string

Start the server with `npm run dev` or `npm start`.

Visit (http://localhost:3000) in your browser. You should see links to sign up for a new account or log into an existing account.

Visit the sign up form, and try to sign up using invalid information, for example, something that isn't an email, or passwords that don't match. Info and error messages will appear at the top of the form.

Try completing sign-up, logging out, and logging back in to see more messages.

## Details

### passport-local-mongoose
[Passport-Local Mongoose](https://github.com/saintedlama/passport-local-mongoose) makes it a little easier to use the passport-local strategy, by plugging into your Mongoose user schema:
```
// models/User.js

const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
})

//...

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

const User = mongoose.model('User', userSchema)

module.exports = User
```

Note the options added: `{ usernameField: 'email' }`. The default is username. In order for an alternative usernameField to be recognized correctly, `User.createStrategy()` must be used as a helper instead of `new LocalStrategy(User.authenticate())`:
```
// utils/passport.js

const User = require('../models/User')

module.exports = function(passport) {
  passport.use(User.createStrategy())
  passport.serializeUser(User.serializeUser()); 
  passport.deserializeUser(User.deserializeUser()); 
}
```

Registering a new user can be as simple as the following:
```
// from controllers/auth.js

User.register(new User({ email: req.body.email }),
	          req.body.password,
		      (err, user) => {
		        if (err) {
		          res.redirect('/signup')
		        }
		        passport.authenticate('local')(req, res, () => {
		          res.redirect(userHome)
		        })
		      })
```

Your new user will be stored in whichever collection you specified in MONGO_URI. By default, passport-local-mongoose adds hash and salt fields which it will use for password verification.

### connect-flash
[connect-flash](https://github.com/jaredhanson/connect-flash) is a package for passing messages to views so they may be rendered. You can also replace this with [express-flash](https://github.com/RGBboy/express-flash) here and the functionality within this project will be identical.

To set up, first simply pass to your app:
```
// app.js

app.use(flash())
```

When it is time to add a message, call req.flash with the `type` and `message` you want to store:
```
// from controllers/auth.js

const getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) next(err)
    req.flash('success', "You have logged out.")
    res.redirect('/')
  })
}
```

Messages will be consumed when `app.flash()` is called. Do this on render to pass all messages to your view:
```
// from controllers/home.js

const getIndex = (req, res, next) => {
  res.render('index', {
    title: "Index",
    messages: req.flash(),
  })
}
```

To consume only messages of a specific type, call `app.flash('yourTypeHere')`. As a result, you can also pass messages to your view by type:
```
const getIndex = (req, res, next) => {
  res.render('index', {
    title: "Index",
    success: req.flash('success'),
	info: req.flash('info'),
	error: req.flash('error'),
  })
}
```

### express-handlebars
[express-handlebars](https://github.com/ericf/express-handlebars) is a Handlebars view engine for Express.

Setup is simple. The following options tell the engine to use files ending in `.hbs` as template files:
```
// from app.js
const hbs = require('express-handlebars')

\\...

app.engine('.hbs', hbs.engine({
  defaultLayout: 'main',
  extname: '.hbs',
}))
app.set('view engine', '.hbs')
```

When a render method is called and passed a flash message, your templates can access it via whatever key you used to store it. Assuming you used `messages: req.flash()` from above, you can access the messages by type:
```
<!-- views/partials/message.hbs -->

{{#each messages.success}}
  <div class="message">
    <p><span class="success">Success:</span> {{ this }}</p>
  </div>
{{/each}}
{{#each messages.info}}
  <div class="message">
    <p><span class="info">Info:</span> {{ this }}</p>
  </div>
{{/each}}
{{#each messages.error}}
  <div class="message">
    <p><span class="error">Error:</span> {{ this }}</p>
  </div>
{{/each}}
```

The different keys in the `messages` object can be accessed by name. Within the `{{#each}}` loop, you can access the individual message via `{{ this }}`.

### Rendering on authentication failure instead of redirecting
A convenient way to use `passport.authenticate` is to pass options:
```
passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true,
  successRedirect: '/dashboard',
}
```
See [passport-api-docs](https://github.com/jwalton/passport-api-docs) for all the options available.

However, if you would like to do anything before or after failure, you can pass in a callback function instead:
```
// from controllers/auth.js

const postLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) {
      req.flash('error', 'Invalid credentials.')
      return res.render('login', {
	title: "Log into your account",
	messages: req.flash(),
      })
    }
    req.logIn(user, (err) => {
      if (err) return next(err)
      return res.redirect(userHome)
    })
  })(req, res, next)
}
```
The callback function given to `passport.authenticate` above does almost the same thing that the options do in the previous example. But on failure, the function *rerenders* `/login` instead of *redirecting* to it.

## Notes

### Contributing

You are encouraged to open issues if you have ideas for how to improve this project :)

### To Do

- There is a lot of repeating render code in the controllers that should be cleaned up.
- I would like to integrate a captcha into the signup and login pages.

### References

I referenced these example apps when figuring out how to structure this:
- [#100Devs Simple ToDo App](https://github.com/100devs/todo-mvc-auth-local/)
- [Brad Traversy's StoryBooks](https://github.com/bradtraversy/storybooks)
- [Fullstack Open Part 4-1 Backend](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-1)
