Sshm [![http://travis-ci.org/cliffano/sshm](https://secure.travis-ci.org/cliffano/sshm.png?branch=master)](http://travis-ci.org/cliffano/sshm)
-----------

Sshm is a command-line tool to execute shell script or command on multiple remote hosts in parallel.

Installation
------------

    npm install -g sshm 

Usage
-----

Create hosts.json and task files examples:

    sshm init
    
Display tasks, hosts, and tags information:

    sshm tasks|hosts|tags

Execute task on multiple servers:

    sshm x <task> <comma-separated-tags>

Execute command on multiple servers:

    sshm x <command> <comma-separated-tags>

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
 
