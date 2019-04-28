# OctoLinker API [![Build Status][travis-image]][travis-url]

Returns the github repository url for the requested package.

The supported registries are:

- [npmjs.com](https://npmjs.com)
- [bower.io](http:/bower.io)
- [getcomposer.org](https://getcomposer.org)
- [rubygems.org](https://rubygems.org)
- [pypi.python.org](https://pypi.python.org)
- [crates.io](https://crates.io)
- [melpa.org](https://melpa.org)

Example:

[POST] https://octolinker.now.sh/api

Body:

```json
[
  { "type": "npm", "target": "react" },
  { "type": "composer", "target": "phpunit/phpunit" },
  { "type": "ping", "target": "https://github.com" },
  { "type": "npm", "target": "unknown-package" }
]
```

Type must be one of:

- `npm`
- `bower`
- `composer`
- `rubygems`
- `pypi`
- `crates`
- `java`
- `go`
- `ping`

Response:

```json
{
  "result": [
    {
      "type": "npm",
      "target": "react",
      "result": "https://github.com/facebook/react"
    },
    {
      "type": "composer",
      "target": "phpunit/phpunit",
      "result": "https://github.com/sebastianbergmann/phpunit"
    },
    {
      "type": "ping",
      "target": "https://github.com",
      "result": "https://github.com"
    },
    {
      "type": "npm",
      "target": "unknown-package"
    }
  ]
}
```

## Installation

Install dependencies:

`yarn install`

Run server:

`yarn start`

## Testing

`yarn test`

## Privacy Policy

Our [Privacy Policy](https://github.com/OctoLinker/OctoLinker/blob/master/privacy-policy.md) describes our practices related to the use, storage and disclosure of information we collect when you're using our service.

## License

Copyright (c) 2015 Stefan Buck. Licensed under the MIT license.

[travis-url]: https://travis-ci.org/OctoLinker/api
[travis-image]: https://travis-ci.org/OctoLinker/api.svg?branch=master
