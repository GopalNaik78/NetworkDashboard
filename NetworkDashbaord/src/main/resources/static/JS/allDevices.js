document.addEventListener("DOMContentLoaded", function () {
    // JavaScript code to populate the device data
    fetch('/network/devices')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('.all-devices tbody');
            data.forEach(device => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="/images/${device.devicetype.toLowerCase()}.png" alt="${device.devicetype}" class="device-icon"></td>
                    <td>${device.deviceID}</td>
                    <td class="device-name" data-device-id="${device.deviceID}">${device.devicename}</td>
                    <td>${device.devicetype}</td>
                    <td>${device.ipaddress}</td>
                    <td>${device.devicestatus}</td>
                    <td>${device.inboundTraffic}</td>
                    <td>${device.outboundTraffic}</td>
                `;
                tableBody.appendChild(row);
                const deviceNameCell = row.querySelector('.device-name');
                    deviceNameCell.addEventListener('click', function () {
                        // Extract the device ID from the data attribute
                        var deviceId = this.getAttribute('data-device-id');
                        console.log(deviceId);
                        window.location.href = '/index/single?imgId=' + deviceId;
                    });
            });
        });
    });