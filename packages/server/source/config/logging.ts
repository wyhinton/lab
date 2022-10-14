import chalk from 'chalk';

/**Message logging utilities */
const getTimeStamp = (): string => {
    return new Date().toISOString();
};

const info = (namespace: string, message: string, object?: any) => {
    if (object) {
        console.log(chalk.yellow(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`, object));
    } else {
        console.log(chalk.yellow(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`));
    }
};
const warn = (namespace: string, message: string, object?: any) => {
    if (object) {
        console.log(`[${getTimeStamp()}] [WARN] [${namespace}] ${message}`, object);
    } else {
        console.log(`[${getTimeStamp()}] [WARN] [${namespace}] ${message}`);
    }
};
const error = (namespace: string, message: string, object?: any) => {
    if (object) {
        console.log(chalk.red(`[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`, object));
    } else {
        console.log(chalk.red(`[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`));
    }
};
const debug = (namespace: string, message: string, object?: any) => {
    if (object) {
        console.log(`[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`, object);
    } else {
        console.log(`[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`);
    }
};

export default {
    info,
    warn,
    error,
    debug
};
