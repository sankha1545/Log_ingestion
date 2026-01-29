# INFO log
curl -Method POST http://localhost/api/logs `
 -Headers @{ "Content-Type" = "application/json" } `
 -Body '{ "level":"info","message":"User logged in","resourceId":"auth-service","timestamp":"2026-01-06T09:15:00Z","traceId":"t-info","spanId":"s-info","commit":"v1","metadata":{} }'

# DEBUG log
curl -Method POST http://localhost/api/logs `
 -Headers @{ "Content-Type" = "application/json" } `
 -Body '{ "level":"debug","message":"Fetching user profile","resourceId":"user-service","timestamp":"2026-01-10T14:42:00Z","traceId":"t-debug","spanId":"s-debug","commit":"v1","metadata":{} }'

# WARN log
curl -Method POST http://localhost/api/logs `
 -Headers @{ "Content-Type" = "application/json" } `
 -Body '{ "level":"warn","message":"High memory usage","resourceId":"metrics-service","timestamp":"2026-01-15T18:30:00Z","traceId":"t-warn","spanId":"s-warn","commit":"v1","metadata":{} }'

# ERROR log
curl -Method POST http://localhost/api/logs `
 -Headers @{ "Content-Type" = "application/json" } `
 -Body '{ "level":"error","message":"Database connection failed","resourceId":"db-service","timestamp":"2026-01-20T22:05:00Z","traceId":"t-error","spanId":"s-error","commit":"v1","metadata":{} }'
