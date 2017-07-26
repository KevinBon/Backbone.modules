# Cache system

Simple Backbone.Collection fetch only caching system.

# How it's working?

We decide to return the current data when:
- The same `url` && `options.data` have been registered in the cache.
- The time elapsed between the last registered request and the fetch didn't exceed the `cacheExpiringTime` property (default: 60s)
- The `useCaching` predicate return true.

# Example of implementation

```javascript
Application.Collections.Test = Application.Collections.Basic.extend({
    url: 'dummyUrl',
    model: function (attrs, options) {
        return new Application.Models.Test(attrs, options);
    },
    /* @Optional: redefine the expiration timer */
    cacheExpiringTime: (1000 * 20), // 20 sec
    /* @Optional: redefine the caching predicate */
    useCaching: function useCaching(expired, opts) {
        return opts.caching && !expired;
    },
});
_.extend(Application.Collections.Test.prototype,
    // Plugins
    Backbone.Abstract.Collection.Cache,
    Application.Collections.Test.prototype
);
```
```javascript
// Only as demo purpose, do not use that specific bad pattern callback calls
var fetchCollec = function fetchCollec(collec, caching, callback) {
  collec.fetch({
      caching: caching || true,
      success: callback
  });
  return collec;
});
var testCollec = new Application.Collections.Test();
fetchCollec(testCollec, true, function() {
  console.log('return non cached collection');
  fetchCollec(testCollec, true, function() {
    console.log('return cached collection');
    fetchCollec(testCollec, false, function() {
      console.log('return non cached collection');
    });
  });
});
  
```


