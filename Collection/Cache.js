(function (Application) {
    'use strict';

    Backbone.Abstract = Backbone.Abstract || {};
    Backbone.Abstract.Collection = Backbone.Abstract.Collection || {};
    Backbone.Abstract.Collection.Cache = {
        cacheExpiringTime: (1000 * 60), // 60 sec
        /**
         * Can be overrided to define a custom way of figuring out if this need to be cached
         * [useCaching description]
         * @method useCaching
         * @param  {Boolean}   expired [description]
         * @param  {Object}   opts [description]
         * @return {Boolean}           [description]
         */
        useCaching: function useCaching(expired, opts) {
            return !expired;
        },
        _isCacheTimeExpired: function _isCacheTimeExpired(hash) {
            if (!this.__cachedFor || !this.__cachedFor[hash])
                return true;

            return (_.now() - this.__cachedFor[hash]) > this.cacheExpiringTime;
        },
        _getCacheHash: function(url, data) {
          return url + '__' + (data ? JSON.stringify(data) : '');
        },
        _registeredAsCached: function _registeredAsCached(hash) {
            if (!this.__cachedFor)
                this.__cachedFor = {};

            this.__cachedFor[hash] = _.now();
            return this;
        },
        fetch: function fetch(opts) {
            opts = opts || {};
            var url = opts.url || _.result(this, 'url');
            var hash = this._getCacheHash(url, opts.data);
            if (this.useCaching(this._isCacheTimeExpired(hash), opts)) {
                opts.success.call(opts.context || this, this, null, opts);
                return this;
            }
            var self = this;
            opts.success = _.wrap(opts.success, function(originalFn, collec, resp, options) {
                self._registeredAsCached(hash);
                originalFn.call(opts.context || collec, collec, resp, options);
            });
            return Backbone.Collection.prototype.fetch.apply(this, arguments);
        }
    };

})(Backbone);
