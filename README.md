# What's tablo?

Tablo is an app that displays real-time UK train departures and it's available at [tablo.taknado.com](https://tablo.taknado.com). It's my playground for experimenting with various front-end tech. I intially wrote it to get up to speed with modern javascript and related stuff.

The app displays live departure boards from a specified station with an option to specify a destination station.

# How it works

Tablo is an SPA built with [Vue.js](https://vuejs.org/) and [Bulma](https://bulma.io/). It's bundled using [Webpack](https://webpack.js.org/) and hosted on [Netlify](https://www.netlify.com/). Automated tests are written using [Jest](https://jestjs.io/).

# Data

Live train times are provided by [TransportAPI](https://www.transportapi.com/). It's possible to use the API directly from a client-side app, but to keep the API credentials private (and retain control over API usage) Tablo is using [AWS API Gateway](https://aws.amazon.com/api-gateway/) as a proxy. The proxy is provisioned using [Terraform](https://www.terraform.io/).

# Development

The app uses the API proxy in development mode as well, so the first step is to provision it:

* Populate AWS and TransportAPI credentials: `cp api_proxy/terraform.tfvars.example api_proxy/terraform.tfvars && editor api_proxy/terraform.tfvars`
* Provision the proxy: `cd api_proxy && terraform init && terraform apply`

I use docker for development mainly to not worry about versions of dependencies (e.g. node). There is a `bin/npm` binstub that starts a docker container using the official `node` image, mounts the current directory and exposes port 8080. To start webpack dev server do:

* Run `bin/npm install` to install all dependencies
* Run `bin/npm start` to start webpack dev server which will be available at [localhost:8080](http://localhost:8080)
* Run `bin/npm run test` to start jest in watch mode

# Deployment

* Provision the API proxy: `cd api_proxy && terraform apply`
* Run `bin/npm run build` to create a bundle
* Commit & push to Github to trigger a deployment in Netlify.
