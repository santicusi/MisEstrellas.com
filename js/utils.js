// Utility Functions for MisEstrellas
// Common helper functions used across the application

// DOM Utilities
const DOMUtils = {
    // Get element by ID with error handling
    getElementById(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with ID '${id}' not found`);
        }
        return element;
    },
    
    // Show/hide elements
    show(elementOrId) {
        const element = typeof elementOrId === 'string' ? this.getElementById(elementOrId) : elementOrId;
        if (element) element.style.display = 'block';
    },
    
    hide(elementOrId) {
        const element = typeof elementOrId === 'string' ? this.getElementById(elementOrId) : elementOrId;
        if (element) element.style.display = 'none';
    },
    
    toggle(elementOrId) {
        const element = typeof elementOrId === 'string' ? this.getElementById(elementOrId) : elementOrId;
        if (element) {
            element.style.display = element.style.display === 'none' ? 'block' : 'none';
        }
    },
    
    // Add/remove classes
    addClass(elementOrId, className) {
        const element = typeof elementOrId === 'string' ? this.getElementById(elementOrId) : elementOrId;
        if (element) element.classList.add(className);
    },
    
    removeClass(elementOrId, className) {
        const element = typeof elementOrId === 'string' ? this.getElementById(elementOrId) : elementOrId;
        if (element) element.classList.remove(className);
    },
    
    toggleClass(elementOrId, className) {
        const element = typeof elementOrId === 'string' ? this.getElementById(elementOrId) : elementOrId;
        if (element) element.classList.toggle(className);
    },
    
    // Create element with attributes
    createElement(tag, attributes = {}, textContent = '') {
        const element = document.createElement(tag);
        
        Object.keys(attributes).forEach(key => {
            if (key === 'class') {
                element.className = attributes[key];
            } else if (key === 'data') {
                Object.keys(attributes[key]).forEach(dataKey => {
                    element.dataset[dataKey] = attributes[key][dataKey];
                });
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        
        if (textContent) {
            element.textContent = textContent;
        }
        
        return element;
    }
};

// Validation Utilities
const ValidationUtils = {
    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Phone validation (Colombian format)
    isValidPhone(phone) {
        // Remove all non-digits
        const cleaned = phone.replace(/\D/g, '');
        
        // Check Colombian phone formats
        // Mobile: 10 digits (3XX XXX XXXX)
        // With country code: 12 digits (57 3XX XXX XXXX)
        return cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('57'));
    },
    
    // URL validation
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },
    
    // QR code validation
    isValidQRCode(qrData) {
        // Basic QR code format validation
        if (!qrData || typeof qrData !== 'string') return false;
        
        // Check for MisEstrellas QR formats
        const patterns = [
            /^POINTS:[^:]+:[^:]+:\d+$/, // Points QR: POINTS:businessId:qrId:points
            /^USER:[^:]+:\d+$/ // User QR: USER:userId:timestamp
        ];
        
        return patterns.some(pattern => pattern.test(qrData));
    },
    
    // Password strength validation
    validatePasswordStrength(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        const score = [
            password.length >= minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumber,
            hasSpecialChar
        ].filter(Boolean).length;
        
        return {
            isValid: score >= 3,
            score: score,
            feedback: {
                length: password.length >= minLength,
                uppercase: hasUpperCase,
                lowercase: hasLowerCase,
                number: hasNumber,
                special: hasSpecialChar
            }
        };
    }
};

// Storage Utilities
const StorageUtils = {
    // Local Storage helpers
    setLocal(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error setting localStorage:', error);
            return false;
        }
    },
    
    getLocal(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error getting localStorage:', error);
            return defaultValue;
        }
    },
    
    removeLocal(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing localStorage:', error);
            return false;
        }
    },
    
    // Session Storage helpers
    setSession(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error setting sessionStorage:', error);
            return false;
        }
    },
    
    getSession(key, defaultValue = null) {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error getting sessionStorage:', error);
            return defaultValue;
        }
    },
    
    removeSession(key) {
        try {
            sessionStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing sessionStorage:', error);
            return false;
        }
    }
};

// Network Utilities
const NetworkUtils = {
    // Check online status
    isOnline() {
        return navigator.onLine;
    },
    
    // Simple fetch wrapper with timeout
    async fetchWithTimeout(url, options = {}, timeout = 10000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    },
    
    // Retry mechanism for network requests
    async retryRequest(requestFn, maxRetries = 3, delay = 1000) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await requestFn();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                await this.delay(delay * Math.pow(2, i)); // Exponential backoff
            }
        }
    },
    
    // Delay utility
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Date and Time Utilities
const DateUtils = {
    // Format date for display
    formatDisplayDate(date, locale = 'es-ES') {
        if (!date) return '';
        
        const dateObj = date instanceof Date ? date : new Date(date);
        return dateObj.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // Format time for display
    formatDisplayTime(date, locale = 'es-ES') {
        if (!date) return '';
        
        const dateObj = date instanceof Date ? date : new Date(date);
        return dateObj.toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // Get relative time (time ago)
    getRelativeTime(date) {
        if (!date) return '';
        
        const now = new Date();
        const past = date instanceof Date ? date : new Date(date);
        const diff = now - past;
        
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days} día${days > 1 ? 's' : ''}`;
        if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''}`;
        if (minutes > 0) return `${minutes} minuto${minutes > 1 ? 's' : ''}`;
        return 'hace un momento';
    },
    
    // Check if date is today
    isToday(date) {
        const today = new Date();
        const checkDate = date instanceof Date ? date : new Date(date);
        
        return today.toDateString() === checkDate.toDateString();
    },
    
    // Get start and end of day
    getStartOfDay(date = new Date()) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        return start;
    },
    
    getEndOfDay(date = new Date()) {
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        return end;
    }
};

// Device Utilities
const DeviceUtils = {
    // Check if mobile device
    isMobile() {
        return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // Check if tablet
    isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    },
    
    // Check if desktop
    isDesktop() {
        return window.innerWidth > 1024;
    },
    
    // Check if touch device
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    
    // Get device type
    getDeviceType() {
        if (this.isMobile()) return 'mobile';
        if (this.isTablet()) return 'tablet';
        return 'desktop';
    },
    
    // Check camera availability
    async hasCameraSupport() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            return devices.some(device => device.kind === 'videoinput');
        } catch {
            return false;
        }
    }
};

// Animation Utilities
const AnimationUtils = {
    // Smooth scroll to element
    scrollToElement(elementOrId, offset = 0) {
        const element = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
        if (element) {
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    },
    
    // Fade in animation
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                element.style.opacity = progress;
                requestAnimationFrame(animate);
            } else {
                element.style.opacity = '1';
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    // Fade out animation
    fadeOut(element, duration = 300) {
        const start = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                element.style.opacity = startOpacity * (1 - progress);
                requestAnimationFrame(animate);
            } else {
                element.style.opacity = '0';
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    }
};

// Notification Utilities
const NotificationUtils = {
    // Show toast notification
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Add styles
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        
        // Type-specific styles
        const colors = {
            success: '#4CAF50',
            error: '#F44336',
            warning: '#FF9800',
            info: '#2196F3'
        };
        
        toast.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
        
        return toast;
    },
    
    // Show browser notification (requires permission)
    async showBrowserNotification(title, options = {}) {
        if (!('Notification' in window)) {
            console.warn('Browser notifications not supported');
            return false;
        }
        
        if (Notification.permission === 'granted') {
            return new Notification(title, options);
        } else if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                return new Notification(title, options);
            }
        }
        
        return false;
    }
};

// File Utilities
const FileUtils = {
    // Convert file to base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    },
    
    // Resize image
    async resizeImage(file, maxWidth = 800, maxHeight = 600, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and convert to blob
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    },
    
    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};

// Performance Utilities
const PerformanceUtils = {
    // Debounce function
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },
    
    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Measure execution time
    measureTime(name, func) {
        const start = performance.now();
        const result = func();
        const end = performance.now();
        console.log(`${name} took ${end - start} milliseconds`);
        return result;
    }
};

// Export all utilities for global use
window.DOMUtils = DOMUtils;
window.ValidationUtils = ValidationUtils;
window.StorageUtils = StorageUtils;
window.NetworkUtils = NetworkUtils;
window.DateUtils = DateUtils;
window.DeviceUtils = DeviceUtils;
window.AnimationUtils = AnimationUtils;
window.NotificationUtils = NotificationUtils;
window.FileUtils = FileUtils;
window.PerformanceUtils = PerformanceUtils;

// Additional global utility functions
window.formatFileSize = FileUtils.formatFileSize;
window.showToast = NotificationUtils.showToast;
window.debounce = PerformanceUtils.debounce;
window.throttle = PerformanceUtils.throttle;

console.log('Utilities module loaded');

