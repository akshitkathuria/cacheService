# Cache Service

This service will take care of your cache data

#### Dependencies
- MongoDB


## API

### Create / Update API

This single api will create and update the cache

```plaintext
Route POST /cache/create
```

```json
{
	"key": "key1",
	"value": "value1"
}
```

Response sample: cache data with time to live is returned in data field

```json
{
    "status": "success",
    "data": {
        "key": "key1",
        "value": "value1",
        "ttl": 1615638903045
    }
}
```

### Get API

This api will return the cache data based on the key passed, if key is not passed will return array of cached key values

```plaintext
Route GET /cache
```

| Attribute | Type    | Required      | Description                                            |
| --------- | ------- | ------------- | -------------------------------------------------------|
| `key`    | String   | No            | will return only the key's value                       |

```plaintext
?key=key1
```

Response sample:

```json
{
    "status": "success",
    "data": {
        "key": "key1",
        "value": "value1",
        "ttl": 1615638915088
    }
}
```

If no key passed below response will be given
```json
{
    "status": "success",
    "data": [
        {
            "_id": "604c90cd2f65222f2c947fe7",
            "key": "key2",
            "value": 1615639355408849,
            "ttl": 1615638909698
        },
        {
            "_id": "604cb13be77bca321c99d496",
            "key": "key1",
            "value": 1615639355409094,
            "ttl": 1615638915088
        }
    ]
}
```
### Delete API

This api will delete the cache data based on the key passed, if key is not passed whole cached is removed

```plaintext
Route Delete /cache
```

| Attribute | Type    | Required      | Description                                            |
| --------- | ------- | ------------- | -------------------------------------------------------|
| `key`    | String   | No            | will return only the key's value                       |

```plaintext
?key=key1
```

Response sample for delete api
```json
{
    "status": "success"
}
```