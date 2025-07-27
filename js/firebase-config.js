console.log("🔥 Iniciando configuración de Firebase...");

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyAdRYp6pQRVoPnhOEnz3PrYPz8B2jswo3Y",
    authDomain: "miestrellas-d677e.firebaseapp.com",
    projectId: "miestrellas-d677e",
    storageBucket: "miestrellas-d677e.firebasestorage.app",
    messagingSenderId: "942296067880",
    appId: "1:942296067880:web:b5c9e6a7c03d06aa07aa1d"
};

// Variables globales para Firebase
let app;
let auth;
let db;
let storage;

// Función para inicializar Firebase
function initializeFirebase() {
    return new Promise((resolve, reject) => {
        try {
            // Verificar si Firebase está disponible
            if (typeof firebase === 'undefined') {
                throw new Error('Firebase SDK no está cargado');
            }

            // Verificar si ya está inicializado
            if (firebase.apps.length > 0) {
                console.log('✅ Firebase ya está inicializado');
                app = firebase.app();
            } else {
                console.log('🔄 Inicializando Firebase...');
                app = firebase.initializeApp(firebaseConfig);
            }

            // Inicializar servicios
            auth = firebase.auth();
            db = firebase.firestore();
            storage = firebase.storage();

            console.log('✅ Servicios de Firebase inicializados');

            // Configurar Firestore
            configureFirestore();

            // Configurar Auth
            configureAuth();

            // Exportar variables globales
            exportGlobalVariables();

            resolve({
                app,
                auth,
                db,
                storage
            });

        } catch (error) {
            console.error('❌ Error inicializando Firebase:', error);
            reject(error);
        }
    });
}

// Configurar Firestore
function configureFirestore() {
    try {
        // Habilitar persistencia offline (opcional)
        db.enablePersistence({ synchronizeTabs: true })
            .then(() => {
                console.log('✅ Persistencia de Firestore habilitada');
            })
            .catch((err) => {
                if (err.code === 'failed-precondition') {
                    console.warn('⚠️ Múltiples pestañas abiertas, persistencia limitada');
                } else if (err.code === 'unimplemented') {
                    console.warn('⚠️ Navegador no soporta persistencia');
                } else {
                    console.warn('⚠️ Error de persistencia:', err);
                }
            });
    } catch (error) {
        console.warn('⚠️ Error configurando Firestore:', error);
    }
}

// Configurar Auth
function configureAuth() {
    try {
        // Configurar persistencia de autenticación
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                console.log('✅ Persistencia de Auth configurada');
            })
            .catch((err) => {
                console.warn('⚠️ Error configurando persistencia de Auth:', err);
            });
    } catch (error) {
        console.warn('⚠️ Error configurando Auth:', error);
    }
}

// Exportar variables globales
function exportGlobalVariables() {
    // Exportar configuración
    window.firebaseConfig = firebaseConfig;
    window.app = app;
    window.auth = auth;
    window.db = db;
    window.storage = storage;

    // Exportar helpers
    window.COLLECTIONS = COLLECTIONS;
    window.FirestoreHelper = FirestoreHelper;
    window.StorageHelper = StorageHelper;
    window.FirebaseUtils = FirebaseUtils;

    console.log('🌍 Variables globales exportadas:', {
        firebaseConfig: !!window.firebaseConfig,
        app: !!window.app,
        auth: !!window.auth,
        db: !!window.db,
        storage: !!window.storage,
        collections: !!window.COLLECTIONS,
        firestoreHelper: !!window.FirestoreHelper,
        storageHelper: !!window.StorageHelper,
        firebaseUtils: !!window.FirebaseUtils
    });
}

// Firebase Collections References
const COLLECTIONS = {
    BUSINESSES: 'businesses',
    USERS: 'users', 
    TRANSACTIONS: 'transactions',
    QR_CODES: 'qr_codes',
    NOTIFICATIONS: 'notifications',
    ANALYTICS: 'analytics',
    BUSINESS_CLIENTS: 'business_clients'
};

