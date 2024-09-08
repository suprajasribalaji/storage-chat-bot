import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, database } from "../config/firebase.config";

export const fetchCurrentUserDetails = async () => {
  try {
    const userQuery = query(collection(database, "Users"), where("email", "==", auth.currentUser?.email));
    const querySnapshot = await getDocs(userQuery);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      return userData;
    }
    return;
  } catch (error: any) {
    console.error('Error at fetching user details: ', error);
  }
};

export const fetchCurrentUserReferrence = async () => {
  try {
    const userQuery = query(collection(database, "Users"), where("email", "==", auth.currentUser?.email));
    const querySnapshot = await getDocs(userQuery);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userRef = userDoc.ref;
      return userRef;
    }
    return;
  } catch (error: any) {
    console.error('Error at fetching user details: ', error);
  }
};

export const fetchPlanValidity = async () => {
  try {
    const user = await fetchCurrentUserDetails();
    let isPlanValid = true;
    if(user) {
      const subscribedAt = new Date(user.subscribed_at);
      const currentTime = new Date().getTime();
      const isDay28 = (28 * 24 * 60 * 60 * 1000) - currentTime;
      if (subscribedAt.getTime() < isDay28) {
        isPlanValid = false;
      }
    } 
    return isPlanValid;
  } catch (error: any) {
    console.error('Error at fetching plan validity: ', error);
  }
}