document.addEventListener("DOMContentLoaded", function () {
    function setImgIdAndNavigate(event) {
    // Prevent the default link behavior to stop the immediate navigation
    event.preventDefault();

    // Get the clicked image ID
    const clickedImgId = event.target.id;

    // Construct the URL with the image ID as a parameter
    const newUrl = `/index/single?imgId=${clickedImgId}`;

    // Navigate to the new URL
    window.location.href = newUrl;
    }

    let allDevicesContainer = document.querySelector(".all-Divs");
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
    addSelectOptions("#select-4");
    addSelectOptions("#select-5");
    addSelectOptions("#select-6");
    addSelectOptions("#select-7");

    function statusUpdate(data, onlineId, offlineId) {
      let device_o = document.getElementById(onlineId);
      let device_f = document.getElementById(offlineId);
      device_o.textContent = "Online : " + data.online;
      device_f.textContent = "Offline : " + data.offline;
    }

    function renderBarChart(selectedDeviceTypes) {
      const existingChart = Chart.getChart("barChart");
      if (existingChart) {
        existingChart.destroy();
      }
      fetch(`/network/rtn-traffic/${selectedDeviceTypes}`)
        .then((response) => response.json())
        .then((devices) => {
          const deviceIds = devices.map((entry) => entry.deviceID);
          const inboundTraffic = devices.map(
            (entry) => entry.inboundTraffic
          );
          const outboundTraffic = devices.map(
            (entry) => entry.outboundTraffic
          );

          const ctx = document.getElementById("barChart").getContext("2d");
          const barChart = new Chart(ctx, {
            type: "bar",
            data: {
              labels: deviceIds,
              datasets: [
                {
                  label: "Inbound",
                  data: inboundTraffic,
                  backgroundColor: "rgba(0,255,246, 0.9)",
                  borderColor: "rgba(0,255,246, 1)",
                  borderWidth: 1,
                },
                {
                  label: "Outbound",
                  data: outboundTraffic,
                  backgroundColor: "rgba(132,0,255, 0.9)",
                  borderColor: "rgba(132,0,255, 1)",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    color: "black", // Text color for legend labels
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Device ID",
                    color: "black",
                  },
                  ticks: {
                    color: "black", // Text color for x-axis labels
                  },
                },
                y: {
                  // Y-axis (traffic values)
                  title: {
                    display: true,
                    text: "Traffic in Kbps",
                    color: "black",
                  },
                  ticks: {
                    color: "black", // Text color for x-axis labels
                  },
                },
              },
            },
          });
        });
    }

    function renderDonutChart(chartId, divData) {
      // Data for the doughnut chart
      const data = {
        labels: ["online", "offline"],
        datasets: [
          {
            data: [divData.online, divData.offline], // Adjust the values as needed
            backgroundColor: ["green", "red"], // Adjust colors as needed
            // borderColor:black,
            borderWidth: 1,
          },
        ],
      };

      // Configuration for the chart
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
            enabled: false, // Disable tooltip on hover
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

    function makeAlertTable(allAlertsRow, selectedDeviceTypes) {
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
    }

    function getAllDevicesHealth() {
      return fetch("/network/get-health").then((response) =>
        response.json()
      );
    }

   

    function renderLineChart(lineChartId, flotData, yAxis, label) {
      const existingChart = Chart.getChart(lineChartId);
      if (existingChart) {
          existingChart.destroy();
      }

      const ctx = document.getElementById(lineChartId).getContext("2d");

      // Create a dataset for each device
      const datasets = flotData.map(deviceEntry => ({
          label: `Device ${deviceEntry.deviceID}`,
          data: deviceEntry.data.map(entry => ({
              x: new Date(entry.timestamp),
              y: entry[yAxis],
          })),
          borderColor: getRandomColor(),
          borderWidth: 2,
          fill: false,
      }));

      new Chart(ctx, {
        type: "line",
        legend: {
          display: false, // Set display property to false to hide the legend for this dataset
        },
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
                color: "black", // Set the text color for the ticks
              },
            },
          },
          plugins: {
            legend: {
              display: false, // Set display property to false to hide the legend
            },
          },
        },
      });
    }

    // Add this function to generate random colors
    function getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    function renderScatterPlot(selectedDeviceTypes) {
      fetch(`/network/get-allLatency/${selectedDeviceTypes}`)
          .then(response => response.json())
          .then(latencyDatas => {
              const existingChart = Chart.getChart("scatterPlot");
              if (existingChart) {
                  existingChart.destroy();
              }
              const ctx = document.getElementById("scatterPlot").getContext("2d");
              
              const datasets = latencyDatas.map(deviceEntry => {
                  const bgColors = deviceEntry.data.map(entry => entry.latency > 50 ? "red" : "green");

                  return {
                      label: `Device ${deviceEntry.deviceID}`,
                      data: deviceEntry.data.map(entry => ({
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
                  type: "scatter",
                  legend: {
                      display: false,
                  },
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
                                  color: "black",
                                  display: true,
                                  text: "Latency (ms)",
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
          });
  }


    function renderBar2Chart(avgUptime, selectedDeviceTypes) {
      const existingChart = Chart.getChart("bar2Chart");
      if (existingChart) {
        existingChart.destroy();
      }
      const ctx = document.getElementById("bar2Chart").getContext("2d");
      const devices = selectedDeviceTypes.includes("All")
        ? avgUptime
        : avgUptime.filter((device) =>
            selectedDeviceTypes.includes(device.devicetype)
          );
      const deviceIds = devices.map((device) => device.deviceID);
      const averageUptime = devices.map((entry) => entry.uptime);
      const barColors = averageUptime.map((uptime) =>
        uptime > 80 ? "green" : "red"
      );

      const uptimeBarChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: deviceIds,
          datasets: [
            {
              data: averageUptime,
              backgroundColor: barColors,
              borderColor: barColors,
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 100, // Assuming uptime is a percentage
              title: {
                display: true,
                text: "Average Uptime (%)",
                color: "black",
              },
              ticks: {
                color: "black",
              },
            },
            x: {
              title: {
                display: true,
                text: "Device ID",
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

    function makeAllDevices(allDevicesData, selectedDeviceTypes) {
      const filteredDevices = selectedDeviceTypes.includes("All")
        ? allDevicesData
        : allDevicesData.filter((device) =>
            selectedDeviceTypes.includes(device.devicetype)
          );

      allDevicesContainer = document.querySelector(".all-Divs");
      allDevicesContainer.innerHTML = `<div class="all-devices carousel"></div>`;
      const allDivs2 = document.querySelector(".all-devices");

      const deviceCount = filteredDevices.length;

      filteredDevices.forEach((device) => {
        const deviceElement = document.createElement("div");
        deviceElement.classList.add("device", "carousel-cell");

        const routerElement = document.createElement("div");
        routerElement.classList.add("Router", "tooltip");

        const imgElement = document.createElement("img");
        imgElement.src =
          "images/" + device.devicetype.toLowerCase() + ".png";
        imgElement.alt = device.devicetype;
        imgElement.className = "deviceImgs";
        imgElement.id = device.deviceID;
        const deviceNameElement = document.createElement("div");
        deviceNameElement.textContent = device.devicename;

        const tooltipElement = document.createElement("div");
        tooltipElement.classList.add("tooltiptext");
        tooltipElement.innerHTML = `<span>
                    DeviceType: ${device.devicetype} <br>
                    DeviceStatus: ${device.devicestatus} <br>
                    IPAddress: ${device.ipaddress}
                </span>`;

        // Append elements to the DOM
        routerElement.appendChild(imgElement);
        routerElement.appendChild(deviceNameElement);
        routerElement.appendChild(tooltipElement);
        deviceElement.appendChild(routerElement);

        allDivs2.appendChild(deviceElement);
        imgElement.addEventListener('click', function () {
            // Extract the image ID from the clicked image
            var imgId = this.id;
            window.location.href = '/index/single?imgId=' + imgId;
        });
      });

      let flickityOptions = {
        pageDots: false,
        imagesLoaded: true,
        groupCells: 1,
      };

      // Conditionally set options based on the number of devices
      if (deviceCount > 6) {
        flickityOptions.prevNextButtons = true;
        flickityOptions.wrapAround = true;
      }

      let carousel = new Flickity(".all-devices", flickityOptions);
    }

    function renderCharts(
      routerData,
      switchData,
      serverData,
      allDevicesData,
      alertTables,
      healthData,
      avgUptime
    ) {
      statusUpdate(routerData, "rout-o", "rout-f");
      statusUpdate(switchData, "swt-o", "swt-f");
      statusUpdate(serverData, "ser-o", "ser-f");
      renderDonutChart("doughnutChart", routerData);
      renderDonutChart("doughnutChart1", switchData);
      renderDonutChart("doughnutChart2", serverData);
      renderBarChart(select2.value.split("&").map((type) => type.trim()));
      makeAlertTable(
        alertTables,
        select3.value.split("&").map((type) => type.trim())
      );
      makeAllDevices(
        allDevicesData,
        select1.value.split("&").map((type) => type.trim())
      );
      var packetTypes=select4.value.split("&").map((type) => type.trim());
      fetch(`/network/get-allPacket/${packetTypes}`)
        .then((response) => response.json())
        .then((packetLoassDatas) => {
          renderLineChart("lineChart-1",packetLoassDatas,"packetLossRate","Packet Loss Rate (%)");
        });
      var throughputTypes=select5.value.split("&").map((type) => type.trim());
      fetch(`/network/get-allThroughput/${throughputTypes}`)
        .then((response) => response.json())
        .then((throughputDatas) => {
          renderLineChart("lineChart-2",throughputDatas,"throughput","Throughput (Mbps)");
        });
      
      var latencyTypes=select6.value.split("&").map((type) => type.trim());
      renderScatterPlot(latencyTypes);

      renderBar2Chart(
        avgUptime,
        select7.value.split("&").map((type) => type.trim())
      );
    }

    function fetchData() {
      return Promise.all([
        fetch("/network/devices/routers-status").then((response) =>
          response.json()
        ),
        fetch("/network/devices/switch-status").then((response) =>
          response.json()
        ),
        fetch("/network/devices/server-status").then((response) =>
          response.json()
        ),
        fetch("/network/devices").then((response) => response.json()),
        fetch("/network/alert-table").then((response) => response.json()),
        fetch("/network/get-health").then((response) => response.json()),
        fetch("/network/average-uptime").then((response) =>
          response.json()
        ),
      ]);
    }

    // Fetch data and render charts
    fetchData().then(
      ([
        routerData,
        switchData,
        serverData,
        allDevicesData,
        alertTables,
        healthData,
        avgUptime,
      ]) => {
        renderCharts(
          routerData,
          switchData,
          serverData,
          allDevicesData,
          alertTables,
          healthData,
          avgUptime
        );
      }
    );

    // Add event listener for the dropdown
    const select1 = document.getElementById("select-1");

    select1.addEventListener("change", function () {
      fetch("/network/devices")
        .then((response) => response.json())
        .then((newAllDevicesData) => {
          allDevicesData = newAllDevicesData;
          const selectedDeviceTypes = select1.value
            .split("&")
            .map((type) => type.trim());
          makeAllDevices(allDevicesData, selectedDeviceTypes);
        });
    });
    const select2 = document.getElementById("select-2");
    select2.addEventListener("change", function () {
      renderBarChart(select2.value.split("&").map((type) => type.trim()));          
    });
    const select3 = document.getElementById("select-3");
    select3.addEventListener("change", function () {
      fetch("/network/alert-table")
        .then((response) => response.json())
        .then((newAlertData) => {
          allAlert = newAlertData;
          const selectedDeviceTypes = select3.value
            .split("&")
            .map((type) => type.trim());
          makeAlertTable(allAlert, selectedDeviceTypes);
        });
    });
    const select4 = document.getElementById("select-4");
    select4.addEventListener("change", function () {
      var types=select4.value.split("&").map((type) => type.trim());
      fetch(`/network/get-allPacket/${types}`)
        .then((response) => response.json())
        .then((packetLoassDatas) => {
          renderLineChart("lineChart-1",packetLoassDatas,"packetLossRate","Packet Loss Rate (%)");
        });
    });

    const select5 = document.getElementById("select-5");
    select5.addEventListener("change", function () {
      var throughputTypes=select5.value.split("&").map((type) => type.trim());
      fetch(`/network/get-allThroughput/${throughputTypes}`)
        .then((response) => response.json())
        .then((throughputDatas) => {
          renderLineChart("lineChart-2",throughputDatas,"throughput","Throughput (Mbps)");
        });
    });
    const select6 = document.getElementById("select-6");
    select6.addEventListener("change", function () {
      var latencyTypes=select6.value.split("&").map((type) => type.trim());
      renderScatterPlot(latencyTypes);
    });

    const select7 = document.getElementById("select-7");
    select7.addEventListener("change", function () {
      // var uptimeTypes =select7.value.split("&").map((type) => type.trim());
      // renderBar2Chart(uptimeTypes);
      fetch("/network/average-uptime")
        .then((response) => response.json())
        .then((newAvgUptime) => {
          avgUptime = newAvgUptime;
          renderBar2Chart(
            avgUptime,
            select7.value.split("&").map((type) => type.trim())
          );
        });
    });

    // Add event listener to the "All Devices" button
    const allDevicesButton = document.getElementById("allDivBtn");
    allDevicesButton.addEventListener("click", function () {
      // Navigate to the other page
      window.location.href = "/index/allDevices";
    });
    const ntwTrafficButton = document.getElementById("ntwTrafficBtn");
    ntwTrafficButton.addEventListener("click", function () {
      // Navigate to the other page
      window.location.href = "/index/ntwTraffic";
    });
    const alertButton = document.getElementById("alertBtn");
    alertButton.addEventListener("click", function () {
      // Navigate to the other page
      window.location.href = "/index/alert";
    });
    const packetButton = document.getElementById("packetBtn");
    packetButton.addEventListener("click", function () {
      // Navigate to the other page
      window.location.href = "/index/packet-loss";
    });
    const throughputButton = document.getElementById("throughputBtn");
    throughputButton.addEventListener("click", function () {
      // Navigate to the other page
      window.location.href = "/index/throughput";
    });
    const latencyButton = document.getElementById("latencyBtn");
    latencyButton.addEventListener("click", function () {
      // Navigate to the other page
      window.location.href = "/index/latency";
    });
    const uptimeButton = document.getElementById("uptimeBtn");
    uptimeButton.addEventListener("click", function () {
      // Navigate to the other page
      window.location.href = "/index/uptime";
    });
    const healthButton = document.getElementById("healthBtn");
    healthButton.addEventListener("click", function () {
      // Navigate to the other page
      window.location.href = "/index/health";
    });

    
  });