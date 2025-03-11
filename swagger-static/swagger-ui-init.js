
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/": {
        "get": {
          "operationId": "AppController_getVercelVersion",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "App"
          ]
        }
      },
      "/testing/all-data": {
        "delete": {
          "operationId": "TestingController_deleteAll",
          "parameters": [],
          "responses": {
            "204": {
              "description": "All data is deleted"
            }
          },
          "summary": "Clear database: delete all data from all tables/collections",
          "tags": [
            "Testing"
          ]
        }
      },
      "/auth/me": {
        "get": {
          "operationId": "AuthController_me",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SwaggerMeViewDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get information about current user",
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/login": {
        "post": {
          "operationId": "AuthController_login",
          "parameters": [],
          "requestBody": {
            "required": false,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SwaggerLoginInputDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Returns JWT accessToken (expired after 10 minutes) in body.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SwaggerLoginSuccessViewDto"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SwaggerErrorsMessagesViewDto"
                  }
                }
              }
            },
            "401": {
              "description": "If the password or login or email is wrong"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "summary": "Try login user to the system",
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/logout": {
        "post": {
          "operationId": "AuthController_logout",
          "parameters": [],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "In cookie client must send correct refreshToken that will be revoked",
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/refresh-token": {
        "post": {
          "operationId": "AuthController_refreshToken",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Returns JWT accessToken (expired after 10 seconds) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 seconds).",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SwaggerRefreshTokenSuccessViewDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing) Device LastActiveDate should be overrode by issued Date of new refresh token",
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/registration": {
        "post": {
          "operationId": "AuthController_registration",
          "parameters": [],
          "requestBody": {
            "required": false,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SwaggerCreateUserInputDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Input data is accepted. Email with confirmation code will be send to passed email address"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SwaggerErrorsMessagesViewDto"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "summary": "Registration in the system. Email with confirmation code will be send to passed email address",
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/registration-confirmation": {
        "post": {
          "operationId": "AuthController_registrationConfirmation",
          "parameters": [],
          "requestBody": {
            "required": false,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SwaggerRegistrationConfirmationInputDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Email was verified. Account was activated"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SwaggerErrorsMessagesViewDto"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "summary": "Confirm registration",
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/registration-email-resending": {
        "post": {
          "operationId": "AuthController_registrationEmailResending",
          "parameters": [],
          "requestBody": {
            "required": false,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SwaggerRegistrationEmailResendingInputDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Input data is accepted.Email with confirmation code will be send to passed email address.Confirmation code should be inside link as query param, for example: https://some-front.com/confirm-registration?code=youtcodehere"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SwaggerErrorsMessagesViewDto"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "summary": "Resend confirmation registration Email if user exists",
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/password-recovery": {
        "post": {
          "operationId": "AuthController_passwordRecovery",
          "parameters": [],
          "requestBody": {
            "required": false,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SwaggerPasswordRecoveryInputDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Even if current email is not registered (for prevent user's email detection)"
            },
            "400": {
              "description": "If the inputModel has invalid email (for example 222^gmail.com)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SwaggerErrorsMessagesViewDto"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "summary": "Password recovery via Email confirmation. Email should be sent with RecoveryCode inside",
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/new-password": {
        "post": {
          "operationId": "AuthController_newPassword",
          "parameters": [],
          "requestBody": {
            "required": false,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SwaggerNewPasswordInputDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "If code is valid and new password is accepted"
            },
            "400": {
              "description": "If the inputModel has incorrect value (for incorrect password length) or RecoveryCode is incorrect or expired",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SwaggerErrorsMessagesViewDto"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "summary": "Confirm password recovery",
          "tags": [
            "Auth"
          ]
        }
      },
      "/users/{id}": {
        "get": {
          "operationId": "UsersController_getById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "User id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserViewDto"
                  }
                }
              }
            },
            "404": {
              "description": "Not Found"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "summary": "Returns user by id",
          "tags": [
            "Users"
          ]
        },
        "delete": {
          "operationId": "UsersController_deleteUser",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "User id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "If specified user is not exists"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "summary": "Delete user specified by id",
          "tags": [
            "Users"
          ]
        }
      },
      "/users": {
        "get": {
          "operationId": "UsersController_getAllUsers",
          "parameters": [
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "minimum": 1,
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "minimum": 1,
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "default": "desc",
                "type": "string",
                "enum": [
                  "asc",
                  "desc"
                ]
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string",
                "enum": [
                  "createdAt",
                  "login",
                  "email"
                ]
              }
            },
            {
              "name": "searchLoginTerm",
              "required": false,
              "in": "query",
              "description": "Search term for user Login: Login should contains this term in any position",
              "schema": {
                "nullable": true,
                "default": null,
                "type": "string"
              }
            },
            {
              "name": "searchEmailTerm",
              "required": false,
              "in": "query",
              "description": "Search term for user Email: Email should contains this term in any position",
              "schema": {
                "nullable": true,
                "default": null,
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginatedViewDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/UserViewDto"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "summary": "Returns users with paging",
          "tags": [
            "Users"
          ]
        },
        "post": {
          "operationId": "UsersController_createUser",
          "parameters": [],
          "requestBody": {
            "required": false,
            "description": "Data for constructing new user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SwaggerCreateUserInputDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created user",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserViewDto"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values <br/> <br/> <i>Note: If the error should be in the BLL, for example, \"the email address is not unique\", do not try to mix this error with input validation errors in the middleware, just return one element in the errors array</i>",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SwaggerErrorsMessagesViewDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "summary": "Add new user to the system",
          "tags": [
            "Users"
          ]
        }
      },
      "/security/devices": {
        "get": {
          "operationId": "SecurityDevicesController_getAllAuthDeviceSessions",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/AuthDeviceSessionViewDto"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Returns all devices with active sessions for current user",
          "tags": [
            "SecurityDevices"
          ]
        },
        "delete": {
          "operationId": "SecurityDevicesController_terminateAllAuthDeviceSessionsExceptCurrent",
          "parameters": [],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Terminate all other (exclude current) device's sessions",
          "tags": [
            "SecurityDevices"
          ]
        }
      },
      "/security/devices/{id}": {
        "delete": {
          "operationId": "SecurityDevicesController_terminateAuthDeviceSessionById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Id of session that will be terminated",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If try to delete the deviceId of other user"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Terminate specified device session",
          "tags": [
            "SecurityDevices"
          ]
        }
      },
      "/blogs": {
        "get": {
          "operationId": "BlogsController_getAllBlogs",
          "parameters": [
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "minimum": 1,
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "minimum": 1,
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "default": "desc",
                "type": "string",
                "enum": [
                  "asc",
                  "desc"
                ]
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string",
                "enum": [
                  "createdAt",
                  "name"
                ]
              }
            },
            {
              "name": "searchNameTerm",
              "required": false,
              "in": "query",
              "description": "Search term for blog Name: Name should contains this term in any position",
              "schema": {
                "nullable": true,
                "default": null,
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginatedViewDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/BlogViewDto"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          "summary": "Returns blogs with paging",
          "tags": [
            "Blogs"
          ]
        },
        "post": {
          "operationId": "BlogsController_createBlog",
          "parameters": [],
          "requestBody": {
            "required": false,
            "description": "Data for constructing new Blog entity",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SwaggerCreateBlogInputDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created blog",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogViewDto"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SwaggerErrorsMessagesViewDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "summary": "Create new blog",
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogs/{id}": {
        "get": {
          "operationId": "BlogsController_getBlogById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Existing blog id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogViewDto"
                  }
                }
              }
            },
            "404": {
              "description": "Not Found"
            }
          },
          "summary": "Returns blog by id",
          "tags": [
            "Blogs"
          ]
        },
        "put": {
          "operationId": "BlogsController_updateBlogById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Blog id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": false,
            "description": "Data for updating",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SwaggerUpdateBlogInputDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SwaggerErrorsMessagesViewDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "summary": "Update existing Blog by id with InputModel",
          "tags": [
            "Blogs"
          ]
        },
        "delete": {
          "operationId": "BlogsController_deleteBlogById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Blog id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "summary": "Delete blog specified by id",
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogs/{blogId}/posts": {
        "get": {
          "operationId": "BlogsController_getAllPostsByBlogId",
          "parameters": [
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "minimum": 1,
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "minimum": 1,
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "default": "desc",
                "type": "string",
                "enum": [
                  "asc",
                  "desc"
                ]
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string",
                "enum": [
                  "createdAt",
                  "title",
                  "blogName"
                ]
              }
            },
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "description": "Blog id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginatedViewDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/PostViewDto"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "404": {
              "description": "If specified blog is not exists"
            }
          },
          "summary": "Returns all posts for specified blog",
          "tags": [
            "Blogs"
          ]
        },
        "post": {
          "operationId": "BlogsController_createPostByBlogID",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "description": "Blog id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": false,
            "description": "Data for constructing new Post entity",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/OmitTypeClass"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created blog",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewDto"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SwaggerErrorsMessagesViewDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "If specified blog doesn't exists"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "summary": "Create new post for specific blog",
          "tags": [
            "Blogs"
          ]
        }
      },
      "/posts": {
        "get": {
          "operationId": "PostsController_getAllPosts",
          "parameters": [
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "minimum": 1,
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "minimum": 1,
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "default": "desc",
                "type": "string",
                "enum": [
                  "asc",
                  "desc"
                ]
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string",
                "enum": [
                  "createdAt",
                  "title",
                  "blogName"
                ]
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginatedViewDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/PostViewDto"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          "summary": "Returns posts with paging",
          "tags": [
            "Posts"
          ]
        },
        "post": {
          "operationId": "PostsController_createPost",
          "parameters": [],
          "requestBody": {
            "required": false,
            "description": "Data for constructing new Blog entity",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SwaggerCreatePostInputDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created post",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewDto"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SwaggerErrorsMessagesViewDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "summary": "Create new post",
          "tags": [
            "Posts"
          ]
        }
      },
      "/posts/{id}": {
        "get": {
          "operationId": "PostsController_getPostById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Id of existing post",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewDto"
                  }
                }
              }
            },
            "404": {
              "description": "Not Found"
            }
          },
          "summary": "Returns post by id",
          "tags": [
            "Posts"
          ]
        },
        "put": {
          "operationId": "PostsController_updatePostById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Post id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": false,
            "description": "Data for updating",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SwaggerUpdatePostInputDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SwaggerErrorsMessagesViewDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "summary": "Update existing post by id with InputModel",
          "tags": [
            "Posts"
          ]
        },
        "delete": {
          "operationId": "PostsController_deletePostById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Post id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "summary": "Delete post specified by id",
          "tags": [
            "Posts"
          ]
        }
      },
      "/posts/{postId}/comments": {
        "get": {
          "operationId": "PostsController_getAllCommentsByPostId",
          "parameters": [
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "minimum": 1,
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "minimum": 1,
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "default": "desc",
                "type": "string",
                "enum": [
                  "asc",
                  "desc"
                ]
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string",
                "enum": [
                  "createdAt"
                ]
              }
            },
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "description": "Post id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginatedViewDto"
                      },
                      {
                        "properties": {
                          "items": {
                            "type": "array",
                            "items": {
                              "$ref": "#/components/schemas/CommentViewDto"
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "404": {
              "description": "If post for passed postId doesn't exist"
            }
          },
          "summary": "Returns comments for specified post",
          "tags": [
            "Posts"
          ]
        },
        "post": {
          "operationId": "PostsController_createCommentByPostId",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "description": "Post id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": false,
            "description": "Data for constructing new comment entity",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SwaggerCreateCommentInputDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created comment",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CommentViewDto"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SwaggerErrorsMessagesViewDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "If specified post doesn't exists"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Create new comment for specified post",
          "tags": [
            "Posts"
          ]
        }
      },
      "/posts/{id}/like-status": {
        "put": {
          "operationId": "PostsController_updateLikePostById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Post id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": false,
            "description": "Like model for make like/dislike/reset operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SwaggerUpdatePostLikeStatusInputDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SwaggerErrorsMessagesViewDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "If post with specified postId doesn't exists"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Make like/unlike/dislike/undislike operation",
          "tags": [
            "Posts"
          ]
        }
      },
      "/comments/{id}": {
        "get": {
          "operationId": "CommentsController_getCommentById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Id of existing comment",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CommentViewDto"
                  }
                }
              }
            },
            "404": {
              "description": "Not Found"
            }
          },
          "summary": "Returns comment by id",
          "tags": [
            "Comments"
          ]
        },
        "put": {
          "operationId": "CommentsController_updateCommentById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Comment id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": false,
            "description": "Data for updating",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SwaggerUpdateCommentInputDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SwaggerErrorsMessagesViewDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If try edit the comment that is not your own"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Update existing comment by id with InputModel",
          "tags": [
            "Comments"
          ]
        },
        "delete": {
          "operationId": "CommentsController_deleteCommentById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Comment id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If try delete the comment that is not your own"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Delete comment specified by id",
          "tags": [
            "Comments"
          ]
        }
      },
      "/comments/{id}/like-status": {
        "put": {
          "operationId": "CommentsController_updateLikeCommentById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Comment id",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": false,
            "description": "Like model for make like/dislike/reset operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SwaggerUpdateCommentLikeStatusInputDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No Content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SwaggerErrorsMessagesViewDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "If comment with specified id doesn't exists"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Make like/unlike/dislike/undislike operation",
          "tags": [
            "Comments"
          ]
        }
      }
    },
    "info": {
      "title": "BLOGGER API",
      "description": "",
      "version": "1.0",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "securitySchemes": {
        "basic": {
          "type": "http",
          "scheme": "basic"
        },
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http",
          "description": "Enter JWT Bearer token only"
        }
      },
      "schemas": {
        "SwaggerMeViewDto": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string"
            },
            "login": {
              "type": "string"
            },
            "email": {
              "type": "string"
            }
          },
          "required": [
            "userId",
            "login",
            "email"
          ]
        },
        "SwaggerLoginInputDto": {
          "type": "object",
          "properties": {
            "loginOrEmail": {
              "type": "string"
            },
            "password": {
              "type": "string"
            }
          },
          "required": [
            "loginOrEmail",
            "password"
          ]
        },
        "SwaggerLoginSuccessViewDto": {
          "type": "object",
          "properties": {
            "accessToken": {
              "type": "string",
              "description": "JWT access token"
            }
          },
          "required": [
            "accessToken"
          ]
        },
        "FieldErrorDto": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "nullable": true,
              "description": "Message with error explanation for certain field"
            },
            "field": {
              "type": "string",
              "nullable": true,
              "description": "What field/property of input model has error"
            }
          }
        },
        "SwaggerErrorsMessagesViewDto": {
          "type": "object",
          "properties": {
            "errorsMessages": {
              "nullable": true,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/FieldErrorDto"
              }
            }
          }
        },
        "SwaggerRefreshTokenSuccessViewDto": {
          "type": "object",
          "properties": {
            "accessToken": {
              "type": "string",
              "description": "JWT access token"
            }
          },
          "required": [
            "accessToken"
          ]
        },
        "SwaggerCreateUserInputDto": {
          "type": "object",
          "properties": {
            "login": {
              "type": "string",
              "maxLength": 10,
              "minLength": 3,
              "pattern": "^[a-zA-Z0-9_-]*$",
              "description": "must be unique"
            },
            "password": {
              "type": "string",
              "maxLength": 20,
              "minLength": 6
            },
            "email": {
              "type": "string",
              "pattern": "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
              "example": "example@example.com",
              "description": "must be unique"
            }
          },
          "required": [
            "login",
            "password",
            "email"
          ]
        },
        "SwaggerRegistrationConfirmationInputDto": {
          "type": "object",
          "properties": {
            "code": {
              "type": "string",
              "description": "Code that be sent via Email inside link"
            }
          },
          "required": [
            "code"
          ]
        },
        "SwaggerRegistrationEmailResendingInputDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "pattern": "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
              "example": "example@example.com",
              "description": "Email of already registered but not confirmed user"
            }
          },
          "required": [
            "email"
          ]
        },
        "SwaggerPasswordRecoveryInputDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "pattern": "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
              "example": "example@example.com",
              "description": "Email of registered user"
            }
          },
          "required": [
            "email"
          ]
        },
        "SwaggerNewPasswordInputDto": {
          "type": "object",
          "properties": {
            "newPassword": {
              "type": "string",
              "maxLength": 20,
              "minLength": 6,
              "description": "New password"
            },
            "recoveryCode": {
              "type": "string",
              "description": "Code that be sent via Email inside link"
            }
          },
          "required": [
            "newPassword",
            "recoveryCode"
          ]
        },
        "UserViewDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "login": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string"
            }
          },
          "required": [
            "id",
            "login",
            "email",
            "createdAt"
          ]
        },
        "PaginatedViewDto": {
          "type": "object",
          "properties": {
            "totalCount": {
              "type": "number"
            },
            "pagesCount": {
              "type": "number"
            },
            "page": {
              "type": "number"
            },
            "pageSize": {
              "type": "number"
            },
            "items": {
              "type": "object"
            }
          },
          "required": [
            "totalCount",
            "pagesCount",
            "page",
            "pageSize",
            "items"
          ]
        },
        "AuthDeviceSessionViewDto": {
          "type": "object",
          "properties": {
            "deviceId": {
              "type": "string"
            },
            "ip": {
              "type": "string"
            },
            "lastActiveDate": {
              "type": "string"
            },
            "title": {
              "type": "string"
            }
          },
          "required": [
            "deviceId",
            "ip",
            "lastActiveDate",
            "title"
          ]
        },
        "BlogViewDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "websiteUrl": {
              "type": "string"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string"
            },
            "isMembership": {
              "type": "boolean",
              "description": "True if user has not expired membership subscription to blog"
            }
          },
          "required": [
            "id",
            "description",
            "name",
            "websiteUrl",
            "createdAt",
            "isMembership"
          ]
        },
        "NewestLikesDto": {
          "type": "object",
          "properties": {
            "addedAt": {
              "format": "date-time",
              "type": "string"
            },
            "userId": {
              "type": "string",
              "nullable": true
            },
            "login": {
              "type": "string",
              "nullable": true
            }
          },
          "required": [
            "addedAt",
            "userId",
            "login"
          ]
        },
        "ExtendedLikesInfoDto": {
          "type": "object",
          "properties": {
            "likesCount": {
              "type": "number",
              "description": "Total likes for parent item"
            },
            "dislikesCount": {
              "type": "number",
              "description": "Total dislikes for parent item"
            },
            "myStatus": {
              "enum": [
                "None",
                "Like",
                "Dislike"
              ],
              "type": "string",
              "description": "Send None if you want to unlike/undislike"
            },
            "newestLikes": {
              "description": "Last 3 likes",
              "nullable": true,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/NewestLikesDto"
              }
            }
          },
          "required": [
            "likesCount",
            "dislikesCount",
            "myStatus",
            "newestLikes"
          ]
        },
        "PostViewDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "shortDescription": {
              "type": "string"
            },
            "content": {
              "type": "string"
            },
            "blogId": {
              "type": "string"
            },
            "blogName": {
              "type": "string"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string"
            },
            "extendedLikesInfo": {
              "$ref": "#/components/schemas/ExtendedLikesInfoDto"
            }
          },
          "required": [
            "id",
            "title",
            "shortDescription",
            "content",
            "blogId",
            "blogName",
            "createdAt",
            "extendedLikesInfo"
          ]
        },
        "SwaggerCreateBlogInputDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 15
            },
            "description": {
              "type": "string",
              "maxLength": 500
            },
            "websiteUrl": {
              "type": "string",
              "maxLength": 100,
              "pattern": "^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$"
            }
          },
          "required": [
            "name",
            "description",
            "websiteUrl"
          ]
        },
        "OmitTypeClass": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "maxLength": 30
            },
            "shortDescription": {
              "type": "string",
              "maxLength": 100
            },
            "content": {
              "type": "string",
              "maxLength": 1000
            }
          },
          "required": [
            "title",
            "shortDescription",
            "content"
          ]
        },
        "SwaggerUpdateBlogInputDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "maxLength": 15
            },
            "description": {
              "type": "string",
              "maxLength": 500
            },
            "websiteUrl": {
              "type": "string",
              "maxLength": 100,
              "pattern": "^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$"
            }
          },
          "required": [
            "name",
            "description",
            "websiteUrl"
          ]
        },
        "CommentatorInfo": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string"
            },
            "userLogin": {
              "type": "string"
            }
          },
          "required": [
            "userId",
            "userLogin"
          ]
        },
        "LikesInfo": {
          "type": "object",
          "properties": {
            "likesCount": {
              "type": "number",
              "description": "Total likes for parent item"
            },
            "dislikesCount": {
              "type": "number",
              "description": "Total dislikes for parent item"
            },
            "myStatus": {
              "enum": [
                "None",
                "Like",
                "Dislike"
              ],
              "type": "string",
              "description": "Send None if you want to unlike/undislike"
            }
          },
          "required": [
            "likesCount",
            "dislikesCount",
            "myStatus"
          ]
        },
        "CommentViewDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "content": {
              "type": "string"
            },
            "commentatorInfo": {
              "$ref": "#/components/schemas/CommentatorInfo"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string"
            },
            "likesInfo": {
              "$ref": "#/components/schemas/LikesInfo"
            }
          },
          "required": [
            "id",
            "content",
            "commentatorInfo",
            "createdAt",
            "likesInfo"
          ]
        },
        "SwaggerCreatePostInputDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "maxLength": 30
            },
            "shortDescription": {
              "type": "string",
              "maxLength": 100
            },
            "content": {
              "type": "string",
              "maxLength": 1000
            },
            "blogId": {
              "type": "string"
            }
          },
          "required": [
            "title",
            "shortDescription",
            "content",
            "blogId"
          ]
        },
        "SwaggerCreateCommentInputDto": {
          "type": "object",
          "properties": {
            "content": {
              "type": "string",
              "minLength": 20,
              "maxLength": 300
            }
          },
          "required": [
            "content"
          ]
        },
        "SwaggerUpdatePostInputDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "maxLength": 30
            },
            "shortDescription": {
              "type": "string",
              "maxLength": 100
            },
            "content": {
              "type": "string",
              "maxLength": 1000
            },
            "blogId": {
              "type": "string"
            }
          },
          "required": [
            "title",
            "shortDescription",
            "content",
            "blogId"
          ]
        },
        "SwaggerUpdatePostLikeStatusInputDto": {
          "type": "object",
          "properties": {
            "likeStatus": {
              "type": "string",
              "enum": [
                "None",
                "Like",
                "Dislike"
              ],
              "description": "Send None if you want to unlike|undislike"
            }
          },
          "required": [
            "likeStatus"
          ]
        },
        "SwaggerUpdateCommentInputDto": {
          "type": "object",
          "properties": {
            "content": {
              "type": "string",
              "minLength": 20,
              "maxLength": 300
            }
          },
          "required": [
            "content"
          ]
        },
        "SwaggerUpdateCommentLikeStatusInputDto": {
          "type": "object",
          "properties": {
            "likeStatus": {
              "type": "string",
              "enum": [
                "None",
                "Like",
                "Dislike"
              ],
              "description": "Send None if you want to unlike|undislike"
            }
          },
          "required": [
            "likeStatus"
          ]
        }
      }
    }
  },
  "customOptions": {
    "operationsSorter": function (a, b) {
                const order = {
                    get: '0',
                    post: '1',
                    patch: '2',
                    put: '3',
                    delete: '4',
                    head: '5',
                    options: '6',
                    connect: '7',
                    trace: '8',
                };
                return (order[a.get('method')].localeCompare(order[b.get('method')]) ||
                    a.get('path').localeCompare(b.get('path')));
            }
  }
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
