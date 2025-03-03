import { initializeApp, ServiceAccount, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from "firebase-admin/firestore";

import serviceAccount from '../test-1-89042-firebase-adminsdk-fbsvc-1f13ce3665.json';

import { getAuth, Auth } from 'firebase-admin/auth';


initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
});

const auth: Auth = getAuth();

const db: Firestore = getFirestore();

export { auth, db};