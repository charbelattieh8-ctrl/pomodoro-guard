import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  signOut,
} from "firebase/auth";
import { appleProvider, googleProvider } from "./firebase";

export const loginWithEmail = (auth, email, password) => signInWithEmailAndPassword(auth, email, password);
export const signupWithEmail = (auth, email, password) => createUserWithEmailAndPassword(auth, email, password);
export const loginWithGoogle = (auth) => signInWithPopup(auth, googleProvider);
export const loginWithApple = (auth) => signInWithPopup(auth, appleProvider);
export const continueAsGuest = (auth) => signInAnonymously(auth);
export const logoutUser = (auth) => signOut(auth);
