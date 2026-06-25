const defaultVersions = {
  react: '^18',
  '@types/react': '^18',
  'react-dom': '^18',
  '@types/react-dom': '^18',
  "html-webpack-plugin": 'latest',
  "webpack-cli": 'latest',
  "webpack-dev-server": 'latest',
  'babel-loader': '^8',
  '@babel/core': '^8',
  '@babel/preset-typescript': '^8',
  '@babel/preset-react': '^8',
  '@babel/preset-env': '^8',
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
