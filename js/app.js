// ============================================
// نظام إدارة الصيدليات - مع دعم التخزين السحابي
// ============================================

// وضع التخزين الحالي
let currentStorageMode = 'local';

// تهيئة وضع التخزين
function initStorageMode() {
    currentStorageMode = localStorage.getItem('storage_mode') || 'local';
    console.log(`Storage mode: ${currentStorageMode}`);
}

// حفظ المنتجات (يدعم المحلي والسحابي)
async function saveProducts(products) {
    if (currentStorageMode === 'cloud' && typeof firebase !== 'undefined') {
        try {
            // حفظ في Firebase
            const batch = firebase.firestore().batch();
            const productsRef = firebase.firestore().collection('products');
            
            // حذف القديم
            const snapshot = await productsRef.get();
            snapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            
            // إضافة الجديد
            products.forEach(product => {
                const docRef = productsRef.doc(product.id.toString());
                batch.set(docRef, product);
            });
            
            await batch.commit();
            console.log("Products saved to cloud");
        } catch (error) {
            console.error("Cloud save error:", error);
            // fallback to local
            localStorage.setItem('products', JSON.stringify(products));
        }
    } else {
        localStorage.setItem('products', JSON.stringify(products));
    }
}

// جلب المنتجات (يدعم المحلي والسحابي)
async function loadProductsFromStorage() {
    if (currentStorageMode === 'cloud' && typeof firebase !== 'undefined') {
        try {
            const snapshot = await firebase.firestore().collection('products').get();
            const products = [];
            snapshot.forEach(doc => {
                products.push(doc.data());
            });
            if (products.length > 0) {
                return products;
            }
        } catch (error) {
            console.error("Cloud load error:", error);
        }
    }
    // fallback to local
    const stored = localStorage.getItem('products');
    return stored ? JSON.parse(stored) : [];
}

// حفظ العملاء
async function saveCustomers(customers) {
    if (currentStorageMode === 'cloud' && typeof firebase !== 'undefined') {
        try {
            const batch = firebase.firestore().batch();
            const customersRef = firebase.firestore().collection('customers');
            const snapshot = await customersRef.get();
            snapshot.forEach(doc => batch.delete(doc.ref));
            customers.forEach(customer => {
                const docRef = customersRef.doc(customer.id.toString());
                batch.set(docRef, customer);
            });
            await batch.commit();
        } catch (error) {
            console.error("Cloud save error:", error);
            localStorage.setItem('customers', JSON.stringify(customers));
        }
    } else {
        localStorage.setItem('customers', JSON.stringify(customers));
    }
}

// جلب العملاء
async function loadCustomersFromStorage() {
    if (currentStorageMode === 'cloud' && typeof firebase !== 'undefined') {
        try {
            const snapshot = await firebase.firestore().collection('customers').get();
            const customers = [];
            snapshot.forEach(doc => customers.push(doc.data()));
            if (customers.length > 0) return customers;
        } catch (error) {
            console.error("Cloud load error:", error);
        }
    }
    const stored = localStorage.getItem('customers');
    return stored ? JSON.parse(stored) : [];
}

// حفظ الفواتير
async function saveInvoices(invoices) {
    if (currentStorageMode === 'cloud' && typeof firebase !== 'undefined') {
        try {
            const batch = firebase.firestore().batch();
            const invoicesRef = firebase.firestore().collection('invoices');
            const snapshot = await invoicesRef.get();
            snapshot.forEach(doc => batch.delete(doc.ref));
            invoices.forEach(invoice => {
                const docRef = invoicesRef.doc(invoice.id.toString());
                batch.set(docRef, invoice);
            });
            await batch.commit();
        } catch (error) {
            console.error("Cloud save error:", error);
            localStorage.setItem('invoices', JSON.stringify(invoices));
        }
    } else {
        localStorage.setItem('invoices', JSON.stringify(invoices));
    }
}

// جلب الفواتير
async function loadInvoicesFromStorage() {
    if (currentStorageMode === 'cloud' && typeof firebase !== 'undefined') {
        try {
            const snapshot = await firebase.firestore().collection('invoices').get();
            const invoices = [];
            snapshot.forEach(doc => invoices.push(doc.data()));
            if (invoices.length > 0) return invoices;
        } catch (error) {
            console.error("Cloud load error:", error);
        }
    }
    const stored = localStorage.getItem('invoices');
    return stored ? JSON.parse(stored) : [];
}

