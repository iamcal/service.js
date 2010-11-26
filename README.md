This module allows you to turn your node app into a linux init.d daemon with a minimum of hassle.
It requires <a href="https://github.com/indexzero/daemon.node">daemon.node</a>.

If you have <a href="http://npmjs.org/">npm</a>, installation is just:

	npm install service

First, write a wrapper/preamble:

	#!/usr/local/bin/node

	require('service').run({
		lockFile: '/var/run/my_app.pid',
		logFile : '/var/log/my_app.log',
	});

	// your app goes here...

Then execute it:

	./wrapper.js [start|stop|restart|status|simple]

The first commands do what you would expect, running the app as a daemon.
The <code>simple</code> command allows you to run the app in interactive mode for testing.

In daemon mode, output sent during startup will be echo'd to the console, while anything sent 
after the first timer/event will go to the log file.

Unfortunately <code>chkconfig</code> requires extra comment lines at the top of the
file that aren't node compatible, so you may want to call your js wrapper from a shell
script like this:

	#!/bin/sh
	# chkconfig: 2345 95 20
	# description: my_app
	# processname: node
	/usr/local/my_app/wrapper.js "$@"

Then to get everything going:

	ln -s /usr/local/my_app/init.sh /etc/init.d/my_app
	chkconfig --add my_app
	chkconfig my_app on
	/etc/init.d/my_app start

