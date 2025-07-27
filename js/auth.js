// Authentication Module for MisEstrellas
// USAR las variables globales de firebase-config.js
// 🔥 ELIMINAR declaración conflictiva
// const auth = window.auth || firebase.auth(); // ❌ ELIMINAR ESTA LÍNEA
const db = window.db || firebase.firestore();

// Authentication state management
let currentAuthUser = null;
let authStateCallbacks = [];

// Phone authentication utilities
let phoneAuthProvider = null;
let confirmationResult = null;

// Initialize auth state management
document.addEventListener('DOMContentLoaded', function() {
    if (typeof firebase !== 'undefined' && window.auth) {
        initializeAuth();
    }
});

function initializeAuth() {
    // Set up phone auth provider
    if (firebase.auth) {
        phoneAuthProvider = new firebase.auth.PhoneAuthProvider();
        
        // Configure reCAPTCHA
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': function(response) {
                console.log('reCAPTCHA verified');
            },
            'expired-callback': function() {
                console.log('reCAPTCHA expired');
            }
        });
    }
    
    // Listen for auth state changes
    window.auth.onAuthStateChanged(async (user) => {
        currentAuthUser = user;
        authStateCallbacks.forEach(callback => callback(user));

        if (user) {
            console.log('User authenticated:', user.uid);
            updateUserSession(user);
            
            // 🔥 NO REDIRIGIR AUTOMÁTICAMENTE - solo almacenar estado
            
        } else {
            console.log('User not authenticated');
            clearUserSession();
            
            // 🔥 COMENTAR redirección automática para evitar loops
            // Solo redirigir si estamos en páginas protegidas
            // const currentPath = window.location.pathname;
            // const isProtectedPage = currentPath.includes('/admin/') || currentPath.includes('/cliente/');
            
            // if (isProtectedPage) {
            //     window.location.href = '/index.html';
            // }
        }
    });
}

// Para autenticación por SMS (clientes)
async function authenticateClientWithPhone(phoneNumber) {
    const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    const confirmationResult = await window.auth.signInWithPhoneNumber(phoneNumber, appVerifier);
    return confirmationResult;
}

// Client Authentication Functions
async function loginCliente(contactInfo) {
    try {
        showAuthLoading(true);
        
        if (isEmail(contactInfo)) {
            // Email-based authentication for clients
            return await authenticateClientWithEmail(contactInfo);
        } else {
            // Phone-based authentication
            return await authenticateClientWithPhone(contactInfo);
        }
    } catch (error) {
        console.error('Client login error:', error);
        throw new Error(getAuthErrorMessage(error.code));
    } finally {
        showAuthLoading(false);
    }
}

async function authenticateClientWithPhone(phoneNumber) {
    try {
        // Format phone number
        const formattedPhone = formatPhoneNumber(phoneNumber);
        
        if (!window.recaptchaVerifier) {
            // Create invisible reCAPTCHA if not exists
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                'size': 'invisible'
            });
        }
        
        // Send SMS verification code
        confirmationResult = await window.auth.signInWithPhoneNumber(
            formattedPhone, 
            window.recaptchaVerifier
        );
        
        console.log('SMS sent to:', formattedPhone);
        return {
            success: true,
            message: 'Código de verificación enviado',
            requiresVerification: true
        };
        
    } catch (error) {
        console.error('Phone auth error:', error);
        
        // Reset reCAPTCHA on error
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
        }
        
        throw error;
    }
}

async function authenticateClientWithEmail(email) {
    try {
        // Check if user exists
        const signInMethods = await window.auth.fetchSignInMethodsForEmail(email);
        
        if (signInMethods.length === 0) {
            // Create new user with email
            return await createClientWithEmail(email);
        } else {
            // Send email verification code
            return await sendEmailVerificationCode(email);
        }
    } catch (error) {
        console.error('Email auth error:', error);
        throw error;
    }
}

async function createClientWithEmail(email) {
    // For clients, we use a passwordless approach
    // Generate a temporary password and send verification email
    const tempPassword = generateTempPassword();
    
    try {
        const userCredential = await window.auth.createUserWithEmailAndPassword(email, tempPassword);
        
        // Send email verification
        await userCredential.user.sendEmailVerification();
        
        // Create user profile
        await createUserProfile(userCredential.user.uid, {
            email: email,
            userType: 'client',
            emailVerified: false
        });
        
        return {
            success: true,
            message: 'Cuenta creada. Verifica tu email',
            requiresVerification: true
        };
        
    } catch (error) {
        console.error('Error creating client account:', error);
        throw error;
    }
}

async function sendEmailVerificationCode(email) {
    // For existing users, send a sign-in link
    const actionCodeSettings = {
        url: `${window.location.origin}/cliente/dashboard.html`,
        handleCodeInApp: true
    };
    
    try {
        await window.auth.sendSignInLinkToEmail(email, actionCodeSettings);
        
        // Store email for sign-in completion
        localStorage.setItem('emailForSignIn', email);
        
        return {
            success: true,
            message: 'Enlace de acceso enviado al email',
            requiresVerification: true
        };
        
    } catch (error) {
        console.error('Error sending email link:', error);
        throw error;
    }
}

