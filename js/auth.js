// ========================================
// 🔥 AUTENTICACIÓN REAL - REEMPLAZAR EN auth.js
// ========================================

// Configuración reCAPTCHA (reemplaza con tus claves reales)
const RECAPTCHA_SITE_KEY = 'TU_SITE_KEY_AQUI'; // Obtener de Google reCAPTCHA

// Control de intentos y rate limiting
let authAttempts = {};
let codeRequests = {};

// Initialize auth with real configuration
function initializeRealAuth() {
    // Set persistence to LOCAL (sesión no expira hasta cerrar manualmente)
    if (window.auth) {
        window.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                console.log('✅ Persistencia LOCAL configurada');
            })
            .catch(err => console.warn('⚠️ Error configurando persistencia:', err));
        
        // Listen for auth state changes
        window.auth.onAuthStateChanged(handleAuthStateChange);
    }
}

function handleAuthStateChange(user) {
    if (user) {
        console.log('✅ Usuario autenticado:', user.uid);
        // No redirigir automáticamente - mantener en la página actual
        updateUserSession(user);
    } else {
        console.log('❌ Usuario no autenticado');
        clearUserSession();
        
        // Solo redirigir si estamos en páginas protegidas
        const currentPath = window.location.pathname;
        const isProtectedPage = currentPath.includes('/admin/') || currentPath.includes('/cliente/');
        
        if (isProtectedPage && !window.location.pathname.includes('index.html')) {
            window.location.href = '/index.html';
        }
    }
}

// ========================================
// 🔥 FUNCIÓN REAL PARA LOGIN CLIENTE
// ========================================
async function loginClienteReal(contactInfo) {
    try {
        console.log('🔄 Iniciando autenticación real para:', contactInfo);
        
        // Verificar rate limiting
        const rateLimitCheck = checkRateLimit(contactInfo);
        if (!rateLimitCheck.allowed) {
            throw new Error(rateLimitCheck.message);
        }
        
        if (isEmail(contactInfo)) {
            return await authenticateWithEmailReal(contactInfo);
        } else {
            return await authenticateWithPhoneReal(contactInfo);
        }
        
    } catch (error) {
        console.error('❌ Error en autenticación real:', error);
        recordFailedAttempt(contactInfo);
        throw error;
    }
}

// ========================================
// 🔥 AUTENTICACIÓN POR TELÉFONO REAL
// ========================================
async function authenticateWithPhoneReal(phoneNumber) {
    try {
        const formattedPhone = formatPhoneNumber(phoneNumber);
        console.log('📱 Enviando SMS real a:', formattedPhone);
        
        // Configurar reCAPTCHA si no existe
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                'size': 'invisible',
                'callback': function(response) {
                    console.log('✅ reCAPTCHA resuelto');
                },
                'expired-callback': function() {
                    console.warn('⚠️ reCAPTCHA expirado');
                    window.recaptchaVerifier.clear();
                    window.recaptchaVerifier = null;
                }
            });
        }
        
        // Verificar si el usuario ya existe (opcional)
        await checkOrCreatePhoneUser(formattedPhone);
        
        // Enviar SMS real
        window.confirmationResult = await window.auth.signInWithPhoneNumber(
            formattedPhone, 
            window.recaptchaVerifier
        );
        
        // Registrar envío exitoso
        recordCodeRequest(formattedPhone);
        
        console.log('✅ SMS enviado exitosamente a:', formattedPhone);
        
        return {
            success: true,
            message: 'Código de verificación enviado a tu teléfono',
            requiresVerification: true
        };
        
    } catch (error) {
        console.error('❌ Error enviando SMS:', error);
        
        // Limpiar reCAPTCHA en caso de error
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
        }
        
        throw new Error(getDetailedSMSError(error));
    }
}

// ========================================
// 🔥 AUTENTICACIÓN POR EMAIL REAL
// ========================================
async function authenticateWithEmailReal(email) {
    try {
        console.log('📧 Enviando enlace de acceso a:', email);
        
        // Verificar si el usuario existe
        const user = await checkOrCreateEmailUser(email);
        
        // Configurar enlace de sign-in
        const actionCodeSettings = {
            url: `${window.location.origin}/verificar-email.html?email=${encodeURIComponent(email)}`,
            handleCodeInApp: true
        };
        
        // Enviar enlace de acceso
        await window.auth.sendSignInLinkToEmail(email, actionCodeSettings);
        
        // Guardar email para completar sign-in
        localStorage.setItem('emailForSignIn', email);
        
        // Registrar envío exitoso
        recordCodeRequest(email);
        
        return {
            success: true,
            message: 'Enlace de acceso enviado a tu email',
            requiresVerification: true
        };
        
    } catch (error) {
        console.error('❌ Error enviando email:', error);
        throw new Error(getDetailedEmailError(error));
    }
}

