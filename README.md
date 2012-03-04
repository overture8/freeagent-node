# freeagent-node

A node wrapper for the Freeagent API.

## Usage

     $ node
     > FreeagentAPI = require('freeagent-node')
     > freeagentAPI = new FreeagentAPI('subdomain', 'username', 'password')

### Projects

     > freeagentAPI.listProjects(function(response) { console.log(response); })

### Timeslips

     > freeagentAPI.listTimeslips('2011-01-01', '2012-01-01', function(response) { console.log(response); })

## Building js file from the coffeescript source

     cake build

## Todo

Lots more API methods need added!

## License

freeagent-node is released under the MIT License.
