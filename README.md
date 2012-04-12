Shoot [![http://travis-ci.org/cliffano/shoot](https://secure.travis-ci.org/cliffano/shoot.png?branch=master)](http://travis-ci.org/cliffano/shoot)
-----------

Shoot is a command-line tool to execute shell script or command on multiple remote hosts in parallel.

Installation
------------

    npm install -g shoot 

Usage
-----

Create hosts.json and task files examples:

    shoot init
    
Display tasks, hosts, and tags information:

    shoot tasks|hosts|tags

Execute task on multiple servers:

    shoot x <task> <comma-separated-tags>

Execute command on multiple servers:

    shoot x <command> <comma-separated-tags>

remember to wrap command in quotes, e.g. "pwd; df -kh; uname -a;" 

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
 
