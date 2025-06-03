"use strict";
// scaffold-engine/src/index.ts
// Main export file for scaffold calculation engine
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSpanParts = exports.totalSpan = exports.selectParts = exports.adjustLength = exports.baseWidth = exports.calculateInitialMargins = exports.calculateSpanWithBoundaries = exports.calculateFaceDimensions = exports.calcAll = void 0;
// Export main calculation function
var calc_all_1 = require("./calc-all");
Object.defineProperty(exports, "calcAll", { enumerable: true, get: function () { return calc_all_1.calcAll; } });
// Export individual calculation functions
var face_dimensions_1 = require("./face-dimensions");
Object.defineProperty(exports, "calculateFaceDimensions", { enumerable: true, get: function () { return face_dimensions_1.calculateFaceDimensions; } });
var span_calculation_1 = require("./span-calculation");
Object.defineProperty(exports, "calculateSpanWithBoundaries", { enumerable: true, get: function () { return span_calculation_1.calculateSpanWithBoundaries; } });
var margins_1 = require("./margins");
Object.defineProperty(exports, "calculateInitialMargins", { enumerable: true, get: function () { return margins_1.calculateInitialMargins; } });
// Export utility functions
var utils_1 = require("./utils");
Object.defineProperty(exports, "baseWidth", { enumerable: true, get: function () { return utils_1.baseWidth; } });
Object.defineProperty(exports, "adjustLength", { enumerable: true, get: function () { return utils_1.adjustLength; } });
Object.defineProperty(exports, "selectParts", { enumerable: true, get: function () { return utils_1.selectParts; } });
Object.defineProperty(exports, "totalSpan", { enumerable: true, get: function () { return utils_1.totalSpan; } });
Object.defineProperty(exports, "formatSpanParts", { enumerable: true, get: function () { return utils_1.formatSpanParts; } });
// Export constants
__exportStar(require("./constants"), exports);
//# sourceMappingURL=index.js.map