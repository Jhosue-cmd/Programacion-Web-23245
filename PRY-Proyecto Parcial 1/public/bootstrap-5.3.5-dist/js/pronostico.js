document.getElementById('buscarClima').addEventListener('click', async () => {
      const ciudad = document.getElementById('ciudad').value;
     const apiKey = '17347ef46f107c1e40a25b82d5ae9cf9';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;


      try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.cod === 200) {
          document.getElementById('resultado').innerHTML = `
            <h3>${datos.name}, ${datos.sys.country}</h3>
            <p>🌡️ Temperatura: ${datos.main.temp} °C</p>
            <p>🌤️ Clima: ${datos.weather[0].description}</p>
          `;
        } else {
          document.getElementById('resultado').innerText = 'Ciudad no encontrada';
        }
      } catch (error) {
        console.error('Error al obtener el clima:', error);
      }
    });