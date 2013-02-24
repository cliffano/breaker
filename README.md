Sshm [![http://travis-ci.org/cliffano/breaker](https://secure.travis-ci.org/cliffano/breaker.png?branch=master)](http://travis-ci.org/cliffano/breaker)
-----------

Breaker is a command-line tool to execute shell script or command on multiple remote hosts in parallel.

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

Remotely execute shell command via SSH on selected hosts in series:

    breaker -l label1,label2 ssh <command>

remember to wrap command in quotes, e.g. "pwd; df -kh; uname -a;"

Configuration
-------------

.breaker.json contains an array of host objects:

    [
      { "host": "dev1.com", "labels": [ "dev" ] },
      { "host": "dev2.com", "labels": [ "dev" ] },
      { "host": "prod1.com", "labels": [ "prod" ] }
    ]