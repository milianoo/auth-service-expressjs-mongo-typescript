const config = {
    secret: 'SecretForPassportJWT',
    mongodbPath: 'mongodb://localhost:27017/',
    databaseName: 'oauth',
    allowed_origins: [
        'https://vsma.finlex.de'
    ]
};

export default config;