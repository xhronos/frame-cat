const should = require('chai').should();
const mod    = require('../frame.js');

describe('frame', function(){
	it('should process cmdline arg -h', function(){
		{
			const opt = mod.getOptions(['-h']);
			should.exist(opt);
			opt.should.have.property('printUsage').equal(true);
		}
	});
});
