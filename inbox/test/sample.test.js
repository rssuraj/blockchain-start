const assert = require('assert');

// Example unit tests
class Car {
    park() {
        return 'stopped';
    }

    drive() {
        return 'vroom';
    }
}

describe('Car', () => {
    let car;

    beforeEach(() => {
        car = new Car();
    });

    it('can park', () => {
        assert.equal(car.park(), 'stopped');
    });

    it('can drive', () => {
        assert.equal(car.drive(), 'vroom');
    });
});