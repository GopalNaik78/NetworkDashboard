document.addEventListener('DOMContentLoaded', function () {
    const select6 = document.getElementById('select-6');

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
    addSelectOptions('#select-6');

    function getAllDevicesHealth() {
        return fetch('/network/get-health')
            .then(response => response.json());
    }

    function renderScatterPlot(ScatterPlotId, allDevicesData, flotData, selectedDeviceTypes) {
        const existingChart = Chart.getChart(ScatterPlotId);
        if (existingChart) {
            existingChart.destroy();
        }
        const ctx = document.getElementById(ScatterPlotId).getContext("2d");
        flotData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const devices = selectedDeviceTypes.includes('All') ? allDevicesData : allDevicesData.filter(device => selectedDeviceTypes.includes(device.devicetype));
        const deviceIds = devices.map(device => device.deviceID);
        const datasets = deviceIds.map(deviceId => {
            const deviceData = flotData.filter(entry => entry.deviceID === deviceId);
            const bgColors = deviceData.map(entry => entry.latency > 50 ? 'red' : 'green');

            return {
                label: `Device ${deviceId}`,
                data: deviceData.map(entry => ({
                    x: new Date(entry.timestamp),
                    y: entry.latency,
                })),
                borderColor: bgColors,
                backgroundColor: bgColors,
                pointBackgroundColor: bgColors,
                pointRadius: 5,
                borderWidth: 1,
                fill: false,
            };
        });

        new Chart(ctx, {
            type: 'scatter',
            legend: {
                display: false,
            },
            data: {
                datasets: datasets,
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        position: 'bottom',
                        time: {
                            unit: 'hour',
                            parser: 'YYYY-MM-DDTHH:mm:ssZ',
                            tooltipFormat: 'MMM D, YYYY HH:mm:ss',
                            displayFormats: {
                                hour: 'HH:mm',
                                day: 'MMM D, YYYY',
                            },
                        },
                        ticks: {
                            color:'black',
                            callback: function (value, index, values) {
                                if (new Date(value).getHours() === 0) {
                                    return new Date(value).toLocaleDateString();
                                } else {
                                    return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                }
                            },
                            maxTicksLimit: 15,
                        },
                    },
                    y: {
                        title: {
                            color:'black',
                            display: true,
                            text: 'Latency (ms)',
                        },
                        ticks: {
                            color: 'black' // Set the text color for the ticks
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                    }
                }
            }
        });
    }

    Promise.all([
            fetch('/network/devices').then(response => response.json()),
            fetch('/network/get-health').then(response => response.json())
        ]).then(([newAllDevicesData, newHealthData]) => {
            allDevicesData = newAllDevicesData;
            healthData = newHealthData;
            renderScatterPlot('scatterPlot', allDevicesData, healthData, select6.value.split('&').map(type => type.trim()));
        }); 
        
    select6.addEventListener('change', function(){
        Promise.all([
            fetch('/network/devices').then(response => response.json()),
            fetch('/network/get-health').then(response => response.json())
        ]).then(([newAllDevicesData, newHealthData]) => {
            allDevicesData = newAllDevicesData;
            healthData = newHealthData;
            renderScatterPlot('scatterPlot', allDevicesData, healthData, select6.value.split('&').map(type => type.trim()));
        });
    });
});