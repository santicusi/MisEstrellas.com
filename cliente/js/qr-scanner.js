async function processQRCode(qrData, userId) {
    console.log('Processing QR code:', qrData, 'for user:', userId);
    
    try {
        // 1. Validar formato del QR
        if (!ValidationUtils.isValidQRCode(qrData)) {
            throw new Error('Código QR inválido');
        }
        
        // 2. Parsear datos del QR
        const qrParts = qrData.split(':');
        
        if (qrParts[0] !== 'POINTS' || qrParts.length !== 4) {
            throw new Error('Formato de QR no válido');
        }
        
        const [type, businessId, qrId, points] = qrParts;
        const pointsToAdd = parseInt(points);
        
        if (isNaN(pointsToAdd) || pointsToAdd <= 0) {
            throw new Error('Cantidad de puntos inválida');
        }
        
        // 3. Verificar que el QR existe y no ha expirado
        const qrDoc = await db.collection('qr_codes').doc(qrId).get();
        
        if (!qrDoc.exists) {
            throw new Error('Código QR no encontrado');
        }
        
        const qrCodeData = qrDoc.data();
        
        // Verificar si ya fue usado
        if (qrCodeData.used) {
            throw new Error('Este código QR ya fue utilizado');
        }
        
        // Verificar si expiró
        const now = new Date();
        const expiresAt = qrCodeData.expiresAt?.toDate();
        
        if (expiresAt && now > expiresAt) {
            throw new Error('Este código QR ha expirado');
        }
        
        // Verificar que coincida el businessId
        if (qrCodeData.businessId !== businessId) {
            throw new Error('Código QR no válido para este negocio');
        }
        
        // 4. Obtener información del negocio
        const businessDoc = await db.collection('businesses').doc(businessId).get();
        
        if (!businessDoc.exists) {
            throw new Error('Negocio no encontrado');
        }
        
        const businessData = businessDoc.data();
        
        // 5. Procesar la transacción usando una transacción de Firestore
        await db.runTransaction(async (transaction) => {
            // Marcar QR como usado
            transaction.update(qrDoc.ref, {
                used: true,
                usedBy: userId,
                usedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Crear registro de transacción
            const transactionRef = db.collection('transactions').doc();
            transaction.set(transactionRef, {
                userId: userId,
                businessId: businessId,
                type: 'earned',
                points: pointsToAdd,
                description: `Puntos ganados en ${businessData.name}`,
                status: 'completed',
                qrCodeId: qrId,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Actualizar estadísticas del negocio
            const analyticsRef = db.collection('analytics').doc(businessId);
            const analyticsDoc = await transaction.get(analyticsRef);
            
            if (analyticsDoc.exists) {
                transaction.update(analyticsRef, {
                    pointsGiven: firebase.firestore.FieldValue.increment(pointsToAdd),
                    totalTransactions: firebase.firestore.FieldValue.increment(1),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            // Actualizar contador del negocio
            transaction.update(businessDoc.ref, {
                totalPointsGiven: firebase.firestore.FieldValue.increment(pointsToAdd),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
        
        console.log('QR processed successfully');
        
        // 6. Retornar resultado exitoso
        return {
            success: true,
            business: {
                name: businessData.name,
                image: businessData.image
            },
            stars: pointsToAdd,
            message: `¡Ganaste ${pointsToAdd} puntos en ${businessData.name}!`
        };
        
    } catch (error) {
        console.error('Error processing QR code:', error);
        
        return {
            success: false,
            message: error.message || 'Error procesando código QR'
        };
    }
}

async function cargarClientes(businessId) {
    const snapshot = await db.collection('transactions')
        .where('businessId', '==', businessId)
        .get();
    
    // Agrupar por usuario y calcular totales
    return processedClients;
}