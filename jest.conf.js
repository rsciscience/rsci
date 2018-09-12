const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '.'),
  moduleFileExtensions: [
    'js'
  ],
  roots: ["<rootDir>/unitTests"],
  testPathIgnorePatterns: [
    '<rootDir>/rsci_ui',
  ]
}
