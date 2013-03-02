Breaker [![http://travis-ci.org/cliffano/breaker](https://secure.travis-ci.org/cliffano/breaker.png?branch=master)](http://travis-ci.org/cliffano/breaker)
-----------

Breaker is a utility tool for other server management tools.

This is handy when you want to remotely execute shell command via SSH on multiple hosts. Also useful when you want to format various host files from a single .breaker.json config.

Installation
------------

    npm install -g breaker 

Usage
-----

Create sample Breaker hosts file:

    breaker init
    
Format hosts info into clusterssh config:

    breaker -t clusterssh format

Format hosts info into SSH config:

    breaker -t sshconfig format

Format selected hosts info into clusterssh config:

    breaker -t clusterssh -l label1,label2 format

Remotely execute shell command via SSH in series:

    breaker ssh <command>

remember to wrap command in quotes, e.g. "pwd; df -kh; uname -a;"

Remotely execute shell command via SSH on selected hosts in series:

    breaker -l label1,label2 ssh <command>

Filter label using regular expressions

    breaker -l .*dev.*,^prod,backup$ ssh <command>

Configuration
-------------

.breaker.json contains an array of host objects:

    [
      { "host": "dev1.com", "labels": [ "dev" ] },
      { "host": "dev2.com", "labels": [ "dev" ] },
      { "host": "prod1.com", "labels": [ "prod" ] }
    ]