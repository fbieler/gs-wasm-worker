Ghostscript compiled to WebAssembly for web-workers

example usage:
```typescript
import createModule, { MainModule } from "@fbieler/gs-wasm-worker/gs";

async function pipeThroughGs(
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
        "-finput.pdf",
      ],
    });
  });
}
```

