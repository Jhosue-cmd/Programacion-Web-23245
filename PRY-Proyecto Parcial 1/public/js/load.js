fetch('./views/inicio.html')
    .then(res => res.text())
    .then(data => document.getElementById('main').innerHTML = data)

fetch('./views/crear_perfil.html')
    .then(res => res.text())
    .then(data => document.getElementById('main').innerHTML = data)

fetch('./views/ver_perfil.html')
    .then(res => res.text())
    .then(data => document.getElementById('main').innerHTML = data)

function cambiarPagina(url) {
    //url=views/nombre_stio.html
    fetch(url)
        .then(res => res.text())
        .then(data => document.getElementById('main').innerHTML = data)

}

window.onload = () => cambiarPagina('./views/inicio.html');