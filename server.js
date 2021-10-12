const serviceAccountPath = '../ServiceAccountKey.json';
const admin = require('firebase-admin');
const serviceAccount = require(serviceAccountPath);
const express = require('express');
const prompt = require('prompt');
const colors = require('colors');
const app = express();
const port = process.env.PORT || 8080;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

prompt.message = "";
prompt.delimiter = "";

const adminAuth = admin.auth();
const db = admin.firestore();

const emailSchema = {
  properties: {
    email: {
      description: 'Enter your email address:',
      required: true,
      message: 'Enter a valid email',
      pattern: /\S+@\S+\.\S+/
    }
  }
}
const passwordCreationSchema = {
  properties: {
    password: {
      description: 'Enter a new password: ',
      message: 'Cannot be blank',
      hidden: true,
      replace: '*',
      required: true,
    },
    confirmPassword: {
      description: 'Confirm password: ',
      message: 'Cannot be blank',
      hidden: true,
      replace: '*',
      required: true
    }
  }
}
console.log('Welcome! Let\'s set up an administrative user'.magenta)

prompt.start();

prompt.get(emailSchema, checkNewEmail);

let userEmail;
async function checkNewEmail(err, userInput) {
  // first check if user already exists and exit if this is the case
  try {
    await adminAuth.getUserByEmail(userInput.email);
    console.log('User with this email address already exists. Run the script again with a new email.'.red);
    process.exit();
  } catch(err) {
    userEmail = userInput.email;
    console.log("");
    prompt.get(passwordCreationSchema, createAdminUser);
  }
}

async function createAdminUser(err, userInput) {

  if (userInput) {
    if (userInput.password === userInput.confirmPassword) {
      adminAuth.createUser({
        email: userEmail,
        password: userInput.pass,
      })
        .then((userRecord) => {
          return userRecord;
        })
        .then((user) => {
          // Create corresponding document in firestore
          return db.collection('users').doc(user.uid).set({
            uid: user.uid,
            email: user.email,
            role: 'admin'
          }, {merge: true})
        })
        .then(() => {
          console.log('Successfully created a user with administrative privileges'.green);
          process.exit();
        })
        .catch((err) => {
          console.log('Error creating administrative user\n: '.red, err);
          process.exit();
        })
    } else {
      console.log('Passwords did not match. Please re-run the script and try again.'.red);
      process.exit();
    }
  }
}




// app.get('/', (req, res) => {
//   res.send('Server up and running');
// });


// app.listen(port, () => {console.log('server listening on port ' + port)});
