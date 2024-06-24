# Nuxeo Admin console UI
Nuxeo Admin console UI is a standard base web application for Nuxeo admin users.

# Development workflow
## Required environment
- Java 17
- Maven 3+
- NodeJS 20+ + NPM
## Setup Maven and NPM repositories

Generate the `TOKEN_NAME` & `TOKEN_PASS_CODE` from [package.nuxeo.com](https://packages.nuxeo.com/#user/usertoken )
Once you have it, just add the following lines to your Maven settings.xml :

```bash
<settings>
   <servers>
      <server>
      <id>maven-internal</id>
      <username>TOKEN_NAME</username>
      <password>TOKEN_PASS_CODE</password>
      </server>
   </servers>
</settings>
```
And those lines to your NPM .npmrc :
```bash
@hylandsoftware:registry=https://npm.pkg.github.com
@nuxeo:registry=https://packages.nuxeo.com/repository/npm-public
registry=https://registry.npmjs.org/
//npm.pkg.github.com/:_authToken=GITHUB_TOKEN
```


## Naviagte to Working Directory
```bash
nuxeo-admin-console-web/angular-app
```

## Install dependencies
```bash
npm i
```
## Start 
```bash
npm run start
```
This makes the Admin console UI available on http://localhost:4200/.

## Run Unit Test
```bash
npm run test
```

## Build
```bash
npm run build
```
# Production workflow
## Marketplace package
On root directory
```bash
mvn package
```
This will build the `nuxeo-admin-console-package/target/nuxeo-admin-console-package-${project.version}.zip` Admin Console UI marketplace to be deployed in a nuxeo server.

A nuxeo platform is expected to run on http://localhost:8080/nuxeo/nuxeoadmin. 
To configure CORS, we need to add the following line to `nuxeo.conf` file in our Nuxeo Server:
```bash
  nuxeo.cors.urls=*
```

©2023 Hyland Software, Inc. and its affiliates. All rights reserved. All Hyland product names are registered or unregistered trademarks of Hyland Software, Inc. or its affiliates.

All images, icons, fonts, and videos contained in this folder are copyrighted by Hyland Software, all rights reserved.

# About Nuxeo
Nuxeo dramatically improves how content-based applications are built, managed and deployed, making customers more agile, innovative and successful. Nuxeo provides a next generation, enterprise ready platform for building traditional and cutting-edge content oriented applications. Combining a powerful application development environment with SaaS-based tools and a modular architecture, the Nuxeo Platform and Products provide clear business value to some of the most recognizable brands including Verizon, Electronic Arts, Sharp, FICO, the U.S. Navy, and Boeing. Nuxeo is headquartered in New York and Paris. More information is available at www.nuxeo.com.