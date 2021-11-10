const serviceAccountPath = './ServiceAccountKey.json';
const admin = require('firebase-admin');
const serviceAccount = require(serviceAccountPath);
const express = require('express');
const prompt = require('prompt');
const colors = require('colors');
const fc = require('./firebaseConfig');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:fc.storageBucket
});
const adminAuth = admin.auth();
const db = admin.firestore();
let userEmail;
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

function initializeNewUser() {
  prompt.message = "";
  prompt.delimiter = "";
  console.log("| *********************************************************  |");
  console.log('   Welcome! Let\'s set up an administrative user.'.magenta)
  console.log('   Follow the remaining prompts to create a new admin account.'.magenta)
  console.log('   Please press enter on your keyboard after you answer each prompt'.magenta)
  console.log("| *********************************************************  |");

  prompt.start();
  prompt.get(emailSchema, checkNewEmail);
}
/* User Creation Stuff */
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

async function setSecurityRules() {
  const src = "rules_version = '2';\n" +
    `
    service cloud.firestore {
      match /databases/{database}/documents {
        function isAdmin() {
          return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
        }
        // allow access to user document if is user OR if is admin user
        match /users/{userDoc=**} {
          allow read, create, update: if request.auth.uid == userDoc.id || isAdmin();
          allow delete: if isAdmin();
        }
        match /resources/{resourceDoc} {
          allow read, update: if request.auth.uid != null;
          allow create, delete: if isAdmin();
        }
      }
    }
    `
    const storageSrc =`rules_version = '2';
      service firebase.storage {
        match /b/{bucket}/o {
          match /users/{user=**} {
            allow read, create, update: if request.auth.uid == user;
            allow read, write: if request.auth.token.name == 'admin';
          }
        }
      }
    `;
  try {
    const securityRules = admin.securityRules();
    const rulesFile = securityRules.createRulesFileFromSource('firestore.rules', src);
    const storageRules = securityRules.createRulesFileFromSource('storage.rules', storageSrc);
    await securityRules.createRuleset(rulesFile)
      .then((ruleSet) =>  securityRules.releaseFirestoreRuleset(ruleSet))
      .then(() => console.log("Created firebase firestore rules"))
      .catch((error) => console.log("Error updating firestore ruleset: ".red + error));
    await securityRules.createRuleset(storageRules)
      .then((ruleSet) => securityRules.releaseStorageRuleset(ruleSet))
      .then(() => console.log("Created firebase storage rules"))
      .catch((error) => console.log("Error updating storage ruleset: ".red + error));
  } catch(error) {
    console.log(error);
  }
}

setSecurityRules().then(() => {
  prompt.get({
    description: 'Would you like to create a new admin user? (y/n) ',
    type: 'string',
    required: true
  }, (err, res) => {
    if (res.question === 'y') {
      initializeNewUser();
    } else {
      console.log('Okay. Have a nice day.'.green);
      process.exit();
    }
  })
});
