// Translations Module for MisEstrellas
// Bilingual support system (Spanish/English)

const translations = {
    es: {
        // Common terms
        'brand_name': 'MisEstrellas',
        'loading': 'Cargando...',
        'error': 'Error',
        'success': '¡Éxito!',
        'continue': 'Continuar',
        'cancel': 'Cancelar',
        'save': 'Guardar',
        'delete': 'Eliminar',
        'edit': 'Editar',
        'close': 'Cerrar',
        'back': 'Atrás',
        'next': 'Siguiente',
        'previous': 'Anterior',
        'confirm': 'Confirmar',
        'try_again': 'Intentar de nuevo',
        'search': 'Buscar',
        'filter': 'Filtrar',
        'clear': 'Limpiar',
        'refresh': 'Actualizar',
        'logout': 'Cerrar Sesión',
        
        // Login & Authentication
        'login': 'Iniciar sesión',
        'client': 'Cliente',
        'admin': 'Administrador',
        'phone': 'Teléfono',
        'email': 'Correo',
        'password': 'Contraseña',
        'phone_or_email': 'Teléfono o Email',
        'verification_code': 'Código de verificación',
        'verification_sent': 'Código enviado a tu teléfono/email',
        'use_email': 'Usar Email',
        'use_phone': 'Usar Teléfono',
        'enter_contact': 'Ingresa tu teléfono o email',
        'enter_code': 'Ingresa el código de verificación',
        'enter_credentials': 'Ingresa email y contraseña',
        'confirm_logout': '¿Estás seguro que deseas cerrar sesión?',
        
        // Dashboard
        'dashboard': 'Dashboard',
        'welcome': 'Bienvenido',
        'my_stars': 'Mis Estrellas',
        'overview': 'Resumen General',
        'recent_activity': 'Actividad Reciente',
        'quick_actions': 'Acciones Rápidas',
        'no_recent_activity': 'No hay actividad reciente',
        
        // Statistics
        'unique_clients': 'Clientes únicos',
        'recurring_clients': 'Clientes recurrentes',
        'active_clients': 'Clientes activos',
        'new_clients': 'Clientes nuevos',
        'total_clients': 'Total clientes',
        'active_this_month': 'Activos este mes',
        'total_stars': 'Estrellas totales',
        'visited_businesses': 'Negocios visitados',
        'this_month': 'Este mes',
        'total_visits': 'Visitas totales',
        'last_visit': 'Última visita',
        'member_since': 'Miembro desde',
        'statistics': 'Estadísticas',
        'total_customers': 'Total clientes',
        'total_points_given': 'Puntos otorgados',
        'total_redemptions': 'Canjes realizados',
        
        // QR Code functionality
        'scan_qr': 'Escanear QR',
        'generate_qr': 'Generar Código QR',
        'qr_placeholder': 'El código QR aparecerá aquí',
        'create_qr': 'Crear QR',
        'generating_qr': 'Generando código QR...',
        'regenerate': 'Regenerar',
        'expires_in': 'Expira en',
        'qr_expired': 'El código QR ha expirado',
        'qr_refreshed': 'Código QR actualizado',
        'refresh_qr': 'Actualizar QR',
        'personal_qr': 'Tu Código QR Personal',
        'qr_description': 'Los negocios pueden escanear este código para darte puntos',
        'scan_client_qr': 'Escanear QR del Cliente',
        'scanning_qr': 'Buscando código QR...',
        'qr_detected': 'Código QR detectado',
        'scanning': 'Buscando código QR...',
        'processing': 'Procesando...',
        'invalid_qr': 'Código QR inválido',
        'processing_error': 'Error al procesar código QR',
        'invalid_client_qr': 'Código QR de cliente inválido',
        
        // Stars and Points
        'stars': 'estrellas',
        'points': 'puntos',
        'stars_earned': 'estrellas ganadas',
        'give_stars': 'Dar Estrellas',
        'select_points': 'Seleccionar Puntos',
        'points_to_give': 'Puntos a otorgar',
        'points_to_redeem': 'Puntos a canjear',
        'redeem_points': 'Canjear Puntos',
        'redeem': 'Canjear',
        'no_stars': 'No tienes estrellas',
        'start_collecting': 'Comienza a coleccionar estrellas visitando nuestros negocios asociados',
        'points_given_to': 'puntos otorgados a',
        'points_redeemed_successfully': 'Puntos canjeados exitosamente',
        'invalid_redeem_amount': 'Cantidad de canje inválida',
        'confirm_redeem_points': '¿Confirmas el canje de {points} puntos para {client}?',
        
        // Business related
        'business': 'Negocio',
        'business_map': 'Mapa de Negocios',
        'business_profile': 'Perfil del Negocio',
        'business_info': 'Información del Negocio',
        'business_name': 'Nombre del negocio',
        'business_description': 'Descripción del negocio',
        'business_hours': 'Horarios de atención',
        'find_businesses': 'Encontrar Negocios',
        'search_businesses': 'Buscar negocios...',
        'loading_map': 'Cargando mapa...',
        'map_placeholder': 'Mapa se cargará aquí con Google Maps API',
        'map_note': 'Integrar con Google Maps JavaScript API',
        'your_location': 'Tu ubicación',
        'directions': 'Ir al negocio',
        'call': 'Llamar',
        'info': 'Información',
        'configuration': 'Configuración',
        'point_value': 'Valor por punto (en pesos colombianos)',
        'point_value_help': 'Valor monetario que representa cada punto de fidelización',
        'google_maps_url': 'URL de Google Maps',
        'maps_url_help': 'Enlace directo a tu ubicación en Google Maps',
        'test_url': 'Probar enlace',
        'description_help': 'Descripción que verán los clientes',
        'enter_maps_url': 'Ingresa la URL de Google Maps',
        'invalid_maps_url': 'URL de Google Maps inválida',
        'configuration_saved': 'Configuración guardada exitosamente',
        'invalid_point_value': 'Valor por punto debe estar entre 1 y 10,000',
        
        // Client management
        'clients': 'Clientes',
        'manage_clients': 'Gestionar Clientes',
        'search_clients': 'Buscar clientes...',
        'view_client_history': 'Ver historial y gestionar puntos',
        'no_clients': 'No hay clientes',
        'no_clients_message': 'Aún no tienes clientes registrados en tu negocio',
        'sort_by_name': 'Ordenar por nombre',
        'sort_by_points': 'Ordenar por puntos',
        'sort_by_recent': 'Más recientes',
        'sort_by_frequent': 'Más frecuentes',
        
        // Map and Navigation
        'map': 'Mapa',
        'profile': 'Perfil',
        'address': 'Dirección',
        'location_error': 'Error obteniendo ubicación',
        'map_error': 'Error cargando el mapa',
        'businesses_error': 'Error cargando negocios',
        'feature_coming_soon': 'Función próximamente disponible',
        
        // Profile
        'personal_info': 'Información Personal',
        'name': 'Nombre',
        'change_photo': 'Cambiar Foto',
        'select_from_gallery': 'Seleccionar de la galería',
        'take_photo': 'Tomar foto',
        'change_business_image': 'Cambiar Imagen del Negocio',
        'image_updated': 'Imagen actualizada exitosamente',
        'profile_updated': 'Perfil actualizado exitosamente',
        'name_required': 'El nombre es requerido',
        'invalid_file_type': 'Tipo de archivo inválido',
        'file_too_large': 'Archivo demasiado grande (máx. 5MB)',
        'image_guidelines': 'Recomendaciones:',
        'image_size': 'Tamaño recomendado: 800x600 píxeles',
        'image_format': 'Formato: JPG, PNG o WebP',
        'image_quality': 'Imagen clara y bien iluminada',
        'image_content': 'Que represente tu negocio',
        
        // Camera and Scanner
        'flip_camera': 'Cambiar Cámara',
        'flash': 'Flash',
        'camera_error': 'Error accediendo a la cámara',
        'camera_permission_error': 'Error de permisos de cámara',
        'camera_flip_error': 'Error cambiando cámara',
        
        // Instructions
        'instructions': 'Instrucciones',
        'instruction_1': 'Apunta la cámara hacia el código QR',
        'instruction_2': 'Asegúrate de que el código esté dentro del marco',
        'instruction_3': 'Mantén la cámara estable hasta que se detecte',
        'instruction_select': 'Selecciona la cantidad de puntos a otorgar',
        'instruction_generate': 'Genera el código QR haciendo clic en "Crear QR"',
        'instruction_scan': 'El cliente debe escanear el código con su aplicación',
        'instruction_confirm': 'Confirma la transacción cuando aparezca la notificación',
        
        // Transactions
        'transaction_history': 'Historial de Transacciones',
        'no_transactions': 'No hay transacciones',
        'error_loading': 'Error al cargar historial',
        'confirm_transaction': 'Confirmar Transacción',
        'transaction_completed': 'Transacción completada exitosamente',
        
        // Time and dates
        'monday': 'Lunes',
        'tuesday': 'Martes',
        'wednesday': 'Miércoles',
        'thursday': 'Jueves',
        'friday': 'Viernes',
        'saturday': 'Sábado',
        'sunday': 'Domingo',
        'closed': 'Cerrado',
        
        // Notifications
        'notifications': 'Notificaciones',
        'no_notifications': 'No hay notificaciones',
        
        // Actions and buttons
        'save_changes': 'Guardar Cambios',
        'reset': 'Restablecer',
        'contact_support': 'Contacta soporte para cambios',
        
        // Error messages
        'firebase_not_configured': 'Firebase no configurado correctamente'
    },
    
    en: {
        // Common terms
        'brand_name': 'MyStars',
        'loading': 'Loading...',
        'error': 'Error',
        'success': 'Success!',
        'continue': 'Continue',
        'cancel': 'Cancel',
        'save': 'Save',
        'delete': 'Delete',
        'edit': 'Edit',
        'close': 'Close',
        'back': 'Back',
        'next': 'Next',
        'previous': 'Previous',
        'confirm': 'Confirm',
        'try_again': 'Try again',
        'search': 'Search',
        'filter': 'Filter',
        'clear': 'Clear',
        'refresh': 'Refresh',
        'logout': 'Sign Out',
        
        // Login & Authentication
        'login': 'Sign in',
        'client': 'Client',
        'admin': 'Administrator',
        'phone': 'Phone',
        'email': 'Email',
        'password': 'Password',
        'phone_or_email': 'Phone or Email',
        'verification_code': 'Verification code',
        'verification_sent': 'Code sent to your phone/email',
        'use_email': 'Use Email',
        'use_phone': 'Use Phone',
        'enter_contact': 'Enter your phone or email',
        'enter_code': 'Enter verification code',
        'enter_credentials': 'Enter email and password',
        'confirm_logout': 'Are you sure you want to sign out?',
        
        // Dashboard
        'dashboard': 'Dashboard',
        'welcome': 'Welcome',
        'my_stars': 'My Stars',
        'overview': 'Overview',
        'recent_activity': 'Recent Activity',
        'quick_actions': 'Quick Actions',
        'no_recent_activity': 'No recent activity',
        
        // Statistics
        'unique_clients': 'Unique clients',
        'recurring_clients': 'Recurring clients',
        'active_clients': 'Active clients',
        'new_clients': 'New clients',
        'total_clients': 'Total clients',
        'active_this_month': 'Active this month',
        'total_stars': 'Total stars',
        'visited_businesses': 'Visited businesses',
        'this_month': 'This month',
        'total_visits': 'Total visits',
        'last_visit': 'Last visit',
        'member_since': 'Member since',
        'statistics': 'Statistics',
        'total_customers': 'Total customers',
        'total_points_given': 'Points given',
        'total_redemptions': 'Redemptions made',
        
        // QR Code functionality
        'scan_qr': 'Scan QR',
        'generate_qr': 'Generate QR Code',
        'qr_placeholder': 'QR code will appear here',
        'create_qr': 'Create QR',
        'generating_qr': 'Generating QR code...',
        'regenerate': 'Regenerate',
        'expires_in': 'Expires in',
        'qr_expired': 'QR code has expired',
        'qr_refreshed': 'QR code refreshed',
        'refresh_qr': 'Refresh QR',
        'personal_qr': 'Your Personal QR Code',
        'qr_description': 'Businesses can scan this code to give you points',
        'scan_client_qr': 'Scan Client QR',
        'scanning_qr': 'Looking for QR code...',
        'qr_detected': 'QR code detected',
        'scanning': 'Looking for QR code...',
        'processing': 'Processing...',
        'invalid_qr': 'Invalid QR code',
        'processing_error': 'Error processing QR code',
        'invalid_client_qr': 'Invalid client QR code',
        
        // Stars and Points
        'stars': 'stars',
        'points': 'points',
        'stars_earned': 'stars earned',
        'give_stars': 'Give Stars',
        'select_points': 'Select Points',
        'points_to_give': 'Points to give',
        'points_to_redeem': 'Points to redeem',
        'redeem_points': 'Redeem Points',
        'redeem': 'Redeem',
        'no_stars': 'No stars yet',
        'start_collecting': 'Start collecting stars by visiting our partner businesses',
        'points_given_to': 'points given to',
        'points_redeemed_successfully': 'Points redeemed successfully',
        'invalid_redeem_amount': 'Invalid redemption amount',
        'confirm_redeem_points': 'Confirm redemption of {points} points for {client}?',
        
        // Business related
        'business': 'Business',
        'business_map': 'Business Map',
        'business_profile': 'Business Profile',
        'business_info': 'Business Information',
        'business_name': 'Business name',
        'business_description': 'Business description',
        'business_hours': 'Business hours',
        'find_businesses': 'Find Businesses',
        'search_businesses': 'Search businesses...',
        'loading_map': 'Loading map...',
        'map_placeholder': 'Map will load here with Google Maps API',
        'map_note': 'Integrate with Google Maps JavaScript API',
        'your_location': 'Your location',
        'directions': 'Get directions',
        'call': 'Call',
        'info': 'Information',
        'configuration': 'Configuration',
        'point_value': 'Value per point (in Colombian pesos)',
        'point_value_help': 'Monetary value that each loyalty point represents',
        'google_maps_url': 'Google Maps URL',
        'maps_url_help': 'Direct link to your location on Google Maps',
        'test_url': 'Test link',
        'description_help': 'Description that clients will see',
        'enter_maps_url': 'Enter Google Maps URL',
        'invalid_maps_url': 'Invalid Google Maps URL',
        'configuration_saved': 'Configuration saved successfully',
        'invalid_point_value': 'Point value must be between 1 and 10,000',
        
        // Client management
        'clients': 'Clients',
        'manage_clients': 'Manage Clients',
        'search_clients': 'Search clients...',
        'view_client_history': 'View history and manage points',
        'no_clients': 'No clients',
        'no_clients_message': 'You don\'t have any registered clients in your business yet',
        'sort_by_name': 'Sort by name',
        'sort_by_points': 'Sort by points',
        'sort_by_recent': 'Most recent',
        'sort_by_frequent': 'Most frequent',
        
        // Map and Navigation
        'map': 'Map',
        'profile': 'Profile',
        'address': 'Address',
        'location_error': 'Error getting location',
        'map_error': 'Error loading map',
        'businesses_error': 'Error loading businesses',
        'feature_coming_soon': 'Feature coming soon',
        
        // Profile
        'personal_info': 'Personal Information',
        'name': 'Name',
        'change_photo': 'Change Photo',
        'select_from_gallery': 'Select from gallery',
        'take_photo': 'Take photo',
        'change_business_image': 'Change Business Image',
        'image_updated': 'Image updated successfully',
        'profile_updated': 'Profile updated successfully',
        'name_required': 'Name is required',
        'invalid_file_type': 'Invalid file type',
        'file_too_large': 'File too large (max 5MB)',
        'image_guidelines': 'Recommendations:',
        'image_size': 'Recommended size: 800x600 pixels',
        'image_format': 'Format: JPG, PNG or WebP',
        'image_quality': 'Clear and well-lit image',
        'image_content': 'That represents your business',
        
        // Camera and Scanner
        'flip_camera': 'Flip Camera',
        'flash': 'Flash',
        'camera_error': 'Error accessing camera',
        'camera_permission_error': 'Camera permission error',
        'camera_flip_error': 'Error flipping camera',
        
        // Instructions
        'instructions': 'Instructions',
        'instruction_1': 'Point the camera towards the QR code',
        'instruction_2': 'Make sure the code is within the frame',
        'instruction_3': 'Keep the camera steady until detected',
        'instruction_select': 'Select the amount of points to give',
        'instruction_generate': 'Generate the QR code by clicking "Create QR"',
        'instruction_scan': 'The client must scan the code with their app',
        'instruction_confirm': 'Confirm the transaction when the notification appears',
        
        // Transactions
        'transaction_history': 'Transaction History',
        'no_transactions': 'No transactions',
        'error_loading': 'Error loading history',
        'confirm_transaction': 'Confirm Transaction',
        'transaction_completed': 'Transaction completed successfully',
        
        // Time and dates
        'monday': 'Monday',
        'tuesday': 'Tuesday',
        'wednesday': 'Wednesday',
        'thursday': 'Thursday',
        'friday': 'Friday',
        'saturday': 'Saturday',
        'sunday': 'Sunday',
        'closed': 'Closed',
        
        // Notifications
        'notifications': 'Notifications',
        'no_notifications': 'No notifications',
        
        // Actions and buttons
        'save_changes': 'Save Changes',
        'reset': 'Reset',
        'contact_support': 'Contact support for changes',
        
        // Error messages
        'firebase_not_configured': 'Firebase not configured properly'
    }
};

