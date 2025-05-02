import createModule from "../gs";

async function extractText(inputPdf) {
  return new Promise((resolve, reject) => {
    createModule({
      preRun: ({ FS }) => {
        FS.writeFile("input.pdf", inputPdf);
      },
      postRun: ({ FS }) => {
        try {
          resolve(FS.readFile("output.txt", { encoding: "utf8" }));
        } catch (e) {
          reject(e);
        }
      },
      arguments: [
        "-ooutput.txt",
        "-sDEVICE=txtwrite",
        "-finput.pdf",
      ],
    });
  });
}

function handleMessage(event) {
  extractText(event.data).then(text => event.ports[0].postMessage(text));
}

self.addEventListener("message", handleMessage);

