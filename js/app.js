// ============================================
// نظام إدارة الصيدليات - تخزين سحابي فقط
// ============================================

// تهيئة البيانات من Firebase
async function initData() {
    const user = firebase.auth().currentUser;
    if (!user) return;
    
    try {
        const db = firebase.firestore();
        const pharmacyId = user.uid; // أو من userDoc.pharmacyId
        
        // التحقق من وجود البيانات في Firebase
        const productsRef = db.collection('pharmacies').doc(pharmacyId).collection('products');
        const productsSnapshot = await productsRef.get();
        if (productsSnapshot.empty) {
            // إذا كانت فارغة، نتركها فارغة (بدون بيانات تجريبية)
            console.log("No products found in Firebase");
        }
        
        const customersRef = db.collection('pharmacies').doc(pharmacyId).collection('customers');
        const customersSnapshot = await customersRef.get();
        if (customersSnapshot.empty) {
            console.log("No customers found in Firebase");
        }
        
        const invoicesRef = db.collection('pharmacies').doc(pharmacyId).collection('invoices');
        const invoicesSnapshot = await invoicesRef.get();
        if (invoicesSnapshot.empty) {
            console.log("No invoices found in Firebase");
        }
        
    } catch(e) {
        console.error("خطأ في تهيئة البيانات:", e);
    }
}

// عرض الإشعارات
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// تنسيق العملة
function formatCurrency(amount) {
    const settings = JSON.parse(localStorage.getItem('pharmacySettings') || '{}');
    const currency = settings.currencySymbol || 'ج.س';
    return `${amount.toFixed(2)} ${currency}`;
}

// حساب سعر البيع
function calculateSellingPrice(purchasePrice) {
    const settings = JSON.parse(localStorage.getItem('pharmacySettings') || '{}');
    const margin = settings.profitMargin || 30;
    return purchasePrice * (1 + margin / 100);
}

// تنسيق التاريخ
function formatDate(dateString) {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';
        return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;
    } catch(e) {
        return '-';
    }
}

// ===== دوال Sync مع Firebase =====
async function syncPharmacyNameFromFirebase() {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        console.log('Firebase not loaded yet');
        return;
    }
    
    const user = firebase.auth().currentUser;
    if (!user) {
        console.log('No user logged in');
        return;
    }
    
    try {
        const db = firebase.firestore();
        const pharmacyRef = db.collection('pharmacies').doc(user.uid);
        const pharmacyDoc = await pharmacyRef.get();
        
        if (pharmacyDoc.exists) {
            const pharmacyName = pharmacyDoc.data().name || 'نظام الصيدلية';
            
            // تحديث localStorage للاستخدام المؤقت
            const settings = JSON.parse(localStorage.getItem('pharmacySettings') || '{}');
            settings.pharmacyName = pharmacyName;
            localStorage.setItem('pharmacySettings', JSON.stringify(settings));
            
            console.log('✅ تم مزامنة اسم الصيدلية من Firebase:', pharmacyName);
            updatePharmacyNameDisplay(pharmacyName);
            return pharmacyName;
        }
    } catch(e) {
        console.error('خطأ في مزامنة اسم الصيدلية:', e);
    }
    return null;
}

function updatePharmacyNameDisplay(pharmacyName) {
    if (!pharmacyName) {
        const settings = JSON.parse(localStorage.getItem('pharmacySettings') || '{}');
        pharmacyName = settings.pharmacyName || 'نظام الصيدلية';
    }
    
    const elements = document.querySelectorAll('#pharmacyNameHeader, .pharmacy-name, .sidebar-header h3');
    elements.forEach(el => {
        if (el) el.innerHTML = pharmacyName;
    });
}

// دوال مساعدة
function toggleSidebar() {
    document.getElementById('sidebar')?.classList.toggle('collapsed');
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// إضافة نمط للرسائل
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
`;
document.head.appendChild(style);

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // عرض اسم المستخدم
    const userNameSpan = document.getElementById('user-name');
    if (userNameSpan) {
        userNameSpan.innerHTML = sessionStorage.getItem('userName') || 'مدير النظام';
    }
    
    // التحقق من حالة تسجيل الدخول
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                await syncPharmacyNameFromFirebase();
                await initData();
            } else {
                if (!window.location.pathname.includes('index.html')) {
                    window.location.href = 'index.html';
                }
            }
        });
    }
});
