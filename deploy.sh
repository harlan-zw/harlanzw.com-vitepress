#!/usr/bin/env bash

yarn build

aws s3 cp app/.vitepress/dist s3://new.harlanzw.com --profile=hzw --recursive --acl=public-read --include="*" --exclude "*.html" --cache-control max-age=31536000,public
aws s3 cp app/.vitepress/dist s3://new.harlanzw.com --profile=hzw --recursive --acl=public-read --exclude="*" --include "*.html" --cache-control max-age=0,no-cache,no-store,must-revalidate

aws cloudfront create-invalidation --profile=hzw --distribution-id=EMBZGGZKSX2IY --paths '/*'
