function initBarChart() {
    const ctxBar = document.getElementById('myBarChart');
    if (ctxBar) {
        new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: ['Ecuador', 'Filipinas', 'Libia', 'Panama', 'Mongolia', 'Turquía'],
                datasets: [{
                    label: 'PIB 2024 (Miles de millones USD)',
                    data: [2.4, 5.2, 10.2, 7.4, 7.4, 5.1],
                    backgroundColor: [
                        'rgba(255, 205, 86, 0.8)',   // Ecuador
                        'rgba(54, 162, 235, 0.8)',   // Colombia
                        'rgba(255, 99, 132, 0.8)',   // Perú
                        'rgba(75, 192, 192, 0.8)',   // Chile
                        'rgba(153, 102, 255, 0.8)',  // Argentina
                        'rgba(255, 159, 64, 0.8)'    // Brasil
                    ],
                    borderColor: [
                        'rgb(255, 205, 86)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 99, 132)',
                        'rgb(75, 192, 192)',
                        'rgb(153, 102, 255)',
                        'rgb(255, 159, 64)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Miles de millones USD'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Comparación PIB Países Sudamericanos 2023'
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Exportar la función para usarla en cargador_paginas.js
window.initBarChart = initBarChart;