// 🔥 Admin Authentication Functions - VERSIÓN CORREGIDA
async function loginAdmin(email, password) {
    try {
        console.log('🔄 Iniciando login admin con:', email);
        
        if (!email || !password) {
            throw new Error('Email y contraseña son requeridos');
        }
        
        // Sign in with email and password
        const userCredential = await window.auth.signInWithEmailAndPassword(email, password);
        console.log('✅ Autenticación Firebase exitosa, UID:', userCredential.user.uid);
        
        // Verify admin role - obtener documento de Firestore
        const userDoc = await window.db.collection('users').doc(userCredential.user.uid).get();
        
        console.log('📄 Documento existe:', userDoc.exists);
        
        if (!userDoc.exists) {
            console.log('❌ El documento no existe en Firestore');
            await window.auth.signOut();
            throw new Error('Usuario no encontrado en la base de datos');
        }

        const userData = userDoc.data();
        console.log('📊 Datos completos del usuario:', userData);
        
        // Debugging detallado del userType
        const userType = userData.userType;
        console.log('🔍 userType extraído:', userType);
        console.log('🔍 Tipo de userType:', typeof userType);
        console.log('🔍 userType === "admin":', userType === 'admin');
        
        // Verificación más robusta
        if (!userType || userType.toString().trim() !== 'admin') {
            console.log('🚫 No es admin, valor actual:', userType);
            await window.auth.signOut();
            throw new Error('Acceso no autorizado. Solo administradores pueden acceder');
        }

        console.log('🎉 Admin autenticado correctamente');
        
        return {
            success: true,
            user: userCredential.user,
            profile: userData
        };
        
    } catch (error) {
        console.error('❌ Admin login error:', error);
        throw new Error(getAuthErrorMessage(error.code) || error.message);
    }
}

// Verification Functions
async function verificarCodigo(verificationCode) {
    try {
        showAuthLoading(true);
        
        if (!verificationCode) {
            throw new Error('Código de verificación requerido');
        }
        
        if (confirmationResult) {
            // Phone verification
            const result = await confirmationResult.confirm(verificationCode);
            
            // Create or update user profile
            await createOrUpdateClientProfile(result.user);
            
            return {
                success: true,
                user: result.user
            };
            
        } else {
            // Check if it's an email sign-in link
            const email = localStorage.getItem('emailForSignIn');
            
            if (email && window.auth.isSignInWithEmailLink(window.location.href)) {
                const result = await window.auth.signInWithEmailLink(email, window.location.href);
                
                // Clear stored email
                localStorage.removeItem('emailForSignIn');
                
                await createOrUpdateClientProfile(result.user);
                
                return {
                    success: true,
                    user: result.user
                };
            } else {
                throw new Error('Código de verificación inválido');
            }
        }
        
    } catch (error) {
        console.error('Verification error:', error);
        throw new Error(getAuthErrorMessage(error.code));
    } finally {
        showAuthLoading(false);
    }
}

// User Profile Management
async function createUserProfile(userId, profileData) {
    try {
        const profile = {
            ...profileData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            isActive: true
        };
        
        await window.db.collection(window.COLLECTIONS.USERS).doc(userId).set(profile);
        
        console.log('User profile created:', userId);
        return profile;
        
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
    }
}

async function createOrUpdateClientProfile(user) {
    try {
        const existingProfile = await getUserProfile(user.uid);
        
        if (existingProfile) {
            // Update existing profile
            await updateUserProfile(user.uid, {
                lastLoginAt: firebase.firestore.FieldValue.serverTimestamp(),
                emailVerified: user.emailVerified,
                phoneVerified: !!user.phoneNumber
            });
        } else {
            // Create new client profile
            await createUserProfile(user.uid, {
                email: user.email,
                phoneNumber: user.phoneNumber,
                displayName: user.displayName || '',
                userType: 'client',
                emailVerified: user.emailVerified,
                phoneVerified: !!user.phoneNumber,
                totalPoints: 0,
                totalVisits: 0,
                joinedBusinesses: []
            });
        }
        
    } catch (error) {
        console.error('Error managing client profile:', error);
        throw error;
    }
}

