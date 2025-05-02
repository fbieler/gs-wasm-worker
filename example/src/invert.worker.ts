console.log('worker1');
import createModule, { MainModule } from "@fbieler/gs-wasm-worker/gs";

async function invertColors(
  inputPdf: Uint8Array,
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    createModule({
      preRun: ({ FS }: MainModule) => {
        FS.writeFile("input.pdf", inputPdf);
      },
      postRun: ({ FS }: MainModule) => {
        try {
          resolve(FS.readFile("output.pdf", { encoding: "binary" }));
        } catch (e) {
          reject(e);
        }
      },
      arguments: [
        "-ooutput.pdf",
        "-sDEVICE=pdfwrite",
        "-c",
        "{1 exch sub}{1 exch sub}{1 exch sub}{1 exch sub} setcolortransfer",
        "-finput.pdf",
      ],
    });
  });
}

function handleMessage(event: MessageEvent) {
  console.log('worker hm');
  invertColors(event.data)
    .then(output => event.ports[0].postMessage(output, [output.buffer]));
}

self.addEventListener("message", handleMessage);
