# Electron Rsbuild template

## Build
- Rsbuild

## Frontend
- React V19
- TypeScript

## Code lint
- BiomeJs

```shell
.
├── biome.json # code lint
├── builder # rsbuild config
│   ├── common # common config for rsbuild
│   ├── main # rsbuild config for main process
│   └── render # rsbuild config for frontend process
├── electron-builder.js # electron-builder
├── mas # entitlements for macos
│   ├── entitlements.mas.inherit.plist
│   └── entitlements.mas.plist
├── nodemon.json # reload config for main process
├── package.json
├── pnpm-lock.yaml
├── release # release directory
│   └── dist
├── src
│   ├── main # main process source code
│   └── render # frontend process source code
└── tsconfig.json
```
