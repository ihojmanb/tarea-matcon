import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseConfig from '../../firebaseCredentials.json'
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export const getResourcesList = async () => {
    let docs = await getDocs(collection(db, "Situaciones"));
    let docsArray = [];
    docs.forEach((doc) => {
        let docObject = {}
        docObject['id'] = doc.id;
        docObject['elements'] = doc.data().elementos;
        docsArray.push(docObject);
    })
    return docsArray;
};