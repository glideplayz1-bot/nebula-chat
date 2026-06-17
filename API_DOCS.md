# API Documentation

## Nebula Chat API Reference

Base URL: `http://localhost:5000/api`

### Authentication Endpoints

#### Register User
```
POST /auth/signup
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}

Response:
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string",
    "role": "user|admin|owner"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response:
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string",
    "role": "user|admin|owner",
    "profilePicture": "url",
    "bio": "string",
    "status": "online|dnd|offline"
  }
}
```

#### Get Current User
```
GET /auth/me
Authorization: Bearer {token}

Response:
{
  "success": true,
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string",
    "role": "user|admin|owner",
    "profilePicture": "url",
    "bio": "string",
    "status": "online|dnd|offline",
    "isBanned": false,
    "isChatMuted": false
  }
}
```

### User Endpoints

#### Get All Users
```
GET /users
Authorization: Bearer {token}

Response:
{
  "success": true,
  "users": [
    {
      "_id": "user_id",
      "username": "string",
      "profilePicture": "url",
      "bio": "string",
      "status": "online|dnd|offline"
    }
  ]
}
```

#### Get User Profile
```
GET /users/:id
Authorization: Bearer {token}

Response:
{
  "success": true,
  "user": {
    "_id": "user_id",
    "username": "string",
    "profilePicture": "url",
    "bio": "string",
    "status": "online|dnd|offline",
    "role": "user|admin|owner"
  }
}
```

#### Update Profile
```
PUT /users/profile/update
Authorization: Bearer {token}
Content-Type: multipart/form-data

- bio (string, optional)
- profilePicture (file, optional)
- password (string, optional)

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "username": "string",
    "bio": "string",
    "profilePicture": "url"
  }
}
```

#### Update Status
```
PUT /users/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "online|dnd|offline"
}

Response:
{
  "success": true,
  "message": "Status updated",
  "user": {
    "id": "user_id",
    "status": "online|dnd|offline"
  }
}
```

#### Change Password
```
PUT /users/password
Authorization: Bearer {token}
Content-Type: application/json

{
  "oldPassword": "string",
  "newPassword": "string"
}

Response:
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Logout All Devices
```
POST /users/logout-all
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Logged out from all devices"
}
```

### Chat Endpoints

#### Get All Chats
```
GET /chats
Authorization: Bearer {token}

Response:
{
  "success": true,
  "chats": [
    {
      "_id": "chat_id",
      "name": "string (group only)",
      "isGroup": boolean,
      "isPublic": boolean,
      "members": [{user_object}],
      "admin": {user_object},
      "lastMessage": {message_object}
    }
  ]
}
```

#### Create DM
```
POST /chats/create-dm
Authorization: Bearer {token}
Content-Type: application/json

{
  "recipientId": "user_id"
}

Response:
{
  "success": true,
  "chat": {chat_object}
}
```

#### Create Group Chat
```
POST /chats/create-group
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "string",
  "memberIds": ["user_id_1", "user_id_2"]
}

Response:
{
  "success": true,
  "chat": {chat_object}
}
```

#### Get Chat Messages
```
GET /chats/:chatId/messages
Authorization: Bearer {token}

Response:
{
  "success": true,
  "messages": [
    {
      "_id": "message_id",
      "sender": {user_object},
      "content": "string",
      "replyTo": {message_object or null},
      "mentions": [{user_object}],
      "createdAt": "ISO_date"
    }
  ]
}
```

#### Send Message
```
POST /chats/:chatId/send-message
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "string",
  "replyToId": "message_id (optional)",
  "mentions": ["username1", "username2"]
}

Response:
{
  "success": true,
  "message": {message_object}
}
```

#### Add Member to Group
```
POST /chats/:chatId/add-member
Authorization: Bearer {token}
Content-Type: application/json

{
  "memberId": "user_id"
}

Response:
{
  "success": true,
  "message": "Member added",
  "chat": {chat_object}
}
```

#### Remove Member from Group
```
POST /chats/:chatId/remove-member
Authorization: Bearer {token}
Content-Type: application/json

{
  "memberId": "user_id"
}

Response:
{
  "success": true,
  "message": "Member removed",
  "chat": {chat_object}
}
```

### Admin Endpoints (Owner Only)

#### Ban User
```
POST /admin/ban-user
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_id",
  "reason": "string",
  "days": 7,
  "isPermanent": false
}

Response:
{
  "success": true,
  "message": "User banned successfully",
  "ban": {ban_object}
}
```

#### Unban User
```
POST /admin/unban-user
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_id"
}

Response:
{
  "success": true,
  "message": "User unbanned successfully"
}
```

#### Promote to Admin
```
POST /admin/promote-admin
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_id",
  "canDeleteMessages": true,
  "canTempBan": true
}

Response:
{
  "success": true,
  "message": "User promoted to admin",
  "user": {user_object}
}
```

#### Demote Admin
```
POST /admin/demote-admin
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_id"
}

Response:
{
  "success": true,
  "message": "Admin demoted to user",
  "user": {user_object}
}
```

#### Get Admin Logs
```
GET /admin/logs
Authorization: Bearer {token}

Response:
{
  "success": true,
  "logs": [
    {
      "_id": "log_id",
      "action": "string",
      "performedBy": {user_object},
      "targetUser": {user_object},
      "reason": "string",
      "createdAt": "ISO_date"
    }
  ]
}
```

#### View Private Messages
```
GET /admin/private-messages/:chatId
Authorization: Bearer {token}

Response:
{
  "success": true,
  "messages": [{message_array}]
}
```

#### Delete Message
```
DELETE /admin/message/:messageId
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Message deleted"
}
```

#### Mute User
```
POST /admin/mute-user
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_id",
  "days": 7
}

Response:
{
  "success": true,
  "message": "User muted"
}
```

#### Reset Password
```
POST /admin/reset-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_id",
  "newPassword": "string"
}

Response:
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### Delete User
```
POST /admin/delete-user
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_id"
}

Response:
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### Channel Lock
```
POST /admin/channel-lock
Authorization: Bearer {token}
Content-Type: application/json

{
  "chatId": "chat_id",
  "isLocked": true
}

Response:
{
  "success": true,
  "message": "Channel locked",
  "chat": {chat_object}
}
```

#### Set Slowmode
```
POST /admin/slowmode
Authorization: Bearer {token}
Content-Type: application/json

{
  "chatId": "chat_id",
  "seconds": 10
}

Response:
{
  "success": true,
  "message": "Slowmode updated",
  "chat": {chat_object}
}
```

#### Server Lockdown
```
POST /admin/lockdown
Authorization: Bearer {token}
Content-Type: application/json

{
  "isLockedDown": true
}

Response:
{
  "success": true,
  "message": "Server locked down"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Error description"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error",
  "error": "Error details"
}
```

## Socket.IO Events

### Client → Server
- `user_join` - User connects
- `send_message` - Send message
- `typing` - User is typing
- `stop_typing` - User stopped typing
- `join_chat` - Join chat room
- `leave_chat` - Leave chat room
- `status_change` - Change user status
- `send_ping` - Send ping to user

### Server → Client
- `user_online` - User came online
- `user_offline` - User went offline
- `receive_message` - Receive message
- `user_typing` - User typing indicator
- `user_stop_typing` - User stopped typing
- `receive_ping` - Receive ping notification
- `user_status` - User status changed
