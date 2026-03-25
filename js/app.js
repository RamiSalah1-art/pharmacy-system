// ============================================
// نظام إدارة الصيدليات - مع الإعدادات
// ============================================

// تهيئة البيانات
function initData() {
    // تهيئة المنتجات
    if (!localStorage.getItem('products')) {
        const defaultProducts = [
            { id: 1, name: "باراسيتامول 500mg", purchasePrice: 500, sellingPrice: 650, quantity: 150, minStock: 50, barcode: "6291001234567", expiryDate: "2025-12-31" },
            { id: 2, name: "إيبوبروفين 400mg", purchasePrice: 800, sellingPrice: 1040, quantity: 80, minStock: 40, barcode: "6291001234568", expiryDate: "2025-10-15" },
            { id: 3, name: "أموكسيسيلين 500mg", purchasePrice: 1200, sellingPrice: 1560, quantity: 45, minStock: 30, barcode: "6291001234569", expiryDate: "2025-08-20" }
        ];
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
    
    // تهيئة العملاء
    if (!localStorage.getItem('customers')) {
        localStorage.setItem('customers', JSON.stringify([
            { id: 1, name: "أحمد محمد", phone: "0123456789", email: "ahmed@email.com", totalSpent: 1250 },
            { id: 2, name: "سارة علي", phone: "0112345678", email: "sara@email.com", totalSpent: 890 }
        ]));
    }
    
    // تهيئة الفواتير
    if (!localStorage.getItem('invoices')) {
        localStorage.setItem('invoices', JSON.stringify([]));
    }
    
    // تهيئة إعدادات الصيدلية
    if (!localStorage.getItem('pharmacySettings')) {
        localStorage.setItem('pharmacySettings', JSON.stringify({
            pharmacyName: "صيدلية السلام",
            pharmacyNameEn: "Al Salam Pharmacy",
            address: "الخرطوم - السودان",
            phone: "0123456789",
            email: "info@alsalam.com",
            license: "123456789",
            currency: "ج.س",
            currencySymbol: "ج.س",
            profitMargin: 30,
            taxRate: 0,
            footerNote: "شكراً لثقتكم بنا - نتمنى لكم دوام الصحة والعافية"
        }));
    }
}

// الحصول على إعدادات الصيدلية
function getPharmacySettings() {
    return JSON.parse(localStorage.getItem('pharmacySettings') || '{}');
}

// تنسيق العملة (جنيه سوداني)
// تنسيق العملة (من الإعدادات)
function formatCurrency(amount) {
    const settings = JSON.parse(localStorage.getItem('pharmacySettings') || '{}');
    const currencySymbol = settings.currencySymbol || 'ج.س';
    return `${amount.toFixed(2)} ${currencySymbol}`;
}

// تحديث اسم الصيدلية في جميع الصفحات
function updatePharmacyName() {
    const settings = getPharmacySettings();
    const pharmacyNameElements = document.querySelectorAll('.pharmacy-name, .sidebar-header h3, .login-header h1');
    pharmacyNameElements.forEach(el => {
        if (el) el.innerHTML = settings.pharmacyName;
    });
    
    // تحديث عنوان الصفحة
    if (settings.pharmacyName && document.title && !document.title.includes('تسجيل')) {
        document.title = `${settings.pharmacyName} - ${document.title.split(' - ')[1] || 'نظام إدارة الصيدليات'}`;
    }
}

// حساب سعر البيع من سعر الشراء
function calculateSellingPrice(purchasePrice) {
    const settings = getPharmacySettings();
    const margin = settings.profitMargin || 30;
    return purchasePrice * (1 + margin / 100);
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
        animation: slideInRight 0.3s ease;
    `;
    notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
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

// دوال مساعدة عامة
function toggleSidebar() {
    document.getElementById('sidebar')?.classList.toggle('collapsed');
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initData();
    
    // تحديث اسم الصيدلية
    updatePharmacyName();
    
    // عرض اسم المستخدم
    const userNameSpan = document.getElementById('user-name');
    if (userNameSpan) {
        userNameSpan.innerHTML = sessionStorage.getItem('userName') || 'مدير النظام';
    }
});

// إضافة نمط للرسائل
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
`;
document.head.appendChild(style);

