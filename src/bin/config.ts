const config = {
    secret: 'SecretForPassportJWT',
    mongodbPath: 'mongodb://localhost:27017/',
    databaseName: 'oauth',
    allowed_origins: [
        'https://vsma.finlex.de',
        'https://cyberpolice.vsma.de'
    ]
};

export default config;