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

export const fetchTransactionReferrence = async () => {
  try {
    const transactionQuery = query(collection(database, "Transaction"));
    const querySnapshot = await getDocs(transactionQuery);
    if (!querySnapshot.empty) {
      const transactionDoc = querySnapshot.docs[0];
      const transactionRef = transactionDoc.ref;
      return transactionRef;
    }
    return;
  } catch (error: any) {
    console.error('Error at fetching transaction details: ', error);
  }
}