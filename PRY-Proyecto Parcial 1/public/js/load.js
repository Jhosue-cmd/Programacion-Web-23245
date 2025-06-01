function cambiarPagina(url) {
    fetch(url)
        .then(res => res.text())
        .then(data => {
            document.getElementById('main').innerHTML = data;
            if (typeof agregarCancionInit === 'function') agregarCancionInit();
        });
}

