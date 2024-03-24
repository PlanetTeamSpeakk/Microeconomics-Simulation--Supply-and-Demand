class OutsideInfluence {
    _duration;
    _hasLastingEffect;

    constructor(duration) {
        this._duration = duration;
    }

    /**
     * @returns {number} the duration (number of rounds) of the outside influence
     */
    get duration() {
        return this._duration;
    }

    /**
     * @returns {boolean} whether the outside influence is active
     */
    get isActive() {
        return this._duration != 0; // Negative duration indicates that the influence doesn't end.
    }

    /**
     * Whether the effects of this influence will linger after it is over.
     * @returns {boolean} whether the outside influence has a lasting effect
     */
    get hasLastingEffect() {
        return this._hasLastingEffect;
    }

    decrementDuration() {
        this._duration--;
    }

    influenceStock(seller) {}

    influencePrice(seller) {}
}

class GovernmentSubsidy extends OutsideInfluence {
    influenceStock(seller) {
        seller.stock += 10;
    }

    influencePrice(seller) {
        seller.price -= 10;
    }
}

class NaturalDisaster extends OutsideInfluence {
    constructor(duration) {
        super(duration);
        this._hasLastingEffect = true;
    }

    influenceStock(seller) {
        seller.stock *= 0.9;
    }

    influencePrice(seller) {
        seller.price += 10;
    }
}
