const should = require('chai').should();
const mod    = require('../frame.js');

describe('frame', function(){
	it('should process cmdline arg -h', function(){
		{
			const opt = mod.getOptions(['-h']);
			should.exist(opt);
			should.not.exist(opt.error);
			opt.should.have.property('printUsage').equal(true);
		}
		{
			const opt = mod.getOptions(['-r']);
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
