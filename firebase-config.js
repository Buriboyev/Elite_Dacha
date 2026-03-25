(function initFirebaseConfig() {
  const firebaseConfig = {
    apiKey: "AIzaSyA-2jSqhTTDlscIfy4KCyvjtSXVdldCr04",
    authDomain: "elite-dacha.firebaseapp.com",
    projectId: "elite-dacha",
    storageBucket: "elite-dacha.firebasestorage.app",
    messagingSenderId: "554561862964",
    appId: "1:554561862964:web:6cc2cd6220a733457f7961",
    measurementId: "G-GK45BB3YCG",
  };

  const hasPlaceholder = Object.values(firebaseConfig).some((value) =>
    String(value).includes("YOUR_"),
  );

  if (hasPlaceholder) {
    console.warn(
      "firebase-config.js ichiga o'zingizning Firebase project qiymatlarini yozing.",
    );
    window.firebaseServices = {
      ready: false,
      db: null,
      bookingsRef: null,
      serverTimestamp: null,
    };
    return;
  }

  if (!window.firebase || !window.firebase.apps) {
    console.error("Firebase scriptlari yuklanmadi.");
    window.firebaseServices = {
      ready: false,
      db: null,
      bookingsRef: null,
      serverTimestamp: null,
    };
    return;
  }

  const app = window.firebase.apps.length
    ? window.firebase.app()
    : window.firebase.initializeApp(firebaseConfig);
  const db = app.database();

  window.firebaseServices = {
    ready: true,
    db,
    bookingsRef: db.ref("bookings"),
    serverTimestamp: window.firebase.database.ServerValue.TIMESTAMP,
  };
})();
