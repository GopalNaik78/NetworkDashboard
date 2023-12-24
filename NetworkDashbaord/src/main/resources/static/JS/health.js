document.addEventListener('DOMContentLoaded', function () {
    const select4 = document.getElementById('select-4');
    const select5 = document.getElementById('select-5');
    const select6 = document.getElementById('select-6');
    const select7 = document.getElementById('select-7');
    function addSelectOptions(selectorId){
        const selector = document.querySelector(selectorId);
        selector.innerHTML=`<option value="Router" selected="selected">Router</option>
                            <option value="Switch">Switch</option>
                            <option value="Server">Server</option>
                            <option value="Router & Switch">Router & Switch</option>
                            <option value="Router & Server">Router & Server</option>
                            <option value="Switch & Server">Switch & Server</option>
                            <option value="All">All</option>`;
    }
    addSelectOptions('#select-4');
    addSelectOptions('#select-5');
    addSelectOptions('#select-6');
    addSelectOptions('#select-7');

    function getAllDevicesHealth() {
        return fetch('/network/get-health')
            .then(response => response.json());
    }

    function renderLineChart(lineChartId,allDevicesData, flotData, yAxis,label, selectedDeviceTypes) {
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
            legend: {
                display: false, // Set display property to false to hide the legend for this dataset
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
                            color:'black'
                        },
                        ticks: {
                            color: 'black' // Set the text color for the ticks
                        }
                    }
                },
                plugins:{
                    legend: {
                        display: false, // Set display property to false to hide the legend
                    }
                }
            }
        });
    }

    // Add this function to generate random colors
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    //ScatterPlot
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

    Promise.all([
        fetch('/network/devices').then(response => response.json()),
        fetch('/network/get-health').then(response => response.json())
    ]).then(([newAllDevicesData, newHealthData]) => {
        allDevicesData = newAllDevicesData;
        healthData = newHealthData;
        renderLineChart('lineChart-1', allDevicesData, healthData, 'packetlossrate', 'Packet Loss Rate (%)', select4.value.split('&').map(type => type.trim()));
        renderLineChart('lineChart-2', allDevicesData, healthData, 'throughput', 'Throughput (Mbps)', select5.value.split('&').map(type => type.trim()));

    });
    Promise.all([
            fetch('/network/devices').then(response => response.json()),
            fetch('/network/get-health').then(response => response.json())
        ]).then(([newAllDevicesData, newHealthData]) => {
            allDevicesData = newAllDevicesData;
            healthData = newHealthData;
            renderScatterPlot('scatterPlot', allDevicesData, healthData, select6.value.split('&').map(type => type.trim()));
        });
    fetch('/network/average-uptime').then(response => response.json())
        .then(newAvgUptime => {
            avgUptime = newAvgUptime;
            renderBar2Chart(avgUptime,select7.value.split('&').map(type => type.trim()));
        });

    select4.addEventListener('change', function () {
        Promise.all([
            fetch('/network/devices').then(response => response.json()),
            fetch('/network/get-health').then(response => response.json())
        ]).then(([newAllDevicesData, newHealthData]) => {

            allDevicesData = newAllDevicesData;
            healthData = newHealthData;
            renderLineChart('lineChart-1', allDevicesData, healthData, 'packetlossrate', 'Packet Loss Rate (%)', select4.value.split('&').map(type => type.trim()));
        });
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
    select7.addEventListener('change', function(){
        fetch('/network/average-uptime').then(response => response.json())
        .then(newAvgUptime => {
            avgUptime = newAvgUptime;
            renderBar2Chart(avgUptime,select7.value.split('&').map(type => type.trim()));
        });
    });
});