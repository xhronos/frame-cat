var Promise  = require('bluebird');
const fs     = require('fs-extra');
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
	return processFiles(options);
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
			case '-a':
				options.append = true;
				break;

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
		else if (options.append && !options.referenceFile) {
			options.error = "no reference file to append to";
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

function processFiles(options) {
	return Promise.resolve(options)
	.tap(getReferenceInfo)
	// .tap(openFiles)
	.then((info)=>{
		console.log("DONE", info);
	});
}


function getReferenceInfo(options) {
	return Promise.resolve()
	.then(()=>{
		if (options.referenceFile) return getInfoFromFile(options.referenceFile);
	 	return {
			offset      : 0,
			columnCount : null,
		};
	})
	.then(info => {
		console.log("info", info);
	});
}

const regexDigit = /[0-9]/;

function getInfoFromFile(file, onlyStartOffset=false) {
	const info = {
		offset      : 0,
		columnCount : null,
	};
	const processBuf = processBufferForInfo(info, onlyStartOffset);

	return new Promise((resolve,reject)=>{
		let buf = "";
		const rs = fs.createReadStream(file);
		rs.on('error', reject);
		rs.on('close', () => {
			try {
				if (typeof buf === 'string') {
					processBuf(buf, true);
				}
			}catch(e){
				rs.destroy(e);
				return;
			}
			resolve(info);
		});
		rs.on('data', data => {
			buf += data;
			try {
				buf = processBuf(buf);
				if (buf === true) {
					rs.destroy();
				}
			}catch(e){
				rs.destroy(e);
			}
		});
	})
	.return(info);
}

/**
* returns {String|boolean} new buf or true if done
*/
function processBufferForInfo(info, onlyStartOffset){ return (buf, last) => {
	const lines = buf.split('\n');
	const count = last || 0===lines.length || 0===lines[lines.length-1].length ?
		lines.length : lines.length -1;
	for (let i=0; i<lines.length; ++i) {
		const line = lines[i].trim();
		if (!line.length) continue;
		const firstChar = line[0];
		if (firstChar === '#') continue;
		if (regexDigit.test(firstChar)) {
			// frame line
			const cols = line.split(',');
			info.offset = parseFloat(cols[0]);
			if (onlyStartOffset) return true; // done
		}
		else {
			// header lines
			if (info.columnCount) throw new Error("multiple column headers defined");
			info.columnCount = line.split(' ').length;
		}
	}
	if (!last && lines.length>0) return lines[lines.length-1];
	return "";
};}

// -----------------------------------------------------------------------------

if (require.main === module)  {
	main();
}
else {
	module.exports = {
		getOptions       : getOptions,
		getReferenceInfo : getReferenceInfo,
		getInfoFromFile  : getInfoFromFile,
		processFiles     : processFiles,
	};
}
