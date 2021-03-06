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

import Model from "./model";
import Api from "../common/api";
import {DateTime} from "luxon";

export default class Link extends Model {
    getDefaults() {
        return {
            UID: "",
            ShareUID: "",
            ShareToken: "",
            ShareExpires: 0,
            Password: "",
            HasPassword: false,
            CanComment: false,
            CanEdit: false,
            CreatedAt: "",
            UpdatedAt: "",
        };
    }

    url() {
        let token = this.ShareToken.toLowerCase();

        if(!token) {
            token = "...";
        }

        return `${window.location.origin}/s/${token}/${this.ShareUID}`;
    }

    caption() {
        return `/s/${this.ShareToken.toLowerCase()}`;
    }

    getId() {
        return this.UID;
    }

    hasId() {
        return !!this.getId();
    }

    clone() {
        return new this.constructor(this.getValues());
    }

    find(id, params) {
        return Api.get(this.getEntityResource(id), params).then((response) => Promise.resolve(new this.constructor(response.data)));
    }

    save() {
        if (this.hasId()) {
            return this.update();
        }

        return Api.post(this.constructor.getCollectionResource(), this.getValues()).then((response) => Promise.resolve(this.setValues(response.data)));
    }

    update() {
        return Api.put(this.getEntityResource(), this.getValues(true)).then((response) => Promise.resolve(this.setValues(response.data)));
    }

    remove() {
        return Api.delete(this.getEntityResource()).then(() => Promise.resolve(this));
    }

    expires() {
        return DateTime.fromISO(this.UpdatedAt).plus({ seconds: this.ShareExpires }).toLocaleString(DateTime.DATE_SHORT);
    }

    static getCollectionResource() {
        return "links";
    }

    static getModelName() {
        return "Link";
    }
}
