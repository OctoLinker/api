# Live resolver [![Build Status][travis-image]][travis-url]

A small service that points you to the github repository for the requested package.

## Find a package

https://githublinker.herokuapp.com/q/{registry}/{package}

The supported registries are: `npm` `bower` and `composer`

Example:

https://githublinker.herokuapp.com/q/bower/backbone

Response:

```json
{
  "url": "https://github.com/jashkenas/backbone"
}
```

## Installation

Install dependencies:

`npm install`

Run server:

`npm start`

## Testing

`npm test`


## License

Copyright (c) 2015 Stefan Buck. Licensed under the MIT license.


[travis-url]: https://travis-ci.org/github-linker/live-resolver
[travis-image]: https://travis-ci.org/github-linker/live-resolver.svg?branch=master
