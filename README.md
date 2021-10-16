# Auth0 Command Line Interface

This utility challenges the
[Resource Owner Password](https://auth0.com/docs/api/authentication?javascript#resource-owner-password)
API of Auth0 with a standard username and password login.

## ⚠️ Development Only

> This flow should only be used from **highly-trusted applications** that cannot
> do redirects. If you can use redirect-based flows from your app, we recommend
> using the Authorization Code Flow instead.

## Requirements

### DENO

This tools is targeted for [Deno](https://deno.land/), see the
[official installation instructions](https://deno.land/) for details.

### Auth0 Regular Web Application

On the Auth0 management site, create an application based on a **regular web
application** profile.

- Enable Refresh Token Rotation (_recommended_)
- Enable Refresh Token in GRANTS
- Activate the _needed_ Database Connections

### Tenant Configuration

Create an `.env` file or export the following variables with the parameters from
the Auth0 tenant.

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

> Note that environment variables have precedence over entries in `.env` file.

## Installing

This utility requires the following permissions at runtime:

- `--allow-env` the whole tenant configuration is passed by environment
  variables
- `--allow-net` API calls need network access
- `--allow-read` Load existing session files from `~/.auth0cli-<clientId>.json`
- `--allow-write` Save new session files to `~/.auth0cli-<clientId>.json`

```sh
deno install -qf --allow-env --allow-net --allow-read --allow-write auth0cli.ts
```

Install directly from github:

```sh
deno install -qf --allow-env --allow-net --allow-read --allow-write https://raw.githubusercontent.com/sdescarries/auth0cli/v1.0.1/auth0cli.ts
```

## Usage

### `> auth0cli login`

Initiates a new session and challenges with the username and password. On
success the result will be logged to console and the session JSON will be
recorded into `~/.auth0cli-<clientId>.json`

### `> auth0cli machine`

Uses the client id and secret for a client grant challenge. This requires the
application to be enabled for this flow in the API and usually has lower quotas
allowed (1000/month for Auth0). See
[client grants](https://auth0.com/docs/api/v2#!/Client_Grants/post_client_grants)
for details.

### `> auth0cli refresh`

Loads a cached session from `~/.auth0cli-<clientId>.json` and initiates a
refresh token challenge. On success the new tokens and updated expiration will
logged to console and the session file will be updated.

### Example output

```JSON
{
  "accessToken": "eyJhbGciOiJSU...",
  "expiresAt": "2020-11-09T19:34:46.246Z",
  "refreshToken": "v1.MaqSwVdfr...",
  "scope": "offline_access",
  "tokenType": "Bearer"
}
```

From this output, the `accessToken` and `tokenType` can be copied for instance
to build an API request with an authorization header:

```javascript
headers: {
  'Authorization': `${tokenType} ${accessToken}`
}
```

## [Testing](https://deno.land/manual/testing)

Make sure your environment is set and run the following:

```sh
deno test -A --coverage=results/coverage
deno coverage results/coverage
```

## Maintenance

Upgrade all dependencies using [UDD](https://github.com/hayd/deno-udd)

```sh
deno install -A -f -n udd https://deno.land/x/udd@0.5.0/main.ts
udd deps/* --tests="deno test -A"
```
