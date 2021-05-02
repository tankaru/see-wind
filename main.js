
function set_coords_info(text){
    const elem = document.getElementById('location_coords');
    elem.setAttribute('value', text);
}
function show_coords() {
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        set_coords_info(`Latitude: ${latitude} °, Longitude: ${longitude} °`);
    }

    function error() {
        set_coords_info('Unable to retrieve your location');
    }

    if (!navigator.geolocation) {
        set_coords_info('Geolocation is not supported by your browser');
    } else {
        set_coords_info('Locating...');
        navigator.geolocation.getCurrentPosition(success, error);
    }
}
function init(){
    console.log('init');
    show_coords();


}
window.onload = function (){
    console.log('onload');
    init();
}