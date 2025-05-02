import { expect } from "@esm-bundle/chai";

it("extracts text from pdf", async () => {
  const worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
  const channel = new MessageChannel();
  const workerResponse = new Promise((resolve, reject) => {
    channel.port1.onmessage = (event) => {
      const outputPdf = event.data;
      if (!(typeof outputPdf === "string")) {
        reject(new Error("no output"));
      } else {
        resolve(outputPdf);
      }
      setTimeout(() => worker.terminate(), 0);
    };
    fetch("test/dummy.pdf")
      .then(response => response.arrayBuffer())
      .then(buffer => worker.postMessage(new Uint8Array(buffer), [channel.port2, buffer]));
  });
  expect((await workerResponse).trim()).to.equal("Dummy PDF file");
});

