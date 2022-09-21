'use strict';



// let jobTitle = "initial bg injected job title"
// let companyName = "initial bg injected company name"


import { initializeApp } from 'firebase/app';
import { getFirestore } from "@firebase/firestore";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc
} from "firebase/firestore";// Follow this pattern to import other Firebase services

// TODO company account+ where to keep secret
const firebaseConfig = {
  apiKey: "AIzaSyBZAyI_ON7F4VEZ_9k1ETzF4_k6qcBJ1uo",
  authDomain: "yuveta2-166505.firebaseapp.com",
  databaseURL: "https://yuveta2-166505-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "yuveta2-166505",
  storageBucket: "yuveta2-166505.appspot.com",
  messagingSenderId: "238877844764",
  appId: "1:238877844764:web:0b49af2563aa55139806d9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const jobsCollectionRef = collection(db, "jobs");



const addJob = async (job) => {
  const id = String(Math.floor(Math.random() * 10000) + 1);
  const newJob = { id, ...job }
  await setDoc(doc(db, "jobs", newJob.id), newJob);
}


chrome.runtime.onMessage.addListener( function(message, sender, sendResponse) {

    if (message.from == "Li-content-script"){
      console.log("job name ", message.jobTitle, "company ", message.companyName)

      if(message.type =="ADD"){


        console.log("got ADD message from Li");

       //payload = JSON.stringify({jobTitle: message.jobTitle, companyName: message.companyName});
        addJob({jobTitle: message.jobTitle, companyName: message.companyName})

      } else if (message.type =="QUERY") {


        console.log("got QUERY message from Li");

        const q = query(jobsCollectionRef, where("jobTitle", "==", message.jobTitle), where("companyName", "==", message.companyName));

        getDocs(q).then((querySnapshot) => {
          if(querySnapshot.size >0) {
            console.log("job name ", message.jobTitle, "company ", message.companyName, "-> found in DB");
            sendResponse({from: "bg script", type: "QUERY_RESP", jobfound: true});
          } else {
            console.log("job name ", message.jobTitle, "company ", message.companyName, "-> NOT found in DB");
            sendResponse({from: "bg script", type: "QUERY_RESP", jobfound: false});
          }
        });
      }
    }
    return true;

});
