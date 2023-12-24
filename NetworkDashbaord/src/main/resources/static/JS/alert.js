document.addEventListener('DOMContentLoaded', function () {
    const select3 = document.getElementById('select-3');
    let allAlertData;

    function fetchDataAndRenderTable() {
        fetch('/network/alert-table')
            .then(response => response.json())
            .then(newAlertData => {
                allAlertData = newAlertData;
                renderAlertTable();
            });
    }

    function renderAlertTable() {
        const selectedAlertTypes = select3.value.split('&').map(type => type.trim());
        const allAlerts = selectedAlertTypes.includes('All') ? allAlertData : allAlertData.filter(alert => {
            const isReviewStatusMatch = selectedAlertTypes.includes(alert.reviewstatus);
            const isStatusMatch = selectedAlertTypes.includes(alert.status);
            if (selectedAlertTypes.length === 1)
                return isReviewStatusMatch || isStatusMatch;
            else
                return isReviewStatusMatch && isStatusMatch;
        });

        const tableBody = document.querySelector('.Alert-table tbody');
        tableBody.innerHTML = '';

        allAlerts.forEach(alert => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${alert.alertID}</td>
                <td>${alert.deviceID}</td>
                <td>${alert.message}</td>
                <td>${alert.status}</td>
                <td>${alert.reviewstatus}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    fetchDataAndRenderTable();

    select3.addEventListener('change', fetchDataAndRenderTable);

    // Responsiveness
    window.addEventListener('resize', function () {
        renderAlertTable();
    });
});