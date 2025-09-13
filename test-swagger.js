const axios = require("axios");

async function testSwaggerEndpoints() {
  const baseUrl = "http://localhost:8080";

  try {
    console.log("🧪 Testing Swagger endpoints...\n");

    // Test Swagger UI
    console.log("1. Testing Swagger UI...");
    const uiResponse = await axios.get(`${baseUrl}/api-docs`);
    console.log(
      `   ✅ Swagger UI: ${uiResponse.status} - ${uiResponse.statusText}`
    );

    // Test Swagger JSON
    console.log("2. Testing Swagger JSON...");
    const jsonResponse = await axios.get(`${baseUrl}/swagger.json`);
    console.log(
      `   ✅ Swagger JSON: ${jsonResponse.status} - ${jsonResponse.statusText}`
    );

    // Check JSON content
    const swaggerData = jsonResponse.data;
    console.log(
      `   📊 Total endpoints: ${Object.keys(swaggerData.paths || {}).length}`
    );
    console.log(
      `   🏷️  Available tags: ${(swaggerData.tags || []).map((tag) => tag.name).join(", ")}`
    );

    // Check servers
    console.log("\n🌐 Available servers:");
    swaggerData.servers.forEach((server, index) => {
      console.log(`   ${index + 1}. ${server.url} (${server.description})`);
    });

    console.log("\n✅ All Swagger endpoints are working correctly!");
  } catch (error) {
    console.error("❌ Error testing Swagger endpoints:", error.message);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${error.response.data}`);
    }
  }
}

// Run the test
testSwaggerEndpoints();
