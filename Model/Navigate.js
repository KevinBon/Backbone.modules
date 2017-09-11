(function (Application) {
    'use strict';

    Backbone.Abstract = Backbone.Abstract || {};
    Backbone.Abstract.Model = Backbone.Abstract.Model || {};
    Backbone.Abstract.Model.Navigate = {
         /**
         * Find the previous model in the linked collection
         * @method previous
         * @param  {Object|Function} where [description]
         * @return {?Backbone.Model}       [description]
         */
        previous: function previous(where) {
            if (!this.collection)
                return null;

            var index = this.collection.indexOf(this);
            if (index === -1 || index === 0)
                return null;
            if (where) {
                var foundIndex = -1;
                for (var i = 0; i < index; i++)
                    if (_.findWhere(this.collection.models[i].toJSON(), where)) {
                        foundIndex = i;
                        break;
                    }

                index = foundIndex;
                if (index === -1)
                    return null;
            } else {
                index -= 1;
            }
            return this.collection.at(index) || null;
        },
        /**
         * Find the next model in the linked collection
         * @method next
         * @param  {Object|Function} where [description]
         * @return {?Backbone.Model}       [description]
         */
        next: function next(where) {
            if (!this.collection)
                return null;

            var index = this.collection.indexOf(this);
            if (index === -1 || index === (this.collection.length - 1))
                return null;
            if (where) {
                var foundIndex = -1;
                for (var i = index + 1; i < this.collection.length; i++)
                    if (_.findWhere(this.collection.models[i].toJSON(), where)) {
                        foundIndex = i;
                        break;
                    }

                index = foundIndex;
                if (index === -1)
                    return null;
            } else {
                index += 1;
            }
            return this.collection.at(index) || null;
        }
    };

})(Backbone);
