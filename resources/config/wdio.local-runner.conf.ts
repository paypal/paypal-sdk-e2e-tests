import { config as defaultConfig } from "./wdio.conf";
import * as _ from "lodash";

const overrides = {
    maxInstances: 1,
    exclude: ["__tests__/**/*.native.test.ts"],
};

export const config = _.defaultsDeep(overrides, defaultConfig);
