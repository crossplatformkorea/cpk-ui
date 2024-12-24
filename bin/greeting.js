#!/usr/bin/env node
'use strict';

const welcome = `
  ____                         ____  _       _    __                        _  __                    
 / ___|_ __ ___  ___ ___      |  _ \\| | __ _| |_ / _| ___  _ __ _ __ ___   | |/ /___  _ __ ___  __ _ 
| |   | '__/ _ \\/ __/ __|_____| |_) | |/ _\` | __| |_ / _ \\| '__| '_ \` _ \\  | ' // _ \\| '__/ _ \\/ _\` |
| |___| | | (_) \\__ \\__ \\_____|  __/| | (_| | |_|  _| (_) | |  | | | | | | | . \\ (_) | | |  __/ (_| |
 \\____|_|  \\___/|___/___/     |_|   |_|\\__,_|\\__|_|  \\___/|_|  |_| |_| |_| |_|\\_\\___/|_|  \\___|\\__,_|
`;

const homepage = `
Designed by crossplatformkorea.com
`;

// eslint-disable-next-line no-undef
console.log('\x1b[92m%s\x1b[0m', welcome); // Green text

// eslint-disable-next-line no-undef
console.log('\x1b[92m%s\x1b[0m', homepage); // Green text
