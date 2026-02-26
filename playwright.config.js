testDir: 'tests',
timeout: 30000,
use: {
  headless: true,
  browserName: 'chromium',
},
reporter: [['list'], ['html', { outputFile: 'test-results.html' }]]