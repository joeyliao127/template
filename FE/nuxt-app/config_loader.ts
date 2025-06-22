import fs from 'fs';
import YAML from 'yaml';

let env = process.env.ENV || process.env.NODE_ENV || 'deveplopment';

if (env === 'testing') env = 'development';
export const ENV_TYPE = env;

const system = YAML.parse(fs.readFileSync('./asset/system.yaml', 'utf-8'));
export const config = system[ENV_TYPE];
