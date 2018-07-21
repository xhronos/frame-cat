const should = require('chai').should();
const mod    = require('../frame.js');

describe('frame', function(){
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
	it('should get reference file info (1)', function(){
		return mod.getInfoFromFile('test/data/1.txt')
		.then(info=>{
			info.offset.should.equal(20.916);
			info.columnCount.should.equal(20);
		});
	});
	it('should get reference file info (2)', function(){
		return mod.getInfoFromFile('test/data/2.txt')
		.then(info=>{
			info.offset.should.equal(44.695);
			info.columnCount.should.equal(20);
		});
	});
	it('should get input file info (1)', function(){
		return mod.getInfoFromFile('test/data/1.txt', true)
		.then(info=>{
			info.offset.should.equal(0);
			info.columnCount.should.equal(20);
		});
	});
	it('should get input file info (2)', function(){
		return mod.getInfoFromFile('test/data/2.txt', true)
		.then(info=>{
			info.offset.should.equal(20.923);
			info.columnCount.should.equal(20);
		});
	});
});
