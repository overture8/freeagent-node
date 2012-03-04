(function() {
  var FreeagentAPI, exports, https, querystring;

  https = require('https');

  querystring = require('querystring');

  FreeagentAPI = (function() {

    FreeagentAPI.prototype.baseDomain = 'freeagent.com';

    function FreeagentAPI(subDomain, user, pass) {
      this.subDomain = subDomain;
      this.user = user;
      this.pass = pass;
      this._basicAuth();
      this._buildUrl();
    }

    FreeagentAPI.prototype.listProjects = function(callback) {
      var options;
      options = this._prepareOptions({
        method: 'get',
        path: '/projects'
      });
      return this._sendRequest(options, callback);
    };

    FreeagentAPI.prototype.listTimeslips = function(start, end, callback) {
      var options, query;
      query = {};
      query['view'] = "" + start + "_" + end;
      options = this._prepareOptions({
        method: 'get',
        path: '/timeslips',
        query: query
      });
      return this._sendRequest(options, callback);
    };

    FreeagentAPI.prototype._buildUrl = function() {
      return this.baseUrl = "" + this.subDomain + "." + this.baseDomain;
    };

    FreeagentAPI.prototype._basicAuth = function() {
      return this.authToken = 'Basic ' + new Buffer(this.user + ':' + this.pass).toString('base64');
    };

    FreeagentAPI.prototype._prepareOptions = function(op) {
      op.host = this.baseUrl;
      if (op.query != null) {
        op.query = querystring.stringify(op.query);
        op.path += "?" + op.query;
      }
      console.log(op.path);
      if (op.headers == null) op.headers = {};
      op.headers['Accept'] = 'application/xml';
      op.headers['Authorization'] = this.authToken;
      if (op.method === 'post' && (op.data != null)) {
        op.data = querystring.stringify(op.data);
        op.headers['Content-Length'] = op.data.length;
        op.headers['Content-Type'] = 'application/xml';
      }
      return op;
    };

    FreeagentAPI.prototype._sendRequest = function(options, callback) {
      var req;
      req = https.request(options);
      req.on('response', function(res) {
        var buffer;
        buffer = '';
        res.on('data', function(chunk) {
          return buffer += chunk;
        });
        return res.on('end', function() {
          var value;
          if (callback != null) {
            if (res.statusCode === 200) {
              value = buffer;
              return callback(value, null);
            } else {
              return callback(null, buffer);
            }
          }
        });
      });
      if (options.data != null) req.write(options.data);
      return req.end();
    };

    return FreeagentAPI;

  })();

  exports = module.exports = FreeagentAPI;

}).call(this);
