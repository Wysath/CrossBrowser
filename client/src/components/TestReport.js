// TestReport.js
import React, { useState } from 'react';
import { runTests } from '../api.js';

const TestReport = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRunTests = async () => {
        setLoading(true);
        console.log('Running tests...');

        try {
            const response = await runTests();
            console.log('Tests executed:', response);
            setReport(response); // Mettre à jour l'état avec le rapport
        } catch (error) {
            console.error('Error running tests:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Test Report</h1>
            <button onClick={handleRunTests} disabled={loading}>
                {loading ? 'Running...' : 'Run Tests'}
            </button>
            {report && (
                <div>
                    <h2>{report.message}</h2>
                    <pre>{report.output}</pre> {/* Affiche le résultat des tests */}
                    <h3>Captures d'écran :</h3>
                    {report.screenshotChrome && (
                        <div>
                            <h4>Chrome</h4>
                            <img src={report.screenshotChrome} alt="Screenshot Chrome" style={{ width: '500px' }} />
                        </div>
                    )}
                    {report.screenshotFirefox && (
                        <div>
                            <h4>Firefox</h4>
                            <img src={report.screenshotFirefox} alt="Screenshot Firefox" style={{ width: '500px' }} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
    
};



export default TestReport;
