function generate_box(){
    const parent = document.getElementById('boxes');
    let scene = document.querySelector('a-scene');

    for (let i = 0; i < 10; i++){
        let latitude = 35.43494;
        let longitude = 139.61281;

        let model = document.createElement('a-box');
        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        model.setAttribute('rotation', '0 180 0');
        model.setAttribute('animation-mixer', '');
        model.setAttribute('position', `0 ${30-i*3} 0`);


        /*
        model.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });
        */

        scene.appendChild(model);
    }


}

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
    generate_box();


}
window.onload = function (){
    console.log('onload');
    init();
}