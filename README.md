sshout [![http://travis-ci.org/cliffano/sshout](https://secure.travis-ci.org/cliffano/sshout.png?branch=master)](http://travis-ci.org/cliffano/sshout)
-----------

Sshout is a CLI tool to execute shell script on multiple remote hosts in parallel.

Installation
------------

    npm install -g sshout 

Usage
-----

Create hosts and tasks file example:

    sshout init
    
Display tasks, hosts, and tags information:

    sshout tasks|hosts|tags

Execute a task on multiple servers using a tag:

    sshout do <task> <comma-separated-tags>

Configuration
-------------

hosts.json file is a JSON file containing host name as key and tags array as value:

    {
      "host1": [ "tag1", "tag2" ],
      "host2": [ "tag1" ],
      "host3": [ "tag3", "tag4" ]
    }

Tasks files are shell scripts having file name ending with '.sh', these files must be placed in the same directory as the hosts.json file.

Colophon
--------

Follow [@cliffano](http://twitter.com/cliffano) on Twitter.
 