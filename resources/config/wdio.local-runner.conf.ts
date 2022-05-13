import { config as defaultConfig } from "./wdio.conf";
import * as _ from "lodash";

const overrides = {
    capabilities: [
        {
            "goog:chromeOptions": {
                args: ["--ignore-certificate-errors"],
            },
        },
    ],
};

export const config = _.defaultsDeep(overrides, defaultConfig);
