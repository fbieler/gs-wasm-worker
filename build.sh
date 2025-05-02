#!/bin/sh

set -e

cd ghostpdl
echo '{}' > package.json

# cherry-pick function pointer cast fix
git cherry-pick -n 8a5c6c0909

emconfigure ./autogen.sh --host=wasm32-unknown-emscripten --with-libtiff --disable-threading --disable-cups --disable-dbus --disable-gtk --with-drivers=PS --without-tesseract --without-x LDFLAGS='-s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_RUNTIME_METHODS=FS -s ENVIRONMENT=worker -s STACK_SIZE=262144 -s EXPORT_ES6=1 --emit-tsd ../gs.d.ts'

emmake make -j

cp bin/gs.wasm ../gs.wasm

# turbopack workaround
sed "s|new URL(.*)\.href|(() => { const tpw_url = \0; if (tpw_url.startsWith('/')) return self.location.origin + tpw_url; return tpw_url; })()|;w ../gs.js" bin/gs

cd ..

