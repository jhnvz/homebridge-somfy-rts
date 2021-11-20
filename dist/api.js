"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
class API {
    constructor(ip, id, log) {
        this.catchRequestErrors = true;
        this.ip = ip;
        this.id = id;
        this.log = log;
    }
    up() {
        this._request('UP');
    }
    down() {
        this._request('DOWN');
    }
    stop() {
        this._request('STOP');
    }
    _request(cmd) {
        const data = {
            remoteId: this.id,
            cmd: cmd,
        };
        (0, node_fetch_1.default)(`http://${this.ip}/remote`, {
            method: 'POST',
            body: JSON.stringify(data),
        }).catch(err => this.log.warn(err));
    }
}
exports.default = API;
//# sourceMappingURL=api.js.map