/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "e1e7b8f4db2d6ee098d6";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (typeof dep === "undefined") hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (typeof dep === "undefined") hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/index.js")(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/three.ar.js/dist/three.ar.module.js":
/*!**********************************************************!*\
  !*** ./node_modules/three.ar.js/dist/three.ar.module.js ***!
  \**********************************************************/
/*! exports provided: ARDebug, ARPerspectiveCamera, ARReticle, ARUtils, ARView, ARAnchorManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ARDebug\", function() { return ARDebug; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ARPerspectiveCamera\", function() { return ARPerspectiveCamera; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ARReticle\", function() { return ARReticle; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ARUtils\", function() { return ARUtils; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ARView\", function() { return ARView; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ARAnchorManager\", function() { return ARAnchorManager; });\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/**\n * @license\n * three.ar.js\n * Copyright (c) 2017 Google\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n/**\n * @license\n * gl-preserve-state\n * Copyright (c) 2016, Brandon Jones.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\nvar global$1 = typeof global !== \"undefined\" ? global :\n            typeof self !== \"undefined\" ? self :\n            typeof window !== \"undefined\" ? window : {};\n\nvar noop = function noop() {};\nvar opacityRemap = function opacityRemap(mat) {\n  if (mat.opacity === 0) {\n    mat.opacity = 1;\n  }\n};\nvar loadObj = function loadObj(objPath, materialCreator, OBJLoader) {\n  return new Promise(function (resolve, reject) {\n    var loader = new OBJLoader();\n    if (materialCreator) {\n      Object.keys(materialCreator.materials).forEach(function (k) {\n        return opacityRemap(materialCreator.materials[k]);\n      });\n      loader.setMaterials(materialCreator);\n    }\n    loader.load(objPath, resolve, noop, reject);\n  });\n};\nvar loadMtl = function loadMtl(mtlPath, MTLLoader) {\n  return new Promise(function (resolve, reject) {\n    var loader = new MTLLoader();\n    loader.setTexturePath(mtlPath.substr(0, mtlPath.lastIndexOf('/') + 1));\n    loader.setMaterialOptions({ ignoreZeroRGBs: true });\n    loader.load(mtlPath, resolve, noop, reject);\n  });\n};\n\nvar colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800'].map(function (hex) {\n  return new three__WEBPACK_IMPORTED_MODULE_0__[\"Color\"](hex);\n});\nvar LEARN_MORE_LINK = 'https://developers.google.com/ar/develop/web/getting-started';\nvar UNSUPPORTED_MESSAGE = 'This augmented reality experience requires\\n  WebARonARCore or WebARonARKit, experimental browsers from Google\\n  for Android and iOS. Learn more at the <a href=\"' + LEARN_MORE_LINK + '\">Google Developers site</a>.';\nvar ARUtils = Object.create(null);\nARUtils.isTango = function (display) {\n  return display && display.displayName.toLowerCase().includes('tango');\n};\nvar isTango = ARUtils.isTango;\nARUtils.isARKit = function (display) {\n  return display && display.displayName.toLowerCase().includes('arkit');\n};\nvar isARKit = ARUtils.isARKit;\nARUtils.isARDisplay = function (display) {\n  return isARKit(display) || isTango(display);\n};\nvar isARDisplay = ARUtils.isARDisplay;\nARUtils.getARDisplay = function () {\n  return new Promise(function (resolve, reject) {\n    if (!navigator.getVRDisplays) {\n      resolve(null);\n      return;\n    }\n    navigator.getVRDisplays().then(function (displays) {\n      if (!displays && displays.length === 0) {\n        resolve(null);\n        return;\n      }\n      var _iteratorNormalCompletion = true;\n      var _didIteratorError = false;\n      var _iteratorError = undefined;\n      try {\n        for (var _iterator = displays[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n          var display = _step.value;\n          if (isARDisplay(display)) {\n            resolve(display);\n            return;\n          }\n        }\n      } catch (err) {\n        _didIteratorError = true;\n        _iteratorError = err;\n      } finally {\n        try {\n          if (!_iteratorNormalCompletion && _iterator.return) {\n            _iterator.return();\n          }\n        } finally {\n          if (_didIteratorError) {\n            throw _iteratorError;\n          }\n        }\n      }\n      resolve(null);\n    });\n  });\n};\n\nARUtils.loadModel = function () {\n  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n  return new Promise(function (resolve, reject) {\n    var mtlPath = config.mtlPath,\n        objPath = config.objPath;\n    var OBJLoader = config.OBJLoader || (global$1.THREE ? global$1.THREE.OBJLoader : null);\n    var MTLLoader = config.MTLLoader || (global$1.THREE ? global$1.THREE.MTLLoader : null);\n    if (!config.objPath) {\n      reject(new Error('`objPath` must be specified.'));\n      return;\n    }\n    if (!OBJLoader) {\n      reject(new Error('Missing OBJLoader as third argument, or window.THREE.OBJLoader existence'));\n      return;\n    }\n    if (config.mtlPath && !MTLLoader) {\n      reject(new Error('Missing MTLLoader as fourth argument, or window.THREE.MTLLoader existence'));\n      return;\n    }\n    var p = Promise.resolve();\n    if (mtlPath) {\n      p = loadMtl(mtlPath, MTLLoader);\n    }\n    p.then(function (materialCreator) {\n      if (materialCreator) {\n        materialCreator.preload();\n      }\n      return loadObj(objPath, materialCreator, OBJLoader);\n    }).then(resolve, reject);\n  });\n};\n\nvar model = new three__WEBPACK_IMPORTED_MODULE_0__[\"Matrix4\"]();\nvar tempPos = new three__WEBPACK_IMPORTED_MODULE_0__[\"Vector3\"]();\nvar tempQuat = new three__WEBPACK_IMPORTED_MODULE_0__[\"Quaternion\"]();\nvar tempScale = new three__WEBPACK_IMPORTED_MODULE_0__[\"Vector3\"]();\nARUtils.placeObjectAtHit = function (object, hit) {\n  var easing = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;\n  var applyOrientation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;\n  if (!hit || !hit.modelMatrix) {\n    throw new Error('placeObjectAtHit requires a VRHit object');\n  }\n  model.fromArray(hit.modelMatrix);\n  model.decompose(tempPos, tempQuat, tempScale);\n  if (easing === 1) {\n    object.position.copy(tempPos);\n    if (applyOrientation) {\n      object.quaternion.copy(tempQuat);\n    }\n  } else {\n    object.position.lerp(tempPos, easing);\n    if (applyOrientation) {\n      object.quaternion.slerp(tempQuat, easing);\n    }\n  }\n};\nvar placeObjectAtHit = ARUtils.placeObjectAtHit;\nARUtils.getRandomPaletteColor = function () {\n  return colors[Math.floor(Math.random() * colors.length)];\n};\nvar getRandomPaletteColor = ARUtils.getRandomPaletteColor;\nARUtils.displayUnsupportedMessage = function (customMessage) {\n  var element = document.createElement('div');\n  element.id = 'webgl-error-message';\n  element.style.fontFamily = 'monospace';\n  element.style.fontSize = '13px';\n  element.style.fontWeight = 'normal';\n  element.style.textAlign = 'center';\n  element.style.background = '#fff';\n  element.style.border = '1px solid black';\n  element.style.color = '#000';\n  element.style.padding = '1.5em';\n  element.style.width = '400px';\n  element.style.margin = '5em auto 0';\n  element.innerHTML = typeof customMessage === 'string' ? customMessage : UNSUPPORTED_MESSAGE;\n  document.body.appendChild(element);\n};\n\nvar vertexShader = \"precision mediump float;precision mediump int;uniform mat4 modelViewMatrix;uniform mat4 modelMatrix;uniform mat4 projectionMatrix;attribute vec3 position;varying vec3 vPosition;void main(){vPosition=(modelMatrix*vec4(position,1.0)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\";\n\nvar fragmentShader = \"precision highp float;varying vec3 vPosition;\\n#define countX 7.0\\n#define countY 4.0\\n#define gridAlpha 0.75\\nuniform float dotRadius;uniform vec3 dotColor;uniform vec3 lineColor;uniform vec3 backgroundColor;uniform float alpha;float Circle(in vec2 p,float r){return length(p)-r;}float Line(in vec2 p,in vec2 a,in vec2 b){vec2 pa=p-a;vec2 ba=b-a;float t=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);vec2 pt=a+t*ba;return length(pt-p);}float Union(float a,float b){return min(a,b);}void main(){vec2 count=vec2(countX,countY);vec2 size=vec2(1.0)/count;vec2 halfSize=size*0.5;vec2 uv=mod(vPosition.xz*1.5,size)-halfSize;float dots=Circle(uv-vec2(halfSize.x,0.0),dotRadius);dots=Union(dots,Circle(uv+vec2(halfSize.x,0.0),dotRadius));dots=Union(dots,Circle(uv+vec2(0.0,halfSize.y),dotRadius));dots=Union(dots,Circle(uv-vec2(0.0,halfSize.y),dotRadius));float lines=Line(uv,vec2(0.0,halfSize.y),-vec2(halfSize.x,0.0));lines=Union(lines,Line(uv,vec2(0.0,-halfSize.y),-vec2(halfSize.x,0.0)));lines=Union(lines,Line(uv,vec2(0.0,-halfSize.y),vec2(halfSize.x,0.0)));lines=Union(lines,Line(uv,vec2(0.0,halfSize.y),vec2(halfSize.x,0.0)));lines=Union(lines,Line(uv,vec2(-halfSize.x,halfSize.y),vec2(halfSize.x,halfSize.y)));lines=Union(lines,Line(uv,vec2(-halfSize.x,-halfSize.y),vec2(halfSize.x,-halfSize.y)));lines=Union(lines,Line(uv,vec2(-halfSize.x,0.0),vec2(halfSize.x,0.0)));lines=clamp(smoothstep(0.0,0.0035,lines),0.0,1.0);dots=clamp(smoothstep(0.0,0.001,dots),0.0,1.0);float result=Union(dots,lines);gl_FragColor=vec4(mix(backgroundColor+mix(dotColor,lineColor,dots),backgroundColor,result),mix(gridAlpha,alpha,result));}\";\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) {\n  return typeof obj;\n} : function (obj) {\n  return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj;\n};\n\n\n\n\n\nvar asyncGenerator = function () {\n  function AwaitValue(value) {\n    this.value = value;\n  }\n\n  function AsyncGenerator(gen) {\n    var front, back;\n\n    function send(key, arg) {\n      return new Promise(function (resolve, reject) {\n        var request = {\n          key: key,\n          arg: arg,\n          resolve: resolve,\n          reject: reject,\n          next: null\n        };\n\n        if (back) {\n          back = back.next = request;\n        } else {\n          front = back = request;\n          resume(key, arg);\n        }\n      });\n    }\n\n    function resume(key, arg) {\n      try {\n        var result = gen[key](arg);\n        var value = result.value;\n\n        if (value instanceof AwaitValue) {\n          Promise.resolve(value.value).then(function (arg) {\n            resume(\"next\", arg);\n          }, function (arg) {\n            resume(\"throw\", arg);\n          });\n        } else {\n          settle(result.done ? \"return\" : \"normal\", result.value);\n        }\n      } catch (err) {\n        settle(\"throw\", err);\n      }\n    }\n\n    function settle(type, value) {\n      switch (type) {\n        case \"return\":\n          front.resolve({\n            value: value,\n            done: true\n          });\n          break;\n\n        case \"throw\":\n          front.reject(value);\n          break;\n\n        default:\n          front.resolve({\n            value: value,\n            done: false\n          });\n          break;\n      }\n\n      front = front.next;\n\n      if (front) {\n        resume(front.key, front.arg);\n      } else {\n        back = null;\n      }\n    }\n\n    this._invoke = send;\n\n    if (typeof gen.return !== \"function\") {\n      this.return = undefined;\n    }\n  }\n\n  if (typeof Symbol === \"function\" && Symbol.asyncIterator) {\n    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {\n      return this;\n    };\n  }\n\n  AsyncGenerator.prototype.next = function (arg) {\n    return this._invoke(\"next\", arg);\n  };\n\n  AsyncGenerator.prototype.throw = function (arg) {\n    return this._invoke(\"throw\", arg);\n  };\n\n  AsyncGenerator.prototype.return = function (arg) {\n    return this._invoke(\"return\", arg);\n  };\n\n  return {\n    wrap: function (fn) {\n      return function () {\n        return new AsyncGenerator(fn.apply(this, arguments));\n      };\n    },\n    await: function (value) {\n      return new AwaitValue(value);\n    }\n  };\n}();\n\n\n\n\n\nvar classCallCheck = function (instance, Constructor) {\n  if (!(instance instanceof Constructor)) {\n    throw new TypeError(\"Cannot call a class as a function\");\n  }\n};\n\nvar createClass = function () {\n  function defineProperties(target, props) {\n    for (var i = 0; i < props.length; i++) {\n      var descriptor = props[i];\n      descriptor.enumerable = descriptor.enumerable || false;\n      descriptor.configurable = true;\n      if (\"value\" in descriptor) descriptor.writable = true;\n      Object.defineProperty(target, descriptor.key, descriptor);\n    }\n  }\n\n  return function (Constructor, protoProps, staticProps) {\n    if (protoProps) defineProperties(Constructor.prototype, protoProps);\n    if (staticProps) defineProperties(Constructor, staticProps);\n    return Constructor;\n  };\n}();\n\n\n\n\n\n\n\nvar get = function get(object, property, receiver) {\n  if (object === null) object = Function.prototype;\n  var desc = Object.getOwnPropertyDescriptor(object, property);\n\n  if (desc === undefined) {\n    var parent = Object.getPrototypeOf(object);\n\n    if (parent === null) {\n      return undefined;\n    } else {\n      return get(parent, property, receiver);\n    }\n  } else if (\"value\" in desc) {\n    return desc.value;\n  } else {\n    var getter = desc.get;\n\n    if (getter === undefined) {\n      return undefined;\n    }\n\n    return getter.call(receiver);\n  }\n};\n\nvar inherits = function (subClass, superClass) {\n  if (typeof superClass !== \"function\" && superClass !== null) {\n    throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass);\n  }\n\n  subClass.prototype = Object.create(superClass && superClass.prototype, {\n    constructor: {\n      value: subClass,\n      enumerable: false,\n      writable: true,\n      configurable: true\n    }\n  });\n  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;\n};\n\n\n\n\n\n\n\n\n\n\n\nvar possibleConstructorReturn = function (self, call) {\n  if (!self) {\n    throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");\n  }\n\n  return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self;\n};\n\n\n\n\n\nvar slicedToArray = function () {\n  function sliceIterator(arr, i) {\n    var _arr = [];\n    var _n = true;\n    var _d = false;\n    var _e = undefined;\n\n    try {\n      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {\n        _arr.push(_s.value);\n\n        if (i && _arr.length === i) break;\n      }\n    } catch (err) {\n      _d = true;\n      _e = err;\n    } finally {\n      try {\n        if (!_n && _i[\"return\"]) _i[\"return\"]();\n      } finally {\n        if (_d) throw _e;\n      }\n    }\n\n    return _arr;\n  }\n\n  return function (arr, i) {\n    if (Array.isArray(arr)) {\n      return arr;\n    } else if (Symbol.iterator in Object(arr)) {\n      return sliceIterator(arr, i);\n    } else {\n      throw new TypeError(\"Invalid attempt to destructure non-iterable instance\");\n    }\n  };\n}();\n\nvar DEFAULT_MATERIAL = new three__WEBPACK_IMPORTED_MODULE_0__[\"RawShaderMaterial\"]({\n  side: three__WEBPACK_IMPORTED_MODULE_0__[\"DoubleSide\"],\n  transparent: true,\n  uniforms: {\n    dotColor: {\n      value: new three__WEBPACK_IMPORTED_MODULE_0__[\"Color\"](0xffffff)\n    },\n    lineColor: {\n      value: new three__WEBPACK_IMPORTED_MODULE_0__[\"Color\"](0x707070)\n    },\n    backgroundColor: {\n      value: new three__WEBPACK_IMPORTED_MODULE_0__[\"Color\"](0x404040)\n    },\n    dotRadius: {\n      value: 0.006666666667\n    },\n    alpha: {\n      value: 0.4\n    }\n  },\n  vertexShader: vertexShader,\n  fragmentShader: fragmentShader\n});\nvar ARPlanes = function (_Object3D) {\n  inherits(ARPlanes, _Object3D);\n  function ARPlanes(vrDisplay) {\n    classCallCheck(this, ARPlanes);\n    var _this = possibleConstructorReturn(this, (ARPlanes.__proto__ || Object.getPrototypeOf(ARPlanes)).call(this));\n    _this.addPlane_ = function (plane) {\n      var planeObj = _this.createPlane(plane);\n      if (planeObj) {\n        _this.add(planeObj);\n        _this.planes.set(plane.identifier, planeObj);\n      }\n    };\n    _this.removePlane_ = function (identifier) {\n      var existing = _this.planes.get(identifier);\n      if (existing) {\n        _this.remove(existing);\n      }\n      _this.planes.delete(identifier);\n    };\n    _this.onPlaneAdded_ = function (event) {\n      event.planes.forEach(function (plane) {\n        return _this.addPlane_(plane);\n      });\n    };\n    _this.onPlaneUpdated_ = function (event) {\n      var _iteratorNormalCompletion = true;\n      var _didIteratorError = false;\n      var _iteratorError = undefined;\n      try {\n        for (var _iterator = event.planes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n          var plane = _step.value;\n          _this.removePlane_(plane.identifier);\n          _this.addPlane_(plane);\n        }\n      } catch (err) {\n        _didIteratorError = true;\n        _iteratorError = err;\n      } finally {\n        try {\n          if (!_iteratorNormalCompletion && _iterator.return) {\n            _iterator.return();\n          }\n        } finally {\n          if (_didIteratorError) {\n            throw _iteratorError;\n          }\n        }\n      }\n    };\n    _this.onPlaneRemoved_ = function (event) {\n      var _iteratorNormalCompletion2 = true;\n      var _didIteratorError2 = false;\n      var _iteratorError2 = undefined;\n      try {\n        for (var _iterator2 = event.planes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {\n          var plane = _step2.value;\n          _this.removePlane_(plane.identifier);\n        }\n      } catch (err) {\n        _didIteratorError2 = true;\n        _iteratorError2 = err;\n      } finally {\n        try {\n          if (!_iteratorNormalCompletion2 && _iterator2.return) {\n            _iterator2.return();\n          }\n        } finally {\n          if (_didIteratorError2) {\n            throw _iteratorError2;\n          }\n        }\n      }\n    };\n    _this.vrDisplay = vrDisplay;\n    _this.planes = new Map();\n    _this.materials = new Map();\n    return _this;\n  }\n  createClass(ARPlanes, [{\n    key: 'enable',\n    value: function enable() {\n      this.vrDisplay.getPlanes().forEach(this.addPlane_);\n      this.vrDisplay.addEventListener('planesadded', this.onPlaneAdded_);\n      this.vrDisplay.addEventListener('planesupdated', this.onPlaneUpdated_);\n      this.vrDisplay.addEventListener('planesremoved', this.onPlaneRemoved_);\n    }\n  }, {\n    key: 'disable',\n    value: function disable() {\n      this.vrDisplay.removeEventListener('planesadded', this.onPlaneAdded_);\n      this.vrDisplay.removeEventListener('planesupdated', this.onPlaneUpdated_);\n      this.vrDisplay.removeEventListener('planesremoved', this.onPlaneRemoved_);\n      var _iteratorNormalCompletion3 = true;\n      var _didIteratorError3 = false;\n      var _iteratorError3 = undefined;\n      try {\n        for (var _iterator3 = this.planes.keys()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {\n          var identifier = _step3.value;\n          this.removePlane_(identifier);\n        }\n      } catch (err) {\n        _didIteratorError3 = true;\n        _iteratorError3 = err;\n      } finally {\n        try {\n          if (!_iteratorNormalCompletion3 && _iterator3.return) {\n            _iterator3.return();\n          }\n        } finally {\n          if (_didIteratorError3) {\n            throw _iteratorError3;\n          }\n        }\n      }\n      this.materials.clear();\n    }\n  }, {\n    key: 'createPlane',\n    value: function createPlane(plane) {\n      if (plane.vertices.length == 0) {\n        return null;\n      }\n      var geo = new three__WEBPACK_IMPORTED_MODULE_0__[\"Geometry\"]();\n      for (var pt = 0; pt < plane.vertices.length / 3; pt++) {\n        geo.vertices.push(new three__WEBPACK_IMPORTED_MODULE_0__[\"Vector3\"](plane.vertices[pt * 3], plane.vertices[pt * 3 + 1], plane.vertices[pt * 3 + 2]));\n      }\n      for (var face = 0; face < geo.vertices.length - 2; face++) {\n        geo.faces.push(new three__WEBPACK_IMPORTED_MODULE_0__[\"Face3\"](0, face + 1, face + 2));\n      }\n      var material = void 0;\n      if (this.materials.has(plane.identifier)) {\n        material = this.materials.get(plane.identifier);\n      } else {\n        var color = getRandomPaletteColor();\n        material = DEFAULT_MATERIAL.clone();\n        material.uniforms.backgroundColor.value = color;\n        this.materials.set(plane.identifier, material);\n      }\n      var planeObj = new three__WEBPACK_IMPORTED_MODULE_0__[\"Mesh\"](geo, material);\n      var mm = plane.modelMatrix;\n      planeObj.matrixAutoUpdate = false;\n      planeObj.matrix.set(mm[0], mm[4], mm[8], mm[12], mm[1], mm[5], mm[9], mm[13], mm[2], mm[6], mm[10], mm[14], mm[3], mm[7], mm[11], mm[15]);\n      this.add(planeObj);\n      return planeObj;\n    }\n  }, {\n    key: 'size',\n    value: function size() {\n      return this.planes.size;\n    }\n  }]);\n  return ARPlanes;\n}(three__WEBPACK_IMPORTED_MODULE_0__[\"Object3D\"]);\n\nvar DEFAULTS = {\n  open: true,\n  showLastHit: true,\n  showPoseStatus: true,\n  showPlanes: false\n};\nvar SUCCESS_COLOR = '#00ff00';\nvar FAILURE_COLOR = '#ff0077';\nvar PLANES_POLLING_TIMER = 500;\nvar THROTTLE_SPEED = 500;\nvar cachedVRDisplayMethods = new Map();\nfunction throttle(fn, timer, scope) {\n  var lastFired = void 0;\n  var timeout = void 0;\n  return function () {\n    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n    var current = +new Date();\n    var until = void 0;\n    if (lastFired) {\n      until = lastFired + timer - current;\n    }\n    if (until == undefined || until < 0) {\n      lastFired = current;\n      fn.apply(scope, args);\n    } else if (until >= 0) {\n      clearTimeout(timeout);\n      timeout = setTimeout(function () {\n        lastFired = current;\n        fn.apply(scope, args);\n      }, until);\n    }\n  };\n}\nvar ARDebug = function () {\n  function ARDebug(vrDisplay, scene, config) {\n    classCallCheck(this, ARDebug);\n    if (typeof config === 'undefined' && scene && scene.type !== 'Scene') {\n      config = scene;\n      scene = null;\n    }\n    this.config = Object.assign({}, DEFAULTS, config);\n    this.vrDisplay = vrDisplay;\n    this._view = new ARDebugView({ open: this.config.open });\n    if (this.config.showLastHit && this.vrDisplay.hitTest) {\n      this._view.addRow('hit-test', new ARDebugHitTestRow(vrDisplay));\n    }\n    if (this.config.showPoseStatus && this.vrDisplay.getFrameData) {\n      this._view.addRow('pose-status', new ARDebugPoseRow(vrDisplay));\n    }\n    if (this.config.showPlanes && this.vrDisplay.getPlanes) {\n      if (!scene) {\n        console.warn('ARDebug `{ showPlanes: true }` option requires ' + 'passing in a THREE.Scene as the second parameter ' + 'in the constructor.');\n      } else {\n        this._view.addRow('show-planes', new ARDebugPlanesRow(vrDisplay, scene));\n      }\n    }\n  }\n  createClass(ARDebug, [{\n    key: 'open',\n    value: function open() {\n      this._view.open();\n    }\n  }, {\n    key: 'close',\n    value: function close() {\n      this._view.close();\n    }\n  }, {\n    key: 'getElement',\n    value: function getElement() {\n      return this._view.getElement();\n    }\n  }]);\n  return ARDebug;\n}();\nvar ARDebugView = function () {\n  function ARDebugView() {\n    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n    classCallCheck(this, ARDebugView);\n    this.rows = new Map();\n    this.el = document.createElement('div');\n    this.el.style.backgroundColor = '#333';\n    this.el.style.padding = '5px';\n    this.el.style.fontFamily = 'Roboto, Ubuntu, Arial, sans-serif';\n    this.el.style.color = 'rgb(165, 165, 165)';\n    this.el.style.position = 'absolute';\n    this.el.style.right = '20px';\n    this.el.style.top = '0px';\n    this.el.style.width = '200px';\n    this.el.style.fontSize = '12px';\n    this.el.style.zIndex = 9999;\n    this._rowsEl = document.createElement('div');\n    this._rowsEl.style.transitionProperty = 'max-height';\n    this._rowsEl.style.transitionDuration = '0.5s';\n    this._rowsEl.style.transitionDelay = '0s';\n    this._rowsEl.style.transitionTimingFunction = 'ease-out';\n    this._rowsEl.style.overflow = 'hidden';\n    this._controls = document.createElement('div');\n    this._controls.style.fontSize = '13px';\n    this._controls.style.fontWeight = 'bold';\n    this._controls.style.paddingTop = '5px';\n    this._controls.style.textAlign = 'center';\n    this._controls.style.cursor = 'pointer';\n    this._controls.addEventListener('click', this.toggleControls.bind(this));\n    config.open ? this.open() : this.close();\n    this.el.appendChild(this._rowsEl);\n    this.el.appendChild(this._controls);\n  }\n  createClass(ARDebugView, [{\n    key: 'toggleControls',\n    value: function toggleControls() {\n      if (this._isOpen) {\n        this.close();\n      } else {\n        this.open();\n      }\n    }\n  }, {\n    key: 'open',\n    value: function open() {\n      this._rowsEl.style.maxHeight = '100px';\n      this._isOpen = true;\n      this._controls.textContent = 'Close ARDebug';\n      var _iteratorNormalCompletion = true;\n      var _didIteratorError = false;\n      var _iteratorError = undefined;\n      try {\n        for (var _iterator = this.rows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n          var _ref = _step.value;\n          var _ref2 = slicedToArray(_ref, 2);\n          var row = _ref2[1];\n          row.enable();\n        }\n      } catch (err) {\n        _didIteratorError = true;\n        _iteratorError = err;\n      } finally {\n        try {\n          if (!_iteratorNormalCompletion && _iterator.return) {\n            _iterator.return();\n          }\n        } finally {\n          if (_didIteratorError) {\n            throw _iteratorError;\n          }\n        }\n      }\n    }\n  }, {\n    key: 'close',\n    value: function close() {\n      this._rowsEl.style.maxHeight = '0px';\n      this._isOpen = false;\n      this._controls.textContent = 'Open ARDebug';\n      var _iteratorNormalCompletion2 = true;\n      var _didIteratorError2 = false;\n      var _iteratorError2 = undefined;\n      try {\n        for (var _iterator2 = this.rows[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {\n          var _ref3 = _step2.value;\n          var _ref4 = slicedToArray(_ref3, 2);\n          var row = _ref4[1];\n          row.disable();\n        }\n      } catch (err) {\n        _didIteratorError2 = true;\n        _iteratorError2 = err;\n      } finally {\n        try {\n          if (!_iteratorNormalCompletion2 && _iterator2.return) {\n            _iterator2.return();\n          }\n        } finally {\n          if (_didIteratorError2) {\n            throw _iteratorError2;\n          }\n        }\n      }\n    }\n  }, {\n    key: 'getElement',\n    value: function getElement() {\n      return this.el;\n    }\n  }, {\n    key: 'addRow',\n    value: function addRow(id, row) {\n      this.rows.set(id, row);\n      if (this._isOpen) {\n        row.enable();\n      }\n      this._rowsEl.appendChild(row.getElement());\n    }\n  }]);\n  return ARDebugView;\n}();\nvar ARDebugRow = function () {\n  function ARDebugRow(title) {\n    classCallCheck(this, ARDebugRow);\n    this.el = document.createElement('div');\n    this.el.style.width = '100%';\n    this.el.style.borderTop = '1px solid rgb(54, 54, 54)';\n    this.el.style.borderBottom = '1px solid #14171A';\n    this.el.style.position = 'relative';\n    this.el.style.padding = '3px 0px';\n    this.el.style.overflow = 'hidden';\n    this._titleEl = document.createElement('span');\n    this._titleEl.style.fontWeight = 'bold';\n    this._titleEl.textContent = title;\n    this._dataEl = document.createElement('span');\n    this._dataEl.style.position = 'absolute';\n    this._dataEl.style.left = '40px';\n    this._dataElText = document.createTextNode('');\n    this._dataEl.appendChild(this._dataElText);\n    this.el.appendChild(this._titleEl);\n    this.el.appendChild(this._dataEl);\n    this._throttledWriteToDOM = throttle(this._writeToDOM, THROTTLE_SPEED, this);\n  }\n  createClass(ARDebugRow, [{\n    key: 'enable',\n    value: function enable() {\n      throw new Error('Implement in child class');\n    }\n  }, {\n    key: 'disable',\n    value: function disable() {\n      throw new Error('Implement in child class');\n    }\n  }, {\n    key: 'getElement',\n    value: function getElement() {\n      return this.el;\n    }\n  }, {\n    key: 'update',\n    value: function update(value, isSuccess, renderImmediately) {\n      if (renderImmediately) {\n        this._writeToDOM(value, isSuccess);\n      } else {\n        this._throttledWriteToDOM(value, isSuccess);\n      }\n    }\n  }, {\n    key: '_writeToDOM',\n    value: function _writeToDOM(value, isSuccess) {\n      this._dataElText.nodeValue = value;\n      this._dataEl.style.color = isSuccess ? SUCCESS_COLOR : FAILURE_COLOR;\n    }\n  }]);\n  return ARDebugRow;\n}();\nvar ARDebugHitTestRow = function (_ARDebugRow) {\n  inherits(ARDebugHitTestRow, _ARDebugRow);\n  function ARDebugHitTestRow(vrDisplay) {\n    classCallCheck(this, ARDebugHitTestRow);\n    var _this = possibleConstructorReturn(this, (ARDebugHitTestRow.__proto__ || Object.getPrototypeOf(ARDebugHitTestRow)).call(this, 'Hit'));\n    _this.vrDisplay = vrDisplay;\n    _this._onHitTest = _this._onHitTest.bind(_this);\n    _this._nativeHitTest = cachedVRDisplayMethods.get('hitTest') || _this.vrDisplay.hitTest;\n    cachedVRDisplayMethods.set('hitTest', _this._nativeHitTest);\n    _this._didPreviouslyHit = null;\n    return _this;\n  }\n  createClass(ARDebugHitTestRow, [{\n    key: 'enable',\n    value: function enable() {\n      this.vrDisplay.hitTest = this._onHitTest;\n    }\n  }, {\n    key: 'disable',\n    value: function disable() {\n      this.vrDisplay.hitTest = this._nativeHitTest;\n    }\n  }, {\n    key: '_hitToString',\n    value: function _hitToString(hit) {\n      var mm = hit.modelMatrix;\n      return mm[12].toFixed(2) + ', ' + mm[13].toFixed(2) + ', ' + mm[14].toFixed(2);\n    }\n  }, {\n    key: '_onHitTest',\n    value: function _onHitTest(x, y) {\n      var hits = this._nativeHitTest.call(this.vrDisplay, x, y);\n      var t = (parseInt(performance.now(), 10) / 1000).toFixed(1);\n      var didHit = hits && hits.length;\n      var value = (didHit ? this._hitToString(hits[0]) : 'MISS') + ' @ ' + t + 's';\n      this.update(value, didHit, didHit !== this._didPreviouslyHit);\n      this._didPreviouslyHit = didHit;\n      return hits;\n    }\n  }]);\n  return ARDebugHitTestRow;\n}(ARDebugRow);\nvar ARDebugPoseRow = function (_ARDebugRow2) {\n  inherits(ARDebugPoseRow, _ARDebugRow2);\n  function ARDebugPoseRow(vrDisplay) {\n    classCallCheck(this, ARDebugPoseRow);\n    var _this2 = possibleConstructorReturn(this, (ARDebugPoseRow.__proto__ || Object.getPrototypeOf(ARDebugPoseRow)).call(this, 'Pose'));\n    _this2.vrDisplay = vrDisplay;\n    _this2._onGetFrameData = _this2._onGetFrameData.bind(_this2);\n    _this2._nativeGetFrameData = cachedVRDisplayMethods.get('getFrameData') || _this2.vrDisplay.getFrameData;\n    cachedVRDisplayMethods.set('getFrameData', _this2._nativeGetFrameData);\n    _this2.update('Looking for position...', false, true);\n    _this2._initialPose = false;\n    return _this2;\n  }\n  createClass(ARDebugPoseRow, [{\n    key: 'enable',\n    value: function enable() {\n      this.vrDisplay.getFrameData = this._onGetFrameData;\n    }\n  }, {\n    key: 'disable',\n    value: function disable() {\n      this.vrDisplay.getFrameData = this._nativeGetFrameData;\n    }\n  }, {\n    key: '_poseToString',\n    value: function _poseToString(pose) {\n      return pose[0].toFixed(2) + ', ' + pose[1].toFixed(2) + ', ' + pose[2].toFixed(2);\n    }\n  }, {\n    key: '_onGetFrameData',\n    value: function _onGetFrameData(frameData) {\n      var results = this._nativeGetFrameData.call(this.vrDisplay, frameData);\n      var pose = frameData && frameData.pose && frameData.pose.position;\n      var isValidPose = pose && typeof pose[0] === 'number' && typeof pose[1] === 'number' && typeof pose[2] === 'number' && !(pose[0] === 0 && pose[1] === 0 && pose[2] === 0);\n      if (!this._initialPose && !isValidPose) {\n        return results;\n      }\n      var renderImmediately = isValidPose !== this._lastPoseValid;\n      if (isValidPose) {\n        this.update(this._poseToString(pose), true, renderImmediately);\n      } else if (!isValidPose && this._lastPoseValid !== false) {\n        this.update('Position lost', false, renderImmediately);\n      }\n      this._lastPoseValid = isValidPose;\n      this._initialPose = true;\n      return results;\n    }\n  }]);\n  return ARDebugPoseRow;\n}(ARDebugRow);\nvar ARDebugPlanesRow = function (_ARDebugRow3) {\n  inherits(ARDebugPlanesRow, _ARDebugRow3);\n  function ARDebugPlanesRow(vrDisplay, scene) {\n    classCallCheck(this, ARDebugPlanesRow);\n    var _this3 = possibleConstructorReturn(this, (ARDebugPlanesRow.__proto__ || Object.getPrototypeOf(ARDebugPlanesRow)).call(this, 'Planes'));\n    _this3.vrDisplay = vrDisplay;\n    _this3.planes = new ARPlanes(_this3.vrDisplay);\n    _this3._onPoll = _this3._onPoll.bind(_this3);\n    _this3.update('Looking for planes...', false, true);\n    if (scene) {\n      scene.add(_this3.planes);\n    }\n    return _this3;\n  }\n  createClass(ARDebugPlanesRow, [{\n    key: 'enable',\n    value: function enable() {\n      if (this._timer) {\n        this.disable();\n      }\n      this._timer = setInterval(this._onPoll, PLANES_POLLING_TIMER);\n      this.planes.enable();\n    }\n  }, {\n    key: 'disable',\n    value: function disable() {\n      clearInterval(this._timer);\n      this._timer = null;\n      this.planes.disable();\n    }\n  }, {\n    key: '_planesToString',\n    value: function _planesToString(count) {\n      return count + ' plane' + (count === 1 ? '' : 's') + ' found';\n    }\n  }, {\n    key: '_onPoll',\n    value: function _onPoll() {\n      var planeCount = this.planes.size();\n      if (this._lastPlaneCount !== planeCount) {\n        this.update(this._planesToString(planeCount), planeCount > 0, true);\n      }\n      this._lastPlaneCount = planeCount;\n    }\n  }]);\n  return ARDebugPlanesRow;\n}(ARDebugRow);\n\nvar frameData = void 0;\nvar ARPerspectiveCamera = function (_PerspectiveCamera) {\n  inherits(ARPerspectiveCamera, _PerspectiveCamera);\n  function ARPerspectiveCamera(vrDisplay, fov, aspect, near, far) {\n    classCallCheck(this, ARPerspectiveCamera);\n    var _this = possibleConstructorReturn(this, (ARPerspectiveCamera.__proto__ || Object.getPrototypeOf(ARPerspectiveCamera)).call(this, fov, aspect, near, far));\n    _this.isARPerpsectiveCamera = true;\n    _this.vrDisplay = vrDisplay;\n    _this.updateProjectionMatrix();\n    if (!vrDisplay || !vrDisplay.capabilities.hasPassThroughCamera) {\n      console.warn('ARPerspectiveCamera does not a VRDisplay with\\n                    a pass through camera. Using supplied values and defaults\\n                    instead of device camera intrinsics');\n    }\n    return _this;\n  }\n  createClass(ARPerspectiveCamera, [{\n    key: 'updateProjectionMatrix',\n    value: function updateProjectionMatrix() {\n      var projMatrix = this.getProjectionMatrix();\n      if (!projMatrix) {\n        get(ARPerspectiveCamera.prototype.__proto__ || Object.getPrototypeOf(ARPerspectiveCamera.prototype), 'updateProjectionMatrix', this).call(this);\n        return;\n      }\n      this.projectionMatrix.fromArray(projMatrix);\n    }\n  }, {\n    key: 'getProjectionMatrix',\n    value: function getProjectionMatrix() {\n      if (this.vrDisplay && this.vrDisplay.getFrameData) {\n        if (!frameData) {\n          frameData = new VRFrameData();\n        }\n        this.vrDisplay.getFrameData(frameData);\n        return frameData.leftProjectionMatrix;\n      }\n      return null;\n    }\n  }]);\n  return ARPerspectiveCamera;\n}(three__WEBPACK_IMPORTED_MODULE_0__[\"PerspectiveCamera\"]);\n\nvar ARReticle = function (_Mesh) {\n  inherits(ARReticle, _Mesh);\n  function ARReticle(vrDisplay) {\n    var innerRadius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.02;\n    var outerRadius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.05;\n    var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0xff0077;\n    var easing = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.25;\n    classCallCheck(this, ARReticle);\n    var geometry = new three__WEBPACK_IMPORTED_MODULE_0__[\"RingGeometry\"](innerRadius, outerRadius, 36, 64);\n    var material = new three__WEBPACK_IMPORTED_MODULE_0__[\"MeshBasicMaterial\"]({ color: color });\n    geometry.applyMatrix(new three__WEBPACK_IMPORTED_MODULE_0__[\"Matrix4\"]().makeRotationX(three__WEBPACK_IMPORTED_MODULE_0__[\"Math\"].degToRad(-90)));\n    var _this = possibleConstructorReturn(this, (ARReticle.__proto__ || Object.getPrototypeOf(ARReticle)).call(this, geometry, material));\n    _this.visible = false;\n    _this.easing = easing;\n    _this.applyOrientation = true;\n    _this.vrDisplay = vrDisplay;\n    _this._planeDir = new three__WEBPACK_IMPORTED_MODULE_0__[\"Vector3\"]();\n    return _this;\n  }\n  createClass(ARReticle, [{\n    key: 'update',\n    value: function update() {\n      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;\n      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;\n      if (!this.vrDisplay || !this.vrDisplay.hitTest) {\n        return;\n      }\n      var hit = this.vrDisplay.hitTest(x, y);\n      if (hit && hit.length > 0) {\n        this.visible = true;\n        placeObjectAtHit(this, hit[0], this.applyOrientation, this.easing);\n      }\n    }\n  }]);\n  return ARReticle;\n}(three__WEBPACK_IMPORTED_MODULE_0__[\"Mesh\"]);\n\nvar vertexSource = \"attribute vec3 aVertexPosition;attribute vec2 aTextureCoord;varying vec2 vTextureCoord;void main(void){gl_Position=vec4(aVertexPosition,1.0);vTextureCoord=aTextureCoord;}\";\n\nvar fragmentSource = \"precision mediump float;varying vec2 vTextureCoord;uniform sampler2D uSampler;void main(void){gl_FragColor=texture2D(uSampler,vTextureCoord);}\";\n\nvar fragmentSourceOES = \"\\n#extension GL_OES_EGL_image_external : require\\nprecision mediump float;varying vec2 vTextureCoord;uniform samplerExternalOES uSampler;void main(void){gl_FragColor=texture2D(uSampler,vTextureCoord);}\";\n\nfunction WGLUPreserveGLState(gl, bindings, callback) {\n  if (!bindings) {\n    callback(gl);\n    return;\n  }\n  var boundValues = [];\n  var activeTexture = null;\n  for (var i = 0; i < bindings.length; ++i) {\n    var binding = bindings[i];\n    switch (binding) {\n      case gl.TEXTURE_BINDING_2D:\n      case gl.TEXTURE_BINDING_CUBE_MAP:\n        var textureUnit = bindings[++i];\n        if (textureUnit < gl.TEXTURE0 || textureUnit > gl.TEXTURE31) {\n          console.error(\"TEXTURE_BINDING_2D or TEXTURE_BINDING_CUBE_MAP must be followed by a valid texture unit\");\n          boundValues.push(null, null);\n          break;\n        }\n        if (!activeTexture) {\n          activeTexture = gl.getParameter(gl.ACTIVE_TEXTURE);\n        }\n        gl.activeTexture(textureUnit);\n        boundValues.push(gl.getParameter(binding), null);\n        break;\n      case gl.ACTIVE_TEXTURE:\n        activeTexture = gl.getParameter(gl.ACTIVE_TEXTURE);\n        boundValues.push(null);\n        break;\n      default:\n        boundValues.push(gl.getParameter(binding));\n        break;\n    }\n  }\n  callback(gl);\n  for (var i = 0; i < bindings.length; ++i) {\n    var binding = bindings[i];\n    var boundValue = boundValues[i];\n    switch (binding) {\n      case gl.ACTIVE_TEXTURE:\n        break;\n      case gl.ARRAY_BUFFER_BINDING:\n        gl.bindBuffer(gl.ARRAY_BUFFER, boundValue);\n        break;\n      case gl.COLOR_CLEAR_VALUE:\n        gl.clearColor(boundValue[0], boundValue[1], boundValue[2], boundValue[3]);\n        break;\n      case gl.COLOR_WRITEMASK:\n        gl.colorMask(boundValue[0], boundValue[1], boundValue[2], boundValue[3]);\n        break;\n      case gl.CURRENT_PROGRAM:\n        gl.useProgram(boundValue);\n        break;\n      case gl.ELEMENT_ARRAY_BUFFER_BINDING:\n        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boundValue);\n        break;\n      case gl.FRAMEBUFFER_BINDING:\n        gl.bindFramebuffer(gl.FRAMEBUFFER, boundValue);\n        break;\n      case gl.RENDERBUFFER_BINDING:\n        gl.bindRenderbuffer(gl.RENDERBUFFER, boundValue);\n        break;\n      case gl.TEXTURE_BINDING_2D:\n        var textureUnit = bindings[++i];\n        if (textureUnit < gl.TEXTURE0 || textureUnit > gl.TEXTURE31)\n          break;\n        gl.activeTexture(textureUnit);\n        gl.bindTexture(gl.TEXTURE_2D, boundValue);\n        break;\n      case gl.TEXTURE_BINDING_CUBE_MAP:\n        var textureUnit = bindings[++i];\n        if (textureUnit < gl.TEXTURE0 || textureUnit > gl.TEXTURE31)\n          break;\n        gl.activeTexture(textureUnit);\n        gl.bindTexture(gl.TEXTURE_CUBE_MAP, boundValue);\n        break;\n      case gl.VIEWPORT:\n        gl.viewport(boundValue[0], boundValue[1], boundValue[2], boundValue[3]);\n        break;\n      case gl.BLEND:\n      case gl.CULL_FACE:\n      case gl.DEPTH_TEST:\n      case gl.SCISSOR_TEST:\n      case gl.STENCIL_TEST:\n        if (boundValue) {\n          gl.enable(binding);\n        } else {\n          gl.disable(binding);\n        }\n        break;\n      default:\n        console.log(\"No GL restore behavior for 0x\" + binding.toString(16));\n        break;\n    }\n    if (activeTexture) {\n      gl.activeTexture(activeTexture);\n    }\n  }\n}\nvar glPreserveState = WGLUPreserveGLState;\n\nfunction getShader(gl, str, type) {\n  var shader = void 0;\n  if (type == 'fragment') {\n    shader = gl.createShader(gl.FRAGMENT_SHADER);\n  } else if (type == 'vertex') {\n    shader = gl.createShader(gl.VERTEX_SHADER);\n  } else {\n    return null;\n  }\n  gl.shaderSource(shader, str);\n  gl.compileShader(shader);\n  var result = gl.getShaderParameter(shader, gl.COMPILE_STATUS);\n  if (!result) {\n    alert(gl.getShaderInfoLog(shader));\n    return null;\n  }\n  return shader;\n}\nfunction getProgram(gl, vs, fs) {\n  var vertexShader = getShader(gl, vs, 'vertex');\n  var fragmentShader = getShader(gl, fs, 'fragment');\n  if (!fragmentShader) {\n    return null;\n  }\n  var shaderProgram = gl.createProgram();\n  gl.attachShader(shaderProgram, vertexShader);\n  gl.attachShader(shaderProgram, fragmentShader);\n  gl.linkProgram(shaderProgram);\n  var result = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);\n  if (!result) {\n    alert('Could not initialise arview shaders');\n  }\n  return shaderProgram;\n}\nfunction combineOrientations(screenOrientation, seeThroughCameraOrientation) {\n  var seeThroughCameraOrientationIndex = 0;\n  switch (seeThroughCameraOrientation) {\n    case 90:\n      seeThroughCameraOrientationIndex = 1;\n      break;\n    case 180:\n      seeThroughCameraOrientationIndex = 2;\n      break;\n    case 270:\n      seeThroughCameraOrientationIndex = 3;\n      break;\n    default:\n      seeThroughCameraOrientationIndex = 0;\n      break;\n  }\n  var screenOrientationIndex = 0;\n  switch (screenOrientation) {\n    case 90:\n      screenOrientationIndex = 1;\n      break;\n    case 180:\n      screenOrientationIndex = 2;\n      break;\n    case 270:\n      screenOrientationIndex = 3;\n      break;\n    default:\n      screenOrientationIndex = 0;\n      break;\n  }\n  var ret = screenOrientationIndex - seeThroughCameraOrientationIndex;\n  if (ret < 0) {\n    ret += 4;\n  }\n  return ret % 4;\n}\nvar ARVideoRenderer = function () {\n  function ARVideoRenderer(vrDisplay, gl) {\n    classCallCheck(this, ARVideoRenderer);\n    this.vrDisplay = vrDisplay;\n    this.gl = gl;\n    if (this.vrDisplay) {\n      this.passThroughCamera = vrDisplay.getPassThroughCamera();\n      if (this.passThroughCamera instanceof Image) {\n        this.textureTarget = gl.TEXTURE_2D;\n        this.fragmentSource = fragmentSource;\n      } else {\n        this.textureTarget = gl.TEXTURE_EXTERNAL_OES;\n        this.fragmentSource = fragmentSourceOES;\n      }\n      this.program = getProgram(gl, vertexSource, this.fragmentSource);\n    }\n    gl.useProgram(this.program);\n    this.vertexPositionAttribute = gl.getAttribLocation(this.program, 'aVertexPosition');\n    this.textureCoordAttribute = gl.getAttribLocation(this.program, 'aTextureCoord');\n    this.samplerUniform = gl.getUniformLocation(this.program, 'uSampler');\n    this.vertexPositionBuffer = gl.createBuffer();\n    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);\n    var vertices = [-1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 1.0, -1.0, 0.0];\n    var f32Vertices = new Float32Array(vertices);\n    gl.bufferData(gl.ARRAY_BUFFER, f32Vertices, gl.STATIC_DRAW);\n    this.vertexPositionBuffer.itemSize = 3;\n    this.vertexPositionBuffer.numItems = 12;\n    this.textureCoordBuffer = gl.createBuffer();\n    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);\n    var textureCoords = null;\n    if (this.vrDisplay) {\n      var u = window.WebARonARKitSendsCameraFrames ? 1.0 : this.passThroughCamera.width / this.passThroughCamera.textureWidth;\n      var v = window.WebARonARKitSendsCameraFrames ? 1.0 : this.passThroughCamera.height / this.passThroughCamera.textureHeight;\n      textureCoords = [[0.0, 0.0, 0.0, v, u, 0.0, u, v], [u, 0.0, 0.0, 0.0, u, v, 0.0, v], [u, v, u, 0.0, 0.0, v, 0.0, 0.0], [0.0, v, u, v, 0.0, 0.0, u, 0.0]];\n    } else {\n      textureCoords = [[0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0], [1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0], [1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0], [0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0]];\n    }\n    this.f32TextureCoords = [];\n    for (var i = 0; i < textureCoords.length; i++) {\n      this.f32TextureCoords.push(new Float32Array(textureCoords[i]));\n    }\n    this.combinedOrientation = combineOrientations(screen.orientation ? screen.orientation.angle : window.orientation, this.passThroughCamera.orientation);\n    gl.bufferData(gl.ARRAY_BUFFER, this.f32TextureCoords[this.combinedOrientation], gl.STATIC_DRAW);\n    this.textureCoordBuffer.itemSize = 2;\n    this.textureCoordBuffer.numItems = 8;\n    gl.bindBuffer(gl.ARRAY_BUFFER, null);\n    this.indexBuffer = gl.createBuffer();\n    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);\n    var indices = [0, 1, 2, 2, 1, 3];\n    var ui16Indices = new Uint16Array(indices);\n    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ui16Indices, gl.STATIC_DRAW);\n    this.indexBuffer.itemSize = 1;\n    this.indexBuffer.numItems = 6;\n    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);\n    this.texture = gl.createTexture();\n    gl.useProgram(null);\n    this.projectionMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];\n    this.mvMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];\n    return this;\n  }\n  createClass(ARVideoRenderer, [{\n    key: 'render',\n    value: function render() {\n      var _this = this;\n      var gl = this.gl;\n      var bindings = [gl.ARRAY_BUFFER_BINDING, gl.ELEMENT_ARRAY_BUFFER_BINDING, gl.CURRENT_PROGRAM, gl.TEXTURE_BINDING_2D];\n      glPreserveState(gl, bindings, function () {\n        if (_this.passThroughCamera.textureWidth === 0 || _this.passThroughCamera.textureHeight === 0) {\n          return;\n        }\n        var previousFlipY = gl.getParameter(gl.UNPACK_FLIP_Y_WEBGL);\n        var previousWinding = gl.getParameter(gl.FRONT_FACE);\n        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);\n        gl.frontFace(gl.CCW);\n        gl.useProgram(_this.program);\n        gl.bindBuffer(gl.ARRAY_BUFFER, _this.vertexPositionBuffer);\n        gl.enableVertexAttribArray(_this.vertexPositionAttribute);\n        gl.vertexAttribPointer(_this.vertexPositionAttribute, _this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);\n        gl.bindBuffer(gl.ARRAY_BUFFER, _this.textureCoordBuffer);\n        var combinedOrientation = combineOrientations(screen.orientation ? screen.orientation.angle : window.orientation, _this.passThroughCamera.orientation);\n        if (combinedOrientation !== _this.combinedOrientation) {\n          _this.combinedOrientation = combinedOrientation;\n          gl.bufferData(gl.ARRAY_BUFFER, _this.f32TextureCoords[_this.combinedOrientation], gl.STATIC_DRAW);\n        }\n        gl.enableVertexAttribArray(_this.textureCoordAttribute);\n        gl.vertexAttribPointer(_this.textureCoordAttribute, _this.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);\n        gl.activeTexture(gl.TEXTURE0);\n        gl.bindTexture(_this.textureTarget, _this.texture);\n        gl.texImage2D(_this.textureTarget, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, _this.passThroughCamera);\n        gl.uniform1i(_this.samplerUniform, 0);\n        if (window.WebARonARKitSendsCameraFrames) {\n          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);\n          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);\n          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);\n        }\n        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _this.indexBuffer);\n        gl.drawElements(gl.TRIANGLES, _this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);\n        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, previousFlipY);\n        gl.frontFace(previousWinding);\n      });\n    }\n  }]);\n  return ARVideoRenderer;\n}();\nvar ARView = function () {\n  function ARView(vrDisplay, renderer) {\n    classCallCheck(this, ARView);\n    this.vrDisplay = vrDisplay;\n    if (isARKit(this.vrDisplay) && !window.WebARonARKitSendsCameraFrames) {\n      return;\n    }\n    this.renderer = renderer;\n    this.gl = renderer.context;\n    this.videoRenderer = new ARVideoRenderer(vrDisplay, this.gl);\n    this.width = window.innerWidth;\n    this.height = window.innerHeight;\n    window.addEventListener('resize', this.onWindowResize.bind(this), false);\n  }\n  createClass(ARView, [{\n    key: 'onWindowResize',\n    value: function onWindowResize() {\n      this.width = window.innerWidth;\n      this.height = window.innerHeight;\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      if (isARKit(this.vrDisplay) && !window.WebARonARKitSendsCameraFrames) {\n        return;\n      }\n      var gl = this.gl;\n      var dpr = window.devicePixelRatio;\n      var width = this.width * dpr;\n      var height = this.height * dpr;\n      if (gl.viewportWidth !== width) {\n        gl.viewportWidth = width;\n      }\n      if (gl.viewportHeight !== height) {\n        gl.viewportHeight = height;\n      }\n      this.gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);\n      this.videoRenderer.render();\n    }\n  }]);\n  return ARView;\n}();\n\nvar ARAnchorManager = function (_EventDispatcher) {\n  inherits(ARAnchorManager, _EventDispatcher);\n  function ARAnchorManager(vrDisplay) {\n    classCallCheck(this, ARAnchorManager);\n    var _this = possibleConstructorReturn(this, (ARAnchorManager.__proto__ || Object.getPrototypeOf(ARAnchorManager)).call(this));\n    if (!(vrDisplay instanceof window.VRDisplay)) {\n      throw new Error('A correct VRDisplay instance is required to ' + 'initialize an ARAnchorManager.');\n    }\n    if (typeof vrDisplay.getAnchors !== 'function') {\n      throw new Error('VRDisplay does not support anchors. Upgrade ' + 'to latest AR browser to get anchor support.');\n    }\n    _this.vrDisplay_ = vrDisplay;\n    _this.anchorsToObject3Ds_ = new Map();\n    _this.object3DsToAnchors_ = new Map();\n    _this.vrDisplay_.addEventListener('anchorsupdated', function (event) {\n      return _this.onAnchorsUpdated_(event);\n    });\n    _this.scale_ = new three__WEBPACK_IMPORTED_MODULE_0__[\"Vector3\"]();\n    _this.matrix_ = new three__WEBPACK_IMPORTED_MODULE_0__[\"Matrix4\"]();\n    return _this;\n  }\n  createClass(ARAnchorManager, [{\n    key: 'add',\n    value: function add(object3d) {\n      if (!(object3d instanceof three__WEBPACK_IMPORTED_MODULE_0__[\"Object3D\"])) {\n        throw new Error('Invalid Object3D trying to add an anchor');\n      }\n      if (this.object3DsToAnchors_.has(object3d)) {\n        return this;\n      }\n      this.scale_.set(1, 1, 1);\n      this.matrix_.compose(object3d.position, object3d.quaternion, this.scale_);\n      var anchor = this.vrDisplay_.addAnchor(this.matrix_.elements);\n      this.anchorsToObject3Ds_.set(anchor, object3d);\n      this.object3DsToAnchors_.set(object3d, anchor);\n      return this;\n    }\n  }, {\n    key: 'remove',\n    value: function remove(object3d) {\n      if (!(object3d instanceof three__WEBPACK_IMPORTED_MODULE_0__[\"Object3D\"])) {\n        throw new Error('Invalid Object3D trying to remove anchor');\n      }\n      var anchor = this.object3DsToAnchors_.get(object3d);\n      if (!anchor) {\n        return false;\n      }\n      this.anchorsToObject3Ds_.delete(anchor);\n      this.object3DsToAnchors_.delete(object3d);\n      this.vrDisplay_.removeAnchor(anchor);\n      return true;\n    }\n  }, {\n    key: 'onAnchorsUpdated_',\n    value: function onAnchorsUpdated_(event) {\n      var updatedObject3Ds = [];\n      var _iteratorNormalCompletion = true;\n      var _didIteratorError = false;\n      var _iteratorError = undefined;\n      try {\n        for (var _iterator = event.anchors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n          var anchor = _step.value;\n          var object3d = this.anchorsToObject3Ds_.get(anchor);\n          if (!object3d) {\n            continue;\n          }\n          object3d.matrix.fromArray(anchor.modelMatrix);\n          object3d.matrix.decompose(object3d.position, object3d.quaternion, this.scale_);\n          updatedObject3Ds.push(object3d);\n        }\n      } catch (err) {\n        _didIteratorError = true;\n        _iteratorError = err;\n      } finally {\n        try {\n          if (!_iteratorNormalCompletion && _iterator.return) {\n            _iterator.return();\n          }\n        } finally {\n          if (_didIteratorError) {\n            throw _iteratorError;\n          }\n        }\n      }\n      this.dispatchEvent({ type: 'anchorsupdated', anchors: updatedObject3Ds });\n    }\n  }]);\n  return ARAnchorManager;\n}(three__WEBPACK_IMPORTED_MODULE_0__[\"EventDispatcher\"]);\n\n(function () {\n  if (window.webarSpeechRecognitionInstance) {\n    var addEventHandlingToObject = function addEventHandlingToObject(object) {\n      object.listeners = {};\n      object.addEventListener = function (eventType, callback) {\n        if (!callback) {\n          return this;\n        }\n        var listeners = this.listeners[eventType];\n        if (!listeners) {\n          this.listeners[eventType] = listeners = [];\n        }\n        if (listeners.indexOf(callback) < 0) {\n          listeners.push(callback);\n        }\n        return this;\n      };\n      object.removeEventListener = function (eventType, callback) {\n        if (!callback) {\n          return this;\n        }\n        var listeners = this.listeners[eventType];\n        if (listeners) {\n          var i = listeners.indexOf(callback);\n          if (i >= 0) {\n            this.listeners[eventType] = listeners.splice(i, 1);\n          }\n        }\n        return this;\n      };\n      object.callEventListeners = function (eventType, event) {\n        if (!event) {\n          event = { target: this };\n        }\n        if (!event.target) {\n          event.target = this;\n        }\n        event.type = eventType;\n        var onEventType = 'on' + eventType;\n        if (typeof this[onEventType] === 'function') {\n          this[onEventType](event);\n        }\n        var listeners = this.listeners[eventType];\n        if (listeners) {\n          for (var i = 0; i < listeners.length; i++) {\n            var typeofListener = _typeof(listeners[i]);\n            if (typeofListener === 'object') {\n              listeners[i].handleEvent(event);\n            } else if (typeofListener === 'function') {\n              listeners[i](event);\n            }\n          }\n        }\n        return this;\n      };\n    };\n    addEventHandlingToObject(window.webarSpeechRecognitionInstance);\n    window.webkitSpeechRecognition = function () {\n      return window.webarSpeechRecognitionInstance;\n    };\n  }\n})();\n\nif (typeof window !== 'undefined' && _typeof(window.THREE) === 'object') {\n  window.THREE.ARDebug = ARDebug;\n  window.THREE.ARPerspectiveCamera = ARPerspectiveCamera;\n  window.THREE.ARReticle = ARReticle;\n  window.THREE.ARUtils = ARUtils;\n  window.THREE.ARView = ARView;\n  window.THREE.ARAnchorManager = ARAnchorManager;\n}\n\n\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack:///./node_modules/three.ar.js/dist/three.ar.module.js?");

/***/ }),

