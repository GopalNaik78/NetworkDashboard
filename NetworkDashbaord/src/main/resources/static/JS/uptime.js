document.addEventListener('DOMContentLoaded', function () {
    const select7 = document.getElementById('select-7');

    function addSelectOptions(selectorId) {
        const selector = document.querySelector(selectorId);
        selector.innerHTML = `<option value="Router" selected="selected">Router</option>
                                <option value="Switch">Switch</option>
                                <option value="Server">Server</option>
                                <option value="Router & Switch">Router & Switch</option>
                                <option value="Router & Server">Router & Server</option>
                                <option value="Switch & Server">Switch & Server</option>
                                <option value="All">All</option>`;
    }
    addSelectOptions('#select-7');

    function getAllDevicesHealth() {
        return fetch('/network/get-health')
            .then(response => response.json());
    }

    function renderBar2Chart(avgUptime, selectedDeviceTypes) {
        const existingChart = Chart.getChart('bar2Chart');
        if (existingChart) {
            existingChart.destroy();
        }
        const ctx = document.getElementById('bar2Chart').getContext('2d');
        const devices = selectedDeviceTypes.includes('All') ? avgUptime : avgUptime.filter(device => selectedDeviceTypes.includes(device.devicetype));
        const deviceIds = devices.map(device => device.deviceID);
        const averageUptime = devices.map(entry => entry.uptime);
        const barColors = averageUptime.map(uptime => uptime > 80 ? 'green' : 'red');

        const uptimeBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: deviceIds,
                datasets: [{
                    data: averageUptime,
                    backgroundColor: barColors,
                    borderColor: barColors,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100, // Assuming uptime is a percentage
                        title: {
                            display: true,
                            text: 'Average Uptime (%)',
                            color:'black',

                        },
                        ticks: {
                            color: 'black'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Device ID',
                            color:'black'
                        },
                        ticks: {
                            color: 'black'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }



   fetch('/network/average-uptime').then(response => response.json())
        .then(newAvgUptime => {
            avgUptime = newAvgUptime;
            renderBar2Chart(avgUptime,select7.value.split('&').map(type => type.trim()));
        });

    select7.addEventListener('change', function(){
        fetch('/network/average-uptime').then(response => response.json())
        .then(newAvgUptime => {
            avgUptime = newAvgUptime;
            renderBar2Chart(avgUptime,select7.value.split('&').map(type => type.trim()));
        });
    });
});