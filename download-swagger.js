const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function downloadSwagger() {
  console.log('📥 Swagger JSON Download Options\n');
  
  // Option 1: Copy local file
  console.log('1️⃣  Local File Copy:');
  const localPath = path.join(__dirname, 'swagger.json');
  if (fs.existsSync(localPath)) {
    const stats = fs.statSync(localPath);
    console.log(`   📁 File: ${localPath}`);
    console.log(`   📊 Size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`   🕒 Modified: ${stats.mtime}`);
    console.log(`   💡 Copy this file to your desired location\n`);
  }
  
  // Option 2: Download from local server
  console.log('2️⃣  Download from Local Server:');
  console.log('   🌐 URL: http://localhost:8080/swagger.json');
  console.log('   📝 Use this URL in your browser or download tool\n');
  
  // Option 3: Download from production server
  console.log('3️⃣  Download from Production Server:');
  console.log('   🌐 URL: https://elminiawy-patisserie.vercel.app/swagger.json');
  console.log('   📝 Use this URL in your browser or download tool\n');
  
  // Option 4: Create a copy with timestamp
  console.log('4️⃣  Create Timestamped Copy:');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const timestampedPath = path.join(__dirname, `swagger-${timestamp}.json`);
  
  try {
    fs.copyFileSync(localPath, timestampedPath);
    console.log(`   ✅ Created: ${timestampedPath}`);
    console.log(`   📊 Size: ${(fs.statSync(timestampedPath).size / 1024).toFixed(2)} KB\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }
  
  // Option 5: Test download URLs
  console.log('5️⃣  Testing Download URLs:');
  
  try {
    // Test local server
    console.log('   Testing local server...');
    const localResponse = await axios.get('http://localhost:8080/swagger.json', { timeout: 5000 });
    console.log(`   ✅ Local server: ${localResponse.status} - ${(localResponse.data.length / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.log(`   ❌ Local server: ${error.message}`);
  }
  
  try {
    // Test production server
    console.log('   Testing production server...');
    const prodResponse = await axios.get('https://elminiawy-patisserie.vercel.app/swagger.json', { timeout: 10000 });
    console.log(`   ✅ Production server: ${prodResponse.status} - ${(prodResponse.data.length / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.log(`   ❌ Production server: ${error.message}`);
  }
  
  console.log('\n🎯 Quick Download Commands:');
  console.log('   # Using curl (Windows):');
  console.log('   curl -o swagger-download.json http://localhost:8080/swagger.json');
  console.log('   curl -o swagger-production.json https://elminiawy-patisserie.vercel.app/swagger.json');
  console.log('');
  console.log('   # Using PowerShell:');
  console.log('   Invoke-WebRequest -Uri "http://localhost:8080/swagger.json" -OutFile "swagger-download.json"');
  console.log('   Invoke-WebRequest -Uri "https://elminiawy-patisserie.vercel.app/swagger.json" -OutFile "swagger-production.json"');
}

// Run the download helper
downloadSwagger(); 