#!/usr/local/bin/node
var srcGlob = process.argv[2] ? process.argv[2] : 'src/**/*.js'
var damnit = require('./')
damnit({
  srcGlob
})
