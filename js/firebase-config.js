// ============================================
// إعدادات Firebase
// قم باستبدال هذه البيانات ببيانات مشروع Firebase الخاص بك
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyB2x_YXqI5PqYwJ-KpQ9xYpQxYpQxYpQ", // استبدل بمفتاح API الخاص بك
    authDomain: "pharmacy-system.firebaseapp.com", // استبدل
    projectId: "pharmacy-system", // استبدل
    storageBucket: "pharmacy-system.firebasestorage.app", // استبدل
    messagingSenderId: "123456789", // استبدل
    appId: "1:123456789:web:abcdef123456" // استبدل
};

// تهيئة Firebase
if (typeof firebase !== 'undefined') {
    // إذا كان Firebase SDK محملاً
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    const auth = firebase.auth();
    const db = firebase.firestore();
    const storage = firebase.storage();
    
    console.log("? Firebase initialized");
}

// وضع التخزين (محلي/سحابي) - يتم تحديده من الإعدادات
let storageMode = localStorage.getItem('storage_mode') || 'local'; // local / cloud

// تغيير وضع التخزين
function setStorageMode(mode) {
    storageMode = mode;
    localStorage.setItem('storage_mode', mode);
    console.log(`Storage mode changed to: ${mode}`);
    showNotification(`تم التبديل إلى التخزين ${mode === 'cloud' ? 'السحابي' : 'المحلي'}`, 'info');
}

// الحصول على وضع التخزين الحالي
function getStorageMode() {
    return localStorage.getItem('storage_mode') || 'local';
}

// عرض حالة الاتصال
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
