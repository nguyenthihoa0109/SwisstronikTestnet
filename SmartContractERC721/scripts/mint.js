const hre = require("hardhat");
const { encryptDataField } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpcLink = hre.network.config.url;

  const [encryptedData] = await encryptDataField(rpcLink, data);

  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  const contractAddress = "0x1E25D687f954B805939f2cb2F0bd4497cb6Ab634"; 
  const recipientAddress = "0x3D73d0CC15cda4A9c1abF8478D442FA77dB69000"; 

  const [signer] = await hre.ethers.getSigners();

  const contractFactory = await hre.ethers.getContractFactory("MyTestToken");  
  const contract = contractFactory.attach(contractAddress);

  const functionName = "mint";
  const functionArgs = [recipientAddress]; 
  const txData = contract.interface.encodeFunctionData(functionName, functionArgs);

  try {
    console.log("Sending... Please wait a second");

    const mintTx = await sendShieldedTransaction(
      signer,
      contractAddress,
      txData,
      0
    );

    await mintTx.wait();

    console.log("Minted successfully!");
    console.log("Receipt transaction: ", mintTx);
  } catch (error) {
    console.error("Minted unsuccessfully: ", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});