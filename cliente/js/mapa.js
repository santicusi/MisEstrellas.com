// En cliente/js/mapa.js
function initGoogleMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 3.4516, lng: -76.5320 }, // Cali
        zoom: 13
    });
    
    // Cargar negocios desde Firebase
    loadBusinessesOnMap(map);
}