// ========================================
// 🔥 VERIFICACIÓN REAL DE CÓDIGOS
// ========================================
async function verificarCodigoReal(verificationCode) {
    try {
        console.log('🔍 Verificando código real:', verificationCode);
        
        if (!verificationCode || verificationCode.length !== 6) {
            throw new Error('El código debe tener 6 dígitos');
        }
        
        let result;
        
        if (window.confirmationResult) {
            // Verificación por SMS
            result = await window.confirmationResult.confirm(verificationCode);
            console.log('✅ SMS verificado exitosamente');
            
        } else {
            // Verificación por email link
            const email = localStorage.getItem('emailForSignIn');
            if (email && window.auth.isSignInWithEmailLink(window.location.href)) {
                result = await window.auth.signInWithEmailLink(email, window.location.href);
                localStorage.removeItem('emailForSignIn');
                console.log('✅ Email verificado exitosamente');
            } else {
                throw new Error('No hay proceso de verificación en curso');
            }
        }
        
        // Crear o actualizar perfil del usuario
        if (result && result.user) {
            await createOrUpdateClientProfileReal(result.user);
            
            // Limpiar intentos fallidos
            clearFailedAttempts(result.user.phoneNumber || result.user.email);
            
            console.log('✅ Usuario autenticado correctamente:', result.user.uid);
            
            return {
                success: true,
                user: result.user,
                redirectTo: '/cliente/dashboard.html'
            };
        }
        
    } catch (error) {
        console.error('❌ Error verificando código:', error);
        recordFailedAttempt(null, 'verification');
        throw new Error(getDetailedVerificationError(error));
    }
}

// ========================================
// 🔥 CONTROL DE RATE LIMITING Y INTENTOS
// ========================================
function checkRateLimit(identifier) {
    const now = Date.now();
    const key = identifier.toLowerCase();
    
    // Verificar intentos fallidos (máximo 3 en 15 minutos)
    if (authAttempts[key]) {
        const attempts = authAttempts[key];
        const recentAttempts = attempts.filter(time => now - time < 15 * 60 * 1000);
        
        if (recentAttempts.length >= 3) {
            const nextAttemptTime = Math.ceil((recentAttempts[0] + 15 * 60 * 1000 - now) / 60000);
            return {
                allowed: false,
                message: `Demasiados intentos fallidos. Espera ${nextAttemptTime} minutos antes de intentar nuevamente.`
            };
        }
    }
    
    // Verificar solicitudes de código (máximo 2 en 5 minutos)
    if (codeRequests[key]) {
        const requests = codeRequests[key];
        const recentRequests = requests.filter(time => now - time < 5 * 60 * 1000);
        
        if (recentRequests.length >= 2) {
            const nextRequestTime = Math.ceil((recentRequests[0] + 5 * 60 * 1000 - now) / 60000);
            return {
                allowed: false,
                message: `Ya enviamos códigos recientemente. Espera ${nextRequestTime} minutos antes de solicitar otro código.`
            };
        }
        
        if (recentRequests.length === 1) {
            const timeSinceLastRequest = Math.ceil((now - recentRequests[0]) / 1000);
            if (timeSinceLastRequest < 60) {
                return {
                    allowed: false,
                    message: `Espera ${60 - timeSinceLastRequest} segundos antes de solicitar otro código.`
                };
            }
        }
    }
    
    return { allowed: true };
}

function recordFailedAttempt(identifier, type = 'auth') {
    if (!identifier) return;
    
    const now = Date.now();
    const key = identifier.toLowerCase();
    
    if (!authAttempts[key]) {
        authAttempts[key] = [];
    }
    
    authAttempts[key].push(now);
    
    // Mantener solo los últimos 5 intentos
    authAttempts[key] = authAttempts[key].slice(-5);
    
    console.log(`❌ Intento fallido registrado para ${key}:`, authAttempts[key].length);
}

function recordCodeRequest(identifier) {
    const now = Date.now();
    const key = identifier.toLowerCase();
    
    if (!codeRequests[key]) {
        codeRequests[key] = [];
    }
    
    codeRequests[key].push(now);
    
    // Mantener solo las últimas 3 solicitudes
    codeRequests[key] = codeRequests[key].slice(-3);
    
    console.log(`📤 Solicitud de código registrada para ${key}`);
}

function clearFailedAttempts(identifier) {
    if (identifier) {
        const key = identifier.toLowerCase();
        delete authAttempts[key];
        delete codeRequests[key];
    }
}

function getRemainingAttempts(identifier) {
    if (!identifier) return 3;
    
    const key = identifier.toLowerCase();
    const now = Date.now();
    
    if (authAttempts[key]) {
        const recentAttempts = authAttempts[key].filter(time => now - time < 15 * 60 * 1000);
        return Math.max(0, 3 - recentAttempts.length);
    }
    
    return 3;
}

// ========================================
// 🔥 MANEJO DE USUARIOS
// ========================================
async function checkOrCreatePhoneUser(phoneNumber) {
    try {
        // Los usuarios de teléfono se crean automáticamente en la verificación
        // Esta función es para logging/preparación
        console.log('📱 Preparando autenticación para:', phoneNumber);
        return true;
    } catch (error) {
        console.error('❌ Error preparando usuario de teléfono:', error);
        return false;
    }
}

