import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  serverTimestamp,
  update,
} from "firebase/database";

const defaultFirebaseConfig = {
  apiKey: "AIzaSyA-2jSqhTTDlscIfy4KCyvjtSXVdldCr04",
  authDomain: "elite-dacha.firebaseapp.com",
  databaseURL: "https://elite-dacha-default-rtdb.firebaseio.com",
  projectId: "elite-dacha",
  storageBucket: "elite-dacha.firebasestorage.app",
  messagingSenderId: "554561862964",
  appId: "1:554561862964:web:6cc2cd6220a733457f7961",
  measurementId: "G-GK45BB3YCG",
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain,
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL || defaultFirebaseConfig.databaseURL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId,
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    defaultFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultFirebaseConfig.appId,
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || defaultFirebaseConfig.measurementId,
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

let database = null;

if (hasFirebaseConfig) {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  database = getDatabase(app);
}

export const firebaseServices = {
  ready: Boolean(database),
  db: database,
};

export const db = database;
export { push, ref, serverTimestamp };

export function subscribeToBookings(onChange, onError) {
  if (!database) {
    onChange([]);
    return () => {};
  }

  const bookingsRef = ref(database, "bookings");

  return onValue(
    bookingsRef,
    (snapshot) => {
      const rawBookings = snapshot.val() || {};
      const mapped = Object.entries(rawBookings).map(([firebaseKey, value]) => ({
        firebaseKey,
        ...value,
      }));

      onChange(mapped);
    },
    (error) => {
      onChange([]);
      if (onError) {
        onError(error);
      }
    },
  );
}

export async function createBooking(payload) {
  if (!database) {
    throw new Error("Firebase is not configured.");
  }

  return push(ref(database, "bookings"), payload);
}

export async function updateBooking(firebaseKey, payload) {
  if (!database) {
    throw new Error("Firebase is not configured.");
  }

  return update(ref(database, `bookings/${firebaseKey}`), payload);
}

export async function deleteBooking(firebaseKey) {
  if (!database) {
    throw new Error("Firebase is not configured.");
  }

  return remove(ref(database, `bookings/${firebaseKey}`));
}

export async function clearBookings() {
  if (!database) {
    throw new Error("Firebase is not configured.");
  }

  return remove(ref(database, "bookings"));
}

export function createServerTimestamp() {
  return serverTimestamp();
}
