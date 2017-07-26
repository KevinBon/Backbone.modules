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
         * @return {Boolean}           [description]
         */
        useCaching: function useCaching(expired) {
            return !expired;
        },
        _isCacheTimeExpired: function _isCacheTimeExpired(url) {
            if (!this.__cachedFor || !this.__cachedFor[url])
                return true;

            return (_.now() - this.__cachedFor[url]) > this.cacheExpiringTime;
        },
        _registeredAsCached: function _registeredAsCached(url) {
            if (!this.__cachedFor)
                this.__cachedFor = {};

            this.__cachedFor[url] = _.now();
            return this;
        },
        fetch: function fetch(opts) {
            opts = opts || {};
            var url = opts.url || _.result(this, 'url');
            if (this.useCaching(this._isCacheTimeExpired(url))) {
                opts.success.call(opts.context || this, this, null, opts);
                return this;
            }
            var self = this;
            opts.success = _.wrap(opts.success, function(originalFn, collec, resp, options) {
                self._registeredAsCached(url);
                originalFn.call(opts.context || collec, collec, resp, options);
            });
            return Backbone.Collection.prototype.fetch.apply(this, arguments);
        }
    };

})(Backbone);
