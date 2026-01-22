# Blogging Platform — Product Documentation

## Overview
The Blogging Platform provides functionality for creating and managing blogs, posts, and comments. The platform supports public content consumption, authenticated user interaction, and administrative control over users, blogs, and posts.

Access control is role-based, distinguishing between guest users, authenticated users, and Super Admin accounts.

## Core Functional Areas

### 1. Authentication and Authorization

The platform includes a secure authentication system with refresh token rotation and email verification.

Supported features:
- User registration with email confirmation
- Login and logout
- Access token and refresh token issuance
- Refresh token rotation with revocation of prior tokens
- Password recovery via email
- New password confirmation
- Resending confirmation email
- Retrieval of current authenticated user information

Refresh tokens are transmitted via secure cookies and are invalidated upon refresh to prevent reuse.

### 2. User Management (Super Admin)

Super Admins manage registered platform users.

Supported operations:
- List users with pagination
- Create a user
- Retrieve a user by ID
- Delete a user

### 3. Device Session Management

Authenticated users can manage active device sessions.

Supported operations:
- List active device sessions for current user
- Terminate all device sessions except the current one 
- Terminate a specific device session 

### 4. Blogs and Posts

Blogs serve as containers for posts.

Public endpoints support:
- Listing blogs with pagination 
- Retrieving a blog by ID 
- Listing posts for a specific blog

Super Admin endpoints support:
- Creating, updating, and deleting blogs 
- Creating, updating, and deleting posts within blogs 

### 5. Posts (Public)

Public post endpoints support:
- Listing posts with pagination 
- Retrieving a post by ID 
- Listing comments for a post

Authenticated users can:
- Create comments on posts 
- React to posts (like, dislike, undo actions) 

### 6. Comments

Comment functionality supports CRUD operations and reaction tracking.

Operations include:
- Retrieve comment by ID 
- Update and delete comment (authenticated) 
- React to comments (like, dislike, undo actions) 

### 7. Reactions (Likes/Dislikes)

Reactions are supported for both posts and comments.

Reaction states:
- Like
- Dislike
- Unlike (remove like)
- Undislike (remove dislike)

Extended reaction data includes:
- Like and dislike counts
- Newest likes
- Current user reaction status

## Roles and Permissions
| Role               | Capabilities                                      |
| :----------------- | :------------------------------------------------ |
| Guest              | Public content consumption                        |
| Authenticated User | Comments, reactions, device session management    |
| Super Admin        | Administrative control of users, blogs, and posts |

## Domain Model
Primary entities:
- User
- Blog
- Post
- Comment
- Device Session
- Reaction (Like/Dislike)

Relationships:
- A Blog contains multiple Posts
- A Post contains multiple Comments
- Posts and Comments support multiple Reactions
- Users may have multiple Device Sessions

## Pagination and Data Transfer Objects
Paginated list endpoints return standardized paging responses. DTOs are used consistently throughout the API for request and response structures.