
function set_coords_info(text){
    const elem = document.getElementById('location_coords');
    elem.setAttribute('value', text);
}

function init(){
    console.log('init');
    set_coords_info('hogehogehoge');


}
window.onload = function (){
    console.log('onload');
    init();
}