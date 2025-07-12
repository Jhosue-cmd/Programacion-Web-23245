function initAreaChart() {
    const ctxArea = document.getElementById('myAreaChart');
    if (ctxArea) {
        new Chart(ctxArea, {
            type: 'line',
            data: {
                labels: ['2017','2018', '2019', '2020', '2021', '2022','2023'],
                datasets: [{
                    label: 'PIB Ecuador',
                    data: [5.3,1.2,-1.5,-11.8,11.2,7.7,3.6],
                    fill: true,
                    borderColor: 'rgb(23, 20, 18)',
                    backgroundColor: 'rgba(240, 139, 44, 0.2)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'PIB Ecuador (Millones USD)'
                    }
                }
            }
        });
    }
}

// Exportar la función para usarla en cargador_paginas.js
window.initAreaChart = initAreaChart;