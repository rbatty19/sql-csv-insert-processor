/**
 *
 * * IMPORTS
 *
 */

import fs from 'fs';
import csv from 'csv-parser';
import iconv from 'iconv-lite';
import write from 'write';
import { replaceAll } from './util';

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
  { 
    IS_INSERT_IGNORE,
    csv_file_path,
    encoding,
    fields,
    result_file_name,
    TABLE_NAME,
    PreProcessor,
    OnCreatePreSQL }: ProcessorSetup
): void {
  let string_file = '';
  //
  let current_array_data_result = [];
  //

  fs.createReadStream(csv_file_path)
    .pipe(iconv.decodeStream(encoding))
    .pipe(csv())
    .on('data', (row_) => {

      let data_sharing = {};
      Object.keys(fields).forEach((item) => data_sharing [item] = row_[item]);
      

      for (const func of PreProcessor) {
        data_sharing = func(data_sharing);
      }

      current_array_data_result.push(data_sharing);

    })
    .on('end', () => {
      console.log(` ${TABLE_NAME} | CSV file successfully processed`);

      const COLUMNS = Object.keys(fields).join(',');

      const insertTable = OnCreatePreSQL(current_array_data_result);
      var row_data;
      insertTable.forEach(item => {
        row_data = Object.values(item).map((item) => {
          if (typeof item == 'string') item = `\'${item}\'`;
          return item;
        });
        string_file += `INSERT INTO ${TABLE_NAME} (${COLUMNS}) VALUES ( ${row_data.join(',')} );\n`;
      });

      if (IS_INSERT_IGNORE) string_file = replaceAll(string_file, 'INSERT', 'INSERT IGNORE');

      console.log(string_file);

      // Main
      write.sync(`${result_file_name}.sql`, string_file, { overwrite: true });

    })
    .on('error', (e) => {
      console.log('Error', e);
    });

};

export {
  Proccessor
}
