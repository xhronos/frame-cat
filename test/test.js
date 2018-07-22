var Promise = require('bluebird');
const should = require('chai').should();
const fs     = require('fs-extra');
const mod    = require('../frame.js');

const testDataDir = "./test/data/";
const testFile_check     = testDataDir+'whole.txt';
const testFile_reference = testDataDir+'1.txt';
const testFile_output    = testDataDir+'out.txt';
const testFile_input     = testDataDir+'2.txt';

describe('frame', function(){
	describe('cmdline args', function(){
		it('should process cmdline args', function(){
			{
				const opt = mod.getOptions(['-h']);
				should.exist(opt);
				should.not.exist(opt.error);
				opt.should.have.property('printUsage').equal(true);
			}
			{
				const opt = mod.getOptions(['-a']);
				should.exist(opt);
				opt.should.have.property('error').not.equal(null);
			}
			{
				const opt = mod.getOptions(['-a', '-r', 'x.txt']);
				should.exist(opt);
				opt.should.have.property('error').not.equal(null);
			}
			{
				const opt = mod.getOptions(['-r', 'x.txt']);
				should.exist(opt);
				opt.should.have.property('error').not.equal(null);
			}
			{
				const opt = mod.getOptions(['-r', 'x.txt', 'y.txt']);
				should.exist(opt);
				should.not.exist(opt.error);
				(!!opt.printUsage).should.equal(false);
				opt.should.have.property('referenceFile').equal('x.txt');
				opt.should.have.property('inputFile').equal('y.txt');
				(!!opt.append).should.equal(false);
			}
			{
				const opt = mod.getOptions(['-a', '-r', 'x.txt', 'y.txt']);
				should.exist(opt);
				should.not.exist(opt.error);
				(!!opt.printUsage).should.equal(false);
				opt.should.have.property('referenceFile').equal('x.txt');
				opt.should.have.property('inputFile').equal('y.txt');
				opt.should.have.property('append').equal(true);
			}
			{
				const opt = mod.getOptions(['y.txt']);
				should.exist(opt);
				should.not.exist(opt.error);
				(!!opt.printUsage).should.equal(false);
				opt.should.not.have.property('referenceFile');
				opt.should.have.property('inputFile').equal('y.txt');
			}
		});
	});
	describe('get info from file',function(){
		it('should get reference file info (1)', function(){
			return mod.getInfoFromFile(testFile_reference)
			.then(info=>{
				info.offset.should.equal(20.916);
				info.columnCount.should.equal(20);
			});
		});
		it('should get reference file info (2)', function(){
			return mod.getInfoFromFile(testFile_input)
			.then(info=>{
				info.offset.should.equal(24.695);
				info.columnCount.should.equal(20);
			});
		});
		it('should get input file info (1)', function(){
			return mod.getInfoFromFile(testFile_reference, true)
			.then(info=>{
				info.offset.should.equal(0);
				info.columnCount.should.equal(20);
			});
		});
		it('should get input file info (2)', function(){
			return mod.getInfoFromFile(testFile_input, true)
			.then(info=>{
				info.offset.should.equal(0.923);
				info.columnCount.should.equal(20);
			});
		});
	});
	describe('should concatenate test data',function(){
		it('cleanup',function(){
			return fs.unlink(testFile_output).catch(()=>{});
		});
		it('prepare',function(){
			return fs.createReadStream(testFile_reference).pipe(fs.createWriteStream(testFile_output));
		});
		it('concatenate',function(){
			const options = {
				referenceFile : testFile_output,
				inputFile     : testFile_input,
				append        : true,
			};
			return mod.processFiles(options);
		});
		it('check concatenated file',function(){
  			return Promise.all([
				fs.readFile(testFile_output),
				fs.readFile(testFile_check),
			])
			.spread((output, check)	=> {
				output = "" + output;
				check  = "" + check;
				check.length.should.be.above(0);
				output.should.equal(check);
			});
		});
	});
});
