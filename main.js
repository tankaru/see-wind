

let current_lat;
let current_lon;
let amedas_json;
let initial_compass;

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

function update_wind_shape(){
    if (!current_lon) return;
    if (!current_lat) return;
    if (!amedas_json) return;
    if (!initial_compass) return;

    const wind = get_nearest_wind(current_lat, current_lon, amedas_json);
    console.log(wind);
    document.getElementById('location_info').insertAdjacentHTML('beforebegin', wind.name);
    set_notice(`wind: ${wind.wind_speed} m/s\ndirection: ${direction[wind.wind_direction]} \ninit compass: ${initial_compass}`);

    /*
    const elem = document.getElementById('wind_shape');
    //elem.setAttribute('rotation', "0 150 0");
    elem.setAttribute('rotation', `0 ${360 - parseInt(Math.max(parseInt(wind.wind_direction)-1, 0)*360/16)} 0`);
    //set_notice(`${wind_direction} ${parseInt(Math.max(parseInt(wind_direction)-1, 0)*360/16)}`);
    //elem.setAttribute('scale', `1 1 ${parseInt(wind_speed)}`);
    */

    
    let scene = document.querySelector('a-scene');
    let model = document.createElement('a-obj-model');
    model.setAttribute('id', "wind_shape");
    model.setAttribute('gps-entity-place', `latitude: ${current_lat+0.00001}; longitude: ${current_lon+0.00001};`);
    model.setAttribute('src', "#arrow-obj");
    model.setAttribute('mtl', "#arrow-mtl");
    //model.setAttribute('scale', `1 1 ${parseFloat(wind.wind_speed)}`);
    model.setAttribute('scale', `1 1 1`);
    model.setAttribute('position', "0 30 0");
    model.setAttribute('rotation', `0 ${parseInt(360 - initial_compass)} 0`);
    //model.setAttribute('rotation', `0 ${parseInt(360 - Math.max(parseInt(wind.wind_direction)-1, 0)*360/16)} 0`);

    scene.appendChild(model);
    /*
    const model = document.getElementById('wind_shape');
    model.setAttribute('gps-entity-place', `latitude: ${current_lat+0.00001}; longitude: ${current_lon+0.00001};`);
    */


}

function NN(n){
    return ("00" + n).slice(-2);
}

