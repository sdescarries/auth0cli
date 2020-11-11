# Auth0 Command Line Interface

This utility challenges the [Resource Owner Password](https://auth0.com/docs/api/authentication?javascript#resource-owner-password) API of Auth0 with a standard username and password login.

## ⚠️ Development Only

> This flow should only be used from **highly-trusted applications** that cannot do redirects. If you can use redirect-based flows from your app, we recommend using the Authorization Code Flow instead.

## Requirements

### DENO

This tools is targeted for [Deno](https://deno.land/). See the [official installation instructions](https://deno.land/) for details.

### Auth0 Regular Web Application

On the Auth0 management site, create an application based on a **regular web application** profile.

- Enable Refresh Token Rotation
- Enable Refresh Token in GRANTS
- Activate the *needed* Database Connections

### Tenant Configuration

Create an `.env` file or export the following variables with the parameters from the Auth0 tenant.

```sh
# The API Audience URL of your tenant
AUTH_AUDIENCE=

# Properties of the Application
AUTH_CLIENT_ID=
AUTH_CLIENT_SECRET=

# The tenant domain (example.auth0.com)
AUTH_DOMAIN=

# Which database connection to use
AUTH_REALM=

# Your login credentials
AUTH_USERNAME=
AUTH_PASSWORD=
```

## Installing

This utility requires the following permissions at runtime:

- `--allow-env` the whole tenant configuration is passed by environment variables
- `--allow-net` API calls need network access
- `--allow-read` Load existing session files from `~/.auth0cli-<clientId>.json`
- `--allow-write` Save new session files to `~/.auth0cli-<clientId>.json`

```sh
deno install -qf --allow-env --allow-net --allow-read --allow-write auth0cli.ts
```


## Usage

### `./auth0cli.ts login`

Initiates a new session and challenges with the username and password. On success the result will be logged to console and the session JSON will be recorded into `~/.auth0cli-<clientId>.json`

```JSON
Login successful, please handle these tokens carefully
{
  "accessToken": "eyJhbGciOiJSU...",
  "refreshToken": "v1.MaqSwVdfr...",
  "scope": "offline_access",
  "expiresIn": 86400,
  "tokenType": "Bearer",
  "expiresAt": "2020-11-09T19:34:46.246Z"
}
```

### `./auth0cli.ts refresh`

Loads a cached session from `~/.auth0cli-<clientId>.json` and initiates a refresh token challenge. On success the new tokens and updated expiration will logged to console and the session file will be updated.

```JSON
Refresh successful, please handle these tokens carefully
{
  "accessToken": "eyJhbGciOiJSU...",
  "refreshToken": "v1.MaqSwVdfr...",
  "scope": "offline_access",
  "expiresIn": 86400,
  "tokenType": "Bearer",
  "expiresAt": "2020-11-09T19:41:40.193Z"
}
```