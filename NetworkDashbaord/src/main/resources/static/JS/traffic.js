document.addEventListener('DOMContentLoaded', function () {
    const select2 = document.getElementById('select-2');
    let allDevicesData;

    function fetchDataAndRenderChart() {
        fetch('/network/devices')
            .then(response => response.json())
            .then(newAllDevicesData => {
                allDevicesData = newAllDevicesData;
                renderBarChart();
            });
    }

    function renderBarChart() {
        const existingChart = Chart.getChart("barChartCanvas");
          if (existingChart) {
            existingChart.destroy();
          }
        const selectedDeviceTypes = select2.value.split('&').map(type => type.trim());
        const devices = selectedDeviceTypes.includes('All') ? allDevicesData : allDevicesData.filter(device => selectedDeviceTypes.includes(device.devicetype));
        const deviceIds = devices.map(entry => entry.deviceID);
        const inboundTraffic = devices.map(entry => entry.inboundTraffic);
        const outboundTraffic = devices.map(entry => entry.outboundTraffic);

        const ctx = document.getElementById('barChartCanvas').getContext('2d');
        const barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: deviceIds,
                datasets: [{
                        label: 'Inbound',
                        data: inboundTraffic,
                        backgroundColor: 'rgba(0,255,246, 0.9)',
                        borderColor: 'rgba(0,255,246, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Outbound',
                        data: outboundTraffic,
                        backgroundColor: 'rgba(132,0,255, 0.9)',
                        borderColor: 'rgba(132,0,255, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: 'black' // Text color for legend labels
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Device ID',
                            color: 'black'
                        },
                        ticks: {
                            color: 'black' // Text color for x-axis labels
                        }
                    },
                    y: { // Y-axis (traffic values)
                        title: {
                            display: true,
                            text: 'Traffic in Kbps',
                            color: 'black'
                        },
                        ticks: {
                            color: 'black' // Text color for x-axis labels
                        }
                    }
                }
            }
        });
    }

    fetchDataAndRenderChart();

    // Responsiveness

    select2.addEventListener('change', function(){
        fetchDataAndRenderChart();
        renderBarChart();
    });
    window.addEventListener('resize', function () {
        renderBarChart();
    });
});