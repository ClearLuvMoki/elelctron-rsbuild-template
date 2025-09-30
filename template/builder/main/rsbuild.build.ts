import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core'
import { join } from 'path'
import { releaseMainPath, srcMainPath } from '../common/paths'
import CommonConfig from '../common/rsbuild.common'

const Config = defineConfig({
    tools: {
        rspack: {
            target: 'electron-main',
        },
    },
    source: {
        entry: {
            index: join(srcMainPath, './index.ts'),
            preload: join(srcMainPath, './preload.ts'),
        },
    },
    output: {
        target: 'node',
        distPath: {
            root: join(releaseMainPath),
        },
        cleanDistPath: true,
    },
})

module.exports = mergeRsbuildConfig(CommonConfig, Config)
