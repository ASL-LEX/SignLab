# SignLab Demo

## Prerequisites

Make sure that you have the following installed:

> Node.js [Download](https://nodejs.org/en/download/)

> Angular [Download](https://angular.io/cli)

 Then clone or download this repository.

## Create a Firebase account
In order to build and deploy this project, you must have a Firebase project. To get started with one, click  [here](www.firebase.google.com), then "Get Started", and follow the step-by-step instructions to Create a Project.
> **Note**: Make sure that your Firebase Project name is the unique name you want to use for your application

Once your project has been successfully created, you will be redirected to `console.firebase.google.com`. From there, get to the project settings by clicking the gear icon in the left navigation menu.

### Initializing an app on the Firebase Console
1. Click the **</>** icon under *Your apps*
2. Follow the prompts to "Add Firebase to your web app". Replace the `firebaseConfig` constant inside the **`firebaseConfig.js`** file with your own `firebaseConfig`, which will be displayed to you during the step-by-step app initialization process.
3. Generate a service account
		- Service accounts > Generate new private key
		- Save the private key as **`ServiceAccountKey.json`** and put it inside your copy of this folder. **NEVER** share this key with anyone as it will compromise the security of your application.

## Database, Storage, and Admin User Setup
#### Setting up security rules and administrative user account for the application
1. Open your terminal.
2. cd into your copy of this folder.
3. type `npm run setup` and follow the command-line prompts


## Deployment
### Whew! Now you can deploy the application and get started. How do we do that?
You can accomplish this easily through Firebase Hosting. For more information, click [here](https://firebase.google.com/docs/hosting/quickstart). For the purposes of this application, however, you can set it up through the following commands in your terminal:
> Note: for each of these steps, follow the prompts.
1. **`firebase login`**
2. **`firebase init hosting`**
    1. *What do you want to use as your public directory?* **dist/prod**
    2. *Configure as a single-page app (rewrite all urls to /index.html)?* **yes**
    3. *Set up automatic builds and deploys with GitHub?* **No**

    Verify that the `firebase.json` file looks like this:
    ```
    {
      "hosting": {
        "public": "dist/prod",
        "ignore": [
          "firebase.json",
          "**/.*",
          "**/node_modules/**"
        ],
        "rewrites": [
          {
            "source": "**",
            "destination": "/index.html"
          }
        ]
      }
    }
    ```
3. `firebase deploy --only hosting`

    **Your project will now be live! Navigate to it to check it out.**


