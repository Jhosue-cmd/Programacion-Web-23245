async function cargarPaises() {
      const url = 'https://restcountries.com/v3.1/all';

      try {
        const respuesta = await fetch(url);
        const paises = await respuesta.json();

        // Orden alfabético
        paises.sort((a, b) => a.name.common.localeCompare(b.name.common));

        const lista = document.getElementById('listaPaises');
        paises.forEach(pais => {
          const item = document.createElement('li');
          item.innerHTML = `<strong>${pais.name.common}</strong> - Capital: ${pais.capital?.[0] || 'Desconocida'}`;
          lista.appendChild(item);
        });
      } catch (error) {
        console.error('Error al cargar países:', error);
      }
    }

    // Ejecutar al cargar la página
    window.addEventListener('DOMContentLoaded', cargarPaises);

    