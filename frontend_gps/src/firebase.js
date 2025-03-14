import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyArlPllZCPncPhi-ek463jHmN_IMJuQTsc",
  authDomain: "fleet-management-32bc5.firebaseapp.com",
  projectId: "fleet-management-32bc5",
  storageBucket: "fleet-management-32bc5.firebasestorage.app",
  messagingSenderId: "183899113111",
  appId: "1:183899113111:web:fd9d25e47c1c459af7cbd2",
  measurementId: "G-B0VGLBJ3TY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
