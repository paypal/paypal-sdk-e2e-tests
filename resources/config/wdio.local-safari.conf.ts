import { config as defaultConfig } from "./wdio.conf";
import * as _ from "lodash";

const overrides = {
    maxInstances: 1,
    services: ["safaridriver"],
    specs: ["tests/**/*.test.ts"],
    capabilities: [
        {
            maxInstances: 1,
            browserName: "safari",
            acceptInsecureCerts: true,
        },
    ],
};

export const config = _.defaultsDeep(overrides, defaultConfig);
