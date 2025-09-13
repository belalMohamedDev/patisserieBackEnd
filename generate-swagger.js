const fs = require("fs");
const path = require("path");
const swaggerSpecs = require("./swagger");

// Generate Swagger JSON file
const swaggerJson = JSON.stringify(swaggerSpecs, null, 2);

// Write to file
const outputPath = path.join(__dirname, "swagger.json");
fs.writeFileSync(outputPath, swaggerJson);

console.log("✅ Swagger JSON file generated successfully!");
console.log(`📁 File location: ${outputPath}`);
console.log(
  `📊 Total endpoints: ${Object.keys(swaggerSpecs.paths || {}).length}`
);
console.log(
  `🏷️  Available tags: ${(swaggerSpecs.tags || []).map((tag) => tag.name).join(", ")}`
);

// Also log the servers
console.log("\n🌐 Available servers:");
swaggerSpecs.servers.forEach((server, index) => {
  console.log(`   ${index + 1}. ${server.url} (${server.description})`);
});
