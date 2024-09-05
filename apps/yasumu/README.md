# Yasumu Application

This directory contains the source code for the Yasumu application. It is written in TypeScript and built with Tauri, React, and TypeScript.

You can find the following contents in this directory:

- `src`: Contains the frontend source code for the application. This directory contains the React components, styles, and other frontend assets.
- `src-tauri`: Contains the Tauri source code for the application. This directory contains the Tauri configuration, build scripts, and other Tauri-specific assets.
- `src-tauri/src/tanxium`: Contains Yasumu's JavaScript runtime to evaluate user generated JavaScript code in the application. It uses Boa, a JavaScript interpreter written in Rust.
- `src-tauri/runtime`: Contains the runtime JavaScript/TypeScript code for the Tanxium JavaScript runtime. It is used to expose certain apis to the user generated JavaScript code.
- `src-tauri/src/commands`: Contains the command handlers for the application. This directory contains the command handlers for the application, which are used to handle the commands sent from the frontend to the Tauri backend.