/***/ "./node_modules/three/build/three.module.js":
/*!**************************************************!*\
  !*** ./node_modules/three/build/three.module.js ***!
  \**************************************************/
/*! exports provided: WebGLRenderTargetCube, WebGLRenderTarget, WebGLRenderer, ShaderLib, UniformsLib, UniformsUtils, ShaderChunk, FogExp2, Fog, Scene, Sprite, LOD, SkinnedMesh, Skeleton, Bone, Mesh, LineSegments, LineLoop, Line, Points, Group, VideoTexture, DataTexture, CompressedTexture, CubeTexture, CanvasTexture, DepthTexture, Texture, CompressedTextureLoader, DataTextureLoader, CubeTextureLoader, TextureLoader, ObjectLoader, MaterialLoader, BufferGeometryLoader, DefaultLoadingManager, LoadingManager, JSONLoader, ImageLoader, ImageBitmapLoader, FontLoader, FileLoader, Loader, LoaderUtils, Cache, AudioLoader, SpotLightShadow, SpotLight, PointLight, RectAreaLight, HemisphereLight, DirectionalLightShadow, DirectionalLight, AmbientLight, LightShadow, Light, StereoCamera, PerspectiveCamera, OrthographicCamera, CubeCamera, ArrayCamera, Camera, AudioListener, PositionalAudio, AudioContext, AudioAnalyser, Audio, VectorKeyframeTrack, StringKeyframeTrack, QuaternionKeyframeTrack, NumberKeyframeTrack, ColorKeyframeTrack, BooleanKeyframeTrack, PropertyMixer, PropertyBinding, KeyframeTrack, AnimationUtils, AnimationObjectGroup, AnimationMixer, AnimationClip, Uniform, InstancedBufferGeometry, BufferGeometry, Geometry, InterleavedBufferAttribute, InstancedInterleavedBuffer, InterleavedBuffer, InstancedBufferAttribute, Face3, Object3D, Raycaster, Layers, EventDispatcher, Clock, QuaternionLinearInterpolant, LinearInterpolant, DiscreteInterpolant, CubicInterpolant, Interpolant, Triangle, Math, Spherical, Cylindrical, Plane, Frustum, Sphere, Ray, Matrix4, Matrix3, Box3, Box2, Line3, Euler, Vector4, Vector3, Vector2, Quaternion, Color, ImmediateRenderObject, VertexNormalsHelper, SpotLightHelper, SkeletonHelper, PointLightHelper, RectAreaLightHelper, HemisphereLightHelper, GridHelper, PolarGridHelper, FaceNormalsHelper, DirectionalLightHelper, CameraHelper, BoxHelper, Box3Helper, PlaneHelper, ArrowHelper, AxesHelper, Shape, Path, ShapePath, Font, CurvePath, Curve, ShapeUtils, WebGLUtils, WireframeGeometry, ParametricGeometry, ParametricBufferGeometry, TetrahedronGeometry, TetrahedronBufferGeometry, OctahedronGeometry, OctahedronBufferGeometry, IcosahedronGeometry, IcosahedronBufferGeometry, DodecahedronGeometry, DodecahedronBufferGeometry, PolyhedronGeometry, PolyhedronBufferGeometry, TubeGeometry, TubeBufferGeometry, TorusKnotGeometry, TorusKnotBufferGeometry, TorusGeometry, TorusBufferGeometry, TextGeometry, TextBufferGeometry, SphereGeometry, SphereBufferGeometry, RingGeometry, RingBufferGeometry, PlaneGeometry, PlaneBufferGeometry, LatheGeometry, LatheBufferGeometry, ShapeGeometry, ShapeBufferGeometry, ExtrudeGeometry, ExtrudeBufferGeometry, EdgesGeometry, ConeGeometry, ConeBufferGeometry, CylinderGeometry, CylinderBufferGeometry, CircleGeometry, CircleBufferGeometry, BoxGeometry, BoxBufferGeometry, ShadowMaterial, SpriteMaterial, RawShaderMaterial, ShaderMaterial, PointsMaterial, MeshPhysicalMaterial, MeshStandardMaterial, MeshPhongMaterial, MeshToonMaterial, MeshNormalMaterial, MeshLambertMaterial, MeshDepthMaterial, MeshDistanceMaterial, MeshBasicMaterial, LineDashedMaterial, LineBasicMaterial, Material, Float64BufferAttribute, Float32BufferAttribute, Uint32BufferAttribute, Int32BufferAttribute, Uint16BufferAttribute, Int16BufferAttribute, Uint8ClampedBufferAttribute, Uint8BufferAttribute, Int8BufferAttribute, BufferAttribute, ArcCurve, CatmullRomCurve3, CubicBezierCurve, CubicBezierCurve3, EllipseCurve, LineCurve, LineCurve3, QuadraticBezierCurve, QuadraticBezierCurve3, SplineCurve, REVISION, MOUSE, CullFaceNone, CullFaceBack, CullFaceFront, CullFaceFrontBack, FrontFaceDirectionCW, FrontFaceDirectionCCW, BasicShadowMap, PCFShadowMap, PCFSoftShadowMap, FrontSide, BackSide, DoubleSide, FlatShading, SmoothShading, NoColors, FaceColors, VertexColors, NoBlending, NormalBlending, AdditiveBlending, SubtractiveBlending, MultiplyBlending, CustomBlending, AddEquation, SubtractEquation, ReverseSubtractEquation, MinEquation, MaxEquation, ZeroFactor, OneFactor, SrcColorFactor, OneMinusSrcColorFactor, SrcAlphaFactor, OneMinusSrcAlphaFactor, DstAlphaFactor, OneMinusDstAlphaFactor, DstColorFactor, OneMinusDstColorFactor, SrcAlphaSaturateFactor, NeverDepth, AlwaysDepth, LessDepth, LessEqualDepth, EqualDepth, GreaterEqualDepth, GreaterDepth, NotEqualDepth, MultiplyOperation, MixOperation, AddOperation, NoToneMapping, LinearToneMapping, ReinhardToneMapping, Uncharted2ToneMapping, CineonToneMapping, UVMapping, CubeReflectionMapping, CubeRefractionMapping, EquirectangularReflectionMapping, EquirectangularRefractionMapping, SphericalReflectionMapping, CubeUVReflectionMapping, CubeUVRefractionMapping, RepeatWrapping, ClampToEdgeWrapping, MirroredRepeatWrapping, NearestFilter, NearestMipMapNearestFilter, NearestMipMapLinearFilter, LinearFilter, LinearMipMapNearestFilter, LinearMipMapLinearFilter, UnsignedByteType, ByteType, ShortType, UnsignedShortType, IntType, UnsignedIntType, FloatType, HalfFloatType, UnsignedShort4444Type, UnsignedShort5551Type, UnsignedShort565Type, UnsignedInt248Type, AlphaFormat, RGBFormat, RGBAFormat, LuminanceFormat, LuminanceAlphaFormat, RGBEFormat, DepthFormat, DepthStencilFormat, RGB_S3TC_DXT1_Format, RGBA_S3TC_DXT1_Format, RGBA_S3TC_DXT3_Format, RGBA_S3TC_DXT5_Format, RGB_PVRTC_4BPPV1_Format, RGB_PVRTC_2BPPV1_Format, RGBA_PVRTC_4BPPV1_Format, RGBA_PVRTC_2BPPV1_Format, RGB_ETC1_Format, RGBA_ASTC_4x4_Format, RGBA_ASTC_5x4_Format, RGBA_ASTC_5x5_Format, RGBA_ASTC_6x5_Format, RGBA_ASTC_6x6_Format, RGBA_ASTC_8x5_Format, RGBA_ASTC_8x6_Format, RGBA_ASTC_8x8_Format, RGBA_ASTC_10x5_Format, RGBA_ASTC_10x6_Format, RGBA_ASTC_10x8_Format, RGBA_ASTC_10x10_Format, RGBA_ASTC_12x10_Format, RGBA_ASTC_12x12_Format, LoopOnce, LoopRepeat, LoopPingPong, InterpolateDiscrete, InterpolateLinear, InterpolateSmooth, ZeroCurvatureEnding, ZeroSlopeEnding, WrapAroundEnding, TrianglesDrawMode, TriangleStripDrawMode, TriangleFanDrawMode, LinearEncoding, sRGBEncoding, GammaEncoding, RGBEEncoding, LogLuvEncoding, RGBM7Encoding, RGBM16Encoding, RGBDEncoding, BasicDepthPacking, RGBADepthPacking, TangentSpaceNormalMap, ObjectSpaceNormalMap, CubeGeometry, Face4, LineStrip, LinePieces, MeshFaceMaterial, MultiMaterial, PointCloud, Particle, ParticleSystem, PointCloudMaterial, ParticleBasicMaterial, ParticleSystemMaterial, Vertex, DynamicBufferAttribute, Int8Attribute, Uint8Attribute, Uint8ClampedAttribute, Int16Attribute, Uint16Attribute, Int32Attribute, Uint32Attribute, Float32Attribute, Float64Attribute, ClosedSplineCurve3, SplineCurve3, Spline, AxisHelper, BoundingBoxHelper, EdgesHelper, WireframeHelper, XHRLoader, BinaryTextureLoader, GeometryUtils, ImageUtils, Projector, CanvasRenderer, SceneUtils, LensFlare */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var g;\n\n// This works in non-strict mode\ng = (function() {\n\treturn this;\n})();\n\ntry {\n\t// This works if eval is allowed (see CSP)\n\tg = g || Function(\"return this\")() || (1, eval)(\"this\");\n} catch (e) {\n\t// This works if the window reference is available\n\tif (typeof window === \"object\") g = window;\n}\n\n// g can still be undefined, but nothing to do about it...\n// We return undefined, instead of nothing here, so it's\n// easier to handle this case. if(!global) { ...}\n\nmodule.exports = g;\n\n\n//# sourceURL=webpack:///(webpack)/buildin/global.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/* harmony import */ var three_ar_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three.ar.js */ \"./node_modules/three.ar.js/dist/three.ar.module.js\");\n\r\n\r\n\r\nconsole.log(three__WEBPACK_IMPORTED_MODULE_0__[\"ARUtils\"])\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });