var sys = require('sys');
var fs = require('fs');
var daemon = require('daemon');

//
// this utility allows us to easily make init.d service wrappers
// around node scripts.
//

var args = process.argv;
var run_args;

exports.run = function(run_args_a){

	run_args = run_args_a;

	switch(args[2]){

		case "stop":
			stop();
			process.exit(0);
	                break;

		case "start":
			start();
			break;

		case "restart":
			stop();
			start();
			break;

		case "status":
			var pid = getPid(run_args.lockFile);
			if (pid){
				sys.puts("Running, pid="+pid);
			}else{
				sys.puts("Not running");
			}
			process.exit(0);
			break;

		case "simple":
			break;

		default:
			sys.puts('Usage: [start|stop|restart|status|simple]');
			process.exit(0);
	}
}

function start(){
	var pid = getPid(run_args.lockFile);
	if (pid){
		sys.puts('Already running');
		process.exit(0);
	}

	fs.open(run_args.logFile, 'w+', function (err, fd){
		if (err){
			sys.puts('Error starting daemon: ' + err);
			process.exit(1);
		}
		daemon.daemonize(fd);
		daemon.lock(run_args.lockFile);
	});
}

function stop(){
	var pid = getPid(run_args.lockFile);
	if (pid){
		process.kill(pid);
		fs.unlinkSync(run_args.lockFile);
		sys.puts('OK');
	}else{
		sys.puts('Not running');
	}
}

function getPid(filename){
	try {
		return parseInt(fs.readFileSync(filename));
	} catch (e){
		return 0;
	}
}
