import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAu1OSi8_gO9qU7GUgvWNq2Wped0XN1ySs",
    authDomain: "embbed-lab-final-project-5564e.firebaseapp.com",
    databaseURL: "https://embbed-lab-final-project-5564e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "embbed-lab-final-project-5564e",
    storageBucket: "embbed-lab-final-project-5564e.appspot.com",
    messagingSenderId: "57487657610",
    appId: "1:57487657610:web:f386b2b9b2da98ebf47b73"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };