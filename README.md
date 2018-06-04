## auth-api using node.js and mongodb

A ready to use project for an auth service, developed using node.js and mongodb 

for vanilla script version please check [here](https://github.com/milianoo/auth-service-expressjs-mongo)

### Quick Start

###### On Development 
```
npm install
npm test
npm run start:dev 
```

###### On Production 
```
npm install
npm test
npm run start
```

## Background

#### Access Tokens
Access tokens carry the necessary information to access a resource directly. In other words,
when a client passes an access token to a server managing a resource,
that server can use the information contained in the token to decide whether the client is authorized or not.
Access tokens usually have an expiration date and are short-lived.

**Note** No checks against an authorization server are needed. This is one of the reasons tokens must be signed (using JWS, for instance)

#### Refresh Tokens 
Refresh tokens carry the information necessary to get a new access token. In other words, 
whenever an access token is required to access a specific resource, 
a client may use a refresh token to get a new access token issued by the authentication server. 
Common use cases include getting new access tokens after old ones have expired, 
or getting access to a new resource for the first time. 
Refresh tokens can also expire but are rather long-lived. 
Refresh tokens are usually subject to strict storage requirements to ensure they are not leaked. 
They can also be blacklisted by the authorization server.

**Note** refresh tokens usually require a check against the authorization server

####  implicit grant flow



## Security 
- Frame Guard package does not allow the app to be in ANY frames.

    `Sets "X-Frame-Options: DENY"`
    
    by setting the action to `deny`    

    `app.use(frameguard({ action: 'deny' }))`
    
- Same Origin allowed only, options can be configured in config folder.

##### Actions

- auth.user_web
- auth.reset_password
- auth.verify_email
- user.add
- user.get
- user.update
- user.remove
- users.get