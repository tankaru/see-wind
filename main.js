
function set_notice(text){
    document.getElementById('notice').textContent = text;
}

function init(){
    console.log('init');
    set_notice('windy');
}
window.onload = function (){
    console.log('onload');
    init();
}