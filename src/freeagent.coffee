https       = require 'https'
querystring = require 'querystring'

class FreeagentAPI

  baseDomain: 'freeagent.com'

  constructor: (@subDomain, @user, @pass) ->
    @_basicAuth()
    @_buildUrl()

  listProjects: (callback) ->
    options = @_prepareOptions
      method: 'get'
      path:   '/projects'
    @_sendRequest options, callback

  listTimeslips: (start, end, callback) ->
    query = {}
    query['view'] = "#{start}_#{end}"

    options = @_prepareOptions
      method: 'get'
      path:   '/timeslips'
      query: query
    @_sendRequest options, callback


  ############
  # Privates #
  ############

  _buildUrl: ->
    @baseUrl = "#{@subDomain}.#{@baseDomain}"

  _basicAuth: ->
    @authToken = 'Basic ' + new Buffer(@user + ':' + @pass).toString('base64');

  _prepareOptions: (op) ->
    op.host = @baseUrl

    if op.query?
      op.query = querystring.stringify(op.query)
      op.path += "?#{op.query}"

    op.headers = {} unless op.headers?
    op.headers['Accept']         = 'application/xml'
    op.headers['Authorization']  = @authToken

    if op.method is 'post' and op.data?
      op.data = querystring.stringify(op.data)
      op.headers['Content-Length'] = op.data.length
      op.headers['Content-Type']   = 'application/xml'

    return op

  _sendRequest: (options, callback) ->
    req = https.request(options)

    req.on 'response', (res) ->
      buffer = ''
      res.on 'data', (chunk) ->
        buffer += chunk
      res.on 'end', ->
        if callback?
          if res.statusCode is 200
            value = buffer
            callback(value, null)
          else
            callback(null, buffer)

    if options.data? then req.write(options.data)
    req.end()

exports = module.exports = FreeagentAPI
