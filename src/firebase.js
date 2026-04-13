import { initializeApp, getApps } from 'firebase/app'
import { getDatabase, ref, push, serverTimestamp } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyA-2jSqhTTDlscIfy4KCyvjtSXVdldCr04',
  authDomain: 'elite-dacha.firebaseapp.com',
  projectId: 'elite-dacha',
  storageBucket: 'elite-dacha.firebasestorage.app',
  messagingSenderId: '554561862964',
  appId: '1:554561862964:web:6cc2cd6220a733457f7961',
  measurementId: 'G-GK45BB3YCG',
  databaseURL: 'https://elite-dacha-default-rtdb.firebaseio.com',
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
const db = getDatabase(app)

export { db, ref, push, serverTimestamp }
