module.exports = {
  "*.{js,jsx,ts,tsx,md,json,css,yml,yaml}": [
    "prettier --write",
    "eslint --fix",
  ],
};
