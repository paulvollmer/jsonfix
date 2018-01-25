module.exports = {
  "extends": ["eslint:recommended", "google"],
  "parserOptions": {
    "ecmaVersion": 6
  },
  "env" : {
    "node" : true,
    "mocha": true
  },
  "rules": {
    "strict": "warn",
    "max-len": ["error", 120]
  }
};
