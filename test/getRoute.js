const chai = require('chai');
const chaiHttp = require('chai-http');

const serverAddress = 'http://localhost:3000/';

// Assertion style
chai.should();

chai.use(chaiHttp);

describe('Cache Get API', () => {
    // Test the getRoute
    describe('API /cache get', () => {
        it('should get the all cache', (done) => {
            chai.request(serverAddress)
                .get('cache/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.status.should.be.eql('success');
                    res.body.data.should.be.an('array');
                    done();
                });
        });

        it('should get key cache :: sending key', (done) => {
            chai.request(serverAddress)
                .get('cache?key=key1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.status.should.be.eql('success');
                    res.body.data.should.be.an('object');
                    res.body.data.key.should.be.eql('key1');
                    res.body.data.ttl.should.be.an('number');
                    Object.keys(res.body.data).length.should.be.eql(3);
                    done();
                });
        });
    });
});
