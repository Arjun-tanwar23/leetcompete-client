const handleRun = async () => {
    setIsRunning(true);
    setOutput(null);

    try {
        const response = await axios.post('/api/evaluation/run', {
            code,
            language: selectedLanguage,
            problemId: problem._id
        });

        setOutput({
            status: response.data.status,
            testResults: response.data.testResults,
            error: response.data.error,
            message: response.data.message
        });
        setShowOutput(true);
    } catch (error) {
        setOutput({
            status: 'Error',
            error: error.response?.data?.message || 'Error running code',
            message: 'Failed to run code'
        });
    } finally {
        setIsRunning(false);
    }
};

const handleSubmit = async () => {
    setIsRunning(true);
    setOutput(null);

    try {
        const response = await axios.post('/api/submissions/submit', {
            code,
            language: selectedLanguage,
            problemId: problem._id,
            matchId: battleData.matchId
        });

        if (response.data.success) {
            // Update local progress
            updateProblemStatus(problem._id, response.data.progress.status);

            // Show results
            setOutput({
                status: response.data.submission.status,
                testResults: response.data.submission.testResults,
                error: response.data.submission.error,
                message: response.data.submission.message,
                progress: response.data.progress
            });

            // If problem is solved, update UI accordingly
            if (response.data.progress.status === 'solved') {
                // Update problem status in the battle context
                updateBattleProgress(response.data.progress);
            }
        }
        setShowOutput(true);
    } catch (error) {
        setOutput({
            status: 'Error',
            error: error.response?.data?.message || 'Error submitting code',
            message: 'Failed to submit code'
        });
    } finally {
        setIsRunning(false);
    }
};