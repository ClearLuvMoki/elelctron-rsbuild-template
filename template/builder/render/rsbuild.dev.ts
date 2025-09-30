import {spawn} from 'node:child_process'
import { join } from 'node:path'
import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { srcRenderPath} from '../common/paths'
import CommonConfig from '../common/rsbuild.common'

function run(cmd: string, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        const proc = spawn(cmd, args, { shell: true, stdio: 'inherit' });
        proc.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`${cmd} ${args.join(' ')} failed with code ${code}`));
        });
        proc.on('error', reject);
    });
}


const Config = defineConfig({
    plugins: [pluginReact()],
    source: {
        entry: {
            index: join(srcRenderPath, './index.tsx'),
        },
    },
    server: {
        port: Number(process.env.PORT),
    },
    dev: {
        setupMiddlewares: [
            async middlewares => {
                await run('npm', ['run', 'dev:main']);
                return middlewares
            },
        ],
    },
})

module.exports = mergeRsbuildConfig(CommonConfig, Config)
