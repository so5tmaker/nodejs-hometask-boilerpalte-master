const { FighterRepository } = require('../repositories/fighterRepository');

class FighterService {
    getFighters() {
        return FighterRepository.getAll();
    }

    getFighterById(id) {
        return FighterRepository.getOne({ id });
    }

    addFighter(data) {
        return FighterRepository.create(data);
    }

    updateFighter(id, data) {
        return FighterRepository.update(id, data);
    }

    deleteFighter(id) {
        return FighterRepository.delete(id);
    }
    // TODO: Implement methods to work with fighters
}

module.exports = new FighterService();