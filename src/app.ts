/**
 *
 * * IMPORTS
 *
 */

import fs from 'fs';
import csv from 'csv-parser';
import iconv from 'iconv-lite';
import write from 'write';

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


function Proccessor(
  { laggards_file_name,
    IS_INSERT_IGNORE,
    csv_file_path,
    encoding,
    fields,
    result_file_name,
    TABLE_NAME }: ProcessorSetup
): void {
  let string_file = '';
  let string_file_2 = '';

  ///
  let columns_header, rows_list;

  fs.createReadStream(csv_file_path)
    .pipe(iconv.decodeStream(encoding))
    .pipe(csv())
    .on('data', (row_) => {
      //
      const row: any = (() => {
        let obj = {};

        Object.keys(row_).forEach((row_raw) => {
          Object.keys(fields).forEach((row_exact) => {
            //
            if (row_exact == row_raw)
              Object.assign(obj, {
                [`${fields[row_exact]}`]: row_[row_raw],
              });
          });
        });

        return obj;
      })();

      const columns = Object.keys(row);
      let row_data = Object.values(row);

      row_data = row_data.map((item) => {
        // if (isNumber(item)) item = Number(item);
        if (typeof item == 'string') item = `\"${item}\"`;
        return item;
      });

      if (!columns_header) {
        columns_header = `INSERT INTO ${TABLE_NAME} (${columns.join(',')}) VALUES ( ${row_data.join(
          ',',
        )} )`;
        PushToLaggardsHeader('-');
        PushToResultHeader(columns_header);
      } else {
        if (TABLE_NAME == '') {
          if (!isNumber(row.ampp_id)) {
            //
            PushToLaggards(`,( ${row_data.join(',')} )`);
          } else {
            PushToResult(`,( ${row_data.join(',')} )`);
          }
        }
        if (TABLE_NAME == 't_producto_ampp') {
          if (!isNumber(row.ampp_id) || !isNumber(row.t_producto_id)) {
            //
            PushToLaggards(`,( ${row_data.join(',')} )`);
          } else {
            PushToResult(`,( ${row_data.join(',')} )`);
          }
        }
      }

      /////////////////////////////////////

      // console.log({ columns, row_data });
    })
    .on('end', () => {
      console.log(` ${TABLE_NAME} | CSV file successfully processed`);

      if (IS_INSERT_IGNORE) string_file = replaceAll(string_file, 'INSERT', 'INSERT IGNORE');

      // Main
      write.sync(`${result_file_name}.sql`, string_file, { overwrite: true });

      // laggards
      write.sync(`${laggards_file_name}.sql`, string_file_2, { overwrite: true });
    })
    .on('error', (e) => {
      console.log('Error', e);
    });

  function PushToResult(data) {
    string_file += `${data}\n`;
  }

  function PushToLaggards(data) {
    string_file_2 += `${data}\n`;
  }

  function PushToResultHeader(data) {
    string_file = `${data}\n`;
  }

  function PushToLaggardsHeader(data) {
    string_file_2 = `${data}\n`;
  }

  function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
  }

  function isNumber(value) {
    try {
      value = Number(value);
      return typeof value === 'number' && isFinite(value);
    } catch (error) {
      return false;
    }
  }
};

export {
  Proccessor
}
