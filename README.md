# Live resolver [![Build Status][travis-image]][travis-url]

Returns the github repository url for the requested package.

The supported registries are:
  - [npmjs.com](https://npmjs.com)
  - [bower.io](http:/bower.io)
  - [getcomposer.org](https://getcomposer.org)
  - [rubygems.org](https://rubygems.org)
  
## Find a package

https://githublinker.herokuapp.com/q/{registry}/{package}

Registry must be one of:
  - `npm`
  - `bower`
  - `composer`
  - `rubygems`

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


[travis-url]: https://travis-ci.org/OctoLinker/live-resolver
[travis-image]: https://travis-ci.org/OctoLinker/live-resolver.svg?branch=master
