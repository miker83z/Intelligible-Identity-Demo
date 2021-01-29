# intelligible-suite-demo

## Project setup
### Install Intelligible Suite SDK
In a parent folder clone the suite SDK:
```
git clone https://github.com/BitNomos/Intelligible-Identity-SDK.git
mv Intelligible-Identity-SDK IntelligibleSuite
cd IntelligibleSuite
git checkout suite
```
then install each package in `/packages/` in this order:
```
cd packages/wrappers/
npm install
cd ../Intelligible-Identity-SDK/
npm install
cd ../Intelligible-Certificate-SDK/
npm install
```
if `npm ERR! enoent` try install multiple times in the same order.

### Install Intelligible DEMO
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
