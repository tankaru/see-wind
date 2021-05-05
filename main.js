let wind_speed = 0;
let wind_direction = 1;

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
    const elem = document.getElementById('wind_shape');
    //elem.setAttribute('rotation', `0 ${parseInt(Math.max(parseInt(wind_direction)-1, 0)*360/16)} 0`);
    elem.setAttribute('scale', `1 1 ${parseInt(wind_speed)}`);
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
        //console.log(JSON.stringify(json, null, 4));
        const location = "11001";
        wind_speed = json[location].wind[0];
        wind_direction = json[location].windDirection[0];
        //console.log(json);
        console.log(wind_speed);
        
        set_notice(`Now: ${current_time}\n wind: ${wind_speed} m/s\n direction: ${direction[wind_direction]}`);


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

function set_notice(text){
    document.getElementById('notice').innerHTML = `<pre>${text}</pre>`;
}

function init(){
    console.log('init');
    set_notice('windy');
    get_current_weather();
}
window.onload = function (){
    console.log('onload');
    init();
}