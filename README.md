# Brewbe

Ease management of project settings (ports, versions etc..) and build files for different environments automatically.

## Why?

I needed some conventions for different projects to store settings centrally like versions of development packages and export them to different files each one for a single environment like dev, staging or production.

There are tons of tools out there (like zc.buildout and its filetemplate recipe) and you could configure build tools like Gulp and Grunt to do it but it should be more easy in usage without much configuration. Sometimes you dont need the boilerplate ;-)

## Features

* Buildout relevant files and whole folders for development
* Store configuration settings (like versions, ports) centrally
* Keep configuration overhead low
* Automatically export different files for different environments
* Automatically keep .gitignore up-to-date

## Requirements

* Node TBD

## Installation

    npm install brewbe -g

## Usage

### Basics

First, create a `buildout.cfg` in your project root with some properties in ini style like this:

    hello = world

### Buildout Single File

Create a hidden file with syntax `.<name>#buildout`, for example `.poetry#buildout` with content like this:

    Hello {{hello}}

Then run with working directory in project root:

    brewbe buildout

And `brewbe` will create a file in the same directory like `.poetry#buildout` called `poetry` with the content:

    Hello world

### Buildout whole folder

Brewbe can buildout folders as well. Therefore create a folder called `.poetry#buildout` and within that folder a file called `lyrics` with content like this:

    Hello {{world}}

After running `brewbe buildout` there will be a folder called `poetry` with a file called `lyrics` and its content:

    Hello world

## Tests

To run the tests:

```
npm run test
```

## Contribute

Feel free to edit the relevant parts and open a Pull Request but don't forget to write tests!
