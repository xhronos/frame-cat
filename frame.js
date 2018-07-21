const fs     = require('fs');
const path   = require('path');

function main() {
	const options = getOptions(getArgsFromProcess());
	if (options.error) {
		console.error(options.error);
		printUsage();
		process.exit(1);
	}
	if (options.printUsage) {
		console.error(options.error);
		printUsage();
		process.exit(0);
	}
}

function getArgsFromProcess(){
	let args;
	[,, ...args] = process.argv;
	return args;
}

function getOptions(args){
	return processArgs(args);
}

function processArgs(args) {
	const options = {};
	for (let i = 0; i<args.length; ++i) {
		const opt = args[i];
		switch (opt) {
			case '-h':
				options.printUsage = true;
				break;

			case '-r':
				if (args.length <= i+1) {
					options.error = "missing file argument for '-r'";
					break;
				}
				++i;
				options.referenceFile = args[i];
				break;

			default:
				if (options.inputFile) {
					options.error = "only one file parameter allowed";
					break;
				}
				options.inputFile = opt;
		}
		if (options.error || options.printUsage) break;
	}
	if (!options.error && !options.printUsage) {
		if (!options.inputFile) {
			options.error = "no input file";
		}
	}
	return options;
}

function printUsage() {
	const script = path.fileName(process.argv[1]);
	console.log("node " + script + " " + "[-h] [-a] [-r <FILE>] <FILE>");
	console.log("  -a            directly append to reference file");
	console.log("  -r <FILE>     reference file");
	console.log("  -h            print this help");
}

if (require.main === module)  {
	main();
}
else {
	module.exports = {
		getOptions     : getOptions,
	};
}
