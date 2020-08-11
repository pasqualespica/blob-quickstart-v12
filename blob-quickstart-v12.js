/*
    https://docs.microsoft.com/it-it/azure/storage/blobs/storage-quickstart-blobs-nodejs
*/

const { BlobServiceClient } = require("@azure/storage-blob");
// const uuidv1 = require('uuid/v1');
const uuidv1 = require("uuid");

async function main() {
    console.log("Azure Blob storage v12 - JavaScript quickstart sample");
    // Quick start code goes here

    console.log(">>>>>>>>>>>>>> 1. Ottenere la stringa di connessione");

    // Retrieve the connection string for use with the application. The storage
    // connection string is stored in an environment variable on the machine
    // running the application called AZURE_STORAGE_CONNECTION_STRING. If the
    // environment variable is created after the application is launched in a
    // console or with Visual Studio, the shell or application needs to be closed
    // and reloaded to take the environment variable into account.
    const AZURE_STORAGE_CONNECTION_STRING =
        process.env.AZURE_STORAGE_CONNECTION_STRING;
    console.log(`>>> ${AZURE_STORAGE_CONNECTION_STRING}`);

    console.log(">>>>>>>>>>>>>> 2. Creare un contenitore");

    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
    );

    // Create a unique name for the container
    const my_uuidv1 = uuidv1.v1();
    console.log(`my_uuidv1 ${my_uuidv1}`);

    const containerName = "quickstart" + my_uuidv1;

    console.log("\nCreating container...");
    console.log("\t", containerName);

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create the container
    const createContainerResponse = await containerClient.create();
    console.log(
        "Container was created successfully. requestId: ",
        createContainerResponse.requestId
    );

    console.time("read-datafile-csv");
    console.log(">>>>>>>>>>>>>> 3.1. Leggere CSV file");
    //   const { time } = require("console");
    fs = require("fs");
    let dati_csv = fs.readFileSync(
        "resources/attivita_pesca_2016_csv.csv",
        "utf8",
        function (err, data) {
            if (err) {
                return console.log(err);
            }

            return data;
        }
    );
    console.timeEnd("read-datafile-csv");

    console.time("upload-blob");
    console.log(">>>>>>>>>>>>>> 3.2. Caricare BLOB in un contenitore");
    let blockBlobClient;
    //   const array1 = ["pasquale", "mario", "giovanni"];

    //   array1.forEach(async (elem) => {
    //     // Create a unique name for the blob
    //     const blobName = "quickstart" + uuidv1.v1() + ".txt";

    //     // Get a block blob client
    //     blockBlobClient = containerClient.getBlockBlobClient(blobName);

    //     console.log("\nUploading to Azure storage as blob:\n\t", blobName);

    //     // Upload data to the blob
    //     const data = `Hello, World ${elem}!"`;
    //     const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
    //     console.log(
    //       "Blob was uploaded successfully. requestId: ",
    //       uploadBlobResponse.requestId
    //     );
    //   });

    // Create a unique name for the blob
    const blobName = "quickstart" + uuidv1.v1() + ".txt";

    // Get a block blob client
    blockBlobClient = containerClient.getBlockBlobClient(blobName);

    console.log("\nUploading to Azure storage as blob:\n\t", blobName);

    // Upload data to the blob
    const uploadBlobResponse = await blockBlobClient.upload(
        dati_csv,
        dati_csv.length
    );
    console.log(
        "Blob was uploaded successfully. requestId: ",
        uploadBlobResponse.requestId
    );
    console.timeEnd("upload-blob");

    console.log(">>>>>>>>>>>>>> 4. Elencare i BLOB in un contenitore");
    console.log("\nListing blobs...");
    // List the blob(s) in the container.
    for await (const blob of containerClient.listBlobsFlat()) {
        console.log("\t", blob.name);
    }

    console.time("download-blob");
    console.log(">>>>>>>>>>>>>> 5. Scaricare BLOB");
    // Get blob content from position 0 to the end
    // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
    // In browsers, get downloaded data by accessing downloadBlockBlobResponse.blobBody
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    console.log("\nDownloaded blob content...");
    console.log(
        "\t",
        await streamToString(downloadBlockBlobResponse.readableStreamBody)
    );
    console.timeEnd("download-blob");

    //   console.log(">>>>>>>>>>>>>> 6. Eliminare un contenitore");

    //   console.log("\nDeleting container...");

    //   // Delete container
    //   const deleteContainerResponse = await containerClient.delete();
    //   console.log(
    //     "Container was deleted successfully. requestId: ",
    //     deleteContainerResponse.requestId
    //   );
}

main()
    .then(() => console.log("Done"))
    .catch((ex) => console.log(ex.message));

// A helper function used to read a Node.js readable stream into a string
async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
            chunks.push(data.toString());
        });
        readableStream.on("end", () => {
            resolve(chunks.join(""));
        });
        readableStream.on("error", reject);
    });
}
