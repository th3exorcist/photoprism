/*

Copyright (c) 2018 - 2020 Michael Mayer <hello@photoprism.org>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

    PhotoPrism™ is a registered trademark of Michael Mayer.  You may use it as required
    to describe our software, run your own server, for educational purposes, but not for
    offering commercial goods, products, or services without prior written permission.
    In other words, please ask.

Feel free to send an e-mail to hello@photoprism.org if you have questions,
want to support our work, or just want to say hello.

Additional information can be found in our Developer Guide:
https://docs.photoprism.org/developer-guide/

*/

import Api from "common/api";
import Form from "common/form";
import Model from "./model";
import Link from "./link";

export class Rest extends Model {
    getId() {
        return this.ID;
    }

    hasId() {
        return !!this.getId();
    }

    clone() {
        return new this.constructor(this.getValues());
    }

    find(id, params) {
        return Api.get(this.getEntityResource(id), params).then((resp) => Promise.resolve(new this.constructor(resp.data)));
    }

    save() {
        if (this.hasId()) {
            return this.update();
        }

        return Api.post(this.constructor.getCollectionResource(), this.getValues()).then((resp) => Promise.resolve(this.setValues(resp.data)));
    }

    update() {
        return Api.put(this.getEntityResource(), this.getValues(true)).then((resp) => Promise.resolve(this.setValues(resp.data)));
    }

    remove() {
        return Api.delete(this.getEntityResource()).then(() => Promise.resolve(this));
    }

    getEditForm() {
        return Api.options(this.getEntityResource()).then(resp => Promise.resolve(new Form(resp.data)));
    }

    getEntityResource(id) {
        if (!id) {
            id = this.getId();
        }

        return this.constructor.getCollectionResource() + "/" + id;
    }

    getEntityName() {
        return this.constructor.getModelName() + " " + this.getId();
    }

    createLink(password, expires) {
        return Api
            .post(this.getEntityResource() + "/links", {
                "Password": password ? password : "",
                "ShareExpires": expires ? expires : 0,
                "CanEdit": false,
                "CanComment": false,
            })
            .then((resp) => Promise.resolve(new Link(resp.data)));
    }

    updateLink(link) {
        let values = link.getValues(false);

        if(link.Password) {
            values["Password"] = link.Password;
        }

        return Api
            .put(this.getEntityResource() + "/links/" + link.getId(), values)
            .then((resp) => Promise.resolve(link.setValues(resp.data)));
    }

    removeLink(link) {
        return Api
            .delete(this.getEntityResource() + "/links/" + link.getId())
            .then((resp) => Promise.resolve(link.setValues(resp.data)));
    }

    links() {
        return Api.get(this.getEntityResource() + "/links").then((resp) => {
            resp.models = [];
            resp.count = resp.data.length;

            for (let i = 0; i < resp.data.length; i++) {
                resp.models.push(new Link(resp.data[i]));
            }

            return Promise.resolve(resp);
        });
    }

    modelName() {
        return this.constructor.getModelName();
    }

    static getCollectionResource() {
        throw new Error("getCollectionResource() needs to be implemented");
    }

    static getCreateResource() {
        return this.getCollectionResource();
    }

    static getCreateForm() {
        return Api.options(this.getCreateResource()).then(resp => Promise.resolve(new Form(resp.data)));
    }

    static getModelName() {
        return "Item";
    }

    static getSearchForm() {
        return Api.options(this.getCollectionResource()).then(resp => Promise.resolve(new Form(resp.data)));
    }

    static search(params) {
        const options = {
            params: params,
        };

        return Api.get(this.getCollectionResource(), options).then((resp) => {
            let count = resp.data.length;
            let limit = 0;
            let offset = 0;

            if (resp.headers) {
                if (resp.headers["x-count"]) {
                    count = parseInt(resp.headers["x-count"]);
                }

                if (resp.headers["x-limit"]) {
                    limit = parseInt(resp.headers["x-limit"]);
                }

                if (resp.headers["x-offset"]) {
                    offset = parseInt(resp.headers["x-offset"]);
                }
            }

            resp.models = [];
            resp.count = count;
            resp.limit = limit;
            resp.offset = offset;

            for (let i = 0; i < resp.data.length; i++) {
                resp.models.push(new this(resp.data[i]));
            }

            return Promise.resolve(resp);
        });
    }
}

export default Rest;
