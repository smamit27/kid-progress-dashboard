import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFwkHAKdkNyeFiYf8ajvMDEPR__9hvDU0",
  authDomain: "kid-progress-dashboard.firebaseapp.com",
  projectId: "kid-progress-dashboard",
  storageBucket: "kid-progress-dashboard.firebasestorage.app",
  messagingSenderId: "204255234279",
  appId: "1:204255234279:web:97d8ff869df49f48997a42",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log("🌱 Seeding Firestore...\n");

  // 1. app_data/settings
  const settings = {
    promotion_month: 4,
    promotion_day: 1,
    first_class_year: 2027,
    fee_due_day: 1,
  };
  await setDoc(doc(db, "app_data", "settings"), settings);
  console.log("✅ Created: app_data/settings", settings);

  // 2. app_data/fees (empty to start, will be populated as user marks fees paid)
  const fees = {};
  await setDoc(doc(db, "app_data", "fees"), fees);
  console.log("✅ Created: app_data/fees (empty — ready for fee tracking)");

  // 3. parent_notes collection with sample notes
  const notes = [
    { note: "Celebrate effort, not speed.", category: "Mindset", created_at: "2026-04-16T10:30:00Z" },
    { note: "Review school readiness every quarter, not every day.", category: "Planning", created_at: "2026-04-15T10:30:00Z" },
    { note: "Keep one weekend block free for family outings and open play.", category: "Balance", created_at: "2026-04-14T10:30:00Z" },
  ];

  for (const noteData of notes) {
    const docRef = await addDoc(collection(db, "parent_notes"), noteData);
    console.log(`✅ Created: parent_notes/${docRef.id} — "${noteData.note}"`);
  }

  console.log("\n🎉 Firestore seeding complete! Your database now has:");
  console.log("   • app_data/settings");
  console.log("   • app_data/fees");
  console.log("   • parent_notes (3 sample notes)");
  console.log("\nYou can verify at: https://console.firebase.google.com/project/kid-progress-dashboard/firestore");

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
