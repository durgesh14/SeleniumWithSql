    // Fetch all flow names when button is clicked
    document.getElementById('fetchFlowNames').addEventListener('click', function() {
        fetch('http://localhost:4000/flow-names')
            .then(response => response.json())
            .then(flowNames => {
                const flowNamesList = document.getElementById('flowNamesList');
                flowNamesList.innerHTML = ''; // Clear existing links
                flowNames.forEach(flow => {
                    const link = document.createElement('a');
                    link.href = '#';
                    link.textContent = flow.flowName;
                    link.onclick = function() {
                        fetchTestData(flow.flowName);
                    };
                    flowNamesList.appendChild(link);
                    flowNamesList.appendChild(document.createElement('br'));
                });
            })
            .catch(err => console.error('Error fetching flow names:', err));
    });

// Fetch test data for a flow
let currentFlowNameForReload = null;
    function fetchTestData(flowName) {
        currentFlowNameForReload = flowName
        fetch(`http://localhost:4000/test-data/${flowName}`)
            .then(response => response.json())
            .then(testData => {

                const transformedTestData = testData.map((dataPoint) => ({
                                flowName: flowName,
                                ...dataPoint,
                            }));
                displayData(transformedTestData);
            })
            .catch(err => console.error('Error fetching test data:', err));
    }

    // Display data in the table
    function displayData(data) {
        const tbody = document.querySelector('#testDataTable tbody');
        console.log(data)
        tbody.innerHTML = ''; // Clear existing rows

        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-flow', row.flowName);
            tr.setAttribute('data-testcase', row.testCaseName);
            tr.setAttribute('data-key', row.testKey);
            tr.innerHTML = `
                <td>${row.testCaseName}</td>
                <td>${row.testKey}</td>
                <td>${row.testValue}</td>
                <td>
                    <button onclick="openEditModal('${row.id}', '${row.flowName}', '${row.testCaseName}', '${row.testKey}', '${row.testValue}')">Edit</button>
                    <button onclick="deleteTestData('${row.flowName}', '${row.testCaseName}', '${row.testKey}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Apply filter based on flow name and script name
    function applyFilter() {
        const flowName = document.getElementById('flowFilter').value;
        const scriptName = document.getElementById('scriptFilter').value;
        fetch(`http://localhost:4000/test-data/${flowName}?scriptName=${scriptName}`)
            .then(response => response.json())
            .then(filteredData => {
                const transformedFilterData = filteredData.map((dataPoint) => ({
                                                flowName: flowName,
                                                ...dataPoint,
                                            }));
                displayData(transformedFilterData);
            })
            .catch(err => console.error('Error fetching filtered data:', err));
    }

    let currentFlowName = null;
    let currentTestCaseName = null;
    let currentId = null;

    function openEditModal(id, flowName, testCaseName, testKey, testValue) {
        // Set current editing row details
        currentId = id;
        currentFlowName = flowName;
        currentTestCaseName = testCaseName;

        console.log("currentId: ", id);
        // Pre-fill modal fields with the current values
        document.getElementById('modalTestScript').value = testCaseName;
        document.getElementById('modalTestKey').value = testKey;
        document.getElementById('modalTestValue').value = testValue;

        // Display the modal and overlay
        document.getElementById('editModal').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
    }

    function closeModal() {
        // Hide the modal and overlay
        document.getElementById('editModal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }

    function saveEdit() {
        const newTestKey = document.getElementById('modalTestKey').value;
        const newTestValue = document.getElementById('modalTestValue').value;
        const newTestName = document.getElementById('modalTestScript').value;


        // Send the updated data to the server
        fetch(`http://localhost:4000/edit-test-data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: currentId,
                flowName: currentFlowName,
                testCaseName: newTestName,
                testKey: newTestKey,
                testValue: newTestValue
            })
        })
        .then(response => response.json())
        .then(() => {
            // Close the modal and refresh the table data
            closeModal();
//            applyFilter();
            //window.location.reload();
            fetchTestData(currentFlowNameForReload);
        })
        .catch(err => console.error('Error saving edited data:', err));
    }





   // Function to delete a specific test data row based on flowName, testCaseName, and testKey
   function deleteTestData(flowName, testCaseName, testKey) {
       fetch('http://localhost:4000/delete-test-data', {
           method: 'DELETE',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify({
               flowName: flowName,
               testCaseName: testCaseName,
               testKey: testKey
           })
       })
       .then(response => {
           if (response.ok) {
               console.log('Test data deleted successfully');
               const row = document.querySelector(`tr[data-flow="${flowName}"][data-testcase="${testCaseName}"][data-key="${testKey}"]`);
                           if (row) {
                               row.remove();
                           }
           } else {
               console.error('Failed to delete test data');
           }
       })
       .catch(error => console.error('Error:', error));
   }

