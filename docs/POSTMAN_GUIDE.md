# Postman Guide

This guide explains how to import and use the Postman collection for the Creator's Platform API.

## Setup

1. Install Postman from https://postman.com/downloads.
2. Open Postman and switch to the `Local Development` environment.

## Import Files

1. Import `docs/Creator-Platform-API.postman_collection.json` as a collection.
2. Import `docs/Local-Development.postman_environment.json` as an environment.
3. In the top-right environment dropdown, select `Local Development`.

## Start the Server

Run the backend server before sending requests:

- `npm run server`
- or `docker-compose up`

The collection expects the API to be available at `http://localhost:5000`.

## Request Order

1. `Health Check` - verify the server is running.
2. `Register User` - create a new user account.
3. `Login User` - retrieve a JWT token and save it automatically.
4. `Create Post` - create a new post with authentication.
5. `Get All Posts` - list posts created by the authenticated user.
6. `Update Post` - update a post using `{{postId}}`.
7. `Delete Post` - delete a post using `{{postId}}`.

## Variables

- `{{baseURL}}` - the API base URL. Default: `http://localhost:5000`.
- `{{authToken}}` - JWT token returned by `Login User`.
- `{{postId}}` - saved automatically after `Create Post`.
- `{{uniqueEmail}}` - generated automatically by the `Register User` pre-request script.

## Collection Structure

- `Health`
  - `Health Check`
- `Auth`
  - `Register User`
  - `Login User`
- `Posts`
  - `Get All Posts`
  - `Create Post`
  - `Update Post`
  - `Delete Post`

## Notes for Use

- The `Login User` request includes a test script that saves `authToken` into the active environment.
- The `Create Post` request saves the created post ID into `{{postId}}` for use in update and delete requests.
- `Register User` includes a pre-request script to generate a unique email so repeated runs do not fail with duplicate email errors.

## Common Issues

- `Could not get any response`: Ensure the backend server is running and the port is correct.
- `Unauthorized` or `401`: Make sure `Login User` ran successfully and `{{authToken}}` is populated.
- Environment variables not working: Confirm `Local Development` is selected in the environment dropdown.
- `postId` is empty: Run `Create Post` first, then re-run `Update Post` or `Delete Post`.

## Validation

Each request contains assertions that validate:

- HTTP status codes
- response structure
- expected properties such as `success`, `token`, and `data`