// Translation utility functions
function t(key, replacements = {}) {
    const lang = getCurrentLanguage();
    let translation = translations[lang][key] || translations['es'][key] || key;
    
    // Replace placeholders
    Object.keys(replacements).forEach(placeholder => {
        const regex = new RegExp(`{${placeholder}}`, 'g');
        translation = translation.replace(regex, replacements[placeholder]);
    });
    
    return translation;
}

function getCurrentLanguage() {
    return localStorage.getItem('lang') || 'es';
}

function changeLanguage(lang) {
    if (!translations[lang]) {
        console.warn(`Language ${lang} not supported, defaulting to Spanish`);
        lang = 'es';
    }
    
    localStorage.setItem('lang', lang);
    updateLanguageButtons();
    updateTexts();
    
    console.log(`Language changed to: ${lang}`);
}

function updateLanguageButtons() {
    const currentLang = getCurrentLanguage();
    
    // Update language toggle buttons
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        const btnLang = btn.id.replace('lang-', '');
        btn.classList.toggle('active', btnLang === currentLang);
    });
}

function updateTexts() {
    const currentLang = getCurrentLanguage();
    
    // Update all elements with data-translate attribute
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = translations[currentLang][key] || translations['es'][key] || key;
        
        if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email' || element.type === 'tel')) {
            // Update placeholder for input elements
            if (element.hasAttribute('data-translate-placeholder')) {
                const placeholderKey = element.getAttribute('data-translate-placeholder');
                element.placeholder = translations[currentLang][placeholderKey] || translations['es'][placeholderKey] || placeholderKey;
            } else {
                element.placeholder = translation;
            }
        } else {
            // Update text content for other elements
            element.textContent = translation;
        }
    });
    
    // Update elements with data-translate-placeholder attribute
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        const translation = translations[currentLang][key] || translations['es'][key] || key;
        element.placeholder = translation;
    });
    
    // Update title if it has a translation
    const titleKey = document.querySelector('title')?.getAttribute('data-translate');
    if (titleKey) {
        document.title = translations[currentLang][titleKey] || translations['es'][titleKey] || titleKey;
    }
    
    // Update language-specific content visibility
    updateLanguageSpecificContent(currentLang);
}

