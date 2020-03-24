// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start();
require("@rails/activestorage").start();
require("channels");

require("admin-lte/dist/css/adminlte");
require("admin-lte/plugins/fontawesome-free/css/all");
const images = require.context('../images/', true);

require("admin-lte/plugins/jquery/jquery");
require("admin-lte/plugins/bootstrap/js/bootstrap");
require("admin-lte/dist/js/adminlte");


// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)