// Firestore Helper Functions
const FirestoreHelper = {
    // Create document with auto-generated ID
    async create(collection, data) {
        try {
            if (!db) throw new Error('Firestore no está inicializado');
            
            const docRef = await db.collection(collection).add({
                ...data,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log(`📄 Document created in ${collection}:`, docRef.id);
            return docRef.id;
        } catch (error) {
            console.error(`❌ Error creating document in ${collection}:`, error);
            throw error;
        }
    },
    
    // Create document with specific ID
    async set(collection, docId, data) {
        try {
            if (!db) throw new Error('Firestore no está inicializado');
            
            await db.collection(collection).doc(docId).set({
                ...data,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log(`📄 Document set in ${collection}:`, docId);
            return docId;
        } catch (error) {
            console.error(`❌ Error setting document ${docId} in ${collection}:`, error);
            throw error;
        }
    },
    
    // Update document
    async update(collection, docId, data) {
        try {
            if (!db) throw new Error('Firestore no está inicializado');
            
            await db.collection(collection).doc(docId).update({
                ...data,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log(`📝 Document updated in ${collection}:`, docId);
            return docId;
        } catch (error) {
            console.error(`❌ Error updating document ${docId} in ${collection}:`, error);
            throw error;
        }
    },
    
    // Get document by ID
    async get(collection, docId) {
        try {
            if (!db) throw new Error('Firestore no está inicializado');
            
            const doc = await db.collection(collection).doc(docId).get();
            if (doc.exists) {
                console.log(`📖 Document found in ${collection}:`, docId);
                return { id: doc.id, ...doc.data() };
            } else {
                console.log(`📭 Document not found in ${collection}:`, docId);
                return null;
            }
        } catch (error) {
            console.error(`❌ Error getting document ${docId} from ${collection}:`, error);
            throw error;
        }
    },
    
    // Query documents with better constraint handling
    async query(collection, whereClause = null, orderBy = null, limit = null) {
        try {
            if (!db) throw new Error('Firestore no está inicializado');
            
            let query = db.collection(collection);
            
            // Apply where clause
            if (whereClause) {
                query = query.where(whereClause.field, whereClause.operator, whereClause.value);
            }
            
            // Apply orderBy
            if (orderBy) {
                query = query.orderBy(orderBy.field, orderBy.direction || 'asc');
            }
            
            // Apply limit
            if (limit) {
                query = query.limit(limit);
            }
            
            const querySnapshot = await query.get();
            const results = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            console.log(`🔍 Query results from ${collection}:`, results.length, 'documents');
            return results;
        } catch (error) {
            console.error(`❌ Error querying ${collection}:`, error);
            throw error;
        }
    },
    
    // Delete document
    async delete(collection, docId) {
        try {
            if (!db) throw new Error('Firestore no está inicializado');
            
            await db.collection(collection).doc(docId).delete();
            console.log(`🗑️ Document deleted from ${collection}:`, docId);
            return true;
        } catch (error) {
            console.error(`❌ Error deleting document ${docId} from ${collection}:`, error);
            throw error;
        }
    },
    
    // Listen to document changes
    listen(collection, docId, callback) {
        if (!db) throw new Error('Firestore no está inicializado');
        
        console.log(`👂 Listening to ${collection}/${docId}`);
        return db.collection(collection).doc(docId).onSnapshot(callback);
    },
    
    // Listen to query changes
    listenToQuery(collection, whereClause, callback) {
        if (!db) throw new Error('Firestore no está inicializado');
        
        let query = db.collection(collection);
        
        if (whereClause) {
            query = query.where(whereClause.field, whereClause.operator, whereClause.value);
        }
        
        console.log(`👂 Listening to query in ${collection}`);
        return query.onSnapshot(callback);
    }
};

// Storage Helper Functions
const StorageHelper = {
    // Upload file
    async uploadFile(path, file, metadata = {}) {
        try {
            if (!storage) throw new Error('Storage no está inicializado');
            
            const storageRef = storage.ref(path);
            const uploadTask = await storageRef.put(file, metadata);
            const downloadURL = await uploadTask.ref.getDownloadURL();
            console.log(`📤 File uploaded to ${path}:`, downloadURL);
            return downloadURL;
        } catch (error) {
            console.error('❌ Error uploading file:', error);
            throw error;
        }
    },
    
    // Delete file
    async deleteFile(path) {
        try {
            if (!storage) throw new Error('Storage no está inicializado');
            
            const storageRef = storage.ref(path);
            await storageRef.delete();
            console.log(`🗑️ File deleted: ${path}`);
            return true;
        } catch (error) {
            console.error('❌ Error deleting file:', error);
            throw error;
        }
    },
    
    // Get download URL
    async getDownloadURL(path) {
        try {
            if (!storage) throw new Error('Storage no está inicializado');
            
            const storageRef = storage.ref(path);
            const url = await storageRef.getDownloadURL();
            console.log(`🔗 Download URL obtained for ${path}`);
            return url;
        } catch (error) {
            console.error('❌ Error getting download URL:', error);
            throw error;
        }
    }
};

// Utility functions for Firebase operations
const FirebaseUtils = {
    // Get current timestamp
    timestamp() {
        return firebase.firestore.FieldValue.serverTimestamp();
    },
    
    // Get array union
    arrayUnion(...elements) {
        return firebase.firestore.FieldValue.arrayUnion(...elements);
    },
    
    // Get array remove
    arrayRemove(...elements) {
        return firebase.firestore.FieldValue.arrayRemove(...elements);
    },
    
    // Get increment
    increment(value) {
        return firebase.firestore.FieldValue.increment(value);
    },
    
    // Create batch
    batch() {
        if (!db) throw new Error('Firestore no está inicializado');
        return db.batch();
    },
    
    // Create transaction
    async runTransaction(callback) {
        if (!db) throw new Error('Firestore no está inicializado');
        return await db.runTransaction(callback);
    },
    
    // Verify Firebase is ready
    isReady() {
        return !!(auth && db && storage);
    },
    
    // Get current user
    getCurrentUser() {
        return auth ? auth.currentUser : null;
    },

    // Wait for auth ready
    waitForAuth() {
        return new Promise((resolve) => {
            if (!auth) {
                resolve(null);
                return;
            }

            const unsubscribe = auth.onAuthStateChanged((user) => {
                unsubscribe();
                resolve(user);
            });
        });
    },
    
    // Generate unique ID
    generateUniqueId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return timestamp + random;
    }
};

// ========================================
// FUNCIONES ESPECÍFICAS PARA QR CODES
// ========================================

// Crear QR para dar puntos (usado por el negocio)
async function crearQRPuntos(puntos, businessId) {
    console.log('📊 Creando QR para puntos:', puntos, 'negocio:', businessId);
    
    try {
        if (!db) throw new Error('Firestore no está inicializado');
        
        // Generar ID único para el QR
        const qrId = FirebaseUtils.generateUniqueId();
        
        // Crear código QR con formato específico
        const code = `POINTS:${businessId}:${qrId}:${puntos}`;
        const displayCode = qrId.substring(0, 8).toUpperCase();
        
        // Tiempo de expiración (5 minutos)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        
        // Datos del QR
        const qrData = {
            businessId: businessId,
            type: 'POINTS',
            points: puntos,
            code: code,
            displayCode: displayCode,
            used: false,
            usedBy: null,
            usedAt: null,
            expiresAt: expiresAt,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Guardar en Firestore
        await db.collection('qr_codes').doc(qrId).set(qrData);
        
        console.log('✅ QR code created successfully:', qrId);
        
        return {
            id: qrId,
            code: code,
            displayCode: displayCode,
            points: puntos,
            expiresIn: 300, // 5 minutos en segundos
            businessId: businessId,
            expiresAt: expiresAt
        };
        
    } catch (error) {
        console.error('❌ Error creating QR code:', error);
        throw new Error('Error creando código QR: ' + error.message);
    }
}

// Procesar QR escaneado por el cliente
async function procesarQREscaneado(qrCode, userId) {
    console.log('📱 Procesando QR escaneado:', qrCode, 'usuario:', userId);
    
    try {
        if (!db) throw new Error('Firestore no está inicializado');
        
        // Parsear el código QR
        const parts = qrCode.split(':');
        if (parts.length !== 4 || parts[0] !== 'POINTS') {
            throw new Error('Código QR inválido');
        }
        
        const [type, businessId, qrId, points] = parts;
        
        // Verificar QR en Firebase
        const qrDoc = await db.collection('qr_codes').doc(qrId).get();
        
        if (!qrDoc.exists) {
            throw new Error('Código QR no encontrado');
        }
        
        const qrData = qrDoc.data();
        
        // Verificaciones de seguridad
        if (qrData.used) {
            throw new Error('Este código ya fue utilizado');
        }
        
        if (new Date() > qrData.expiresAt.toDate()) {
            throw new Error('Este código ha expirado');
        }
        
        if (qrData.businessId !== businessId) {
            throw new Error('Código QR corrupto');
        }
        
        // Obtener información del negocio
        const businessDoc = await db.collection('businesses').doc(businessId).get();
        if (!businessDoc.exists) {
            throw new Error('Negocio no encontrado');
        }
        
        const businessData = businessDoc.data();
        
        return {
            qrId: qrId,
            businessId: businessId,
            businessName: businessData.name,
            businessAddress: businessData.address,
            points: parseInt(points),
            qrData: qrData,
            businessData: businessData
        };
        
    } catch (error) {
        console.error('❌ Error procesando QR:', error);
        throw error;
    }
}

// Confirmar ganancia de puntos (ejecutado por el cliente)
async function confirmarGananciaPuntos(qrId, businessId, userId, points) {
    console.log('✅ Confirmando ganancia de puntos:', {qrId, businessId, userId, points});
    
    try {
        if (!db) throw new Error('Firestore no está inicializado');
        
        // Usar transacción para garantizar consistencia
        return await db.runTransaction(async (transaction) => {
            // 1. Verificar QR nuevamente
            const qrRef = db.collection('qr_codes').doc(qrId);
            const qrDoc = await transaction.get(qrRef);
            
            if (!qrDoc.exists) {
                throw new Error('Código QR no encontrado');
            }
            
            const qrData = qrDoc.data();
            
            if (qrData.used) {
                throw new Error('Este código ya fue utilizado');
            }
            
            if (new Date() > qrData.expiresAt.toDate()) {
                throw new Error('Este código ha expirado');
            }
            
            // 2. Obtener datos del usuario
            const userRef = db.collection('users').doc(userId);
            const userDoc = await transaction.get(userRef);
            
            if (!userDoc.exists) {
                throw new Error('Usuario no encontrado');
            }
            
            const userData = userDoc.data();
            
            // 3. Obtener datos del negocio
            const businessRef = db.collection('businesses').doc(businessId);
            const businessDoc = await transaction.get(businessRef);
            
            if (!businessDoc.exists) {
                throw new Error('Negocio no encontrado');
            }
            
            const businessData = businessDoc.data();
            
            // 4. Crear transacción
            const transactionRef = db.collection('transactions').doc();
            const transactionData = {
                userId: userId,
                businessId: businessId,
                qrCodeId: qrId,
                type: 'earned',
                points: points,
                description: `Puntos ganados en ${businessData.name}`,
                status: 'completed',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                metadata: {
                    qrDisplayCode: qrData.displayCode,
                    businessName: businessData.name,
                    clientName: userData.name || userData.displayName,
                    clientPhone: userData.phoneNumber
                }
            };
            
            transaction.set(transactionRef, transactionData);
            
            // 5. Marcar QR como usado
            transaction.update(qrRef, {
                used: true,
                usedBy: userId,
                usedAt: firebase.firestore.FieldValue.serverTimestamp(),
                clientData: {
                    name: userData.name || userData.displayName || 'Cliente',
                    phone: userData.phoneNumber,
                    email: userData.email
                }
            });
            
            // 6. Actualizar estadísticas del usuario
            transaction.update(userRef, {
                totalPoints: firebase.firestore.FieldValue.increment(points),
                totalEarned: firebase.firestore.FieldValue.increment(points),
                totalVisits: firebase.firestore.FieldValue.increment(1),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                joinedBusinesses: firebase.firestore.FieldValue.arrayUnion(businessId)
            });
            
            // 7. Actualizar estadísticas del negocio
            transaction.update(businessRef, {
                totalPointsGiven: firebase.firestore.FieldValue.increment(points),
                totalClients: firebase.firestore.FieldValue.increment(1),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('✅ Transacción completada exitosamente');
            
            return {
                success: true,
                transactionId: transactionRef.id,
                points: points,
                businessName: businessData.name,
                clientName: userData.name || userData.displayName || 'Cliente'
            };
        });
        
    } catch (error) {
        console.error('❌ Error confirmando puntos:', error);
        throw error;
    }
}

// Escuchar cambios en QR (para el negocio)
function listenForQRUsage(qrId, callback) {
    console.log('👂 Escuchando uso del QR:', qrId);
    
    if (!db) throw new Error('Firestore no está inicializado');
    
    return db.collection('qr_codes').doc(qrId).onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            if (data.used && data.usedBy) {
                console.log('🎉 QR usado por:', data.usedBy);
                callback(data);
            }
        }
    });
}

// ========================================
// FUNCIONES PARA MANEJO DE USUARIOS
// ========================================

// Cargar puntos del usuario (para dashboard cliente)
async function cargarPuntosUsuario(userId) {
    console.log('📊 Cargando puntos para usuario:', userId);
    
    try {
        if (!db) throw new Error('Firestore no está inicializado');
        
        // Obtener todas las transacciones del usuario
        const transactionsSnapshot = await db.collection('transactions')
            .where('userId', '==', userId)
            .limit(100)
            .get();
        
        console.log('🔍 Transacciones encontradas:', transactionsSnapshot.size);
        
        if (transactionsSnapshot.empty) {
            console.log('📭 No se encontraron transacciones para el usuario');
            return [];
        }
        
        // Agrupar transacciones por negocio
        const businessPoints = {};
        const businessIds = new Set();
        
        transactionsSnapshot.forEach(doc => {
            const transaction = doc.data();
            const businessId = transaction.businessId;
            
            if (!businessId) {
                console.warn('⚠️ Transacción sin businessId:', doc.id);
                return;
            }
            
            businessIds.add(businessId);
            
            if (!businessPoints[businessId]) {
                businessPoints[businessId] = {
                    totalPoints: 0,
                    totalVisits: 0,
                    lastVisit: null,
                    transactions: []
                };
            }
            
            // Sumar/restar puntos según el tipo
            const points = transaction.points || 0;
            if (transaction.type === 'earned') {
                businessPoints[businessId].totalPoints += points;
                businessPoints[businessId].totalVisits++;
            } else if (transaction.type === 'redeemed') {
                businessPoints[businessId].totalPoints -= points;
            }
            
            // Actualizar última visita
            const transactionDate = transaction.createdAt?.toDate() || new Date();
            if (!businessPoints[businessId].lastVisit || transactionDate > businessPoints[businessId].lastVisit) {
                businessPoints[businessId].lastVisit = transactionDate;
            }
            
            businessPoints[businessId].transactions.push({
                id: doc.id,
                ...transaction,
                date: transactionDate
            });
        });
        
        console.log('🏪 Negocios únicos encontrados:', businessIds.size);
        
        // Obtener información de los negocios
        const businesses = [];
        
        for (const businessId of businessIds) {
            try {
                const businessDoc = await db.collection('businesses').doc(businessId).get();
                
                if (businessDoc.exists) {
                    const businessData = businessDoc.data();
                    const points = businessPoints[businessId];
                    
                    // Solo incluir negocios con puntos positivos
                    if (points.totalPoints >= 0) {
                        businesses.push({
                            id: businessId,
                            name: businessData.name || 'Negocio',
                            address: businessData.address || '',
                            image: businessData.image || null,
                            stars: points.totalPoints,
                            visits: points.totalVisits,
                            lastVisit: points.lastVisit,
                            transactions: points.transactions
                        });
                    }
                } else {
                    console.warn('⚠️ Negocio no encontrado:', businessId);
                }
            } catch (error) {
                console.error(`❌ Error cargando negocio ${businessId}:`, error);
            }
        }
        
        // Ordenar por puntos (descendente)
        businesses.sort((a, b) => b.stars - a.stars);
        
        console.log('✅ Negocios cargados:', businesses.length);
        return businesses;
        
    } catch (error) {
        console.error('❌ Error cargando puntos del usuario:', error);
        return [];
    }
}

// Obtener historial de transacciones
async function getTransactionHistory(userId, businessId = null) {
    console.log('📋 Cargando historial para usuario:', userId, 'negocio:', businessId);
    
    try {
        if (!db) throw new Error('Firestore no está inicializado');
        
        let query = db.collection('transactions').where('userId', '==', userId);
        
        if (businessId) {
            query = query.where('businessId', '==', businessId);
        }
        
        const transactionsSnapshot = await query.limit(20).get();
        
        const transactions = [];
        
        transactionsSnapshot.forEach(doc => {
            const transaction = doc.data();
            transactions.push({
                id: doc.id,
                stars: transaction.points || 0,
                date: transaction.createdAt?.toDate() || new Date(),
                type: transaction.type || 'earned',
                description: transaction.description || `${transaction.type === 'earned' ? 'Ganaste' : 'Canjeaste'} ${transaction.points || 0} puntos`
            });
        });
        
        // Ordenar por fecha (más reciente primero)
        transactions.sort((a, b) => b.date - a.date);
        
        return transactions;
        
    } catch (error) {
        console.error('❌ Error cargando historial de transacciones:', error);
        return [];
    }
}

// Obtener datos del usuario
async function getUserData(userId) {
    console.log('👤 Cargando datos del usuario:', userId);
    
    try {
        if (!db) throw new Error('Firestore no está inicializado');
        
        const userDoc = await db.collection('users').doc(userId).get();
        
        if (userDoc.exists) {
            return { id: userId, ...userDoc.data() };
        } else {
            console.warn('⚠️ Usuario no encontrado:', userId);
            return null;
        }
        
    } catch (error) {
        console.error('❌ Error cargando datos del usuario:', error);
        return null;
    }
}

// ========================================
// FUNCIONES PARA MANEJO DE CLIENTES (NEGOCIO)
// ========================================

// Cargar clientes del negocio
async function cargarClientes(businessId) {
    console.log('👥 Cargando clientes para negocio:', businessId);
    
    try {
        if (!db) throw new Error('Firestore no está inicializado');
        
        // Obtener transacciones del negocio
        const transactionsSnapshot = await db.collection('transactions')
            .where('businessId', '==', businessId)
            .get();
        
        const clientsData = {};
        const clientIds = new Set();
        
        // Agrupar por cliente
        transactionsSnapshot.forEach(doc => {
            const transaction = doc.data();
            const userId = transaction.userId;
            
            if (!userId) return;
            
            clientIds.add(userId);
            
            if (!clientsData[userId]) {
                clientsData[userId] = {
                    points: 0,
                    visits: 0,
                    totalEarned: 0,
                    totalRedeemed: 0,
                    lastVisit: null,
                    firstVisit: null
                };
            }
            
            const points = transaction.points || 0;
            const date = transaction.createdAt?.toDate() || new Date();
            
            if (transaction.type === 'earned') {
                clientsData[userId].points += points;
                clientsData[userId].totalEarned += points;
                clientsData[userId].visits++;
            } else if (transaction.type === 'redeemed') {
                clientsData[userId].points -= points;
                clientsData[userId].totalRedeemed += points;
            }
            
            // Actualizar fechas
            if (!clientsData[userId].lastVisit || date > clientsData[userId].lastVisit) {
                clientsData[userId].lastVisit = date;
            }
            
            if (!clientsData[userId].firstVisit || date < clientsData[userId].firstVisit) {
                clientsData[userId].firstVisit = date;
            }
        });
        
        // Obtener datos de los usuarios
        const clients = [];
        
        for (const userId of clientIds) {
            try {
                const userData = await getUserData(userId);
                
                if (userData) {
                    const clientStats = clientsData[userId];
                    
                    clients.push({
                        id: userId,
                        name: userData.name || userData.displayName || 'Cliente',
                        phone: userData.phoneNumber,
                        email: userData.email,
                        avatar: userData.avatar,
                        points: clientStats.points,
                        visits: clientStats.visits,
                        totalEarned: clientStats.totalEarned,
                        totalRedeemed: clientStats.totalRedeemed,
                        lastVisit: clientStats.lastVisit,
                        firstVisit: clientStats.firstVisit,
                        isActive: clientStats.lastVisit && (new Date() - clientStats.lastVisit) < (30 * 24 * 60 * 60 * 1000) // Activo si visitó en últimos 30 días
                    });
                }
            } catch (error) {
                console.error(`❌ Error cargando cliente ${userId}:`, error);
            }
        }
        
        // Ordenar por puntos (descendente)
        clients.sort((a, b) => b.points - a.points);
        
        console.log('✅ Clientes cargados:', clients.length);
        return clients;
        
    } catch (error) {
        console.error('❌ Error cargando clientes:', error);
        return [];
    }
}

// Obtener historial de transacciones de un cliente específico
async function getClientTransactionHistory(clientId, businessId) {
    console.log('📋 Cargando historial de cliente:', clientId, 'negocio:', businessId);
    
    try {
        if (!db) throw new Error('Firestore no está inicializado');
        
        const transactionsSnapshot = await db.collection('transactions')
            .where('userId', '==', clientId)
            .where('businessId', '==', businessId)
            .limit(20)
            .get();
        
        const transactions = [];
        
        transactionsSnapshot.forEach(doc => {
            const transaction = doc.data();
            transactions.push({
                id: doc.id,
                points: transaction.points || 0,
                date: transaction.createdAt?.toDate() || new Date(),
                type: transaction.type || 'earned',
                description: transaction.description || `${transaction.type === 'earned' ? 'Puntos ganados' : 'Puntos canjeados'}`
            });
        });
        
        // Ordenar por fecha (más reciente primero)
        transactions.sort((a, b) => b.date - a.date);
        
        return transactions;
        
    } catch (error) {
        console.error('❌ Error cargando historial del cliente:', error);
        return [];
    }
}

// Procesar canje de puntos
async function procesarCanje(clientId, points, businessId) {
    console.log('💰 Procesando canje:', {clientId, points, businessId});
    
    try {
        if (!db) throw new Error('Firestore no está inicializado');
        
        return await db.runTransaction(async (transaction) => {
            // 1. Verificar datos del cliente
            const userRef = db.collection('users').doc(clientId);
            const userDoc = await transaction.get(userRef);
            
            if (!userDoc.exists) {
                throw new Error('Cliente no encontrado');
            }
            
            const userData = userDoc.data();
            
            // 2. Verificar puntos disponibles en este negocio
            const clientTransactions = await db.collection('transactions')
                .where('userId', '==', clientId)
                .where('businessId', '==', businessId)
                .get();
            
            let totalPoints = 0;
            clientTransactions.forEach(doc => {
                const trans = doc.data();
                if (trans.type === 'earned') {
                    totalPoints += trans.points || 0;
                } else if (trans.type === 'redeemed') {
                    totalPoints -= trans.points || 0;
                }
            });
            
            if (totalPoints < points) {
                throw new Error(`Cliente solo tiene ${totalPoints} puntos disponibles`);
            }
            
            // 3. Obtener datos del negocio
            const businessRef = db.collection('businesses').doc(businessId);
            const businessDoc = await transaction.get(businessRef);
            
            if (!businessDoc.exists) {
                throw new Error('Negocio no encontrado');
            }
            
            const businessData = businessDoc.data();
            
            // 4. Crear transacción de canje
            const transactionRef = db.collection('transactions').doc();
            const transactionData = {
                userId: clientId,
                businessId: businessId,
                qrCodeId: null,
                type: 'redeemed',
                points: points,
                description: `Puntos canjeados en ${businessData.name}`,
                status: 'completed',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                metadata: {
                    businessName: businessData.name,
                    clientName: userData.name || userData.displayName,
                    redemptionMethod: 'manual'
                }
            };
            
            transaction.set(transactionRef, transactionData);
            
            // 5. Actualizar estadísticas del usuario
            transaction.update(userRef, {
                totalRedemptions: firebase.firestore.FieldValue.increment(1),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // 6. Actualizar estadísticas del negocio
            transaction.update(businessRef, {
                totalRedemptions: firebase.firestore.FieldValue.increment(1),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('✅ Canje procesado exitosamente');
            
            return {
                success: true,
                transactionId: transactionRef.id,
                points: points,
                clientName: userData.name || userData.displayName || 'Cliente'
            };
        });
        
    } catch (error) {
        console.error('❌ Error procesando canje:', error);
        throw error;
    }
}

// ========================================
// FUNCIONES ESPECÍFICAS PARA NEGOCIOS
// ========================================

// Cargar datos del negocio (mejorada)
async function cargarDatosNegocio(businessId) {
    try {
        console.log('📊 Cargando datos del negocio:', businessId);
        
        if (!db) throw new Error('Firestore no está inicializado');
        
        const doc = await db.collection('businesses').doc(businessId).get();
        
        if (doc.exists) {
            const data = doc.data();
            console.log('✅ Datos del negocio cargados:', data);
            return data;
        } else {
            console.log('📭 No se encontró el negocio, creando datos por defecto');
            
            const defaultData = {
                name: 'Mi Negocio',
                category: 'Restaurante',
                email: businessId + '@negocio.com',
                phone: '+57 300 123 4567',
                address: 'Dirección no configurada',
                description: 'Negocio registrado en MisEstrellas',
                pointValue: 1000,
                mapsUrl: '',
                image: '',
                isActive: true,
                hours: {
                    monday: { open: '08:00', close: '18:00', closed: false },
                    tuesday: { open: '08:00', close: '18:00', closed: false },
                    wednesday: { open: '08:00', close: '18:00', closed: false },
                    thursday: { open: '08:00', close: '18:00', closed: false },
                    friday: { open: '08:00', close: '18:00', closed: false },
                    saturday: { open: '09:00', close: '17:00', closed: false },
                    sunday: { open: '', close: '', closed: true }
                },
                rating: 0.0,
                ratingCount: 0,
                totalClients: 0,
                totalPointsGiven: 0,
                totalRedemptions: 0,
                ownerId: businessId,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // Guardar en Firebase
            await db.collection('businesses').doc(businessId).set(defaultData);
            return defaultData;
        }
        
    } catch (error) {
        console.error('❌ Error cargando datos del negocio:', error);
        throw error;
    }
}

// Obtener estadísticas del negocio (corregida)
async function getBusinessStatistics(businessId) {
    try {
        console.log('📊 Cargando estadísticas para:', businessId);
        
        if (!db) throw new Error('Firestore no está inicializado');
        
        // Buscar en analytics primero
        const analyticsDoc = await db.collection('analytics').doc(businessId).get();
        if (analyticsDoc.exists) {
            const data = analyticsDoc.data();
            return {
                totalCustomers: data.totalCustomers || 0,
                totalPointsGiven: data.totalPointsGiven || 0,
                totalRedemptions: data.totalRedemptions || 0
            };
        }
        
        // Si no hay analytics, calcular desde transacciones
        const transactionsSnapshot = await db.collection('transactions')
            .where('businessId', '==', businessId)
            .get();
        
        const uniqueCustomers = new Set();
        let totalPointsGiven = 0;
        let totalRedemptions = 0;
        
        transactionsSnapshot.forEach(doc => {
            const transaction = doc.data();
            uniqueCustomers.add(transaction.userId);
            
            // CORREGIDO: usar 'earned' y 'redeemed' como en Firebase
            if (transaction.type === 'earned') {
                totalPointsGiven += transaction.points || 0;
            } else if (transaction.type === 'redeemed') {
                totalRedemptions += 1;
            }
        });
        
        return {
            totalCustomers: uniqueCustomers.size,
            totalPointsGiven,
            totalRedemptions
        };
        
    } catch (error) {
        console.error('❌ Error cargando estadísticas:', error);
        return {
            totalCustomers: 0,
            totalPointsGiven: 0,
            totalRedemptions: 0
        };
    }
}

// Actualizar configuración del negocio
async function actualizarConfiguracion(businessId, configuration) {
    try {
        console.log('💾 Actualizando configuración:', businessId, configuration);
        
        if (!db) throw new Error('Firestore no está inicializado');
        
        await db.collection('businesses').doc(businessId).update({
            ...configuration,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('✅ Configuración actualizada');
        
    } catch (error) {
        console.error('❌ Error actualizando configuración:', error);
        throw error;
    }
}

// Subir imagen del negocio
async function uploadBusinessImage(businessId, file) {
    try {
        console.log('🖼️ Subiendo imagen para:', businessId);
        
        if (!storage) throw new Error('Storage no está inicializado');
        
        const fileName = `business-images/${businessId}/${Date.now()}_${file.name}`;
        const storageRef = storage.ref(fileName);
        
        const snapshot = await storageRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        
        console.log('✅ Imagen subida:', downloadURL);
        return downloadURL;
        
    } catch (error) {
        console.error('❌ Error subiendo imagen:', error);
        throw error;
    }
}

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

// Error handling mejorado
function showFirebaseError(message = 'Error de configuración de Firebase') {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        right: 20px;
        background: #F44336;
        color: white;
        padding: 16px;
        border-radius: 8px;
        z-index: 10000;
        text-align: center;
        font-weight: 500;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Función para verificar permisos de usuario
function verificarPermisos(userId, businessId) {
    // Verificar si el usuario es el dueño del negocio
    return userId === businessId;
}

// Función para formatear fechas
function formatearFecha(date) {
    if (!date) return 'No disponible';
    
    try {
        const fecha = date instanceof Date ? date : date.toDate();
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Fecha inválida';
    }
}

// ========================================
// INICIALIZACIÓN AUTOMÁTICA
// ========================================

(async function() {
    try {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        // Esperar a que Firebase esté disponible
        let attempts = 0;
        while (typeof firebase === 'undefined' && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        if (typeof firebase === 'undefined') {
            throw new Error('Firebase SDK no se cargó después de 5 segundos');
        }

        // Inicializar Firebase
        await initializeFirebase();

        // Disparar evento de Firebase listo
        const firebaseReadyEvent = new CustomEvent('firebaseReady', {
            detail: {
                auth: !!auth,
                db: !!db,
                storage: !!storage,
                timestamp: new Date()
            }
        });

        window.dispatchEvent(firebaseReadyEvent);
        console.log('🎉 Firebase Ready event dispatched');

    } catch (error) {
        console.error('❌ Error en inicialización automática:', error);
        showFirebaseError('Error iniciando Firebase: ' + error.message);
    }
})();

// ========================================
// EXPORTAR TODAS LAS FUNCIONES
// ========================================

// Funciones específicas del negocio
window.cargarDatosNegocio = cargarDatosNegocio;
window.getBusinessStatistics = getBusinessStatistics;
window.actualizarConfiguracion = actualizarConfiguracion;
window.uploadBusinessImage = uploadBusinessImage;

// Funciones de QR codes
window.crearQRPuntos = crearQRPuntos;
window.procesarQREscaneado = procesarQREscaneado;
window.confirmarGananciaPuntos = confirmarGananciaPuntos;
window.listenForQRUsage = listenForQRUsage;

// Funciones de usuarios/clientes
window.cargarPuntosUsuario = cargarPuntosUsuario;
window.getTransactionHistory = getTransactionHistory;
window.getUserData = getUserData;
window.cargarClientes = cargarClientes;
window.getClientTransactionHistory = getClientTransactionHistory;
window.procesarCanje = procesarCanje;

// Funciones de utilidad
window.verificarPermisos = verificarPermisos;
window.formatearFecha = formatearFecha;
window.cargarPuntosUsuarioNuevo = cargarPuntosUsuario;
// Exportar función waitForAuth
window.waitForAuth = FirebaseUtils.waitForAuth;

console.log('🎉 Todas las funciones de Firebase exportadas correctamente');

// ========================================
// FUNCIONES QR MEJORADAS (AGREGAR AL FINAL)
// ========================================

// Función de validación mejorada
window.ValidationUtils = {
    isValidQRCode(qrData) {
        if (!qrData || typeof qrData !== 'string') {
            return false;
        }
        
        const parts = qrData.split(':');
        return parts.length === 4 && parts[0] === 'POINTS';
    },
    
    isValidBusinessId(businessId) {
        return businessId && typeof businessId === 'string' && businessId.length > 0;
    },
    
    isValidPoints(points) {
        const numPoints = parseInt(points);
        return !isNaN(numPoints) && numPoints > 0 && numPoints <= 1000;
    }
};

// Función para debugging QR
window.debugQR = function(qrCode) {
    console.log('🔍 Debug QR:', qrCode);
    
    if (!qrCode) {
        console.log('❌ QR vacío');
        return false;
    }
    
    const parts = qrCode.split(':');
    console.log('📋 Partes del QR:', parts);
    
    if (parts.length !== 4) {
        console.log('❌ Formato incorrecto, debe tener 4 partes');
        return false;
    }
    
    const [type, businessId, qrId, points] = parts;
    
    console.log('📊 Análisis:');
    console.log('  - Tipo:', type, type === 'POINTS' ? '✅' : '❌');
    console.log('  - Business ID:', businessId, businessId ? '✅' : '❌');
    console.log('  - QR ID:', qrId, qrId ? '✅' : '❌');
    console.log('  - Puntos:', points, window.ValidationUtils.isValidPoints(points) ? '✅' : '❌');
    
    return window.ValidationUtils.isValidQRCode(qrCode);
};

// Función para crear usuarios automáticamente
window.createUserIfNotExists = async function(userId) {
    try {
        // Verificar que Firebase esté inicializado
        if (!window.db || !window.auth) {
            throw new Error('Firebase no está inicializado');
        }
        
        const userRef = window.db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
            console.log('👤 Creando nuevo usuario:', userId);
            const userData = {
                name: window.auth.currentUser?.displayName || 'Usuario',
                email: window.auth.currentUser?.email,
                phoneNumber: window.auth.currentUser?.phoneNumber,
                totalPoints: 0,
                totalEarned: 0,
                totalVisits: 0,
                joinedBusinesses: [],
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await userRef.set(userData);
            console.log('✅ Usuario creado exitosamente');
            return userData;
        } else {
            return userDoc.data();
        }
    } catch (error) {
        console.error('❌ Error creando usuario:', error);
        throw error;
    }
};

// Función para generar QR de prueba
window.generateTestQR = function() {
    const businessId = 'CBSU8br1nARkQZgbbR6Sz8cb61v2';
    const qrId = 'test-' + Date.now();
    const points = 5;
    const testQR = `POINTS:${businessId}:${qrId}:${points}`;
    console.log('🧪 QR de prueba generado:', testQR);
    return testQR;
};

// Función para probar manualmente
window.testQR = function(qrCode) {
    if (!qrCode) {
        qrCode = window.generateTestQR();
    }
    console.log('🧪 Probando QR:', qrCode);
    
    if (window.debugQR(qrCode)) {
        console.log('✅ QR válido, listo para procesar');
        return qrCode;
    } else {
        console.log('❌ QR inválido');
        return null;
    }
};

console.log('🔄 Funciones QR mejoradas agregadas correctamente (versión simplificada)');