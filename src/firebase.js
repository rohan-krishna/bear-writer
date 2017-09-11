import firebase from 'firebase'

const config = {
	apiKey: "AIzaSyD_dvior5vofXRtKaU_2IBo9MkZeaC8qxo",
    authDomain: "bear-writer.firebaseapp.com",
    databaseURL: "https://bear-writer.firebaseio.com",
    projectId: "bear-writer",
    storageBucket: "",
    messagingSenderId: "433171378994"
}

firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;