import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCVDpZcaqyi_ipRdrJpC-HMzX93cWRGkbc",
    authDomain: "todo-list-6690c.firebaseapp.com",
    projectId: "todo-list-6690c",
    storageBucket: "todo-list-6690c.appspot.com",
    messagingSenderId: "287210538493",
    appId: "1:287210538493:web:19887167987bc652af0594",
    measurementId: "G-KDBWGWG0YM"
};

const app = initializeApp( firebaseConfig );
const db = getFirestore( app );
const collectionRef = collection( db, 'tasks' );

export async function saveTaskToFirebase( taskDetails ) {
    try {
        taskDetails.status = 'pending';
        const docRef = await addDoc( collectionRef, taskDetails );
        console.log( 'Tarea guardada en Firebase correctamente.' );
        return docRef.id;
    } catch ( error ) {
        console.log( 'Error al guardar la tarea en Firebase:', error );
        throw error;
    }
}


export async function getTasksFromFirebase() {
    const querySnapshot = await getDocs( collectionRef );
    const tasks = [];
    querySnapshot.forEach( ( doc ) => {
        tasks.push( { id: doc.id, ...doc.data() } );
    } );
    return tasks;
}

export async function updateTaskStatusInFirebase( taskId, newStatus ) {
    const taskDocRef = doc( db, 'tasks', taskId );
    await updateDoc( taskDocRef, {
        status: newStatus
    } );
}