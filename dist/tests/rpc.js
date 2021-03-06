"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var ava_1 = require("ava");
var __1 = require("..");
ava_1["default"].serial("method `put` sets a key with value", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var client, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = new __1.Etcd();
                return [4, client.put({
                        key: new Buffer("name"),
                        value: new Buffer("foo")
                    })];
            case 1:
                res = _a.sent();
                t.deepEqual(Object.keys(res.header), ["clusterId", "memberId", "revision", "raftTerm"]);
                return [2];
        }
    });
}); });
ava_1["default"].serial("method `range` retrieves one or more keys", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var client, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = new __1.Etcd();
                return [4, client.put({
                        key: new Buffer("name"),
                        value: new Buffer("foo")
                    }).then(function () {
                        return client.range({
                            key: new Buffer("name")
                        });
                    })];
            case 1:
                res = _a.sent();
                t.deepEqual(Object.keys(res.header), ["clusterId", "memberId", "revision", "raftTerm"]);
                t.deepEqual(Object.keys(res.kvs[0]), ["key", "createRevision", "modRevision", "version", "value", "lease"]);
                t.is(res.kvs[0].value.toString(), "foo");
                t.is(res.more, false);
                t.is(res.count, "1");
                return [2];
        }
    });
}); });
ava_1["default"].serial("method `deleteRange` removes the key", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var client, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = new __1.Etcd();
                return [4, client.put({
                        key: new Buffer("name"),
                        value: new Buffer("foo")
                    }).then(function () {
                        return client.deleteRange({
                            key: new Buffer("name")
                        });
                    }).then(function () {
                        return client.range({
                            key: new Buffer("name")
                        });
                    })];
            case 1:
                res = _a.sent();
                t.deepEqual(Object.keys(res.header), ["clusterId", "memberId", "revision", "raftTerm"]);
                t.is(res.kvs.length, 0);
                t.is(res.more, false);
                t.is(res.count, "0");
                return [2];
        }
    });
}); });
ava_1["default"].serial("method `txn` executes operations in transaction", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var client, res, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = new __1.Etcd();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4, client.put({
                        key: new Buffer("name"),
                        value: new Buffer("")
                    })];
            case 2:
                _a.sent();
                return [4, Promise.all([0, 1].map(function () {
                        return client.txn({
                            compare: {
                                result: 0,
                                target: 3,
                                key: new Buffer("name"),
                                value: new Buffer("foo")
                            },
                            success: [{
                                    requestPut: {
                                        key: new Buffer("name"),
                                        value: new Buffer("bar")
                                    }
                                }],
                            failure: [{
                                    requestPut: {
                                        key: new Buffer("name"),
                                        value: new Buffer("foo")
                                    }
                                }]
                        });
                    }))];
            case 3:
                res = _a.sent();
                t.is(res[0].succeeded, false);
                t.is(res[1].succeeded, true);
                t.pass();
                return [3, 5];
            case 4:
                e_1 = _a.sent();
                t.fail();
                return [3, 5];
            case 5: return [2];
        }
    });
}); });
ava_1["default"].serial("method `compact` compacts etcd key-value store", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var client, res, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = new __1.Etcd();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, client.compact()];
            case 2:
                res = _a.sent();
                t.deepEqual(Object.keys(res.header), ["clusterId", "memberId", "revision", "raftTerm"]);
                return [3, 4];
            case 3:
                e_2 = _a.sent();
                if (e_2.message === "etcdserver: mvcc: required revision has been compacted") {
                    t.pass();
                }
                else {
                    throw e_2;
                }
                return [3, 4];
            case 4: return [2];
        }
    });
}); });
ava_1["default"].serial("method throws when no connection", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var client, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = new __1.Etcd({
                    endpoints: ["127.0.0.1:7891"]
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, client.range({
                        key: new Buffer("name")
                    })];
            case 2:
                _a.sent();
                t.fail();
                return [3, 4];
            case 3:
                e_3 = _a.sent();
                t.is(__1.getErrorKind(e_3) === __1.ErrorKind.CONNECTION_FAILED, true);
                return [3, 4];
            case 4: return [2];
        }
    });
}); });
ava_1["default"].serial("method `reconnect` connects to the next available endpoint", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var client, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = new __1.Etcd({
                    endpoints: ["127.0.0.1:7891", "127.0.0.1:2379"]
                });
                client.reconnect();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, client.range({
                        key: new Buffer("name")
                    })];
            case 2:
                _a.sent();
                t.pass();
                return [3, 4];
            case 3:
                e_4 = _a.sent();
                t.fail();
                return [3, 4];
            case 4: return [2];
        }
    });
}); });
ava_1["default"].serial("method `leaseGrant` creates new TTL lease", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var client, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = new __1.Etcd();
                return [4, client.leaseGrant({
                        ttl: "10"
                    })];
            case 1:
                res = _a.sent();
                t.deepEqual(Object.keys(res), ["header", "id", "ttl", "error"]);
                t.deepEqual(Object.keys(res.header), ["clusterId", "memberId", "revision", "raftTerm"]);
                t.is(res.ttl, "10");
                return [2];
        }
    });
}); });
ava_1["default"].serial("method `leaseRevoke` removes the lease", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var client, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = new __1.Etcd();
                return [4, client.leaseGrant({
                        ttl: "10"
                    }).then(function (res) {
                        return client.leaseRevoke({
                            id: res.id
                        });
                    })];
            case 1:
                res = _a.sent();
                t.deepEqual(Object.keys(res.header), ["clusterId", "memberId", "revision", "raftTerm"]);
                return [2];
        }
    });
}); });
ava_1["default"].serial("method `createWatcher` returns a new instance of Watcher", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var client, res;
    return __generator(this, function (_a) {
        client = new __1.Etcd();
        res = client.createWatcher();
        t.deepEqual(res instanceof __1.Watcher, true);
        return [2];
    });
}); });
//# sourceMappingURL=rpc.js.map