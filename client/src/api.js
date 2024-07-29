export const runTests = async () => {
    console.log('Sending request to run tests...');
    try {
        const response = await fetch('http://localhost:5000/api/tests/run-tests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        console.log('Tests executed:', data);
        return data;
    } catch (error) {
        console.error('Error running tests:', error);
        throw error;
    }
};


