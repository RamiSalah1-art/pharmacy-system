// ============================================
// إعدادات Firebase - بيانات حقيقية
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyA6xbkAe6MqNc-gKg-uHU4TpEdHVb0HYaI",
    authDomain: "pharmacy-system-cafdf.firebaseapp.com",
    projectId: "pharmacy-system-cafdf",
    storageBucket: "pharmacy-system-cafdf.firebasestorage.app",
    messagingSenderId: "802316904728",
    appId: "1:802316904728:web:84757a51b203aed94d166d"
};

// تهيئة Firebase
if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("✅ Firebase initialized with real config");
    }
}

// وضع التخزين (تخزين سحابي فقط)
let storageMode = localStorage.getItem('storage_mode') || 'cloud'; // تغيير الافتراضي للسحابي

function setStorageMode(mode) {
    storageMode = mode;
    localStorage.setItem('storage_mode', mode);
    console.log(`Storage mode changed to: ${mode}`);
    showNotification(`تم التبديل إلى التخزين ${mode === 'cloud' ? 'السحابي' : 'المحلي'}`, 'info');
}

function getStorageMode() {
    return localStorage.getItem('storage_mode') || 'cloud';
}

function checkCloudConnection() {
    if (storageMode === 'cloud') {
        if (typeof firebase !== 'undefined' && firebase.apps.length) {
            return true;
        } else {
            console.warn("Firebase not initialized, falling back to local storage");
            return false;
        }
    }
    return true;
}

console.log("🔥 Firebase Config Loaded - Mode:", getStorageMode());
