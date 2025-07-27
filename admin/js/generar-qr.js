async function crearQRPuntos(puntos, businessId) {
    const qrData = {
        type: 'POINTS',
        businessId: businessId,
        points: puntos,
        code: generateUniqueCode(),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutos
        used: false
    };
    
    const docRef = await db.collection('qr_codes').add(qrData);
    return { id: docRef.id, ...qrData };
}