// ============================================
// نظام إدارة الصيدليات - بدون بيانات تجريبية
// ============================================

// تهيئة البيانات (فارغة)
function initData() {
    // المنتجات - تبدأ فارغة
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify([]));
    }
    
    // العملاء - يبدأون فارغين
    if (!localStorage.getItem('customers')) {
        localStorage.setItem('customers', JSON.stringify([]));
    }
    
    // الفواتير - تبدأ فارغة
    if (!localStorage.getItem('invoices')) {
        localStorage.setItem('invoices', JSON.stringify([]));
    }
    
    // إعدادات الصيدلية - افتراضية
    if (!localStorage.getItem('pharmacySettings')) {
        localStorage.setItem('pharmacySettings', JSON.stringify({
            pharmacyName: "",
            pharmacyNameEn: "",
            address: "",
            phone: "",
            email: "",
            license: "",
            currencySymbol: "ج.س",
            profitMargin: 30,
            taxRate: 0,
            footerNote: "شكراً لثقتكم بنا"
        }));
    }
    
    console.log("تم تهيئة البيانات (فارغة)");
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
    initData();
    
    // تحديث اسم الصيدلية
    const settings = JSON.parse(localStorage.getItem('pharmacySettings') || '{}');
    const pharmacyNameElements = document.querySelectorAll('.pharmacy-name, .sidebar-header h3');
    pharmacyNameElements.forEach(el => {
        if (el && settings.pharmacyName) el.innerHTML = settings.pharmacyName;
    });
    
    // عرض اسم المستخدم
    const userNameSpan = document.getElementById('user-name');
    if (userNameSpan) {
        userNameSpan.innerHTML = sessionStorage.getItem('userName') || 'مدير النظام';
    }
});
