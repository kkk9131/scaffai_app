"use strict";
// scaffold-engine/src/test-example.ts
// Test example to verify the TypeScript conversion works correctly
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTest = runTest;
const calc_all_1 = require("./calc-all");
// Test parameters matching the Python example
const testParams = {
    width_NS: 10010,
    width_EW: 9100,
    eaves_N: 500,
    eaves_E: 500,
    eaves_S: 500,
    eaves_W: 500,
    boundary_N: 640,
    boundary_E: null,
    boundary_S: 600,
    boundary_W: null,
    standard_height: 6000,
    roof_shape: "フラット",
    tie_column: true,
    railing_count: 3,
    use_355_NS: 1,
    use_300_NS: 0,
    use_150_NS: 1,
    use_355_EW: 0,
    use_300_EW: 0,
    use_150_EW: 0,
    target_margin: 1000
};
function runTest() {
    console.log("========== 入力パラメータ ==========");
    Object.entries(testParams).forEach(([key, value]) => {
        if (key.includes("boundary") && value === 0) {
            console.log(`${key.padEnd(18)}: ${value} (境界指示あり、壁位置)`);
        }
        else if (key.includes("boundary") && value === null) {
            console.log(`${key.padEnd(18)}: ${value} (境界指示なし)`);
        }
        else {
            console.log(`${key.padEnd(18)}: ${value}`);
        }
    });
    console.log("===================================");
    const results = (0, calc_all_1.calcAll)(testParams);
    console.log("\n========== 計算結果 ==========");
    console.log(`南北 総スパン   : ${results.ns_total_span} mm`);
    console.log(`東西 総スパン   : ${results.ew_total_span} mm`);
    console.log(`南北 スパン構成: ${results.ns_span_structure}`);
    console.log(`東西 スパン構成: ${results.ew_span_structure}`);
    console.log(`北面 離れ      : ${results.north_gap}`);
    console.log(`南面 離れ      : ${results.south_gap}`);
    console.log(`東面 離れ      : ${results.east_gap}`);
    console.log(`西面 離れ      : ${results.west_gap}`);
    console.log("--- 高さ関連 ---");
    console.log(`総段数        : ${results.num_stages} 段`);
    console.log(`1層目高さ     : ${results.first_layer_height} mm`);
    console.log(`ジャッキアップ: ${results.jack_up_height} mm`);
    console.log(`コマ数        : ${results.modules_count} コマ`);
    if (results.tie_column_used) {
        console.log(`根がらみ支柱  : ${results.tie_ok ? '設置可能' : '設置不可'}`);
    }
    else {
        console.log(`根がらみ支柱  : 使用しない`);
    }
    return results;
}
// Run test if this file is executed directly
if (require.main === module) {
    runTest();
}
//# sourceMappingURL=test-example.js.map