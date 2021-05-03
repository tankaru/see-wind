function generate_box(){
    const parent = document.getElementById('boxes');
    for (let i = 0; i < 10; i++){
        const html = `
            <a-box 
                id="wind_particle_${i}" 
                position="0 ${30-i*3} 0" 
                radius="10" 
                color="#ff0000" 
                gps-entity-place="latitude: 35.43494; longitude: 139.61281;" 
                animation="property: rotation; to: 0 360 720; loop: true; dur: 5000; dir: alternate; easing: easeInOutSine;">
            </a-box>
        `;
        parent.insertAdjacentHTML('beforeend', html);

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