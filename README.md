# harlanzw.com

This repo is the project for my personal website. It's built using VitePress (Vite + Vue3) with a custom templat using TailwindCSS.

Feel free to clone it if you'd like to setup your own personal site. 

Setup
-------------

#### **Environment**

Recommended:
- [node - latest](https://nodejs.org/en/)
- [yarn - latest](https://yarnpkg.com/)

#### **Instructions**

1. Install deps `yarn`
2. Run app `yarn dev`


Usage
-------------

#### **Deployment**

Deployment is only setup for S3+Cloudfront.

#### GitHub Deployment

If that is the case, you can go into your Github repo settings and setup the keys:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

On master branch pushes, it will deploy the website.

Note: The IAM will need permission to the pushing to the s3 bucket and cloudfront cache invalidation.


#### Manual Deployment 

If you want to deploy outside of Github repo you can run `./scripts/deploy.sh`