function get_current_weather(){

    let d = new Date();
    d.setMinutes(d.getMinutes() - 15); //時刻変更直後はファイルが更新されていなさそうなので15分前の時刻で取得
    const current_time = `${d.getFullYear()}${NN(d.getMonth() + 1)}${NN(d.getDate())}${NN(d.getHours())}0000`;
    const URL = `https://www.jma.go.jp/bosai/amedas/data/map/${current_time}.json`;
    console.log(URL);

    const request = new XMLHttpRequest();
    request.addEventListener("load", (e) => {
        if (e.target.status != 200) {
            console.log(e.target.status + ':' + e.target.statusText);
            return;
        }
        const json = JSON.parse(e.target.responseText);
        amedas_json = json;
        //console.log(JSON.stringify(json, null, 4));



        update_wind_shape();

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
function get_location() {
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        current_lat = latitude;
        current_lon = longitude;

        //set_location_info(`Latitude: ${latitude} \n Longitude: ${longitude}`);

        update_wind_shape();
    }

    function error() {
        set_location_info('Unable to retrieve your location');
    }

    if (!navigator.geolocation) {
        set_location_info('Geolocation is not supported by your browser');
    } else {
        set_location_info('Locating...');
        navigator.geolocation.getCurrentPosition(success, error);
    }

    let first_time = true;
    window.addEventListener('deviceorientation', function(event) {
        console.log('方角       : ' + event.alpha);
        console.log('上下の傾き : ' + event.beta);
        console.log('左右の傾き : ' + event.gamma);
        
        console.log('コンパスの向き : ' + event.webkitCompassHeading);
        console.log('コンパスの精度 : ' + event.webkitCompassAccuracy);

        const compass_heading_str = parseInt(((event.webkitCompassHeading+360/16/2)%360)/(360/16)+1) + '';
        set_device_info(`compass: ${direction[compass_heading_str]}`);

        if (!event.webkitCompassHeading) return;
        if (first_time){
            /*
            //https://stackoverflow.com/questions/53459247/ar-js-trying-to-synchronize-scene-to-compass-north
            const compassdir = event.webkitCompassHeading;// however you get the compass reading
            const model = document.getElementById('wind_shape');
            let rotation = model.getAttribute('rotation');
            rotation.y = THREE.Math.degToRad(-compassdir);
            model.setAttribute('rotation', "0 90 0");
            */
            initial_compass = event.webkitCompassHeading;
            first_time = false;
            update_wind_shape();
        }

        


      });
}
function set_notice(text){
    document.getElementById('weather_info').innerHTML = `<pre>${text}</pre>`;
}
function set_device_info(text){
    document.getElementById('device_info').innerHTML = `<pre>${text}</pre>`;
}
function set_location_info(text){
    console.log(text);

    //document.getElementById('location_info').innerHTML = `<pre>${text}</pre>`;
}
//404 Motivation Not Found, 地球上の2地点間の距離を取得するアルゴリズム(ヒュベニ or 球面三角法)比較, https://tech-blog.s-yoshiki.com/2018/05/92/
function hubeny(lat1, lng1, lat2, lng2) {
    function rad(deg) {
        return deg * Math.PI / 180;
    }
    //degree to radian
    lat1 = rad(lat1);
    lng1 = rad(lng1);
    lat2 = rad(lat2);
    lng2 = rad(lng2);

    // 緯度差
    var latDiff = lat1 - lat2;
    // 経度差算
    var lngDiff = lng1 - lng2;
    // 平均緯度
    var latAvg = (lat1 + lat2) / 2.0;
    // 赤道半径
    var a = 6378137.0;
    // 極半径
    var b = 6356752.314140356;
    // 第一離心率^2
    var e2 = 0.00669438002301188;
    // 赤道上の子午線曲率半径
    var a1e2 = 6335439.32708317;

    var sinLat = Math.sin(latAvg);
    var W2 = 1.0 - e2 * (sinLat * sinLat);

    // 子午線曲率半径M
    var M = a1e2 / (Math.sqrt(W2) * W2);
    // 卯酉線曲率半径
    var N = a / Math.sqrt(W2);

    const t1 = M * latDiff;
    const t2 = N * Math.cos(latAvg) * lngDiff;
    return Math.sqrt((t1 * t1) + (t2 * t2));
}
function get_nearest_wind(lat, lon, amedas_data){
    let wind_list = [];
    for (let key in amedas){
        const obserber = amedas[key];
        const obs_lat = obserber.lat[0] + obserber.lat[1]/60;
        const obs_lon = obserber.lon[0] + obserber.lon[1]/60;
        const distance = hubeny(lat, lon, obs_lat, obs_lon);
        wind_list.push({
            id : key,
            name: obserber.kjName,
            distance: distance,
        });
    }
    wind_list.sort(function(a,b){
        if( a.distance < b.distance ) return -1;
        if( a.distance > b.distance ) return 1;
        return 0;
    });

    for (let i = 0; i < wind_list.length; i++){
        const wind = wind_list[i];
        const location = wind.id;
        if (!amedas_data[location].wind) continue;
        if (!amedas_data[location].windDirection) continue;
        return {
            id: wind.id,
            name: wind.name,
            wind_speed: amedas_data[location].wind[0],
            wind_direction: amedas_data[location].windDirection[0],
        };

    }

}

function init(){
    console.log('init');
    set_notice('windy');
    get_current_weather();
    get_location();
}
window.onload = function (){
    console.log('onload');
    init();
}