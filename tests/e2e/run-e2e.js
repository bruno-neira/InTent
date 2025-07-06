const { spawn } = require('child_process')
const path = require('path')

async function runE2ETests() {
  console.log('🏗️  Building extension for E2E tests...')
  
  // Build the extension first
  const buildProcess = spawn('npm', ['run', 'build'], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '../..')
  })

  buildProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Build completed successfully')
      console.log('🧪 Running E2E tests...')
      
      // Run the E2E tests
      const testProcess = spawn('npx', ['vitest', 'run', 'tests/e2e'], {
        stdio: 'inherit',
        cwd: path.join(__dirname, '../..'),
        env: { ...process.env, NODE_ENV: 'test' }
      })

      testProcess.on('close', (testCode) => {
        if (testCode === 0) {
          console.log('✅ E2E tests passed!')
        } else {
          console.log('❌ E2E tests failed!')
          process.exit(1)
        }
      })
    } else {
      console.log('❌ Build failed!')
      process.exit(1)
    }
  })
}

runE2ETests().catch(console.error)
