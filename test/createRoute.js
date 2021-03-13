const chai = require('chai');
const chaiHttp = require('chai-http');

const serverAddress = 'http://localhost:3000/';

// Assertion style
chai.should();

chai.use(chaiHttp);

describe('Cache Create API', () => {
    // Test the getRoute
    describe('API /cache/get', () => {
        it('should create a new cache', (done) => {
            chai.request(serverAddress)
                .post('cache/create')
                .send({
                    key: 'key1',
                    value: 'value1',
                })
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
