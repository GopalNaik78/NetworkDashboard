document.addEventListener('DOMContentLoaded', function () {
    const select5 = document.getElementById('select-5');

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
    addSelectOptions('#select-5');

    function getAllDevicesHealth() {
        return fetch('/network/get-health')
            .then(response => response.json());
    }

    function renderLineChart(lineChartId, allDevicesData, flotData, yAxis, label, selectedDeviceTypes) {
        const devices = selectedDeviceTypes.includes('All') ? allDevicesData : allDevicesData.filter(device => selectedDeviceTypes.includes(device.devicetype));
        const existingChart = Chart.getChart(lineChartId);
        if (existingChart) {
            existingChart.destroy();
        }
        const ctx = document.getElementById(lineChartId).getContext("2d");
        flotData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // Extract device IDs
        const deviceIds = devices.map(device => device.deviceID);
        // Create a dataset for each device
        const datasets = deviceIds.map(deviceId => ({
            label: `Device ${deviceId}`,
            data: flotData
                .filter(entry => entry.deviceID === deviceId)
                .map(entry => ({
                    x: new Date(entry.timestamp),
                    y: entry[yAxis]
                })),
            borderColor: getRandomColor(), // Function to generate random colors
            borderWidth: 2,
            fill: false,
        }));

        new Chart(ctx, {
            type: 'line',
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
                            color: 'black',
                            callback: function (value, index, values) {
                                // Display date only at midnight (12 AM)
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
                            display: true,
                            text: label,
                            color: 'black',

                        },
                        ticks: {
                            color: 'black',

                        }
                    }
                },

            }
        });
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    Promise.all([
              fetch('/network/devices').then(response => response.json()),
              fetch('/network/get-health').then(response => response.json())
          ]).then(([newAllDevicesData, newHealthData]) => {
              allDevicesData = newAllDevicesData;
              healthData = newHealthData;
              renderLineChart('lineChart-2', allDevicesData, healthData, 'throughput', 'Throughput (Mbps)', select5.value.split('&').map(type => type.trim()));
          });

    select5.addEventListener('change', function(){
          Promise.all([
              fetch('/network/devices').then(response => response.json()),
              fetch('/network/get-health').then(response => response.json())
          ]).then(([newAllDevicesData, newHealthData]) => {
              allDevicesData = newAllDevicesData;
              healthData = newHealthData;
              renderLineChart('lineChart-2', allDevicesData, healthData, 'throughput', 'Throughput (Mbps)', select5.value.split('&').map(type => type.trim()));
          });
      });
});