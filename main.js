let wind_speed;
let wind_direction;

let direction = {};
const directions_text = `0	No wind	無風
1	N	北
2	NNE	北北東
3	NE	北東
4	ENE	東北東
5	E	東
6	ESE	東南東
7	SE	南東
8	SSE	南南東
9	S	南
10	SSW	南南西
11	SW	南西
12	WSW	西南西
13	W	西
14	WNW	西北西
15	NW	北西
16	NNW	北北西`;
const directions_lines = directions_text.split('\n');
for (let line of directions_lines){
    const items = line.split('\t');
    direction[items[0]] = items[1];
}


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

        set_coords_info(`Latitude: ${latitude}, Longitude: ${longitude}`);
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
    window.addEventListener('deviceorientation', function(event) {
        console.log('方角       : ' + event.alpha);
        console.log('上下の傾き : ' + event.beta);
        console.log('左右の傾き : ' + event.gamma);
        
        console.log('コンパスの向き : ' + event.webkitCompassHeading);
        console.log('コンパスの精度 : ' + event.webkitCompassAccuracy);
        const elem = document.getElementById('compass');
        elem.setAttribute('text', `value: ${event.alpha};`);

        update_particle_direction(parseInt(event.alpha));
      });
}
function rad(deg){
    return deg/360 * 2 * Math.PI;
}
function set_particle(elem_id, D, L, alpha, beta){
    const y0 = 10;
    const y1 = y0, y2 = y0;

    const x1 = D * Math.sin(rad(alpha));
    const z1 = D * Math.cos(rad(alpha));

    const x2 = x1 - L * Math.sin(rad(beta));
    const z2 = z1 - L * Math.cos(rad(beta));

    const elem = document.getElementById(elem_id);
    elem.setAttribute('position', `${x1} ${y1} ${z1}`);
    elem.setAttribute('animation',`property: position; to: ${x2} ${y2} ${z2}; dir: normal; easing: linear; dur: 5000; loop: true`);
}

let fixed_alpha = 0;
function update_particle_direction(alpha){
    const D = 10;
    const L = 20;
    const beta = (parseInt(wind_direction)-1)*360/16;
    
    if (Math.abs(alpha - fixed_alpha) > 5){
        set_particle('wind_particle', D, L, alpha, beta);
        fixed_alpha = alpha;
    }
    
}

function update_particle_direction_test(){
    const D = 10;
    const L = 20;
    let alpha = 50;
    const beta = 30;
    
    
    setInterval(() => {
        set_particle('wind_particle', D, L, alpha, beta);
        console.log("Interval type1");
        alpha += 1;
    }, 1000);

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
        wind_speed = json[location].wind[0];
        wind_direction = json[location].windDirection[0];
        //console.log(json);
        console.log(wind_speed);
        set_wind_info(`Now: ${current_time}\n wind: ${wind_speed} m/s\n direction: ${direction[wind_direction]}`);


        //update_particle_direction_test();

        /*
        const elem = document.getElementById('wind_particle');
        const x = 0, y = 3, z = -5;
        const durs = 2; //s
        const dx = wind * durs;
        elem.setAttribute('position', `${x} ${y} ${z}`);
        elem.setAttribute('animation', `property: position; to: ${x+dx} ${y} ${z}; dir: normal; easing: linear; dur: ${durs}000; loop: true`);
        */

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