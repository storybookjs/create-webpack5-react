const defaultVersions = {
  react: '^18',
  '@types/react': '^18',
  'react-dom': '^18',
  '@types/react-dom': '^18',
  "html-webpack-plugin": 'latest',
  "webpack-cli": 'latest',
  "webpack-dev-server": 'latest',
  'babel-loader': 'latest',
  'babel-preset-react-app': 'latest',
  '@babel/core': 'latest',
  '@babel/preset-typescript': 'latest',
  webpack: '^5',
  typescript: '^4.8',
};

module.exports = {
  getDependencies: (args) => {
    let missingVersion = false;
    let n;

    const versions = args.reduce((acc, arg) => {
      if (missingVersion && arg.startsWith('--version')) {
        throw new Error('parsing error');
      }

      if (arg.startsWith('--version')) {
        const [k, v] = arg.split('=');
        n = k.replace('--version-', '');
        acc[n] = v || null;

        if (!v) {
          missingVersion = true;
        }
      } else if (missingVersion) {
        acc[n] = arg;
        missingVersion = false;
      }

      return acc;
    }, defaultVersions);
    return versions;
  }
}
