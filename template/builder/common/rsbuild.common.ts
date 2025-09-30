import { defineConfig } from '@rsbuild/core'
import 'dotenv/config';

const CommonConfig = defineConfig({
    source: {
        decorators: {
            version: 'legacy',
        },
    },
})

export default CommonConfig
