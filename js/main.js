

const body = document.getElementsByTagName('body')[0];
//console.log(body);
body.addEventListener('touchstart', function(event) {

}, false);
body.addEventListener('touchend', function(event) {

}, false);


body.addEventListener('click', function(event) {

}, false);


function set_wind_info(text){
    const elem = document.getElementById('wind_info');
    elem.setAttribute('text', `value: ${text};`);
}

function set_coords_info(text){
    const elem = document.getElementById('location_coords');
    elem.setAttribute('text', `value: ${text};`);
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

function NN(n){
    return ("00" + n).slice(-2);
}

function show_current_weather(){

    const d = new Date();
    const current_time = `${d.getFullYear()}${NN(d.getMonth() + 1)}${NN(d.getDate())}${NN(d.getHours())}0000`;
    const URL = `https://www.jma.go.jp/bosai/amedas/data/map/${current_time}.json`;

    const request = new XMLHttpRequest();
    request.addEventListener("load", (e) => {
        if (e.target.status != 200) {
            console.log(e.target.status + ':' + e.target.statusText);
            return;
        }
        const json = JSON.parse(e.target.responseText);
        //console.log(JSON.stringify(json, null, 4));
        const location = "11001";
        const wind = json[location].wind[0];
        const wind_direction = json[location].windDirection[0];
        //console.log(json);
        console.log(wind);
        set_wind_info(`Now: ${current_time}\n wind: ${wind}\n direction: ${wind_direction}`);

        const elem = document.getElementById('wind_particle');
        const x = 0, y = 3, z = -5;
        const durs = 2; //s
        const dx = wind * durs;
        elem.setAttribute('position', `${x} ${y} ${z}`);
        elem.setAttribute('animation', `property: position; to: ${x+dx} ${y} ${z}; dir: normal; easing: linear; dur: ${durs}000; loop: true`);

    });
    request.addEventListener("error", () => {
        console.log("Http Request Error");
    });

    request.open("GET", URL);
    //request.open("GET", URL + encodeURIComponent(Query[0] + strings[0] + Query[1] + strings[strings.length - 1] + Query[2]));
    request.send();
}

function init(){
    console.log('init');

    show_current_weather();
    show_coords();

}
window.onload = function (){
    console.log('onload');
    init();
}