const { environment } = require('@rails/webpacker');
const typescript = require('./loaders/typescript');

const webpack = require('webpack');

environment.loaders.prepend('typescript', typescript);
module.exports = environment;

environment.plugins.append(
  'Provide',
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
  })
);
