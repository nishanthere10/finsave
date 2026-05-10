const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const ExpenseEscrow = await ethers.getContractFactory("ExpenseEscrow");
  const escrow = await ExpenseEscrow.deploy();
  await escrow.waitForDeployment();

  const address = await escrow.getAddress();
  console.log("ExpenseEscrow deployed to:", address);

  // Save the address and ABI to the backend folder
  const artifactsDir = path.join(__dirname, "..", "..", "backend", "artifacts");
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir);
  }

  const contractArtifact = require("../artifacts/contracts/ExpenseEscrow.sol/ExpenseEscrow.json");
  fs.writeFileSync(
    path.join(artifactsDir, "ExpenseEscrow.json"),
    JSON.stringify(
      {
        address: address,
        abi: contractArtifact.abi,
      },
      null,
      2
    )
  );
  
  console.log("Artifacts saved to backend/artifacts/ExpenseEscrow.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
