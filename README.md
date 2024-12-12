## node.js testing

### tools

**compiler** tsx
**testing** mocha
**assertion** chai
**stubbing** sinon
**http mocking** supertest

### scripts

to run, add an `.env` file in the root directory.

```env
MONGODB_URI=<enter-mongo-uri>
NODE_ENV=test # change this to "prod" for using a real database
```

### endpoints

here are some helpful curl commands generated with chatgpt.

### 1. **Create a New User (`POST /create`)**
```bash
curl -X POST http://localhost:3000/create \
-H "Content-Type: application/json" \
-d '{
  "name": "Alice Smith",
  "email": "alice.smith@example.com",
  "role": "editor"
}'
```

### 2. **Get All Users (`GET /read`)**
```bash
curl -X GET http://localhost:3000/read
```

### 3. **Update a User (`PUT /update/:id`)**
Replace `<user_id>` with the actual ID of the user you want to update.

```bash
curl -X PUT http://localhost:3000/update/<user_id> \
-H "Content-Type: application/json" \
-d '{
  "name": "Bob Johnson",
  "email": "bob.johnson@example.com",
  "role": "viewer"
}'
```

### 4. **Delete a User (`DELETE /delete/:id`)**
Replace `<user_id>` with the actual ID of the user you want to delete.

```bash
curl -X DELETE http://localhost:3000/delete/<user_id>
```