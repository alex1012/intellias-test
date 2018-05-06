# intellias-test
Test Node.js task.

`POST` http://localhost:3030/batch

Body:

```
{
	"endpoint": {
		"url": "https://guesty-user-service.herokuapp.com/user",
		"method": "PUT"
	},
	"userIDs": ["14", "29", "103"],
	"updates": {
		"age": 30
	}
}
```
