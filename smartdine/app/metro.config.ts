// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix: Prevent Metro from trying to resolve Node built-ins (crypto, url, etc.)
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Block Node built-in modules that axios tries to import
  const nodeBuiltins = ['crypto', 'url', 'http', 'https', 'zlib', 'stream', 'buffer', 'util', 'events', 'net', 'tls', 'fs', 'path', 'os'];
  if (nodeBuiltins.includes(moduleName)) {
    return { type: 'empty' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;