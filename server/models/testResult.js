const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
    browser: String,
    title: String,
    passed: Boolean,
    error: String,
    screenshot: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestResult', testResultSchema);
