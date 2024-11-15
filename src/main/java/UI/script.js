document.getElementById('testDataForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const flowName = document.getElementById('flowName').value;
    const testCaseName = document.getElementById('testCaseName').value;
    const testKey = document.getElementById('testKey').value;
    const testValue = document.getElementById('testValue').value;

    // Create a data object to send to the server
    const data = {
        flowName: flowName,
        testCaseName: testCaseName,
        testKey: testKey,
        testValue: testValue
    };

    // Send data to the server using fetch API
    fetch('http://localhost:4000/add-test-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            alert('Data added successfully!');
        } else if(response.status == 409){
        alert('Duplicate data.');
        }
        else {
            alert('Error adding data.');
        }
    })
    .catch(error => console.error('Error:', error));
});
