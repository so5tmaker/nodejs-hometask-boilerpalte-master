const { UserRepository } = require('../repositories/userRepository');

class UserService {
    getUsers() {
        return UserRepository.getAll();
    }

    getUserById(id) {
        return UserRepository.getOne({ id });
    }

    addUser(data) {
        return UserRepository.create(data);
    }

    updateUser(id, data) {
        return UserRepository.update(id, data);
    }

    deleteUser(id) {
        return UserRepository.delete(id);
    }

    // TODO: Implement methods to work with user

    search(search) {
        const item = UserRepository.getOne(search);
        if (!item) {
            return null;
        }
        return item;
    }
}

module.exports = new UserService();