async function getUserProfile(userId) {
    try {
        const userDoc = await window.db.collection(window.COLLECTIONS.USERS).doc(userId).get();
        
        if (userDoc.exists) {
            return { id: userDoc.id, ...userDoc.data() };
        }
        
        return null;
        
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
}

async function updateUserProfile(userId, updates) {
    try {
        await window.db.collection(window.COLLECTIONS.USERS).doc(userId).update({
            ...updates,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('User profile updated:', userId);
        
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}

// Session Management
function updateUserSession(user) {
    const sessionData = {
        uid: user.uid,
        email: user.email,
        phoneNumber: user.phoneNumber,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        lastLoginAt: new Date().toISOString()
    };
    
    sessionStorage.setItem('currentUser', JSON.stringify(sessionData));
    localStorage.setItem('userLoggedIn', 'true');
}

function clearUserSession() {
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('emailForSignIn');
}

function getCurrentUser() {
    try {
        const userData = sessionStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

function isUserLoggedIn() {
    return localStorage.getItem('userLoggedIn') === 'true' && getCurrentUser() !== null;
}

// Sign Out
async function signOut() {
    try {
        await window.auth.signOut();
        clearUserSession();
        
        console.log('User signed out');
        
        // Redirect to login
        window.location.href = '/index.html';
        
    } catch (error) {
        console.error('Sign out error:', error);
        throw error;
    }
}

// Utility Functions
function isEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
}

function formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present (default to Colombia +57)
    if (!cleaned.startsWith('57') && cleaned.length === 10) {
        cleaned = '57' + cleaned;
    }
    
    // Add '+' prefix
    return '+' + cleaned;
}

function generateTempPassword() {
    // Generate a secure temporary password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < 16; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return password;
}

function getAuthErrorMessage(errorCode) {
    const errorMessages = {
        'auth/invalid-phone-number': 'Número de teléfono inválido',
        'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/email-already-in-use': 'El email ya está en uso',
        'auth/weak-password': 'La contraseña es muy débil',
        'auth/invalid-email': 'Email inválido',
        'auth/user-disabled': 'Usuario deshabilitado',
        'auth/network-request-failed': 'Error de conexión',
        'auth/invalid-verification-code': 'Código de verificación inválido',
        'auth/invalid-verification-id': 'ID de verificación inválido',
        'auth/code-expired': 'El código ha expirado',
        'auth/missing-verification-code': 'Código de verificación requerido',
        'auth/missing-verification-id': 'ID de verificación requerido',
        'auth/quota-exceeded': 'Cuota de SMS excedida'
    };
    
    return errorMessages[errorCode] || 'Error de autenticación';
}

function showAuthLoading(show) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = show ? 'flex' : 'none';
    }
}

// Auth State Observers
function onAuthStateChanged(callback) {
    authStateCallbacks.push(callback);
    
    // Call immediately with current state
    if (currentAuthUser !== null) {
        callback(currentAuthUser);
    }
    
    // Return unsubscribe function
    return () => {
        const index = authStateCallbacks.indexOf(callback);
        if (index > -1) {
            authStateCallbacks.splice(index, 1);
        }
    };
}

// Password Reset (for admins)
async function resetPassword(email) {
    try {
        await window.auth.sendPasswordResetEmail(email);
        
        return {
            success: true,
            message: 'Email de recuperación enviado'
        };
        
    } catch (error) {
        console.error('Password reset error:', error);
        throw new Error(getAuthErrorMessage(error.code));
    }
}

// Admin Registration (for initial setup)
async function registerAdmin(email, password, businessData) {
    try {
        // Create admin user
        const userCredential = await window.auth.createUserWithEmailAndPassword(email, password);
        
        // Create admin profile
        await createUserProfile(userCredential.user.uid, {
            email: email,
            userType: 'admin',
            businessId: userCredential.user.uid, // Use user ID as business ID
            emailVerified: false
        });
        
        // Create business profile
        await createBusinessProfile(userCredential.user.uid, businessData);
        
        // Send email verification
        await userCredential.user.sendEmailVerification();
        
        return {
            success: true,
            user: userCredential.user,
            message: 'Cuenta de administrador creada. Verifica tu email'
        };
        
    } catch (error) {
        console.error('Admin registration error:', error);
        throw new Error(getAuthErrorMessage(error.code));
    }
}

async function createBusinessProfile(businessId, businessData) {
    try {
        const profile = {
            ...businessData,
            id: businessId,
            isActive: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            totalClients: 0,
            totalPointsGiven: 0,
            totalRedemptions: 0
        };
        
        await window.db.collection(window.COLLECTIONS.BUSINESSES).doc(businessId).set(profile);
        
        console.log('Business profile created:', businessId);
        return profile;
        
    } catch (error) {
        console.error('Error creating business profile:', error);
        throw error;
    }
}

// Export functions for global use
window.loginCliente = loginCliente;
window.loginAdmin = loginAdmin;
window.verificarCodigo = verificarCodigo;
window.signOut = signOut;
window.getCurrentUser = getCurrentUser;
window.isUserLoggedIn = isUserLoggedIn;
window.onAuthStateChanged = onAuthStateChanged;
window.resetPassword = resetPassword;
window.registerAdmin = registerAdmin;
window.getUserProfile = getUserProfile;
window.updateUserProfile = updateUserProfile;

console.log('Authentication module loaded');