const cron = require('node-cron');
const { spawn } = require('child_process');
const path = require('path');

// Schedule model training to run every day at 2 AM
cron.schedule('0 2 * * *', () => {
    console.log('Starting scheduled model training...');
    
    // Run the Python script for model training
    const pythonProcess = spawn('python', [path.join(__dirname, 'matchmaking_model.py')]);
    
    pythonProcess.stdout.on('data', (data) => {
        console.log(`Model training output: ${data}`);
    });
    
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Model training error: ${data}`);
    });
    
    pythonProcess.on('close', (code) => {
        console.log(`Model training process exited with code ${code}`);
    });
});

console.log('Model training scheduler started. Will run daily at 2 AM.'); 