import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
import { firebaseApiKeys } from "../env";

const firebaseConfig = {
  apiKey: firebaseApiKeys.apiKey,
  authDomain: firebaseApiKeys.authDomain,
  projectId: firebaseApiKeys.projectId,
  storageBucket: firebaseApiKeys.storageBucket,
  messagingSenderId: firebaseApiKeys.messagingSenderId,
  appId: firebaseApiKeys.appId,
  measurementId: firebaseApiKeys.measurementId,
  databaseUrl: firebaseApiKeys.databaseUrl,
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const dbRef = ref(getDatabase());
