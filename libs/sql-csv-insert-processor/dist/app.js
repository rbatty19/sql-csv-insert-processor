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
    var laggards_file_name = _a.laggards_file_name, IS_INSERT_IGNORE = _a.IS_INSERT_IGNORE, csv_file_path = _a.csv_file_path, encoding = _a.encoding, fields = _a.fields, result_file_name = _a.result_file_name, TABLE_NAME = _a.TABLE_NAME, PreProcessor = _a.PreProcessor;
    var string_file = '';
    var string_file_2 = '';
    ///
    var columns_header, rows_list;
    fs_1.default.createReadStream(csv_file_path)
        .pipe(iconv_lite_1.default.decodeStream(encoding))
        .pipe(csv_parser_1.default())
        .on('data', function (row_) {
        //
        var row = (function () {
            var obj = {};
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
        var columns = Object.keys(row);
        var row_data = Object.values(row);
        row_data = row_data.map(function (item) {
            // if (isNumber(item)) item = Number(item);
            if (typeof item == 'string')
                item = "\"" + item + "\"";
            return item;
        });
        // for first row and item
        if (!columns_header) {
            //
            columns_header = "INSERT INTO " + TABLE_NAME + " (" + columns.join(',') + ") VALUES ( " + row_data.join(',') + " )"; //
            PushToLaggardsHeader('-');
            //
            PushToResultHeader(columns_header);
            //
            var data_sharing = row;
            //
            for (var _i = 0, PreProcessor_1 = PreProcessor; _i < PreProcessor_1.length; _i++) {
                var func = PreProcessor_1[_i];
                data_sharing = func(data_sharing, (function () { return PushToResult("( " + row_data.join(',') + " )"); }), (function () { return PushToLaggards("( " + row_data.join(',') + " )"); }));
            }
        }
        else {
            var data_sharing = row;
            for (var _a = 0, PreProcessor_2 = PreProcessor; _a < PreProcessor_2.length; _a++) {
                var func = PreProcessor_2[_a];
                data_sharing = func(data_sharing, (function () { return PushToResult(",( " + row_data.join(',') + " )"); }), (function () { return PushToLaggards(",( " + row_data.join(',') + " )"); }));
            }
        }
        /////////////////////////////////////
        // console.log({ columns, row_data });
    })
        .on('end', function () {
        console.log(" " + TABLE_NAME + " | CSV file successfully processed");
        if (IS_INSERT_IGNORE)
            string_file = replaceAll(string_file, 'INSERT', 'INSERT IGNORE');
        // Main
        write_1.default.sync(result_file_name + ".sql", string_file, { overwrite: true });
        // laggards
        write_1.default.sync(laggards_file_name + ".sql", string_file_2, { overwrite: true });
    })
        .on('error', function (e) {
        console.log('Error', e);
    });
    function PushToResult(data) {
        string_file += data + "\n";
    }
    function PushToLaggards(data) {
        string_file_2 += data + "\n";
    }
    function PushToResultHeader(data) {
        string_file = data + "\n";
    }
    function PushToLaggardsHeader(data) {
        string_file_2 = data + "\n";
    }
    function replaceAll(string, search, replace) {
        return string.split(search).join(replace);
    }
}
exports.Proccessor = Proccessor;
;