// تهيئة البيانات
async function initData() {
    initStorageMode();
    
    // تحميل المنتجات
    let products = await loadProductsFromStorage();
    if (products.length === 0) {
        products = [
            { id: 1, name: "باراسيتامول 500mg", purchasePrice: 100, sellingPrice: 130, quantity: 150, minStock: 50, barcode: "123456", expiryDate: "2025-12-31" },
            { id: 2, name: "إيبوبروفين 400mg", purchasePrice: 150, sellingPrice: 195, quantity: 80, minStock: 40, barcode: "123457", expiryDate: "2025-10-15" },
            { id: 3, name: "أموكسيسيلين 500mg", purchasePrice: 200, sellingPrice: 260, quantity: 45, minStock: 30, barcode: "123458", expiryDate: "2025-08-20" },
            { id: 4, name: "فيتامين C", purchasePrice: 80, sellingPrice: 104, quantity: 200, minStock: 50, barcode: "123459", expiryDate: "2026-01-10" },
            { id: 5, name: "أسبرين 100mg", purchasePrice: 50, sellingPrice: 65, quantity: 25, minStock: 30, barcode: "123460", expiryDate: "2025-09-05" }
        ];
        await saveProducts(products);
    }
    
    // تحميل العملاء
    let customers = await loadCustomersFromStorage();
    if (customers.length === 0) {
        customers = [
            { id: 1, name: "أحمد محمد", phone: "0123456789", email: "ahmed@email.com", totalSpent: 1250 },
            { id: 2, name: "سارة علي", phone: "0112345678", email: "sara@email.com", totalSpent: 890 }
        ];
        await saveCustomers(customers);
    }
    
    // تحميل الفواتير
    let invoices = await loadInvoicesFromStorage();
    if (invoices.length === 0) {
        invoices = [];
        await saveInvoices(invoices);
    }
    
    return { products, customers, invoices };
}

// دالة مساعدة لتنسيق العملة
function formatCurrency(amount) {
    const settings = JSON.parse(localStorage.getItem('pharmacySettings') || '{}');
    const currency = settings.currencySymbol || 'ج.س';
    return `${amount.toFixed(2)} ${currency}`;
}

// دالة عرض الإشعارات
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#f39c12'};
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// مزامنة البيانات من المحلي إلى السحابي
async function syncToCloud() {
    showNotification("جاري المزامنة مع السحابة...", "info");
    
    try {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
        
        await saveProducts(products);
        await saveCustomers(customers);
        await saveInvoices(invoices);
        
        showNotification("✅ تمت المزامنة بنجاح", "success");
    } catch (error) {
        showNotification("❌ فشلت المزامنة: " + error.message, "error");
    }
}

// مزامنة البيانات من السحابي إلى المحلي
async function syncToLocal() {
    showNotification("جاري تحميل البيانات من السحابة...", "info");
    
    try {
        const products = await loadProductsFromStorage();
        const customers = await loadCustomersFromStorage();
        const invoices = await loadInvoicesFromStorage();
        
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('customers', JSON.stringify(customers));
        localStorage.setItem('invoices', JSON.stringify(invoices));
        
        showNotification("✅ تم تحميل البيانات بنجاح", "success");
        location.reload();
    } catch (error) {
        showNotification("❌ فشل التحميل: " + error.message, "error");
    }
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

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async function() {
    await initData();
    
    // تحديث اسم الصيدلية
    const settings = JSON.parse(localStorage.getItem('pharmacySettings') || '{}');
    const pharmacyNameElements = document.querySelectorAll('.pharmacy-name, .sidebar-header h3');
    pharmacyNameElements.forEach(el => {
        if (el) el.innerHTML = settings.pharmacyName || 'نظام الصيدلية';
    });
    
    // عرض اسم المستخدم
    const userNameSpan = document.getElementById('user-name');
    if (userNameSpan) {
        userNameSpan.innerHTML = sessionStorage.getItem('userName') || 'مدير النظام';
    }
});

// دوال مساعدة
function toggleSidebar() {
    document.getElementById('sidebar')?.classList.toggle('collapsed');
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}
