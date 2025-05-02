document.querySelector("input")!.addEventListener("change", async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length != 1) return;
  console.log("File selected: ", target.files[0]);
  const name = target.files[0].name;
  const input = new Uint8Array(await target.files[0].arrayBuffer());
  const output = await invertPdfInWorker(input);
  target.value = "";
  const file = new File([output], name, { type: "application/pdf" });
  const url = window.URL.createObjectURL(file);
  window.open(url, '_blank');
  setTimeout(() => window.URL.revokeObjectURL(url), 0);
});

async function invertPdfInWorker(inputPdf: Uint8Array): Promise<Uint8Array> {
  const worker = new Worker(new URL("./invert.worker", import.meta.url), { type: "module" });
  const channel = new MessageChannel();
  return new Promise<Uint8Array>((resolve, reject) => {
    channel.port1.onmessage = (event: MessageEvent) => {
      const outputPdf = event.data;
      if (!(outputPdf instanceof Uint8Array)) {
        reject(new Error("no output"));
      } else {
        resolve(outputPdf);
      }
      setTimeout(() => worker.terminate(), 0);
    };
    worker.postMessage(inputPdf, [channel.port2, inputPdf.buffer]);
    console.log('main pm');
  });
}

