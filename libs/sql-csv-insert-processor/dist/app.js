"use strict";
/**
 *
 * * IMPORTS
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proccessor = void 0;
var fs_1 = __importDefault(require("fs"));
var csv_parser_1 = __importDefault(require("csv-parser"));
var iconv_lite_1 = __importDefault(require("iconv-lite"));
var write_1 = __importDefault(require("write"));
var util_1 = require("./util");
/**
 *
 * <> GLOBALS
 *
 */
/**
 *
 * ! BUILDING
 *
 */
function Proccessor(_a) {
    var IS_INSERT_IGNORE = _a.IS_INSERT_IGNORE, csv_file_path = _a.csv_file_path, encoding = _a.encoding, fields = _a.fields, result_file_name = _a.result_file_name, TABLE_NAME = _a.TABLE_NAME, PreProcessor = _a.PreProcessor, OnCreatePreSQL = _a.OnCreatePreSQL;
    var string_file = '';
    //
    var current_array_data_result = [];
    //
    fs_1.default.createReadStream(csv_file_path)
        .pipe(iconv_lite_1.default.decodeStream(encoding))
        .pipe(csv_parser_1.default())
        .on('data', function (row_) {
        var data_sharing = {};
        Object.keys(fields).forEach(function (item) { return data_sharing[item] = row_[item]; });
        for (var _i = 0, PreProcessor_1 = PreProcessor; _i < PreProcessor_1.length; _i++) {
            var func = PreProcessor_1[_i];
            data_sharing = func(data_sharing);
        }
        current_array_data_result.push(data_sharing);
    })
        .on('end', function () {
        console.log(" " + TABLE_NAME + " | CSV file successfully processed");
        var COLUMNS = Object.keys(fields).join(',');
        var insertTable = OnCreatePreSQL(current_array_data_result);
        var row_data;
        insertTable.forEach(function (item) {
            row_data = Object.values(item).map(function (item) {
                if (typeof item == 'string')
                    item = "'" + item + "'";
                return item;
            });
            string_file += "INSERT INTO " + TABLE_NAME + " (" + COLUMNS + ") VALUES ( " + row_data.join(',') + " );\n";
        });
        if (IS_INSERT_IGNORE)
            string_file = util_1.replaceAll(string_file, 'INSERT', 'INSERT IGNORE ');
        console.log(string_file);
        // Main
        write_1.default.sync(result_file_name + ".sql", string_file, { overwrite: true });
    })
        .on('error', function (e) {
        console.log('Error', e);
    });
}
exports.Proccessor = Proccessor;
;
