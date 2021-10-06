// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
firebase.initializeApp({
  apiKey: "AIzaSyDnzXVuFJd3ccueQyVg_V385lRMtkyn88M",
  authDomain: "calendar-app-2a9c5.firebaseapp.com",
  projectId: "calendar-app-2a9c5",
  storageBucket: "calendar-app-2a9c5.appspot.com",
  messagingSenderId: "593023651197",
  appId: "1:593023651197:web:93b65e680154e4d4239014",
  measurementId: "G-4P3JENV8GB"
});

// Initialize Firebase

let db = firebase.firestore()

export {
    db
}