function updateLanguageSpecificContent(lang) {
    // Hide/show language-specific elements
    const langElements = document.querySelectorAll('[data-lang]');
    langElements.forEach(element => {
        const elementLang = element.getAttribute('data-lang');
        element.style.display = elementLang === lang ? '' : 'none';
    });
}

// Initialize translations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set default language if not set
    if (!localStorage.getItem('lang')) {
        // Detect browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const lang = browserLang.startsWith('en') ? 'en' : 'es';
        localStorage.setItem('lang', lang);
    }
    
    updateLanguageButtons();
    updateTexts();
    
    console.log('Translations initialized');
});

// Format functions for different languages
const formatters = {
    currency: {
        es: (amount) => `$${amount.toLocaleString('es-CO')} COP`,
        en: (amount) => `$${amount.toLocaleString('en-US')} COP`
    },
    
    date: {
        es: (date) => new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        en: (date) => new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    },
    
    time: {
        es: (date) => new Date(date).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        }),
        en: (date) => new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    },
    
    number: {
        es: (number) => number.toLocaleString('es-ES'),
        en: (number) => number.toLocaleString('en-US')
    }
};

function formatCurrency(amount) {
    const lang = getCurrentLanguage();
    return formatters.currency[lang](amount);
}

function formatDate(date) {
    const lang = getCurrentLanguage();
    return formatters.date[lang](date);
}

function formatTime(date) {
    const lang = getCurrentLanguage();
    return formatters.time[lang](date);
}

function formatNumber(number) {
    const lang = getCurrentLanguage();
    return formatters.number[lang](number);
}

// Time ago function with translations
function formatTimeAgo(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = now - then;
    const lang = getCurrentLanguage();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (lang === 'es') {
        if (minutes < 1) return 'hace un momento';
        if (minutes < 60) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
        if (hours < 24) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
        return `hace ${days} día${days > 1 ? 's' : ''}`;
    } else {
        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
}

// Export functions for global use
window.t = t;
window.changeLanguage = changeLanguage;
window.getCurrentLanguage = getCurrentLanguage;
window.updateTexts = updateTexts;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.formatNumber = formatNumber;
window.formatTimeAgo = formatTimeAgo;

console.log('Translations module loaded');

