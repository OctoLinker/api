# OctoLinker API

Returns the github repository url for the requested package.

The supported registries are:

- [npmjs.com](https://npmjs.com)
- [bower.io](http:/bower.io)
- [getcomposer.org](https://getcomposer.org)
- [rubygems.org](https://rubygems.org)
- [pypi.python.org](https://pypi.python.org)
- [crates.io](https://crates.io)
- [melpa.org](https://melpa.org)
- [pub.dev](https://pub.dev)

Example:

[POST] https://octolinker-api.now.sh/

Body:

```json
[
  { "type": "npm", "target": "react" },
  { "type": "composer", "target": "phpunit/phpunit" },
  { "type": "ping", "target": "https://github.com" },
  { "type": "npm", "target": "unknown-package" }
]
```

or as 

[GET] https://octolinker-api.now.sh/?npm=react,lodash&composer=phpunit/phpunit

Type must be one of:

- `npm`
- `bower`
- `composer`
- `rubygems`
- `pypi`
- `crates`
- `java`
- `go`
- `pub`
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

`npm install`

Run server:

`npm run dev`

## Testing

`npm test`

## Privacy Policy

Our [Privacy Policy](https://octolinker.now.sh/privacy/) describes our practices related to the use, storage and disclosure of information we collect when you're using our service.

## License

Copyright (c) 2015–present [Stefan Buck](https://stefanbuck.com/) and [other contributors](https://github.com/OctoLinker/api/graphs/contributors).
Licensed under the MIT license.
