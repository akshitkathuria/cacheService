const chai = require('chai');
const chaiHttp = require('chai-http');

const serverAddress = 'http://localhost:3000/';

// Assertion style
chai.should();

chai.use(chaiHttp);

describe('Cache Delete API', () => {
    // Test the getRoute
    describe('API /cache delete', () => {
        it('should delete cache by key name', (done) => {
            chai.request(serverAddress)
                .delete('cache?key=key1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.status.should.be.eql('success');
                    done();
                });
        });

        it('should delete all cache', (done) => {
            chai.request(serverAddress)
                .get('cache')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.status.should.be.eql('success');
                    done();
                });
        });
    });
});
