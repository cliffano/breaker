Breaker [![http://travis-ci.org/cliffano/breaker](https://secure.travis-ci.org/cliffano/breaker.png?branch=master)](http://travis-ci.org/cliffano/breaker)
-----------

Breaker is a utility tool for other server management tools.

This is handy when you want to remotely execute shell command via SSH on multiple hosts. Also useful when you want to format various host files (<a href="http://www.debianadmin.com/ssh-on-multiple-servers-using-cluster-ssh.html">clusterssh config</a>, <a href="http://ansible.cc/docs/patterns.html#hosts-and-groups">Ansible inventory</a>, <a href="http://nerderati.com/2011/03/simplify-your-life-with-an-ssh-config-file/">SSH config</a>) from a single .breaker.json configuration file.

Installation
------------

    npm install -g breaker 

Usage
-----

Create sample Breaker hosts file:

    breaker init
    
Format hosts info into clusterssh config:

    breaker -t clusterssh format

Format hosts info into Ansible inventory:

    breaker -t ansible format

Format hosts info into SSH config:

    breaker -t sshconfig format

Format selected hosts info into clusterssh config:

    breaker -t clusterssh -l label1,label2 format

Remotely execute shell command via SSH in series:

    breaker ssh <command>

remember to wrap command in quotes, e.g. `"pwd; df -kh; uname -a;"`

Remotely execute shell command via SSH on selected hosts in series:

    breaker -l label1,label2 ssh <command>

Filter label using regular expressions

    breaker -l .*dev.*,^prod,backup$ ssh <command>

Configuration
-------------

.breaker.json contains an array of host objects.

For standard SSH (current user, default port, no key), only host needs to be specified, labels are useful for filtering hosts by labels:

    [
      { "host": "dev1.com", "labels": [ "dev" ] },
      { "host": "dev2.com", "labels": [ "dev" ] },
      { "host": "prod1.com", "labels": [ "prod" ] }
    ]

For SSH with specific key, user, and port (all optionals):

    [
      { "host": "dev1.com", "labels": [ "dev" ],
        "ssh":
          [
            { "user": "user1", "port": 2222, "key": "path/to/key1" },
            { "user": "user2", "port": 2223, "key": "path/to/key2" }
          ]
        }
    ]
