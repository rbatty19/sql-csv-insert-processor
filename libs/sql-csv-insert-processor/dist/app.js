"use strict";
/**
 *
 * * IMPORTS 123
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
    var laggards_file_name = _a.laggards_file_name, IS_INSERT_IGNORE = _a.IS_INSERT_IGNORE, csv_file_path = _a.csv_file_path, encoding = _a.encoding, fields = _a.fields, result_file_name = _a.result_file_name, TABLE_NAME = _a.TABLE_NAME, PreProcessor = _a.PreProcessor, PostProcessor = _a.PostProcessor;
    var string_file = '';
    var string_file_2 = '';
    ///
    var columns_header, rows_list, columns = [], row_data;
    //
    var current_array_data_result = [];
    //
    var current_array_data_laggard = [];
    fs_1.default.createReadStream(csv_file_path)
        .pipe(iconv_lite_1.default.decodeStream(encoding))
        .pipe(csv_parser_1.default())
        .on('data', function (row_) {
        //
        var row = (function () {
            var obj = {};
            //
            Object.keys(row_).forEach(function (row_raw) {
                Object.keys(fields).forEach(function (row_exact) {
                    var _a;
                    //
                    if (row_exact == row_raw)
                        Object.assign(obj, (_a = {},
                            _a["" + fields[row_exact]] = row_[row_raw],
                            _a));
                });
            });
            return obj;
        })();
        var data_sharing = row;
        //
        for (var _i = 0, PreProcessor_1 = PreProcessor; _i < PreProcessor_1.length; _i++) {
            var func = PreProcessor_1[_i];
            //
            data_sharing = func(data_sharing, PushToResult, PushToLaggards, current_array_data_result);
            //
            columns = Object.keys(data_sharing);
        }
    })
        .on('end', function () {
        var recycle = {};
        var final_data_sharing = current_array_data_result;
        var final_data_sharing_laggards = current_array_data_laggard;
        for (var _i = 0, PostProcessor_1 = PostProcessor; _i < PostProcessor_1.length; _i++) {
            var func = PostProcessor_1[_i];
            //
            var _a = func(final_data_sharing, final_data_sharing_laggards), ress = _a[0], laggs = _a[1];
            final_data_sharing = ress;
            final_data_sharing_laggards = laggs;
        }
        //
        current_array_data_result = final_data_sharing;
        //
        current_array_data_laggard = final_data_sharing_laggards;
        //
        //
        console.log(" " + TABLE_NAME + " | CSV file successfully processed");
        current_array_data_result.forEach(function (item, i) {
            //
            row_data = Object.values(item).map(function (item) {
                if (typeof item == 'string')
                    item = "\"" + item + "\"";
                return item;
            });
            //
            if (!i) {
                string_file += "INSERT INTO " + TABLE_NAME + " (" + columns.join(',') + ") VALUES ( " + row_data.join(',') + " )";
            }
            else {
                string_file += "," + ("( " + row_data.join(',') + " )") + "\n";
            }
        });
        current_array_data_laggard.forEach(function (item, i) {
            //
            row_data = Object.values(item).map(function (item) {
                if (typeof item == 'string')
                    item = "\"" + item + "\"";
                return item;
            });
            //
            if (!i) {
                string_file_2 += "INSERT INTO " + TABLE_NAME + " (" + columns.join(',') + ") VALUES ( " + row_data.join(',') + " )";
            }
            else {
                string_file_2 += "," + ("( " + row_data.join(',') + " )") + "\n";
            }
        });
        //
        if (IS_INSERT_IGNORE)
            string_file = util_1.replaceAll(string_file, 'INSERT', 'INSERT IGNORE');
        // Main
        write_1.default.sync(result_file_name + ".sql", string_file, { overwrite: true });
        // laggards
        write_1.default.sync(laggards_file_name + ".sql", string_file_2, { overwrite: true });
    })
        .on('error', function (e) {
        console.log('Error', e);
    });
    function PushToResult(data) {
        current_array_data_result.push(data);
    }
    function PushToLaggards(data) {
        current_array_data_laggard.push(data);
    }
}
exports.Proccessor = Proccessor;
;
