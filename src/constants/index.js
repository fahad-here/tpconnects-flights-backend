const PERMISSION_STATES = {
    INCLUDED: 'Included',
    EXCLUDED: 'Excluded',
    FORBIDDEN: 'Forbidden'
}

const USER_ROLES = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    USER: 'User'
}

const EXPIRATION_PERIOD = {
    SHORT: 604800000, // 7 days
    MEDIUM: 1209600000, // 14 days
    LONG: 2592000000 // 30 days
}

module.exports = {
    PERMISSION_STATES,
    USER_ROLES,
    EXPIRATION_PERIOD
}
