shoot [![http://travis-ci.org/cliffano/shoot](https://secure.travis-ci.org/cliffano/shoot.png?branch=master)](http://travis-ci.org/cliffano/shoot)
-----------

Shoot is a CLI tool to execute shell script on multiple remote hosts in parallel.

Installation
------------

    npm install -g shoot 

Usage
-----

Create hosts and tasks file example:

    shoot init
    
Display tasks, hosts, and tags information:

    shoot tasks|hosts|tags

Execute a task on multiple servers using a tag:

    shoot do <task> <comma-separated-tags>

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
 