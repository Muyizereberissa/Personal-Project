AgriYouth Application - Setup Guide
Welcome to the AgriYouth Application repository! This React Native app connects youth with agriculture-related opportunities, providing mentorship, funding, and resources to empower their agribusiness ventures. Follow this guide to set up the project and get it running locally.

Table of Contents
Prerequisites
Installation
Running the Application
Environment Variables
Troubleshooting
Prerequisites
Before setting up the project, ensure you have the following installed:

Node.js: Download and install from Node.js.
Yarn: Install globally by running:
bash
Copy code
npm install --global yarn
Expo CLI: Install globally by running:
bash
Copy code
npm install --global expo-cli
Git: Install from Git.
Android Studio (for Android emulator) or Xcode (for iOS simulator):
Download and set up Android Studio.
For iOS, Xcode comes pre-installed on macOS.
Installation
Clone the Repository: Open your terminal and run:

bash
Copy code
git clone <repository-url>
Replace <repository-url> with the link to the GitHub repository.

Navigate to the Project Directory:

bash
Copy code
cd AgriYouth
Install Dependencies: Use Yarn to install the required packages:

bash
Copy code
yarn install
Install Expo Go App (For physical devices):

Download Expo Go from Google Play Store or Apple App Store.
Running the Application
Start the Development Server:

bash
Copy code
expo start
This will open the Expo development tool in your browser.

Run on Emulator or Physical Device:

For Android:
Start an Android emulator from Android Studio.
Press a in the terminal to launch the app on the emulator.
For iOS (macOS only):
Start an iOS simulator from Xcode.
Press i in the terminal to launch the app on the simulator.
For Physical Device:
Scan the QR code displayed in the Expo development tool using the Expo Go app.
Environment Variables
To connect the app to Firebase and other services, create a .env file in the project root. Add the following variables:

env
Copy code
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
Replace the placeholder values with your Firebase credentials. If you don’t have them:

Go to the Firebase Console.
Create a project and add a web app.
Copy the configuration values into the .env file.
Troubleshooting
Common Issues and Solutions
Error: expo-cli not found:

Ensure Expo CLI is installed globally:
bash
Copy code
npm install --global expo-cli
App Not Displaying on Emulator:

Verify your emulator is running and properly configured in Android Studio or Xcode.
Restart the development server:
bash
Copy code
expo start -c
Dependency Errors:

Clear the Yarn cache and reinstall dependencies:
bash
Copy code
yarn cache clean
yarn install
Environment Variables Not Working:

Ensure the .env file exists in the project root.
Restart the Expo server after making changes.
Cannot Install App on Physical Device:

Ensure your device and computer are on the same Wi-Fi network.
Use a USB connection as an alternative.