async function checkOrCreateEmailUser(email) {
    try {
        const signInMethods = await window.auth.fetchSignInMethodsForEmail(email);
        
        if (signInMethods.length === 0) {
            console.log('👤 Usuario nuevo con email:', email);
        } else {
            console.log('👤 Usuario existente con email:', email);
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error verificando usuario de email:', error);
        return false;
    }
}

async function createOrUpdateClientProfileReal(user) {
    try {
        if (!window.db) {
            console.warn('⚠️ Firestore no disponible');
            return;
        }
        
        const userRef = window.db.collection('users').doc(user.uid);
        const userDoc = await userRef.get();
        
        if (userDoc.exists) {
            // Actualizar usuario existente
            await userRef.update({
                lastLoginAt: firebase.firestore.FieldValue.serverTimestamp(),
                emailVerified: user.emailVerified,
                phoneVerified: !!user.phoneNumber
            });
            console.log('✅ Perfil actualizado:', user.uid);
        } else {
            // Crear nuevo usuario
            const userData = {
                name: user.displayName || user.phoneNumber || user.email || 'Usuario',
                email: user.email || null,
                phoneNumber: user.phoneNumber || null,
                phoneVerified: !!user.phoneNumber,
                emailVerified: user.emailVerified || false,
                userType: 'client',
                totalPoints: 0,
                totalVisits: 0,
                totalRedemptions: 0,
                joinedBusinesses: [],
                isActive: true,
                displayName: user.displayName || user.phoneNumber || user.email || 'Usuario',
                preferences: {
                    language: 'es',
                    notifications: true,
                    theme: 'light'
                },
                registrationSource: user.phoneNumber ? 'phone' : 'email',
                analytics: {
                    averagePointsPerVisit: 0
                },
                avatar: '',
                location: {
                    city: 'Cali',
                    coordinates: {}
                },
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLoginAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await userRef.set(userData);
            console.log('✅ Perfil creado:', user.uid);
        }
    } catch (error) {
        console.error('❌ Error manejando perfil de cliente:', error);
        // No lanzar error para no bloquear el flujo de autenticación
    }
}

// ========================================
// 🔥 MANEJO DE ERRORES DETALLADO
// ========================================
function getDetailedSMSError(error) {
    const errorMessages = {
        'auth/invalid-phone-number': 'El número de teléfono no es válido. Verifica que incluya el código de país (+57).',
        'auth/too-many-requests': 'Demasiadas solicitudes. Intenta nuevamente en unos minutos.',
        'auth/quota-exceeded': 'Se agotó la cuota de SMS. Intenta más tarde o contacta soporte.',
        'auth/captcha-check-failed': 'Verificación de seguridad fallida. Recarga la página e intenta nuevamente.',
        'auth/web-storage-unsupported': 'Tu navegador no soporta almacenamiento web. Habilita las cookies.',
        'auth/app-not-authorized': 'La aplicación no está autorizada para usar Firebase Auth con este dominio.',
        'auth/network-request-failed': 'Error de conexión. Verifica tu internet e intenta nuevamente.'
    };
    
    return errorMessages[error.code] || `Error enviando SMS: ${error.message}`;
}

function getDetailedEmailError(error) {
    const errorMessages = {
        'auth/invalid-email': 'El formato del email no es válido.',
        'auth/user-not-found': 'No encontramos una cuenta con este email.',
        'auth/too-many-requests': 'Demasianas solicitudes. Intenta nuevamente en unos minutos.',
        'auth/network-request-failed': 'Error de conexión. Verifica tu internet e intenta nuevamente.',
        'auth/unauthorized-domain': 'El dominio no está autorizado para enviar emails.'
    };
    
    return errorMessages[error.code] || `Error enviando email: ${error.message}`;
}

function getDetailedVerificationError(error) {
    const errorMessages = {
        'auth/invalid-verification-code': 'El código ingresado no es válido. Verifica que sea correcto.',
        'auth/code-expired': 'El código ha expirado. Solicita uno nuevo.',
        'auth/too-many-requests': 'Demasiados intentos. Espera antes de intentar nuevamente.',
        'auth/session-expired': 'La sesión ha expirado. Solicita un nuevo código.',
        'auth/missing-verification-code': 'Debes ingresar el código de verificación.'
    };
    
    return errorMessages[error.code] || `Error verificando código: ${error.message}`;
}

// ========================================
// 🔥 FUNCIONES DE UTILIDAD
// ========================================
function formatPhoneNumber(phoneNumber) {
    // Limpiar número
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Agregar código de país si no lo tiene (Colombia +57)
    if (!cleaned.startsWith('57') && cleaned.length === 10) {
        cleaned = '57' + cleaned;
    }
    
    // Agregar prefijo +
    return '+' + cleaned;
}

function isEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
}

// ========================================
// 🔥 INICIALIZACIÓN AUTOMÁTICA
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeRealAuth();
});

// ========================================
// 🔥 EXPORTAR FUNCIONES REALES
// ========================================
window.loginCliente = loginClienteReal;
window.verificarCodigo = verificarCodigoReal;
window.getRemainingAttempts = getRemainingAttempts;
window.checkRateLimit = checkRateLimit;

console.log('🔥 Sistema de autenticación REAL inicializado');