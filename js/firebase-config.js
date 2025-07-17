// Firebase Configuration for MisEstrellas
// [ESPACIO FIREBASE CONFIG] - Complete Firebase initialization

// Firebase configuration object
const firebaseConfig = {
    // Replace with your Firebase project configuration
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com", 
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialize Firebase app
let app;
let auth;
let db;
let storage;

try {
    // Check if Firebase is available
    if (typeof firebase !== 'undefined') {
        // Initialize Firebase
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        storage = firebase.storage();
        
        console.log('Firebase initialized successfully');
        
        // Configure Firestore settings
        db.enablePersistence().catch((err) => {
            if (err.code === 'failed-precondition') {
                console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
            } else if (err.code === 'unimplemented') {
                console.warn('The current browser does not support persistence.');
            }
        });
        
        // Set up auth state persistence
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        
    } else {
        console.error('Firebase SDK not loaded. Please include Firebase scripts.');
        showFirebaseError();
    }
} catch (error) {
    console.error('Error initializing Firebase:', error);
    showFirebaseError();
}

// Firebase Collections References
const COLLECTIONS = {
    BUSINESSES: 'businesses',
    USERS: 'users', 
    TRANSACTIONS: 'transactions',
    QR_CODES: 'qr_codes',
    NOTIFICATIONS: 'notifications',
    ANALYTICS: 'analytics'
};

// Firebase Auth State Observer
if (auth) {
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('User signed in:', user.uid);
            // Store user data in session storage for quick access
            sessionStorage.setItem('currentUser', JSON.stringify({
                uid: user.uid,
                email: user.email,
                phoneNumber: user.phoneNumber,
                displayName: user.displayName,
                photoURL: user.photoURL
            }));
        } else {
            console.log('User signed out');
            sessionStorage.removeItem('currentUser');
            
            // Redirect to login if on protected pages
            const protectedPaths = ['/cliente/', '/admin/'];
            const currentPath = window.location.pathname;
            
            if (protectedPaths.some(path => currentPath.includes(path))) {
                window.location.href = '/index.html';
            }
        }
    });
}

// Firestore Helper Functions
const FirestoreHelper = {
    // Create document with auto-generated ID
    async create(collection, data) {
        try {
            const docRef = await db.collection(collection).add({
                ...data,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error(`Error creating document in ${collection}:`, error);
            throw error;
        }
    },
    
    // Create document with specific ID
    async set(collection, docId, data) {
        try {
            await db.collection(collection).doc(docId).set({
                ...data,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return docId;
        } catch (error) {
            console.error(`Error setting document ${docId} in ${collection}:`, error);
            throw error;
        }
    },
    
    // Update document
    async update(collection, docId, data) {
        try {
            await db.collection(collection).doc(docId).update({
                ...data,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return docId;
        } catch (error) {
            console.error(`Error updating document ${docId} in ${collection}:`, error);
            throw error;
        }
    },
    
    // Get document by ID
    async get(collection, docId) {
        try {
            const doc = await db.collection(collection).doc(docId).get();
            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            } else {
                return null;
            }
        } catch (error) {
            console.error(`Error getting document ${docId} from ${collection}:`, error);
            throw error;
        }
    },
    
    // Query documents
    async query(collection, constraints = []) {
        try {
            let query = db.collection(collection);
            
            // Apply constraints (where, orderBy, limit, etc.)
            constraints.forEach(constraint => {
                query = query[constraint.method](...constraint.args);
            });
            
            const querySnapshot = await query.get();
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error(`Error querying ${collection}:`, error);
            throw error;
        }
    },
    
    // Delete document
    async delete(collection, docId) {
        try {
            await db.collection(collection).doc(docId).delete();
            return true;
        } catch (error) {
            console.error(`Error deleting document ${docId} from ${collection}:`, error);
            throw error;
        }
    },
    
    // Listen to document changes
    listen(collection, docId, callback) {
        return db.collection(collection).doc(docId).onSnapshot(callback);
    },
    
    // Listen to query changes
    listenToQuery(collection, constraints, callback) {
        let query = db.collection(collection);
        
        constraints.forEach(constraint => {
            query = query[constraint.method](...constraint.args);
        });
        
        return query.onSnapshot(callback);
    }
};

// Storage Helper Functions
const StorageHelper = {
    // Upload file
    async uploadFile(path, file, metadata = {}) {
        try {
            const storageRef = storage.ref(path);
            const uploadTask = await storageRef.put(file, metadata);
            const downloadURL = await uploadTask.ref.getDownloadURL();
            return downloadURL;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    },
    
    // Delete file
    async deleteFile(path) {
        try {
            const storageRef = storage.ref(path);
            await storageRef.delete();
            return true;
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    },
    
    // Get download URL
    async getDownloadURL(path) {
        try {
            const storageRef = storage.ref(path);
            return await storageRef.getDownloadURL();
        } catch (error) {
            console.error('Error getting download URL:', error);
            throw error;
        }
    }
};

// Error handling for Firebase issues
function showFirebaseError() {
    const errorMessage = document.createElement('div');
    errorMessage.style.cssText = `
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
    `;
    errorMessage.textContent = 'Error de configuración de Firebase. Contacta al administrador.';
    document.body.appendChild(errorMessage);
    
    setTimeout(() => {
        errorMessage.remove();
    }, 5000);
}

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
        return db.batch();
    },
    
    // Create transaction
    async runTransaction(callback) {
        return await db.runTransaction(callback);
    }
};

// Export for use in other files
window.firebaseConfig = firebaseConfig;
window.auth = auth;
window.db = db;
window.storage = storage;
window.COLLECTIONS = COLLECTIONS;
window.FirestoreHelper = FirestoreHelper;
window.StorageHelper = StorageHelper;
window.FirebaseUtils = FirebaseUtils;

console.log('Firebase configuration loaded');
