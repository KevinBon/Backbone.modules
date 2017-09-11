(function (Application) {
    'use strict';

    Backbone.Abstract = Backbone.Abstract || {};
    Backbone.Abstract.Model = Backbone.Abstract.Model || {};
    Backbone.Abstract.Model.Navigate = {
        /**
         * Find the previous model in the linked collection
         * @method previous
         * @param  {Object|Function} where [description]
         * @param  {Boolean} loop [description]
         * @return {?Backbone.Model}       [description]
         */
        previous: function previous(where, loop) {
            loop = Boolean(loop);
            if (!this.collection)
                return null;
            function result(model) {
                return model || (loop ? this.next(where) : null);
            }
            var index = this.collection.indexOf(this);
            if (index === -1 || index === 0)
                return result.call(this, null);
            if (where) {
                var foundIndex = -1;
                for (var i = 0; i < index; i++)
                    if (_.findWhere([this.collection.at(i).toJSON()], where)) {
                        foundIndex = i;
                        break;
                    }

                index = foundIndex;
                if (index === -1)
                    return result.call(this, null);
            } else {
                index -= 1;
            }
            return result.call(this, this.collection.at(index));
        },
        /**
         * Find the next model in the linked collection
         * @method next
         * @param  {Object|Function} where [description]
         * @param  {Boolean} loop [description]
         * @return {?Backbone.Model}       [description]
         */
        next: function next(where, loop) {
            loop = Boolean(loop);
            if (!this.collection)
                return null;
            function result(model) {
                return model || (loop ? this.previous(where) : null);
            }
            var index = this.collection.indexOf(this);
            if (index === -1 || index === (this.collection.length - 1))
                return result.call(this, null);
            if (where) {
                var foundIndex = -1;
                for (var i = index + 1; i < this.collection.length; i++)
                    if (_.findWhere([this.collection.at(i).toJSON()], where)) {
                        foundIndex = i;
                        break;
                    }

                index = foundIndex;
                if (index === -1)
                    return result.call(this, null);
            } else {
                index += 1;
            }
            return result.call(this, this.collection.at(index));
        }
    };

})(Backbone);
