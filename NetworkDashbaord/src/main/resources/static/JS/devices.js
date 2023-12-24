document.addEventListener("DOMContentLoaded", function () {
    const select1 = document.getElementById("select-1");
    const select3 = document.getElementById("select-3");
    var urlParams = new URLSearchParams(window.location.search);
    let DeviceID = urlParams.get('imgId');

    fetch("/network/devices-ids")
      .then((response) => response.json())
      .then((devicesIds) => {
        devicesIds.forEach((deviceId) => {
          const option = document.createElement("option");
          option.value = deviceId;
          option.text = `Device ${deviceId}`;
          if (deviceId == DeviceID) {
            option.selected = "selected";
          }
          select1.add(option);
        });
      });

    function addBasic(deviceId) {
      const basic = document.querySelector(".basicInfo");
      const img1 = document.querySelector(".img1");
      fetch(`/network/deviceInfo/${deviceId}`)
        .then((response) => response.json())
        .then((deviceData) => {
          basic.innerHTML = `ID        : ${deviceData.deviceID} <br>
          Name             : ${deviceData.devicename}<br>
          Type             : ${deviceData.devicetype}<br>
          IPAddress        : ${deviceData.ipaddress}<br>
          Inbound Traffic   : ${deviceData.inboundTraffic} (Kbps)<br>
          Outbound traffic  : ${deviceData.outboundTraffic} (Kbps)<br>
          Status           : ${deviceData.devicestatus}`;
          img1.innerHTML = `<img class="divImg" src="/images/${deviceData.devicetype.toLowerCase()}.png" alt="${
            deviceData.devicetype
          }">`;
        });
    }

    function renderDonutChart(chartId, alertData) {
      const existingChart = Chart.getChart(chartId);
      if (existingChart) {
        existingChart.destroy();
      }
      const data = {
        labels: [
          "Critical-Active",
          "Warning-Active",
          "Critical-Solved",
          "Warning-Solved",
        ],
        datasets: [
          {
            data: [
              alertData.criticalAct,
              alertData.warningAct,
              alertData.criticalSol,
              alertData.warningSol,
            ], // Adjust the values as needed
            backgroundColor: ["red", "orange", "rgb(0, 234, 255)", "green"], // Adjust colors as needed
            // borderColor:black,
            borderWidth: 1,
          },
        ],
      }; // Configuration for the chart
      const options = {
        animation: {
          duration: 2000,
          animateRotate: true,
          animateScale: true,
        },
        cutout: 52,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true, // Disable tooltip on hover
          },
        },
        responsive: true, // Make the chart responsive
      };

      const ctx = document.getElementById(chartId).getContext("2d");
      const doughnutChart = new Chart(ctx, {
        type: "doughnut",
        data: data,
        options: options,
      });
    }

    function addAlertChart(deviceId) {
      const chartInfo = document.querySelector(".alert-chartInfo");
      chartInfo.innerHTML ="";
      fetch(`/network/alertInfo/${deviceId}`)
        .then((response) => response.json())
        .then((alertData) => {
          renderDonutChart("alert-chart1", alertData);
          chartInfo.innerHTML = `<div>
          <div class="status"><div class="box red-box"></div>Critical-Active : ${alertData.criticalAct}</div> 
          <div class="status"><div class="box orange-box"></div>Warning-Active   : ${alertData.warningAct}</div>
          <div class="status"><div class="box blue-box"></div>Critical-Solved  : ${alertData.criticalSol}</div>
          <div class="status"><div class="box green-box"></div>Warning-Solved   : ${alertData.warningSol}</div>
         </div>`;
        });
    }

    

    function renderTrafficLineChart(deviceId) {
      const existingChart = Chart.getChart("lineChart-0");
      if (existingChart) {
        existingChart.destroy();
      }
      const ctx = document.getElementById("lineChart-0").getContext("2d");

      fetch(`/network/traffic/${deviceId}`)
        .then((response) => response.json())
        .then((trafficData) => {
          const datasets = [
            {
              label: "Inbound Traffic",
              data: trafficData.map((entry) => ({
                x: new Date(entry.timestamp),
                y: entry.inboundtraffic,
              })),
              borderColor: "rgba(0,255,246, 0.9)",
              borderWidth: 2,
              fill: false,
            },
            {
              label: "Outbound Traffic",
              data: trafficData.map((entry) => ({
                x: new Date(entry.timestamp),
                y: entry.outboundtraffic,
              })),
              borderColor: "rgba(132,0,255, 0.9)",
              borderWidth: 2,
              fill: false,
            },
          ];
          new Chart(ctx, {
            type: "line",
            data: {
              datasets: datasets,
            },
            options: {
              scales: {
                x: {
                  type: "time",
                  position: "bottom",
                  time: {
                    unit: "hour",
                    parser: "YYYY-MM-DDTHH:mm:ssZ",
                    tooltipFormat: "MMM D, YYYY HH:mm:ss",
                    displayFormats: {
                      hour: "HH:mm",
                      day: "MMM D, YYYY",
                    },
                  },
                  ticks: {
                    color: "black",
                    callback: function (value, index, values) {
                      // Display date only at midnight (12 AM)
                      if (new Date(value).getHours() === 0) {
                        return new Date(value).toLocaleDateString();
                      } else {
                        return new Date(value).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                      }
                    },
                    maxTicksLimit: 15,
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Traffic",
                    color: "black",
                  },
                  ticks: {
                    color: "black",
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    color: "black", // Set the text color of the legend items
                  },
                },
              },
            },
          });
        });
    }
    

    function makeAlertTable1(deviceId, selectedDeviceTypes) {
      fetch(`/network/alert-table/${deviceId}`)
        .then((response) => response.json())
        .then((allAlertsRow) => {
          const allAlerts = selectedDeviceTypes.includes("All")
            ? allAlertsRow
            : allAlertsRow.filter((alert) => {
                const isReviewStatusMatch = selectedDeviceTypes.includes(
                  alert.reviewstatus
                );
                const isStatusMatch = selectedDeviceTypes.includes(
                  alert.status
                );
                if (selectedDeviceTypes.length === 1)
                  return isReviewStatusMatch || isStatusMatch;
                else return isReviewStatusMatch && isStatusMatch;
              });
          const tableBody = document.querySelector(".Alert-table tbody");
          tableBody.innerHTML = "";
          allAlerts.forEach((alert) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                    <td>${alert.alertID}</td>
                    <td>${alert.deviceid}</td>
                    <td>${alert.message}</td>
                    <td>${alert.status}</td>
                    <td>${alert.reviewstatus}</td>
                `;
            tableBody.appendChild(row);
          });
        });
    }
    
    function renderLineChart(lineChartId, flotData, yAxis, label) {
      const existingChart = Chart.getChart(lineChartId);
      if (existingChart) {
        existingChart.destroy();
      }
      const ctx = document.getElementById(lineChartId).getContext("2d");

      // Extract device IDs
      // const deviceIds = devices.map((device) => device.deviceID);
      // Create a dataset for each device

      const datasets = [{
        label: yAxis,
        data: flotData.map((entry) => ({
          x: new Date(entry.timestamp),
          y: entry[yAxis],
        })),
        borderColor: "rgba(0,255,246, 0.9)",
        borderWidth: 2,
        fill: false,
      }];

      new Chart(ctx, {
        type: "line",
        data: {
          datasets: datasets,
        },
        options: {
          scales: {
            x: {
              type: "time",
              position: "bottom",
              time: {
                unit: "hour",
                parser: "YYYY-MM-DDTHH:mm:ssZ",
                tooltipFormat: "MMM D, YYYY HH:mm:ss",
                displayFormats: {
                  hour: "HH:mm",
                  day: "MMM D, YYYY",
                },
              },
              ticks: {
                color: "black",
                callback: function (value, index, values) {
                  // Display date only at midnight (12 AM)
                  if (new Date(value).getHours() === 0) {
                    return new Date(value).toLocaleDateString();
                  } else {
                    return new Date(value).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  }
                },
                maxTicksLimit: 15,
              },
            },
            y: {
              title: {
                display: true,
                text: label,
                color: "black",
              },
              ticks: {
                color: "black",
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }

    function loadAllCharts(){
      addBasic(DeviceID);
    addAlertChart(DeviceID);
    renderTrafficLineChart(DeviceID);
    makeAlertTable1(DeviceID,select3.value.split("&").map((type) => type.trim()));

    fetch(`/network/get-packet/${DeviceID}`)
      .then((response) => response.json())
      .then((packetLossData) => {
        renderLineChart(
          "lineChart-1",
          packetLossData,
          "packetLossRate",
          "Packet Loss Rate (%)"
        );
      });
      fetch(`/network/get-throughput/${DeviceID}`)
      .then((response) => response.json())
      .then((throughputData) => {
        renderLineChart(
          "lineChart-2",
          throughputData,
          "throughput",
          "Throughput (Mbps)"
        );
      });
      fetch(`/network/get-latency/${DeviceID}`)
      .then((response) => response.json())
      .then((latencyData) => {
        renderLineChart(
          "lineChart-3",
          latencyData,
          "latency",
          "latency (ms)"
        );
      });
      fetch(`/network/get-uptime/${DeviceID}`)
      .then((response) => response.json())
      .then((uptimeData) => {
        renderLineChart(
          "lineChart-4",
          uptimeData,
          "uptime",
          "uptime (%)"
        );
      });
    }
    loadAllCharts();

      select1.addEventListener('change', function(){
        DeviceID=select1.value;
        loadAllCharts();
      });
      select3.addEventListener('change', function(){
        makeAlertTable1(DeviceID,select3.value.split("&").map((type) => type.trim()));
      });
  });